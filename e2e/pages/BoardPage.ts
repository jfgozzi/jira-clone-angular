import { Page, Locator } from '@playwright/test';

export class BoardPage {
    readonly page: Page;
    readonly columnsGroup: Locator;
    readonly columns: Locator;
    readonly filters: Locator;

    constructor(page: Page) {
        this.page = page;
        this.columnsGroup = page.locator('[cdkdroplistgroup]');      // entre corchetes si esta suelto el atributo
        this.columns = this.columnsGroup.locator('.board-dnd-list'); // si no, de esta forma 
        this.filters = page.locator('board-filter');
    }

    getColumnByName(nombre: string): Locator {
        return this.columns.filter({ hasText: nombre });
    }

    async validateAvatars(nombresEsperados: string[]) {
        const columnsArray = await this.columns.all();
        for(const column of columnsArray) {
            const issues = await column.locator('.issue-wrap').all()
            for(const issue of issues) {
                await issue.click();
                await expect(this.page.locator('issue-modal')).toBeVisible();
                await expect(this.page.locator('issue-assignees').getByRole('button', { name: 'Trung Vo' })).toBeVisible();
                await this.page.locator('j-button[icon="times"]').click();
            }
        }       
    }

    async goto() {
        await this.page.goto('http://localhost:4200/');
    }
}