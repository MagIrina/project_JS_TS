import {AuthGuard} from "../utils/auth-guard";
import {HttpUtils} from "../utils/http-utils";
import { Modal } from "bootstrap";
import {CategoryType} from "../types/category.type";

export class Income {
    readonly openNewRoute: (path: string) => void;
    private container: HTMLElement;
    private modal: Modal;
    private categoryToDeleteId: number | string | null = null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        const containerElement = document.getElementById('income-categories-container');
        const modalElement = document.getElementById('modal-default');

        if (!containerElement || !modalElement) {
            throw new Error("Элементы не найдены");
        }

        this.container = containerElement;
        this.modal = new Modal(modalElement);

        this.init().then();
    }

    private async init(): Promise<void> {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        await this.loadCategories();
        this.bindModalEvents();
    }

    private async loadCategories(): Promise<void> {
        const result = await HttpUtils.request(
            '/categories/income',
            'GET',
            true);
        if (result.error || !Array.isArray(result.response)) {
            alert("Ошибка при получении категорий доходов");
            return;
        }

        const addButton = this.container.querySelector('a');
        this.container.innerHTML = '';
        if (addButton) {
            this.container.appendChild(addButton);
        }

        (result.response as CategoryType[]).forEach(category => {
            const div = document.createElement('div');
            div.className = 'category';
            div.dataset.id = String(category.id);
            div.innerHTML = `
                <h3>${category.title}</h3>
                <button type="button" class="btn btn-primary btn-edit-income">Редактировать</button>
                <button type="button" class="btn btn-danger btn-delete-income">Удалить</button>
            `;

            const btnEdit = div.querySelector('.btn-edit-income');
            btnEdit?.addEventListener('click', () => {
                this.openNewRoute(`/editing-income?id=${category.id}`);
            });

            const btnDelete = div.querySelector('.btn-delete-income');
            btnDelete?.addEventListener('click', () => {
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
        const closeBtn = document.querySelector('.close-modal-income');
        closeBtn?.addEventListener('click', () => {
            this.modal.hide();
        });

        const confirmBtn = document.querySelector('.modal .btn-success');
        confirmBtn?.addEventListener('click', async () => {
            if (!this.categoryToDeleteId) return;

            const result = await HttpUtils.request(
                `/categories/income/${this.categoryToDeleteId}`,
                'DELETE',
                true);
            if (!result.error) {
                this.modal.hide();
                await this.loadCategories();
            } else {
                alert("Не удалось удалить категорию");
            }
        });
    }
}


