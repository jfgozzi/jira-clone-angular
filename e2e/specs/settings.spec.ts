import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('Jira Clone - Settings Window', () => 
{
    let boardPage: BoardPage;
    let settingsPage: SettingsPage;

    test.beforeEach(async ({ page }) => 
    {
        boardPage = new BoardPage(page);
        settingsPage = new SettingsPage(page);
        await boardPage.goto();
        await boardPage.settingsButton.click();
        await expect(settingsPage.modal).toBeVisible();
    });
    
    
    test('Change the projects name and see the change.', async () => 
    {
        const newName = 'A Normal and Completely Project Name';
        await settingsPage.fillInput(newName);
        await expect(settingsPage.path).toContainText(newName);
        await expect(boardPage.sideBar).toContainText(newName);
    });
});