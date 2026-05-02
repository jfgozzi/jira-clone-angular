import { Page, Locator, expect } from '@playwright/test';
import { getRandomElement } from '../utils/utils';

export class IssueDetailPage {
    readonly page: Page;
    readonly issueModal: Locator;
    readonly deleteButton: Locator;
    readonly closeButton: Locator;
    readonly expandButton: Locator;
    readonly boxComment: Locator;
    readonly comments: Locator;
    readonly saveComment: Locator;
    readonly removeAssigneeButton: Locator;
    readonly confirmDeleteModal: Locator;
    readonly confirmDeleteButton: Locator;
    
    readonly typeOptions: Locator;
    readonly statusOptions: Locator;
    readonly reporterOptions: Locator;
    readonly priorityOptions: Locator;
    readonly assigneesOptions: Locator;
    readonly addAssigneeButton: Locator;

    readonly titleBox: Locator;
    readonly titleInput: Locator;
    readonly descBox: Locator;
    readonly descEditor: Locator;

    
    constructor(page: Page) {
        this.page = page;
        this.issueModal = page.locator('issue-modal');

        this.closeButton = page.locator('j-button[icon=times]');
        this.deleteButton = page.locator('j-button[icon=trash]');
        this.expandButton = page.locator('j-button[icon=expand]');

        this.typeOptions = this.issueModal.locator('issue-type j-button');
        this.statusOptions = page.locator('issue-status j-button');
        this.reporterOptions = page.locator('issue-reporter j-button');
        this.priorityOptions = page.locator('issue-priority j-button');
        this.assigneesOptions = page.locator('issue-assignees j-button');
        this.removeAssigneeButton = page.locator('svg-icon[title="Remove user"]');
        this.addAssigneeButton = page.getByText('Add Assignee');


        this.comments = page.locator('issue-comments');
        this.saveComment = page.getByText('Save').nth(0);
        this.boxComment = page.getByPlaceholder('Add a comment');
        this.confirmDeleteModal = page.locator('issue-delete-modal');
        this.confirmDeleteButton = page.getByText('Delete', { exact: true });


        this.titleBox = page.locator('issue-title');
        this.titleInput = page.locator('issue-title textarea');
        this.descBox = page.locator('issue-description');
        this.descEditor = page.locator('issue-description .ql-editor');
    }

    async cambiarDropdownAlAzar(botonTrigger: Locator): Promise<string> {
        await botonTrigger.click();
        const opciones = this.page.locator('li.ant-dropdown-menu-item');
        const opcionAlAzar = await getRandomElement(opciones);
        await opcionAlAzar.click();
        await opciones.first().waitFor({ state: 'hidden' });
        await this.page.waitForTimeout(200);
        return await botonTrigger.innerText();
    }

    async getIssueId() {
        await this.typeOptions.waitFor({ state: 'visible' });
        return await this.typeOptions.innerText();
    }

    async putComment(comment: string) {
        await this.boxComment.click();
        await this.boxComment.fill(comment);
        await this.saveComment.click();
    }

    async removeAssignees() {
        let cantAssignees = await this.removeAssigneeButton.count();
        
        while (cantAssignees > 0) {
            await this.removeAssigneeButton.first().click();
            await expect(this.removeAssigneeButton).toHaveCount(cantAssignees - 1);
            await this.page.waitForTimeout(150);
            cantAssignees = await this.removeAssigneeButton.count();
        }
    }

    async agregarAsignadoAlAzar(): Promise<string> {
        const cantidadAnterior = await this.assigneesOptions.count();
        await this.addAssigneeButton.click();
        const opciones = this.page.locator('li.ant-dropdown-menu-item');
        const opcion = await getRandomElement(opciones);
        await opcion.click();
        await opciones.first().waitFor({ state: 'hidden' });
        await expect(this.assigneesOptions).toHaveCount(cantidadAnterior + 1);
        const todosLosAsignados = await this.assigneesOptions.allInnerTexts(); 
        return todosLosAsignados.join(', ');
    }

    async modificarTextos(nuevoTitulo: string, nuevaDesc: string) {
        await this.titleBox.click();
        await expect(this.titleInput).toBeVisible();
        await this.titleInput.fill(nuevoTitulo);
        await this.issueModal.click({ position: { x: 10, y: 10 } });
        await this.page.waitForTimeout(500);
        await this.descBox.click();
        await expect(this.descEditor).toBeVisible();
        await this.descEditor.fill(nuevaDesc);
        await this.saveComment.click();
        await this.page.waitForTimeout(500);
        await expect(this.saveComment).toBeHidden();
    }
}