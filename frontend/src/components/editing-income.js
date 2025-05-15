import {HttpUtils} from "../utils/http-utils.js";
import {AuthGuard} from "../utils/auth-guard.js";

export class EditingIncome {
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
            alert("ID категории не указан");
            this.openNewRoute('/income');
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
        const result = await HttpUtils.request(`/categories/income/${this.categoryId}`, 'GET', true);
        if (result.error || !result.response?.title) {
            alert("Не удалось загрузить категорию");
            this.openNewRoute('/income');
            return null;
        }
        return result.response;
    }

    bindEvents() {
        this.cancelBtn.addEventListener('click', () => {
            this.openNewRoute('/income');
        });

        this.saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const newTitle = this.input.value.trim();
            if (!newTitle) {
                alert("Введите название категории");
                return;
            }

            const result = await HttpUtils.request(`/categories/income/${this.categoryId}`, 'PUT', true, { title: newTitle });
            if (!result.error) {
                this.openNewRoute('/income');
            } else {
                alert("Ошибка при обновлении категории");
            }
        });
    }
}
