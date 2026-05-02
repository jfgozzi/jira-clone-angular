import { Page, Locator } from '@playwright/test';

export class BoardPage {
    readonly page: Page;
    readonly columnsGroup: Locator;
    readonly columns: Locator;
    readonly filters: Locator;
    readonly issues: Locator;
    readonly onlyMyIssuesButton: Locator;
    readonly ignoredResolvedButton: Locator;
    readonly columnIssues: Locator;
    readonly avatarButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.columnsGroup = page.locator('[cdkdroplistgroup]');      // entre corchetes si esta suelto el atributo
        this.columns = this.columnsGroup.locator('.board-dnd-list'); // si no, de esta forma 
        this.filters = page.locator('board-filter'); 
        this.avatarButtons = this.filters.locator('.lift-avatar');
        this.issues = page.locator('issue-card');
        this.onlyMyIssuesButton = this.filters.getByText('Only My Issues');
        this.columnIssues = this.columns.locator('.issue-wrap');
        this.ignoredResolvedButton = this.filters.getByText('Ignore Resolved');
    }

    getColumnByName(nombre: string): Locator {
        return this.columns.filter({ hasText: nombre });
    }


    // reveer esto
    async validateAvatars(): Promise<boolean> {
        let activesBg: string[] = [];
        const avatarButtons = await this.page.locator('board-filter .lift-avatar').all();
        
        for (const button of avatarButtons) {
            const estaActivo = await button.evaluate((el) => el.classList.contains('is-active'));
            if (estaActivo) {
                const bg = await button.locator('j-avatar .avatar-container')
                    .evaluate((el: HTMLElement) => el.style.backgroundImage);
                
                if (bg) {
                    activesBg.push(bg);
                }
            }
        }
        if (activesBg.length === 0) return true;
        const issues = await this.page.locator('.issue-wrap').all();
        
        for (const issue of issues) {
            let isValidIssue = false;
            const assignees = await issue.locator('j-avatar .avatar-container').all();
            
            for (const assignee of assignees) {
                const bg = await assignee.evaluate((el: HTMLElement) => el.style.backgroundImage);
                
                if (bg && activesBg.includes(bg)) {
                    isValidIssue = true;
                    break; 
                }
            }
            if (!isValidIssue) { return false; }
        }
        return true;
    }

    async enterIssue(id: string) { // asumo que el issue existe
        const issue = this.issues.filter({ hasText: id });
        await issue.click();
    }

    async getBoardState(columnaAIgnorar?: string): Promise<Record<string, string[]>> {
        await this.columns.first().waitFor({ state: 'visible' });
        await this.page.locator('issue-card').first().waitFor({ state: 'visible' });
        const boardState: Record<string, string[]> = {};
        const columnsArray = await this.columns.all();
        for (const column of columnsArray) {
            const nombreColumna = await column.locator('[cdkdroplist]').getAttribute('id') || ''; 
            if (columnaAIgnorar && nombreColumna === columnaAIgnorar) {
                continue;
            }
            const titulosDeLaColumna = await column.locator('issue-card p').allInnerTexts();
            boardState[nombreColumna] = titulosDeLaColumna;
        }
        return boardState;
    }

    async moverIssueAColumna(issueLocator: Locator, columnaDestino: Locator) {
        await issueLocator.scrollIntoViewIfNeeded();
        await columnaDestino.scrollIntoViewIfNeeded();

        const cajaOrigen = await issueLocator.boundingBox();
        const cajaDestino = await columnaDestino.boundingBox();

        if (!cajaOrigen || !cajaDestino) {
            throw new Error('No se pudieron obtener las coordenadas para el Drag & Drop');
        }
        await this.page.mouse.move(cajaOrigen.x + cajaOrigen.width / 2, cajaOrigen.y + cajaOrigen.height / 2);
        await this.page.mouse.down();

        await this.page.waitForTimeout(200);

        await this.page.mouse.move((cajaOrigen.x + cajaOrigen.width / 2) + 10, (cajaOrigen.y + cajaOrigen.height / 2) + 10);

        await this.page.mouse.move(cajaDestino.x + cajaDestino.width / 2, cajaDestino.y + cajaDestino.height / 2, { steps: 50 });
        
        await this.page.waitForTimeout(200);
        await this.page.mouse.up();
    }


    async arrastrarIssueAlAzar(): Promise<{ titulo: string, columnaOrigen: Locator, columnaDestino: Locator }> {
        await this.columns.first().waitFor({ state: 'visible' });
        const allColumns = await this.columns.all(); 
        const numCols = allColumns.length;
        let columnFrom: Locator = allColumns[0];
        let cantFrom = 0;
        let intentos = 0;

        while (cantFrom === 0 && intentos < 10) {
            const idxAleatorio = Math.floor(Math.random() * numCols);
            columnFrom = allColumns[idxAleatorio];
            cantFrom = await columnFrom.locator('issue-card').count();
            intentos++;
        }

        if (cantFrom === 0) {
            throw new Error('No se encontró ninguna columna con tickets para arrastrar.');
        }
        let columnTo: Locator = allColumns[0];
        let esMismaColumna = true;
        const idFrom = await columnFrom.locator('[cdkdroplist]').getAttribute('id');

        while (esMismaColumna) {
            const idxDestino = Math.floor(Math.random() * numCols);
            columnTo = allColumns[idxDestino];
            const idTo = await columnTo.locator('[cdkdroplist]').getAttribute('id');
            
            if (idFrom !== idTo) {
                esMismaColumna = false;
            }
        }
        const idxIssueFrom = Math.floor(Math.random() * cantFrom);
        const pickedIssue = columnFrom.locator('issue-card').nth(idxIssueFrom);
        const tituloDelTicket = await pickedIssue.locator('p').innerText();
        await this.moverIssueAColumna(pickedIssue, columnTo);
        return {
            titulo: tituloDelTicket,
            columnaOrigen: columnFrom,
            columnaDestino: columnTo
        };
    }


    async goto() {
        await this.page.goto('http://localhost:4200/');
    }
}