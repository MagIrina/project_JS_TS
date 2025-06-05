import { HttpUtils } from "./http-utils";
import {BalanceResponseType} from "../types/balance-response.type";

export class BalanceUtils {
    public static async getBalance(): Promise<number | null> {
        const res = await HttpUtils.request<BalanceResponseType>('/balance', 'GET', true);
        if (res.redirect) {
            window.location.href = res.redirect;
        }
        return res.response?.balance ?? 0;
    }

    static async updateBalance(newBalance: number): Promise<number | null> {
        const res = await HttpUtils.request<BalanceResponseType>('/balance', 'PUT', true, {newBalance});
        if (res.redirect) {
            window.location.href = res.redirect;
            return null;
        }
        return res.response?.balance ?? null;
    }
}