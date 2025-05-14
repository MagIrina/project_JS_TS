import { HttpUtils } from "./http-utils";

export class BalanceUtils {
    static async getBalance() {
        const res = await HttpUtils.request('/balance', 'GET', true);
        if (res.redirect) {
            window.location.href = res.redirect;
            return;
        }
        return res.response?.balance ?? 0;
    }

    static async updateBalance(newBalance) {
        const res = await HttpUtils.request('/balance', 'PUT', true, {newBalance});
        if (res.redirect) {
            window.location.href = res.redirect;
            return null;
        }
        return res.response?.balance ?? null;
    }
}