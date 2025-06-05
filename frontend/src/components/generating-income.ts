import {HttpUtils} from "../utils/http-utils";
import {AuthGuard} from "../utils/auth-guard";

export class GeneratingIncome {
    readonly openNewRoute: (path: string) => void;
    readonly input: HTMLInputElement | null;
    readonly createBtn: HTMLElement | null;
    readonly cancelBtn: HTMLElement | null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.input = document.getElementById('category-title-input') as HTMLInputElement | null;
        this.createBtn = document.getElementById('create-btn');
        this.cancelBtn = document.getElementById('cancel-btn');

        this.init().then();
    }

    private async init(): Promise<void> {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        this.bindEvents();
    }

    private bindEvents(): void {
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => {
                this.openNewRoute('/income');
            });
        }

        if (this.createBtn) {
            this.createBtn.addEventListener('click', async (e: MouseEvent) => {
                e.preventDefault();
                if (!this.input) return;
                const title = this.input.value.trim();
                if (!title) {
                    alert("Название не может быть пустым");
                    return;
                }

                const result = await HttpUtils.request('/categories/income', 'POST', true, { title });

                if (!result.error) {
                    this.openNewRoute('/income');
                } else {
                    alert("Ошибка при создании категории");
                }
            });
        }
    }
}
