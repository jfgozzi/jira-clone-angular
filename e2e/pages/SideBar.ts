import { Page, Locator } from '@playwright/test';

export class SideBar {
    readonly page: Page;
    readonly title: Locator;
    readonly logo: Locator;
    readonly kanbanButton: Locator;
    readonly settingsButton: Locator;
    readonly overlayButton: Locator;

    constructor(page: Page) {
        this.page = page;

    }

    async goto() {
        await this.page.goto('http://localhost:4200/');
    }
}