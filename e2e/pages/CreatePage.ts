import { Page, Locator, expect } from '@playwright/test';
import { selectRandomDropdownOption } from '../utils/utils';

export class CreatePage 
{
    readonly page: Page;
    readonly modal: Locator;
    readonly typeSelect: Locator;
    readonly prioritySelect: Locator;
    readonly shortSummaryBox: Locator;
    readonly descriptionBox: Locator;
    readonly assigneesSelect: Locator;
    readonly createIssueButton: Locator;
    readonly cancelButton: Locator;

    
    constructor(page: Page) 
    {
        this.page = page;
        this.modal = page.locator('add-issue-modal');
        this.createIssueButton = this.modal.locator('button[type="submit"]');
        this.cancelButton = this.modal.getByText('Cancel');
        this.typeSelect = this.modal.locator('issue-type-select');
        this.prioritySelect = this.modal.locator('issue-priority-select');
        this.assigneesSelect = this.modal.locator('issue-assignees-select');
        this.shortSummaryBox = this.modal.locator('input[formcontrolname="title"]');
        this.descriptionBox = this.modal.locator('quill-editor [contenteditable="true"]');
    }


    async fillSummary(summary: string) 
    {
        await this.shortSummaryBox.fill(summary);
        await this.page.keyboard.press('Tab');
    }

    
    async fillDescription(description: string) 
    {
        await this.descriptionBox.evaluate((node, injectedText) => {
            node.innerHTML = `<p>${injectedText}</p>`;
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
        }, description);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(300);
    }


    async chooseRandomDropdown(trigger: Locator): Promise<string> 
    {
        const options= this.page.locator('cdk-virtual-scroll-viewport nz-option-item:visible');
        return selectRandomDropdownOption(this.page, trigger, options, false);
    }


    async assignAssignee(): Promise<string> 
    {
        const options = this.page.locator('cdk-virtual-scroll-viewport nz-option-item:visible');
        return selectRandomDropdownOption(this.page, this.assigneesSelect, options, true);
    }
}