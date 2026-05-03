import { Page, Locator } from '@playwright/test';

export class BoardPage 
{
    readonly page: Page;
    readonly leftColumn: Locator;
    readonly navBar: Locator;
    readonly sideBar: Locator;
    
    readonly searchButton: Locator; 
    readonly createIssueButton: Locator;

    readonly settingsButton: Locator;
    readonly homeButton: Locator;

    readonly columnsGroup: Locator;
    readonly columns: Locator;
    readonly issues: Locator;

    readonly filters: Locator;
    readonly filterBar: Locator;
    readonly avatarButtons: Locator;
    readonly onlyMyIssuesButton: Locator;
    readonly ignoredResolvedButton: Locator;


    constructor(page: Page) 
    {
        this.page = page;
        this.leftColumn = this.page.locator('app-navigation');
        this.navBar = this.leftColumn.locator('app-navbar-left');
        this.sideBar = this.leftColumn.locator('app-sidebar');

        this.searchButton = this.navBar.locator('i[aria-label="search"]');
        this.createIssueButton = this.navBar.locator('i[aria-label="plus"]');
        
        this.settingsButton = this.sideBar.getByText('Project Settings');
        this.homeButton = this.sideBar.getByText('Kanban Board');
        
        this.columnsGroup = page.locator('board-dnd');         
        this.columns = this.columnsGroup.locator('.board-dnd-list'); 
        this.issues = this.columns.locator('issue-card');
        
        this.filters = page.locator('board-filter'); 
        this.filterBar = this.filters.locator('.input-container input');
        this.avatarButtons = this.filters.locator('.lift-avatar');
        this.onlyMyIssuesButton = this.filters.getByText('Only My Issues');
        this.ignoredResolvedButton = this.filters.getByText('Ignore Resolved');
    }
    
    
    async goto() 
    {
        await this.page.goto('http://localhost:4200/');
    }


    getColumnByName(name: string): Locator 
    {
        return this.columns.filter({ hasText: name });
    }


    async enterIssueWithTitle(summary: string) 
    {
        const issue = this.issues.filter({ hasText: summary });
        await issue.click();
    }


    async validateAvatars(): Promise<boolean> 
    {
        let activesBg: string[] = [];
        const avatarButtons = await this.avatarButtons.all();
        
        for (const button of avatarButtons) {
            const isActive = await button.evaluate((el) => el.classList.contains('is-active'));
            if (isActive) 
            {
                const bg = await button.evaluate((el: HTMLElement) => el.style.backgroundImage);
                if (bg) { activesBg.push(bg); }
            }
        }
        if (activesBg.length === 0) return true;
        const issues = await this.issues.all();
        
        for (const issue of issues) 
        {
            let isValidIssue = false;
            const assignees = await issue.locator('j-avatar .avatar-container').all();
            
            for (const assignee of assignees)
            {
                const bg = await assignee.evaluate((el: HTMLElement) => el.style.backgroundImage);
                
                if (bg && activesBg.includes(bg)) 
                {
                    isValidIssue = true;
                    break; 
                }
            }
            if (!isValidIssue) { return false; }
        }
        return true;
    }


    async fillBar(text: string) 
    {
        await this.filterBar.pressSequentially(text, { delay: 100 });
    }


    async enterIssue(id: string) // I assume the issue exists
    { 
        const issue = this.issues.filter({ hasText: id });
        await issue.click();
    }


    async getBoardState(doneColumn: string): Promise<Record<string, string[]>> 
    {
        await this.issues.first().waitFor({ state: 'visible' });
        const boardState: Record<string, string[]> = {};
        const columnsArray = await this.columns.all();
        for (const column of columnsArray) 
        {
            const columnName = await column.locator('[cdkdroplist]').getAttribute('id') || ''; 
            if (doneColumn && columnName === doneColumn) { continue; }

            const columnTitle = await column.locator('issue-card p').allInnerTexts();
            boardState[columnName] = columnTitle;
        }
        return boardState;
    }


    async moveIssueToColumn(issueLocator: Locator, destinationColumn: Locator) 
    {
        await issueLocator.scrollIntoViewIfNeeded();
        await destinationColumn.scrollIntoViewIfNeeded();

        const from = await issueLocator.boundingBox();
        const to = await destinationColumn.boundingBox();

        if (!from || !to) { throw new Error('The coordinates for the Drag & Drop couldn´t be obtained.'); }
        await this.page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
        await this.page.mouse.down();

        await this.page.mouse.move((from.x + from.width / 2) + 10, (from.y + from.height / 2) + 10);
        await this.page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 50 });

        await this.page.mouse.up();
    }


    async dragRandomIssue(): Promise<{ title: string, sourceColumn: Locator, destinationColumn: Locator }>
    {
        await this.columns.first().waitFor({ state: 'visible' });
        const allColumns = await this.columns.all(); 
        const numCols = allColumns.length;
        let columnFrom: Locator = allColumns[0];
        let cantFrom = 0;
        let attemps = 0;

        while (cantFrom === 0 && attemps < 10) 
        {
            const randomIdx = Math.floor(Math.random() * numCols);
            columnFrom = allColumns[randomIdx];
            cantFrom = await columnFrom.locator('issue-card').count();
            attemps++;
        }

        if (cantFrom === 0) { throw new Error('No column with issues to drag was found.'); }

        let columnTo: Locator = allColumns[0];
        let isSameColumn = true;
        const idFrom = await columnFrom.locator('[cdkdroplist]').getAttribute('id');

        while (isSameColumn) 
        {
            const destinationIdx = Math.floor(Math.random() * numCols);
            columnTo = allColumns[destinationIdx];
            const idTo = await columnTo.locator('[cdkdroplist]').getAttribute('id');
            
            if (idFrom !== idTo) { isSameColumn = false; }
        }
        const idxIssueFrom = Math.floor(Math.random() * cantFrom);
        const pickedIssue = columnFrom.locator('issue-card').nth(idxIssueFrom);
        const issueTitle = await pickedIssue.locator('p').innerText();
        await this.moveIssueToColumn(pickedIssue, columnTo);

        return { title: issueTitle, sourceColumn: columnFrom, destinationColumn: columnTo };
    }
}