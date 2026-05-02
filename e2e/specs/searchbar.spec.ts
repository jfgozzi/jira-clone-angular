import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { SearchBarPage } from '../pages/SearchBar';

test.describe('Jira Clone - Search Bar Window', () => {
    let boardPage: BoardPage;
    let bar: SearchBarPage;

    test.beforeEach(async ({ page }) => {
        boardPage = new BoardPage(page);
        bar = new SearchBarPage(page);
        await boardPage.goto();
        await bar.searchIcon.click(); 
    });

    test('Write some word and all results are related.', async ({ page }) => {
        await bar.fillBox('issue');
        const results = await page.locator('issue-results').all();
        for (const result of results) {
            await result.click();
            await expect(page.locator('issue-detail')).toContainText('issue');
        }
    });

    test('Write some random word and "no match" message appears.', async ({ page }) => {
        await bar.fillBox('No results');
        await expect(bar.searchResults).toContainText("We couldn't find anything matching your search");
    });

});