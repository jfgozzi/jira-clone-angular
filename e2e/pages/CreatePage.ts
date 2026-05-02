import { Page, Locator, expect } from '@playwright/test';
import { getRandomElement } from '../utils/utils';

export class CreatePage {
    readonly page: Page;
    readonly createButton: Locator;
    readonly issueTypeSelect: Locator;
    readonly issuePrioritySelect: Locator;
    readonly shortSummaryBox: Locator;
    readonly descriptionBox: Locator;
    readonly assigneesSelect: Locator;
    readonly saveButton: Locator;

    
    constructor(page: Page) {
        this.page = page;
        this.createButton = page.locator('app-navbar-left i[aria-label="plus"]');
        this.issueTypeSelect = page.locator('issue-type-select');
        this.issuePrioritySelect = page.locator('issue-priority-select');
        this.shortSummaryBox = page.locator('input[formcontrolname="title"]');
        this.descriptionBox = page.locator('quill-editor [contenteditable="true"]');
        this.assigneesSelect = page.locator('issue-assignees-select');
        this.saveButton = page.locator('button[type="submit"]');
    }

    async chooseRandomDropdown(botonTrigger: Locator): Promise<string> {
        await botonTrigger.click();
        await this.page.waitForTimeout(200);
        const opciones = this.page.locator('cdk-virtual-scroll-viewport nz-option-item:visible');
        const opcionAlAzar = await getRandomElement(opciones);
        await this.page.waitForTimeout(200);
        const textoElegido = await opcionAlAzar.innerText();
        await this.page.waitForTimeout(200);
        await opcionAlAzar.click();
        await this.page.waitForTimeout(200);
        return textoElegido.trim(); 
    }

    async fillSummary(summary: string) {
        await this.shortSummaryBox.fill(summary);
    }

    async fillDescription(description: string) {
        await this.descriptionBox.fill(description);
    }

    async assignAssignee(): Promise<string> {
        /*
        const cantidadAnterior = await this.assigneesOptions.count();
        await this.addAssigneeButton.click();
        const opciones = this.page.locator('li.ant-dropdown-menu-item');
        const opcion = await getRandomElement(opciones);
        await opcion.click();
        await opciones.first().waitFor({ state: 'hidden' });
        await expect(this.assigneesOptions).toHaveCount(cantidadAnterior + 1);
        const todosLosAsignados = await this.assigneesOptions.allInnerTexts(); 
        return todosLosAsignados.join(', ');
        */
        await this.assigneesSelect.click();
        const opciones = this.page.locator('cdk-virtual-scroll-viewport nz-option-item:visible');
        const opcion = await getRandomElement(opciones);
        const textoElegido = await opcion.innerText();
        await opcion.click();
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Escape');
        return textoElegido.trim();
    }
}