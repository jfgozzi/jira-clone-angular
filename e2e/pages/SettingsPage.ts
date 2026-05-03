import { Page, Locator } from '@playwright/test';

export class SettingsPage 
{
    readonly page: Page;
    readonly modal: Locator;
    readonly searchBar: Locator;
    readonly saveButton: Locator;
    readonly path: Locator;

    
    constructor(page: Page) 
    {
        this.page = page;
        this.modal = page.locator('ng-component');
        this.searchBar = this.modal.getByPlaceholder('Project Name');
        this.saveButton = this.modal.locator('j-button[type="submit"]');
        this.path = this.modal.locator('breadcrumbs');
    }

    
    async fillInput(text: string) 
    {
        await this.searchBar.click();
        await this.searchBar.clear();
        await this.searchBar.pressSequentially(text, { delay: 100 });
        await this.saveButton.click();
    }
}