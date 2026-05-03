import { Page, Locator, expect } from '@playwright/test';
import { selectRandomDropdownOption } from '../utils/utils';

export class IssueDetailPage 
{
    readonly page: Page;
    readonly modal: Locator;

    readonly deleteButton: Locator;
    readonly expandButton: Locator;
    readonly closeButton: Locator;

    readonly titleBox: Locator;
    readonly titleInput: Locator;
    readonly descBox: Locator;
    readonly descEditor: Locator;

    readonly typeOptions: Locator;
    readonly statusOptions: Locator;
    readonly reporterOptions: Locator;
    readonly assigneesOptions: Locator;
    readonly removeAssigneeButton: Locator;
    readonly addAssigneeButton: Locator;
    readonly priorityOptions: Locator;

    readonly commentBox: Locator;
    readonly comments: Locator;
    readonly descSaveButton: Locator;
    readonly commentSaveButton: Locator;
    readonly confirmDeleteModal: Locator;
    readonly confirmDeleteButton: Locator;
    
    
    constructor(page: Page) 
    {
        this.page = page;
        this.modal = page.locator('issue-modal');

        this.closeButton = this.modal.locator('j-button[icon=times]');
        this.deleteButton = this.modal.locator('j-button[icon=trash]');
        this.expandButton = this.modal.locator('j-button[icon=expand]');

        this.titleBox = this.modal.locator('issue-title');
        this.titleInput = this.modal.locator('issue-title textarea');
        this.descBox = this.modal.locator('issue-description');
        this.descEditor = this.modal.locator('issue-description .ql-editor');

        this.typeOptions = this.modal.locator('issue-type j-button');
        this.statusOptions = this.modal.locator('issue-status j-button');
        this.reporterOptions = this.modal.locator('issue-reporter j-button');
        this.assigneesOptions = this.modal.locator('issue-assignees j-button');
        this.removeAssigneeButton = this.modal.locator('svg-icon[title="Remove user"]');
        this.addAssigneeButton = this.modal.getByText('Add Assignee');
        this.priorityOptions = this.modal.locator('issue-priority j-button');


        this.commentBox = this.modal.getByPlaceholder('Add a comment');
        this.comments = this.modal.locator('issue-comments');
        this.descSaveButton = this.modal.locator('issue-description').getByText('Save');
        this.commentSaveButton = this.modal.locator('issue-comments').getByText('Save');
        this.confirmDeleteModal = this.page.locator('issue-delete-modal');
        this.confirmDeleteButton = this.page.getByText('Delete', { exact: true });
    }
    

    async chooseRandomDropdown(trigger: Locator): Promise<string> 
    {
        const options = this.page.locator('li.ant-dropdown-menu-item:visible');
        const result = await selectRandomDropdownOption(this.page, trigger, options, false);
        await this.page.waitForTimeout(1000); 
        return result;
    }


    async getIssueId() 
    {
        await this.typeOptions.waitFor({ state: 'visible' });
        const text = await this.typeOptions.innerText();
        return text.trim(); 
    }


    async putComment(comment: string) 
    {
        await this.commentBox.click();
        await this.commentBox.fill(comment);
        await this.commentSaveButton.click();
    }

    async removeAssignees() 
    {
        let cantAssignees = await this.removeAssigneeButton.count();
        
        while (cantAssignees > 0) {
            await this.removeAssigneeButton.first().click();
            await expect(this.removeAssigneeButton).toHaveCount(cantAssignees - 1);
            cantAssignees = await this.removeAssigneeButton.count();
        }
    }

    async assignAssignee(): Promise<string> 
    {
        const options = this.page.locator('li.ant-dropdown-menu-item:visible');
        const trigger = this.assigneesOptions.or(this.addAssigneeButton);
        const result = await selectRandomDropdownOption(this.page, trigger, options, true);
        await this.page.waitForTimeout(1000); 
        return result;
    }

    async modifyTexts(newTitle: string, newDesc: string) 
    {
        await this.titleBox.click();
        await expect(this.titleInput).toBeVisible();
        await this.titleInput.fill(newTitle);
        await this.modal.click({ position: { x: 10, y: 10 } });
        await this.page.waitForTimeout(500);
        await this.descBox.click();
        await expect(this.descEditor).toBeVisible();
        await this.page.waitForTimeout(500); 

        /*
        await this.page.keyboard.press('ControlOrMeta+A');
        await this.page.keyboard.press('Backspace');
        await this.page.keyboard.insertText(newDesc);
        */
        
        await this.descEditor.evaluate((node, injectedText) => {
            node.innerHTML = `<p>${injectedText}</p>`;
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        }, newDesc);

        await this.page.waitForTimeout(500);
        await this.descSaveButton.click();
        await this.page.waitForTimeout(500);
        await expect(this.descSaveButton).toBeHidden();
    }
}