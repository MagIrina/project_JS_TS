import { AuthUtils } from "./auth-utils";

export class AuthGuard {
    public static async checkAuth(openNewRoute: (path: string) => void): Promise<boolean> {
        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string | null;
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) as string | null;

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