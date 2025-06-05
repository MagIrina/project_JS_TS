import { HttpUtils } from "../utils/http-utils";
import { AuthGuard } from "../utils/auth-guard";

export class GeneratingExpenses {
    readonly openNewRoute: (path: string) => void;
    public input: HTMLInputElement | null;
    public createBtn: HTMLButtonElement | null;
    public cancelBtn: HTMLButtonElement | null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.input = document.getElementById('category-title-input') as HTMLInputElement | null;
        this.createBtn = document.getElementById('create-btn') as HTMLButtonElement | null;
        this.cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement | null;

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
                this.openNewRoute('/expenses');
            });
        }

        if (this.createBtn) {
            this.createBtn?.addEventListener('click', async (e: MouseEvent) => {
                e.preventDefault();
                if (!this.input) return;

                const title = this.input.value.trim();
                if (!title) {
                    alert("Название не может быть пустым");
                    return;
                }

                const result = await HttpUtils.request('/categories/expense', 'POST', true, {title});

                if (!result.error) {
                    this.openNewRoute('/expenses');
                } else {
                    alert("Ошибка при создании категории");
                }
            });
        }
    }
}



// import {HttpUtils} from "../utils/http-utils";
// import {AuthGuard} from "../utils/auth-guard";
//
// export class GeneratingExpenses {
//     readonly openNewRoute: (path: string) => void;
//     private input: HTMLInputElement;
//     private createBtn: HTMLButtonElement;
//     private cancelBtn: HTMLButtonElement;
//
//     constructor(openNewRoute: (path: string) => void) {
//         this.openNewRoute = openNewRoute;
//         this.input = document.getElementById('category-title-input') as HTMLInputElement;
//         this.createBtn = document.getElementById('create-btn') as HTMLButtonElement;
//         this.cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
//
//         this.init().then();
//     }
//
//     private async init() {
//         const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
//         if (!isAuth) return;
//
//         this.bindEvents();
//     }
//
//     private bindEvents() {
//         this.cancelBtn.addEventListener('click', () =>
//             this.openNewRoute('/expenses'));
//
//         this.createBtn.addEventListener('click', async (e) => {
//             e.preventDefault();
//             const title = this.input.value.trim();
//             if (!title) {
//                 alert("Название не может быть пустым");
//                 return;
//             }
//
//             const result = await HttpUtils.request('/categories/expense', 'POST', true, { title });
//
//             if (!result.error) {
//                 this.openNewRoute('/expenses');
//             } else {
//                 alert("Ошибка при создании категории");
//             }
//         });
//     }
// }
