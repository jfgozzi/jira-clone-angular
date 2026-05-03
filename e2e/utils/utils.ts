import { Locator, Page } from '@playwright/test';

export async function getRandomElement(locators: Locator): Promise<Locator> 
{
    await locators.first().waitFor({ state: 'visible' });
    const cant = await locators.count();

    if (cant === 0) throw new Error('No items were found.');

    const idx = Math.floor(Math.random() * cant);
    return locators.nth(idx);
}

export async function selectRandomDropdownOption(page: Page, trigger: Locator, options: Locator, useEsc: boolean = false): Promise<string> 
{
    await trigger.click();
    const chosen = await getRandomElement(options);
    const text = await chosen.innerText();
    await chosen.evaluate((nodo) => (nodo as HTMLElement).click());

    if (useEsc) await page.keyboard.press('Escape');

    await chosen.waitFor({ state: 'hidden' });
    return text.trim();
}