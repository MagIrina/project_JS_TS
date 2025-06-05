import {HttpUtils} from "./http-utils";
import {UserInfoType} from "../types/user-info.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    public static setAuthInfo(
        accessToken: string,
        refreshToken: string,
        userInfo?: UserInfoType
    ): void {
        if (!accessToken || !refreshToken) {
            throw new Error("Не удалось сохранить токены: один из них отсутствует");
        }

        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo !== undefined) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static getAuthInfo(
        key?: string
    ): string | UserInfoType | null | Record<string, string | null> {
        const validKeys = [
            this.accessTokenKey,
            this.refreshTokenKey,
            this.userInfoTokenKey,
        ];

        if (key && validKeys.includes(key)) {
            const value = localStorage.getItem(key);
            return key === this.userInfoTokenKey && value
                ? JSON.parse(value)
                : value;
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            };
        }
    };

    private static isRefreshing = false;
    private static refreshPromise: Promise<boolean>;

    public static async updateRefreshToken(): Promise<boolean> {
        if (this.isRefreshing) {
            console.warn("Уже идет обновление токена — ждём завершения...");
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = new Promise<boolean>(async (resolve) => {
            let result = false;
            const refreshToken = this.getAuthInfo(this.refreshTokenKey) as string;
            if (refreshToken) {
                try {
                    const res = await HttpUtils.request('/refresh', 'POST', false, {refreshToken});

                    if (
                        !res.error &&
                        res.response?.tokens?.accessToken &&
                        res.response?.tokens?.refreshToken
                    ) {
                        const tokens = res.response.tokens;
                        const existingUserInfo = this.getAuthInfo(this.userInfoTokenKey) as string | null;
                        this.setAuthInfo(
                            tokens.accessToken,
                            tokens.refreshToken,
                            existingUserInfo ? JSON.parse(existingUserInfo) : undefined
                        );
                        result = true;
                    } else {
                        console.warn("Не удалось обновить токен, res:", res);
                    }
                } catch (e) {
                    console.error("Ошибка запроса обновления токена:", e);
                }
            }

            if (!result) {
                console.warn("Удаление токенов из localStorage");
                this.removeAuthInfo();
            }

            this.isRefreshing = false;
            resolve(result);
        });

        return this.refreshPromise;
    }
}
