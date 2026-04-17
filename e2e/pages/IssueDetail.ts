import { Page, Locator } from '@playwright/test';

export class IssueDetail {
    readonly page: Page;
    readonly titleIssue: Locator;
    readonly descriptionIssue: Locator;
    readonly commentsIssue: Locator;
    readonly statusIssue: Locator;
    readonly reporterIssue: Locator;
    readonly assigneesIssue: Locator;
    readonly priorityIssue: Locator;
    readonly buttonIssue: Locator;
    readonly typeIssue: Locator;


    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('http://localhost:4200/');
    }
}
