import {AuthGuard} from "../utils/auth-guard.js";
import {HttpUtils} from "../utils/http-utils.js";

export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.container = document.getElementById('income-categories-container');
        this.modal = new bootstrap.Modal(document.getElementById('modal-default'), {});
        this.categoryToDeleteId = null;

        this.init().then();
    }

    async init() {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        await this.loadCategories();
        this.bindModalEvents();
    }

    async loadCategories() {
        const result = await HttpUtils.request('/categories/income', 'GET', true);
        if (result.error || !Array.isArray(result.response)) {
            alert("Ошибка при получении категорий доходов");
            return;
        }

        const addButton = this.container.querySelector('a');
        this.container.innerHTML = '';
        this.container.appendChild(addButton);

        result.response.forEach(category => {
            const div = document.createElement('div');
            div.className = 'category';
            div.dataset.id = category.id;
            div.innerHTML = `
                <h3>${category.title}</h3>
                <button type="button" class="btn btn-primary btn-edit-income">Редактировать</button>
                <button type="button" class="btn btn-danger btn-delete-income">Удалить</button>
            `;

            div.querySelector('.btn-edit-income').addEventListener('click', () => {
                this.openNewRoute(`/editing-income?id=${category.id}`);
            });

            div.querySelector('.btn-delete-income').addEventListener('click', () => {
                this.categoryToDeleteId = category.id;
                this.modal.show();
            });

            this.container.insertBefore(div, addButton);
        });
    }

    bindModalEvents() {
        document.querySelector('.close-modal-income').addEventListener('click', () => {
            this.modal.hide();
        });

        document.querySelector('.modal .btn-success').addEventListener('click', async () => {
            if (!this.categoryToDeleteId) return;

            const result = await HttpUtils.request(`/categories/income/${this.categoryToDeleteId}`, 'DELETE', true);
            if (!result.error) {
                this.modal.hide();
                await this.loadCategories();
            } else {
                alert("Не удалось удалить категорию");
            }
        });
    }
}


