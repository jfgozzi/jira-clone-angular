import { Page, Locator, expect } from '@playwright/test';

export class SearchBarPage {
    readonly page: Page;
    readonly searchIcon: Locator; 
    readonly searchInput: Locator;
    readonly searchResults: Locator;

    
    constructor(page: Page) {
        this.page = page;
        this.searchIcon = page.locator('app-navbar-left i[aria-label="search"]');
        this.searchInput = page.locator('input[placeholder="Search issues by summary, description..."]');
        this.searchResults = page.locator('search-drawer');
    }

    async fillBox(text: string) {
        await this.searchInput.pressSequentially(text, { delay: 100 });
    }
}