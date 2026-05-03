import { Page, Locator } from '@playwright/test';

export class SearchBarPage 
{
    readonly page: Page;
    readonly input: Locator;
    readonly resultsColumn: Locator;
    readonly results: Locator;

    
    constructor(page: Page) 
    {
        this.page = page;
        this.input = page.locator('input[placeholder="Search issues by summary, description..."]');
        this.resultsColumn = page.locator('search-drawer');
        this.results = this.resultsColumn.locator('issue-results');
    }

    
    async fillBox(text: string) 
    {
        await this.input.pressSequentially(text, { delay: 100 });
    }
}