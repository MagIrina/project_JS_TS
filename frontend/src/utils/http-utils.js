import {AuthUtils} from "./auth-utils.js";
import config from "../config/config.js";

export class HttpUtils {
    static async request(url, method = "GET", useAuth = true, body = null) {
        const result = {
            error: false,
            response: null
        }

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
        };

        let token = null;

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['X-Auth-Token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            console.error("Ошибка запроса:", e);
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = '/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        const newToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                        if (newToken) {
                            params.headers['Authorization'] = `Bearer ${newToken}`;
                        }
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }
        return result;
    }
}