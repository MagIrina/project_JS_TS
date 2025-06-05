import {AuthUtils} from "../utils/auth-utils";
import {AuthGuard} from "../utils/auth-guard";
import {BalanceUtils} from "../utils/balance-utils";
import { Modal} from "bootstrap";

export class LayoutSidebar {
    readonly openNewRoute: (path: string) => void;
    readonly userFullNameElement: HTMLElement | null;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.userFullNameElement = document.getElementById('user-full-name');
        if (this.userFullNameElement) {
            this.setUserFullName();
        }

        this.init().then();
    }

    private async init(): Promise<void> {
        const isAuthenticated = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuthenticated) return;

        if (this.userFullNameElement) {
            this.setUserFullName();
        }
        await this.setupBalanceSection();
    }

    private setUserFullName() {
        const userInfoRaw = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
        if (!userInfoRaw) return;

        if (typeof userInfoRaw === 'string') {
            try {
                const userInfo = JSON.parse(userInfoRaw);
                const fullName = [userInfo.name, userInfo.lastName].filter(Boolean).join(' ');
                if (fullName && this.userFullNameElement) {
                    this.userFullNameElement.textContent = fullName;
                }
            } catch (e) {
                console.error("Ошибка при разборе userInfo:", e);
            }
        }

    }

    private async setupBalanceSection() {
        const balanceLink = document.getElementById('balance');
        const balanceModalEl = document.getElementById('balance-modal');
        const inputEl = document.getElementById('balance-input') as HTMLInputElement;
        const saveBtn = document.getElementById('save-balance');
        if (!balanceLink || !balanceModalEl || !inputEl || !saveBtn) {
            return;
        }

        const modal = new Modal(balanceModalEl, {keyboard: false});

        const currentBalance: number | null = await BalanceUtils.getBalance();
        if (currentBalance !== null) {
            balanceLink.textContent = `${currentBalance} $`;
        }

        balanceLink.addEventListener('click', async () => {
            const latestBalance = await BalanceUtils.getBalance();
            inputEl.value = String(latestBalance ?? 0);
            modal.show();
        });

        saveBtn.addEventListener('click', async () => {
            const newBalance = parseFloat(inputEl.value);

            if (isNaN(newBalance)) {
                alert("Введите корректное число");
                return;
            }

            const updated = await BalanceUtils.updateBalance(newBalance);
            if (updated !== null) {
                balanceLink.textContent = `${updated} $`;
                modal.hide();
            } else {
                alert("Не удалось обновить баланс");
            }
        });
    }
}



