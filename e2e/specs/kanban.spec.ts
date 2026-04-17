import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';

test.describe('Jira Clone - Kanban board', () => {
    let boardPage: BoardPage;

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        await boardPage.goto();
    });

    test('Las columnas se cargan y no estan vacias.', async () => {
            await expect(boardPage.columns).toHaveCount(4);
            const columnsArray = await boardPage.columns.all();
            for(const column of columnsArray) {
                const issuesColumn = await column.locator('issue-card').count();
                expect(issuesColumn).toBeGreaterThan(0);
            }

        });

    // In this clone, Trung Vo is the only name that i can have as owner.
    test('Toco "Only My Issues" y únicamente se muestran issues de Trung Vo.', async ({ page }) => {
        const omiButton = boardPage.filters.getByText('Only My Issues');
        await omiButton.click();
        const columnsArray = await boardPage.columns.all();
        for(const column of columnsArray) {
            const issues = await column.locator('.issue-wrap').all()
            for(const issue of issues) {
                await issue.click();
                await expect(page.locator('issue-modal')).toBeVisible();
                await expect(page.locator('issue-assignees').getByRole('button', { name: 'Trung Vo' })).toBeVisible();
                await page.locator('j-button[icon="times"]').click();
            }
        }
    });

    test('Toco "Ignore Resolved" y únicamente se muestran las primeras 3 columnas inalteradas.', async ({ page }) => {
        const contenidoAntes: Record<string, string[]> = {};
        const contenidoDespues: Record<string, string[]> = {};
        const irButton = boardPage.filters.getByText('Ignore Resolved');
        const columnsArray = await boardPage.columns.all();
        
        for(const column of columnsArray) {
            const nombreColumna = await column.locator('[cdkdroplist]').getAttribute('id'); 
            if (nombreColumna == "Done") {
                continue;
            }
            const cant = await column.locator('issue-card').count();
            const titulosDeLaColumna = await column.locator('issue-card p').allInnerTexts();
            contenidoAntes[nombreColumna] = titulosDeLaColumna;
        }
        await irButton.click();

        const columnsArray2 = await page.locator('[cdkdroplistgroup]').locator('.board-dnd-list').all();
        for(const column of columnsArray2) {
            const nombreColumna = await column.locator('[cdkdroplist]').getAttribute('id'); 
            if (nombreColumna == "Done") {
                continue;
            }
            const cant = await column.locator('issue-card').count();
            const titulosDeLaColumna = await column.locator('issue-card p').allInnerTexts();
            contenidoDespues[nombreColumna] = titulosDeLaColumna;
        }
        expect(contenidoAntes).toEqual(contenidoDespues);
    });
});

