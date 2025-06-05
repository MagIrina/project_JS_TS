import {HttpUtils} from "../utils/http-utils";
import {AuthGuard} from "../utils/auth-guard";
import { CategoryType } from "../types/category.type";

export class EditingExpenses {
    readonly openNewRoute: (path: string) => void;
    private input: HTMLInputElement;
    private saveBtn: HTMLElement;
    private cancelBtn: HTMLElement;
    readonly categoryId: string | null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;

        const input = document.getElementById('category-title-input');
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');

        if (!input || !saveBtn || !cancelBtn) {
            throw new Error("Один из обязательных элементов не найден на странице");
        }

        this.input = input as HTMLInputElement;
        this.saveBtn = saveBtn;
        this.cancelBtn = cancelBtn;
        this.categoryId = this.getCategoryIdFromURL();

        this.init().then();
    }

    private async init(): Promise<void> {
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

    private getCategoryIdFromURL(): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    private async fetchCategory(): Promise<CategoryType | null> {
        const result = await HttpUtils.request<CategoryType>(
            `/categories/expense/${this.categoryId}`,
            'GET',
            true
        );

        if (result.error || !result.response?.title) {
            this.openNewRoute('/expenses');
            return null;
        }
        return result.response;
    }

    private bindEvents(): void {
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

            const result = await HttpUtils.request<unknown>(
                `/categories/expense/${this.categoryId}`,
                'PUT',
                true,
                { title: newTitle });
            if (!result.error) {
                this.openNewRoute('/expenses');
            } else {
                alert("Ошибка при обновлении категории");
            }
        });
    }
}
