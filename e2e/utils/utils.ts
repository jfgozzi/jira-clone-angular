import { Locator } from '@playwright/test';

export async function getRandomElement(locators: Locator): Promise<Locator> {
    await locators.first().waitFor({ state: 'visible' });

    const cantidad = await locators.count();
    
    if (cantidad === 0) {
        throw new Error('No se encontraron elementos para elegir al azar.');
    }
    
    const indiceAleatorio = Math.floor(Math.random() * cantidad);
    return locators.nth(indiceAleatorio);
}