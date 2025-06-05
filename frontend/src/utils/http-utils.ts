import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {HttpResponseType} from "../types/http-response.type";

export class HttpUtils {
    static async request<T = any>(
        url: string,
        method: string = "GET",
        useAuth: boolean = true,
        body: any = null
    ): Promise<HttpResponseType<T>> {
        const result: HttpResponseType<T> = {
            error: false,
            response: null
        };

        const params: RequestInit = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
        };

        let token: string | null = null;

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string;
            if (token) {
                if (!params.headers) {
                    params.headers = {};
                }
                (params.headers as Record<string, string>)['X-Auth-Token'] = token;
            }
        }


        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;

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
                            (params.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
                        }
                        return this.request<T>(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }
        return result;
    }
}