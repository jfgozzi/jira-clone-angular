import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { CreatePage } from '../pages/CreatePage';
import { IssueDetailPage } from '../pages/IssueDetail';


test.describe('Jira Clone - Create Issue Window', () => 
{
    let boardPage: BoardPage;
    let createPage: CreatePage;
    let issueDetail: IssueDetailPage;


    test.beforeEach(async ({ page }) => 
    {
        boardPage = new BoardPage(page);
        createPage = new CreatePage(page);
        issueDetail = new IssueDetailPage(page);

        await boardPage.goto();
        await boardPage.createIssueButton.click();
        await expect(createPage.modal).toBeVisible();
    });


    test('Create an issue and its correctly visible.', async () => 
    {
        const title = `Testing Issue - ${Date.now()}`;
        const description = `Description - ${Date.now()}`;

        await createPage.fillSummary(title);
        await createPage.fillDescription(description);
        const type = await createPage.chooseRandomDropdown(createPage.typeSelect); 
        const priority = await createPage.chooseRandomDropdown(createPage.prioritySelect);
        const assignee = await createPage.assignAssignee();
        await createPage.createIssueButton.click();

        await boardPage.enterIssueWithTitle(title);

        await expect(issueDetail.titleInput).toHaveValue(title);
        await expect(issueDetail.descBox).toHaveText(description);
        await expect(issueDetail.priorityOptions).toHaveText(priority, { useInnerText: true, ignoreCase: true });
        await expect(issueDetail.typeOptions).toContainText(type, { ignoreCase: true });

        const currentAssignees = await issueDetail.assigneesOptions.allInnerTexts();
        expect(currentAssignees.join(', ')).toContain(assignee);
    });


    test('Fill all issue fields, click cancel button and ensure issue is not created.', async () => 
    {
        const title = `Testing Issue - ${Date.now()}`;
        const description = `Description - ${Date.now()}`;

        await createPage.fillSummary(title);
        await createPage.fillDescription(description);
        await createPage.chooseRandomDropdown(createPage.typeSelect); 
        await createPage.chooseRandomDropdown(createPage.prioritySelect);
        await createPage.assignAssignee();
        await createPage.cancelButton.click();

        const nonExistentIssue = boardPage.issues.filter({ hasText: title });

        await expect(createPage.modal).toBeHidden();
        await expect(nonExistentIssue).toBeHidden();
    });


    test('Try to create an issue without data and ensure it is not possible.', async () => 
    {
        await expect(createPage.createIssueButton).toBeDisabled();
    })
});