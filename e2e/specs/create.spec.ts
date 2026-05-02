import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { CreatePage } from '../pages/CreatePage';
import { IssueDetailPage } from 'e2e/pages/IssueDetail';

test.describe('Jira Clone - Create Issue Window', () => {
    let boardPage: BoardPage;
    let createPage: CreatePage;
    let issueDetail: IssueDetailPage;

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        createPage = new CreatePage(page);
        issueDetail = new IssueDetailPage(page);
        await boardPage.goto();
        await createPage.createButton.click();
        await expect(page.locator('add-issue-modal')).toBeVisible();
    });

    test('Create an issue and its correctly visuable.', async ({ page }) => {
        const type = await createPage.chooseRandomDropdown(createPage.issueTypeSelect); // funciona
        const priority = await createPage.chooseRandomDropdown(createPage.issuePrioritySelect);
        const summary = `Summary - ${Date.now()}`;
        const description = `Description - ${Date.now()}`;
        await createPage.fillSummary(summary);
        await createPage.fillDescription(description);
        // await page.waitForTimeout(500);
        const assignee = await createPage.assignAssignee();
        await createPage.saveButton.click();

        /*
            - Crear un metodo en BoardPage que entre a un issue a partir de un summary(titulo)
            - Reescribir los expects de forma mas comparta usando los metodos de IssueDetail
            */
            
            const column = await page.locator('[cdkdroplist]#Backlog');
            await column.locator('issue-card').getByText(summary).click();
            await page.waitForTimeout(500);
            const cajaDeTexto = page.locator('issue-title textarea');
            await expect(cajaDeTexto).toHaveValue(summary);
            const resumen = page.locator('issue-description');
            await expect(resumen).toHaveText(description);
            
            const priorityLabel = page.locator('.priority-label');
            await expect(priorityLabel).toHaveText(priority);
            
            const issueType = page.locator('issue-type');
            await expect(issueType).toContainText(type);
            
            const assignees = page.locator('issue-assignees j-user');
            const assigneesText = await assignees.allInnerTexts();
            const assigneesList = assigneesText.map(text => text.trim());
            const expectedAssignees = assignee.split(',').map(name => name.trim());
            expect(assigneesList).toEqual(expect.arrayContaining(expectedAssignees));
            




        /*
        const createButton = page.locator('app-navbar-left i[aria-label="plus"]'); 
        await createButton.click();
        await expect(page.locator('add-issue-modal')).toBeVisible();
        const summary = "Summary.";
        const description = "Description.";
        await page.locator('issue-type-select').click();
        await page.locator('nz-option-item').getByText('Bug').click();
        await page.locator('issue-priority-select').click();
        await page.locator('nz-option-item').getByText('High', { exact: true }).click();
        await page.locator('input[formcontrolname="title"]').fill(summary);
        await page.locator('quill-editor p').fill(description);
        await page.locator('issue-assignees-select').click();
        await page.locator('nz-option-item[title="Spider Man"]').click();
        await page.locator('nz-option-item[title="Thor"]').click();
        page.keyboard.press('Escape');
        page.locator('j-button[type="submit"]').click();

        const column = await page.locator('[cdkdroplist]#Backlog');
        await column.locator('issue-card').getByText('Summary.').click();
        await page.waitForTimeout(500);
        const cajaDeTexto = page.locator('issue-title textarea');
        await expect(cajaDeTexto).toHaveValue('Summary.');
        const resumen = page.locator('issue-description');
        await expect(resumen).toHaveText('Description.');

        const assignees = page.locator('issue-assignees j-user');
        await expect(assignees).toHaveText(['Spider Man', 'Thor']);

        await expect(page.locator('.priority-label')).toHaveText('High');

        await expect(page.locator('issue-type')).toContainText('Bug'); 
        */
    });

    
    // ver si complejizo el chequeo de la no existencia del issue
    test('Llenar todos los campos de un issue, tocar el botón de cancelar y que no aparezca.', async ({ page }) => {
        const unique = Date.now().toString(); 
        const title = `Test Cancelar - ${unique}`;

        const createButton = page.locator('app-navbar-left i[aria-label="plus"]');
        await createButton.click();
        await expect(page.locator('add-issue-modal')).toBeVisible();
        const description = "Description.";
        await page.locator('issue-type-select').click();
        await page.locator('nz-option-item').getByText('Bug').click();
        await page.locator('issue-priority-select').click();
        await page.locator('nz-option-item').getByText('High', { exact: true }).click();
        await page.locator('input[formcontrolname="title"]').fill(title);
        await page.locator('quill-editor p').fill(description);
        await page.locator('issue-assignees-select').click();
        await page.locator('nz-option-item[title="Spider Man"]').click();
        await page.locator('nz-option-item[title="Thor"]').click();
        page.keyboard.press('Escape');
        page.getByText('Cancel').click();

        await expect(page.getByText(title)).not.toBeVisible();
    });

    // Finished
    test('Intentar crear un issue sin nada y que no se pueda.', async ({ page }) => {
        await expect(createPage.saveButton).toBeDisabled();
    })

});