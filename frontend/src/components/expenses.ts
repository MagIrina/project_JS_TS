import {AuthGuard} from "../utils/auth-guard";
import {HttpUtils} from "../utils/http-utils";
import { Modal } from 'bootstrap';

export class Expenses {
    readonly openNewRoute: (path: string) => void;
    private container: HTMLElement;
    private modal: Modal;
    private categoryToDeleteId: number | null = null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.container = document.getElementById('expense-categories-container') as HTMLElement;
        this.modal = new Modal(document.getElementById('modal-default') as HTMLElement, {});

        this.init().then();
    }

    private async init(): Promise<void> {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        await this.loadCategories();
        this.bindModalEvents();
    }

    private async loadCategories(): Promise<void> {
        const result = await HttpUtils.request('/categories/expense', 'GET', true);
        if (result.error || !Array.isArray(result.response)) return;

        const addButton = this.container.querySelector('a');
        this.container.innerHTML = '';
        if (addButton) {
            this.container.appendChild(addButton);
        }


        result.response.forEach((category) => {
            const div = document.createElement('div');
            div.className = 'category';
            div.dataset.id = String(category.id);
            div.innerHTML = `
                <h3>${category.title}</h3>
                <button type="button" class="btn btn-primary btn-edit-expense">Редактировать</button>
                <button type="button" class="btn btn-danger btn-delete-expense">Удалить</button>
            `;

            (div.querySelector('.btn-edit-expense') as HTMLButtonElement).addEventListener('click', () => {
                this.openNewRoute(`/editing-expenses?id=${category.id}`);
            });

            (div.querySelector('.btn-delete-expense') as HTMLButtonElement).addEventListener('click', () => {
                this.categoryToDeleteId = category.id;
                this.modal.show();
            });

            if (addButton) {
                this.container.insertBefore(div, addButton);
            } else {
                this.container.appendChild(div);
            }
        });
    }

    private bindModalEvents(): void {
        const closeModalBtn = document.querySelector('.close-modal-expense') as HTMLElement;
        const confirmBtn = document.querySelector('.modal .btn-success') as HTMLButtonElement;

        closeModalBtn.addEventListener('click', () => this.modal.hide());

        confirmBtn.addEventListener('click', async () => {
            if (!this.categoryToDeleteId) return;
            const result = await HttpUtils.request(`/categories/expense/${this.categoryToDeleteId}`, 'DELETE', true);
            if (!result.error) {
                this.modal.hide();
                await this.loadCategories();
            } else {
                alert("Не удалось удалить категорию");
            }
        });
    }
}
