import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { getRandomElement } from '../utils/utils';
import { IssueDetailPage } from '../pages/IssueDetail';

test.describe('Jira Clone - Issue Detail', () => {
    let boardPage: BoardPage;
    let issuePage: IssueDetailPage;

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        issuePage = new IssueDetailPage(page);
        await boardPage.goto();
        const chosenIssue = await getRandomElement(page.locator('issue-card'));
        await chosenIssue.click();
        await expect(issuePage.issueModal).toBeVisible();
    });
    
    test('Press the delete button, the confirm, and the issue will disappear.', async ({ page }) => {
        const id = await issuePage.getIssueId();

        await expect(issuePage.deleteButton).toBeVisible();
        await issuePage.deleteButton.click();

        await expect(issuePage.confirmDeleteModal).toBeVisible();
        await issuePage.confirmDeleteButton.click();

        const issueDeleted = page.locator('issue-card').filter({ hasText: id });
        await expect(issueDeleted).toBeHidden();
    });
    
    test('Press the `extend button` and the url will change.', async ({ page }) => {
        const fullId = await issuePage.getIssueId();
        const id = fullId.split('-')[1];

        await issuePage.expandButton.click();
        await expect(page.locator('full-issue-detail')).toBeVisible();
        const regexUrl = new RegExp(`.*${id}`);
        await expect(page).toHaveURL(regexUrl);
    });

    test('Put a comment, close the issue, open it again and it persists(the comment).', async ({ page }) => {
        const comment = 'Nothing important.';
        const id = await issuePage.getIssueId();
        await issuePage.putComment(comment);
        await issuePage.closeButton.click();
        await boardPage.enterIssue(id);
        await expect(issuePage.issueModal).toBeVisible();
        await expect(issuePage.issueModal.getByText(comment)).toBeVisible();
    });

    test('Change the issue info and those changes persist.', async ({ page }) => {
        const newTitle = `Modified Title - ${Date.now()}`;
        const newDesc = `Modified Description - ${Date.now()}`;
        const fullId = await issuePage.getIssueId(); 
        const id = fullId.split('-')[1];
        
        await issuePage.modificarTextos(newTitle, newDesc);
        const newType = await issuePage.cambiarDropdownAlAzar(issuePage.typeOptions);
        const newStatus = await issuePage.cambiarDropdownAlAzar(issuePage.statusOptions);
        const newReporter = await issuePage.cambiarDropdownAlAzar(issuePage.reporterOptions);
        const newPriority = await issuePage.cambiarDropdownAlAzar(issuePage.priorityOptions);

        await issuePage.removeAssignees();
        const newAssignees = await issuePage.agregarAsignadoAlAzar();

        await issuePage.closeButton.click();

        await boardPage.enterIssue(id); 
        await expect(issuePage.issueModal).toBeVisible();

        await expect(issuePage.titleInput).toHaveValue(newTitle);
        await expect(issuePage.descBox).toHaveText(newDesc);
        await expect(issuePage.statusOptions).toHaveText(newStatus, { useInnerText: true });
        await expect(issuePage.reporterOptions).toHaveText(newReporter);
        await expect(issuePage.priorityOptions).toHaveText(newPriority);
        await expect(issuePage.typeOptions).toHaveText(newType, { ignoreCase: true });
        
        const currentAssignees = await issuePage.assigneesOptions.allInnerTexts();
        expect(currentAssignees.join(', ')).toEqual(newAssignees);
    });
});
