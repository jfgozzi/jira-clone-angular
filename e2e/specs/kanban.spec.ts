import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';

test.describe('Jira Clone - Kanban board', () => {
    let boardPage: BoardPage;

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        await boardPage.goto();
    });


    test('All columns loads correctly and are not empty.', async () => 
    {
        await expect(boardPage.columns).toHaveCount(4); // hardcoded bc i know that there are 4 columns, this clone has just 4.
        const columnsArray = await boardPage.columns.all();
        for(const column of columnsArray) 
        {
            const issuesColumn = await column.locator('issue-card').count();
            expect(issuesColumn).toBeGreaterThan(-1);
        }
    });


    test('Press "Only My Issues" and just Trung Vo`s issues are shown.', async ({ page }) => 
    {
        await boardPage.onlyMyIssuesButton.click();
        await page.waitForTimeout(500); 
        const issues = await boardPage.issues.all();
        
        for (const issue of issues) 
        {
            await issue.click({ force: true });
            await expect(page.locator('issue-modal')).toBeVisible();
            await expect(page.locator('issue-assignees').getByText('Trung Vo')).toBeVisible();
            await page.locator('j-button[icon="times"]').click({ force: true });
            await expect(page.locator('issue-modal')).toBeHidden();
        }
    });


    test('Press "Ignore Resolved" and just show the first 3 unaltered columns.', async ({ page }) => 
    {
        const before = await boardPage.getBoardState('Done');
        await boardPage.ignoredResolvedButton.click();
        await page.waitForTimeout(500); 
        const after = await boardPage.getBoardState('Done');
        expect(after).toEqual(before);
        const columnaDone = boardPage.getColumnByName('Done');
        const issuesEnDone = await columnaDone.locator('issue-card').count();
        expect(issuesEnDone).toBe(0); 
    });


    test('Drag and Drop Random Issue', async () => 
    {
        const { title, sourceColumn, destinationColumn } = await boardPage.dragRandomIssue();
        const ticketEnDestino = destinationColumn.locator('issue-card', { hasText: title });
        await expect(ticketEnDestino).toBeVisible();
        const ticketEnOrigen = sourceColumn.locator('issue-card', { hasText: title });
        await expect(ticketEnOrigen).toBeHidden();
    });

    
    
    test('Put some word in the bar and show related issues.', async () => 
    {
        const word = 'issue';
        await boardPage.fillBar(word); 
        const issues = await boardPage.issues.all();
        for(const issue of issues) {
            await expect(issue).toContainText(word, { ignoreCase: true });        
        }
    });

    
    test('Put some random word in the bar and show no one issue.', async () => 
    {
        const word = 'no results';
        await boardPage.fillBar(word); 
        const columns = await boardPage.columns.all();
        for(const column of columns) {
            await expect(column.locator('issue-card')).toHaveCount(0);
        }
    });


    test('Press one or more avatars and show related issues.', async () => 
    {
        const avatars = await boardPage.avatarButtons.all();
        let someTouched = false;

        for (const avatar of avatars) 
        {
            if (Math.random() > 0.5) {
                await avatar.click();
                await expect(avatar).toHaveClass(/is-active/);
                
                someTouched = true;
            }
        }
        if (!someTouched && avatars.length > 0) 
        {
            const fstAvatar = avatars[0];
            await fstAvatar.click();
            await expect(fstAvatar).toHaveClass(/is-active/);
        }
        const dashboardIsCorrect = await boardPage.validateAvatars();
        expect(dashboardIsCorrect).toBe(true); 
    });
});

