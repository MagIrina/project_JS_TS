import {HttpUtils} from "./http-utils";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo = undefined) {
        if (!accessToken || !refreshToken) {
            throw new Error("Не удалось сохранить токены: один из них отсутствует");
        }

        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo !== undefined) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

    static async updateRefreshToken() {
        if (this.isRefreshing) {
            console.warn("Уже идет обновление токена — ждём завершения...");
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = new Promise(async (resolve) => {
            let result = false;
            const refreshToken = this.getAuthInfo(this.refreshTokenKey);
            if (refreshToken) {
                try {
                    const res = await HttpUtils.request('/refresh', 'POST', false, {refreshToken});

                    console.log("Ответ от /refresh:", res);

                    if (!res.error && res.response?.tokens?.accessToken && res.response?.tokens?.refreshToken) {
                        const tokens = res.response.tokens;

                        const existingUserInfo = this.getAuthInfo(this.userInfoTokenKey);
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
