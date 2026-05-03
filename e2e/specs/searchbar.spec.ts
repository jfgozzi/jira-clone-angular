import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { SearchBarPage } from '../pages/SearchBar';
import { IssueDetailPage } from '../pages/IssueDetail';

test.describe('Jira Clone - Search Bar Window', () => {
    let boardPage: BoardPage;
    let searchBar: SearchBarPage;
    let issuePage: IssueDetailPage;

    test.beforeEach(async ({ page }) => 
    {
        boardPage = new BoardPage(page);
        searchBar = new SearchBarPage(page);
        await boardPage.goto();
        await boardPage.searchButton.click();
        await searchBar.input.click(); 
    });
    
    
    test('Write some word and all results are related.', async ({ page }) => 
    {
        issuePage = new IssueDetailPage(page);
        await searchBar.fillBox('issue');
        const results = await searchBar.results.all();
        for (const result of results) 
        {
            await result.click();
            await expect(issuePage.modal).toContainText('issue');
        }
    });


    test('Write some random word and "no match" message appears.', async () => 
    {
        await searchBar.fillBox('No results');
        await expect(searchBar.resultsColumn).toContainText("We couldn't find anything matching your search");
    });
});