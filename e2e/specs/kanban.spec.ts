import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';

test.describe('Jira Clone - Kanban board', () => {
    let boardPage: BoardPage;

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        await boardPage.goto();
    });

    test('All columns loads correctly and are not empty.', async () => {
        await expect(boardPage.columns).toHaveCount(4); // hardcoded bcs i know that there are 4 columns, this clone has just 4.
        const columnsArray = await boardPage.columns.all();
        for(const column of columnsArray) {
            const issuesColumn = await column.locator('issue-card').count();
            expect(issuesColumn).toBeGreaterThan(0);
        }
    });

    test('Press "Only My Issues" and just Trung Vo`s issues are shown.', async ({ page }) => {
        await boardPage.onlyMyIssuesButton.click();
        await page.waitForTimeout(500); 
        const issues = await boardPage.columnIssues.all();
        
        for (const issue of issues) {
            await issue.click();
            await expect(page.locator('issue-modal')).toBeVisible();
            await expect(page.locator('issue-assignees').getByRole('button', { name: 'Trung Vo' })).toBeVisible();
            await page.locator('j-button[icon="times"]').click();
            await expect(page.locator('issue-modal')).toBeHidden();
        }
    });

    test('Press "Ignore Resolved" and just show the first 3 unaltered columns.', async ({ page }) => {
            const before = await boardPage.getBoardState('Done');
            await boardPage.ignoredResolvedButton.click();
            await page.waitForTimeout(500); 
            const after = await boardPage.getBoardState('Done');
            expect(after).toEqual(before);
            const columnaDone = boardPage.getColumnByName('Done');
            const issuesEnDone = await columnaDone.locator('issue-card').count();
            expect(issuesEnDone).toBe(0); 
        });

    test('Drag and Drop Random Issue', async ({ page }) => {
        const { titulo, columnaOrigen, columnaDestino } = await boardPage.arrastrarIssueAlAzar();
        const ticketEnDestino = columnaDestino.locator('issue-card', { hasText: titulo });
        await expect(ticketEnDestino).toBeVisible();
        const ticketEnOrigen = columnaOrigen.locator('issue-card', { hasText: titulo });
        await expect(ticketEnOrigen).toBeHidden();
    });


    test('Press one or more avatars and show related issues.', async ({ page }) => {
        const filtrosAvatares = await boardPage.avatarButtons.all();
        let tocamosAlguno = false;

        for (const avatar of filtrosAvatares) {
            if (Math.random() > 0.5) {
                await avatar.click();
                await expect(avatar).toHaveClass(/is-active/);
                await page.waitForTimeout(200); 
                
                tocamosAlguno = true;
            }
        }
        if (!tocamosAlguno && filtrosAvatares.length > 0) {
            const primerAvatar = filtrosAvatares[0];
            await primerAvatar.click();
            await expect(primerAvatar).toHaveClass(/is-active/);
            await page.waitForTimeout(200);
        }
        await page.waitForTimeout(500); 
        const elTableroEstaCorrecto = await boardPage.validateAvatars();
        expect(elTableroEstaCorrecto).toBe(true); 
    });
});

