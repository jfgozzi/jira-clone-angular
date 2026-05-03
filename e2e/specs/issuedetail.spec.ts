import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { getRandomElement } from '../utils/utils';
import { IssueDetailPage } from '../pages/IssueDetail';

test.describe('Jira Clone - Issue Detail', () => 
{
    let boardPage: BoardPage;
    let issuePage: IssueDetailPage;

    test.beforeEach(async ({ page }) => 
    {
        boardPage = new BoardPage(page);
        issuePage = new IssueDetailPage(page);
        await boardPage.goto();
        const chosenIssue = await getRandomElement(boardPage.issues);
        await chosenIssue.click();
        await expect(issuePage.modal).toBeVisible();
    });
    

    test('Press the delete button, the confirm, and the issue will disappear.', async () => 
    {
        const id = await issuePage.getIssueId();

        await expect(issuePage.deleteButton).toBeVisible();
        await issuePage.deleteButton.click();

        await expect(issuePage.confirmDeleteModal).toBeVisible();
        await issuePage.confirmDeleteButton.click();

        const issueDeleted = boardPage.issues.filter({ hasText: id });
        await expect(issueDeleted).toBeHidden();
    });
    

    test('Press the `extend button` and the url will change.', async ({ page }) => 
    {
        const fullId = await issuePage.getIssueId();
        const id = fullId.split('-')[1];

        await issuePage.expandButton.click();
        await expect(page.locator('full-issue-detail')).toBeVisible();
        const regexUrl = new RegExp(`.*${id}`);
        await expect(page).toHaveURL(regexUrl);
    });


    test('Put a comment, close the issue, open it again and it persists(the comment).', async () => 
    {
        const comment = 'Nothing important.';
        const id = await issuePage.getIssueId();
        await issuePage.putComment(comment);
        await issuePage.closeButton.click();
        await boardPage.enterIssue(id);
        await expect(issuePage.modal).toBeVisible();
        await expect(issuePage.modal.getByText(comment)).toBeVisible();
    });

    
    test('Change the issue info and those changes persist.', async () => 
    {
        const newTitle = `Modified Title - ${Date.now()}`;
        const newDesc = `Modified Description - ${Date.now()}`;
        const fullId = await issuePage.getIssueId(); 
        const id = fullId.split('-')[1];
        
        await issuePage.modifyTexts(newTitle, newDesc);
        const newType = await issuePage.chooseRandomDropdown(issuePage.typeOptions);
        const newStatus = await issuePage.chooseRandomDropdown(issuePage.statusOptions);
        const newReporter = await issuePage.chooseRandomDropdown(issuePage.reporterOptions);
        const newPriority = await issuePage.chooseRandomDropdown(issuePage.priorityOptions);

        await issuePage.removeAssignees();
        const newAssignees = await issuePage.assignAssignee();

        await issuePage.closeButton.click();
        await expect(issuePage.modal).toBeHidden();

        await boardPage.enterIssue(id); 
        await expect(issuePage.modal).toBeVisible();

        await expect(issuePage.titleInput).toHaveValue(newTitle);
        await expect(issuePage.descBox).toHaveText(newDesc);
        await expect(issuePage.statusOptions).toHaveText(newStatus, { useInnerText: true, ignoreCase: true });
        await expect(issuePage.reporterOptions).toHaveText(newReporter);
        await expect(issuePage.priorityOptions).toHaveText(newPriority, { ignoreCase: true });
        await expect(issuePage.typeOptions).toContainText(newType, { ignoreCase: true });
        
        const currentAssignees = await issuePage.assigneesOptions.allInnerTexts();
        expect(currentAssignees.join(', ')).toContain(newAssignees);
    });
});
