import {AuthUtils} from "../utils/auth-utils.js";
import { AuthGuard } from "../utils/auth-guard.js";
import { BalanceUtils } from "../utils/balance-utils.js";

export class LayoutSidebar {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.userFullNameElement = document.getElementById('user-full-name');
        if (this.userFullNameElement) {
            this.setUserFullName();
        }

        this.init().then();
    }

    async init() {
        const isAuthenticated = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuthenticated)
            return;
        if (this.userFullNameElement) {
            this.setUserFullName();
        }
        await this.setupBalanceSection();
    }

    setUserFullName() {
        const userInfoRaw = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
        if (userInfoRaw) {
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

    async setupBalanceSection() {
        const balanceLink = document.getElementById('balance');
        const balanceModalEl = document.getElementById('balance-modal');
        const inputEl = document.getElementById('balance-input');
        const saveBtn = document.getElementById('save-balance');
        if (!balanceLink || !balanceModalEl || !inputEl || !saveBtn) {
            return;
        }

        const modal = new bootstrap.Modal(balanceModalEl, { keyboard: false });

        const currentBalance = await BalanceUtils.getBalance();
        if (currentBalance !== null) {
            balanceLink.textContent = `${currentBalance} $`;
        }

        balanceLink.addEventListener('click', async () => {
            const latestBalance = await BalanceUtils.getBalance();
            inputEl.value = latestBalance ?? 0;
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



