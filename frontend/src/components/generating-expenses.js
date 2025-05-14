import {HttpUtils} from "../utils/http-utils.js";
import {AuthGuard} from "../utils/auth-guard.js";

export class GeneratingExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.input = document.getElementById('category-title-input');
        this.createBtn = document.getElementById('create-btn');
        this.cancelBtn = document.getElementById('cancel-btn');

        this.init().then();
    }

    async init() {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        this.bindEvents();
    }

    bindEvents() {
        this.cancelBtn.addEventListener('click', () => {
            this.openNewRoute('/expenses');
        });

        this.createBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const title = this.input.value.trim();
            if (!title) {
                alert("Название не может быть пустым");
                return;
            }

            const result = await HttpUtils.request('/categories/expense', 'POST', true, { title });

            if (!result.error) {
                this.openNewRoute('/expenses');
            } else {
                alert("Ошибка при создании категории");
            }
        });
    }
}
