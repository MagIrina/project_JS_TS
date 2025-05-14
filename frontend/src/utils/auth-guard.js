import { AuthUtils } from "./auth-utils.js";

export class AuthGuard {
    static async checkAuth(openNewRoute) {
        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (!accessToken || !refreshToken) {
            const refreshed = await AuthUtils.updateRefreshToken();

            if (!refreshed) {
                openNewRoute('/login');
                return false;
            }
        }
        return true;
    }
}