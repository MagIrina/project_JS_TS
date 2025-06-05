import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";

export class Logout {
    readonly openNewRoute: (route: string) => void;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;

        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (!accessToken || !refreshToken) {
            this.openNewRoute('/login');
            return;
        }

        this.logout().then();
    }


    private async logout(): Promise<void> {

        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
        }
}