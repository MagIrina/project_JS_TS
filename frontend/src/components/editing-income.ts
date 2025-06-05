import { HttpUtils } from "../utils/http-utils";
import { AuthGuard } from "../utils/auth-guard";
import { CategoryType } from "../types/category.type";

export class EditingIncome {
    readonly openNewRoute: (path: string) => void;
    private input: HTMLInputElement;
    private saveBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    readonly categoryId: string | null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.input = document.getElementById('category-title-input')! as HTMLInputElement;
        this.saveBtn = document.getElementById('save-btn')! as HTMLButtonElement;
        this.cancelBtn = document.getElementById('cancel-btn')! as HTMLButtonElement;
        this.categoryId = this.getCategoryIdFromURL();

        this.init().then();
    }

    private async init(): Promise<void> {
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

    private getCategoryIdFromURL(): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    private async fetchCategory(): Promise<CategoryType | null> {
        const result = await HttpUtils.request<CategoryType>(`/categories/income/${this.categoryId}`, 'GET', true);
        if (result.error || !result.response?.title) {
            alert("Не удалось загрузить категорию");
            this.openNewRoute('/income');
            return null;
        }
        return result.response;
    }

    private bindEvents(): void {
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

            const result = await HttpUtils.request<unknown>(
                `/categories/income/${this.categoryId}`,
                'PUT',
                true,
                { title: newTitle }
            );
            if (!result.error) {
                this.openNewRoute('/income');
            } else {
                alert("Ошибка при обновлении категории");
            }
        });
    }
}

