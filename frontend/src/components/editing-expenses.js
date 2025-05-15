import {HttpUtils} from "../utils/http-utils.js";
import {AuthGuard} from "../utils/auth-guard.js";

export class EditingExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.input = document.getElementById('category-title-input');
        this.saveBtn = document.getElementById('save-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.categoryId = this.getCategoryIdFromURL();

        this.init().then();
    }

    async init() {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        if (!this.categoryId) {
            this.openNewRoute('/expenses');
            return;
        }

        const category = await this.fetchCategory();
        if (category) {
            this.input.value = category.title;
            this.bindEvents();
        }
    }

    getCategoryIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async fetchCategory() {
        const result = await HttpUtils.request(`/categories/expense/${this.categoryId}`, 'GET', true);
        if (result.error || !result.response?.title) {
            this.openNewRoute('/expenses');
            return null;
        }
        return result.response;
    }

    bindEvents() {
        this.cancelBtn.addEventListener('click', () => {
            this.openNewRoute('/expenses');
        });

        this.saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const newTitle = this.input.value.trim();
            if (!newTitle) {
                alert("Введите название категории");
                return;
            }

            const result = await HttpUtils.request(`/categories/expense/${this.categoryId}`, 'PUT', true, { title: newTitle });
            if (!result.error) {
                this.openNewRoute('/expenses');
            } else {
                alert("Ошибка при обновлении категории");
            }
        });
    }
}
