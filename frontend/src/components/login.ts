import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import {LoginRequestType} from "../types/login-request.type";
import {HttpResponseType} from "../types/http-response.type";
import {TokensType} from "../types/tokens.type";
import {UserInfoType} from "../types/user-info.type";

export class Login {private emailElement: HTMLInputElement;
    private passwordElement: HTMLInputElement;
    private rememberMeElement: HTMLInputElement;
    private commonErrorElement: HTMLElement;
    readonly openNewRoute: (route: string) => void;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLElement;

        const button = document.getElementById('process-button');
        if (button) {
            button.addEventListener('click', this.login.bind(this));
        }}

    private validateForm(): boolean {
        let isValid = true;

        const emailValue = this.emailElement.value;
        const passwordValue = this.passwordElement.value;

        const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (emailValue && emailRegex.test(emailValue)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (passwordValue) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    private async login(): Promise<void> {
        this.commonErrorElement.style.display = 'none';

        if (!this.validateForm()) return;

        const payload: LoginRequestType = {
            email: this.emailElement.value,
            password: this.passwordElement.value,
            rememberMe: this.rememberMeElement.checked
        };

        const result: HttpResponseType<{
            tokens: TokensType;
            user: UserInfoType;
        }> = await HttpUtils.request('/login', 'POST', false, payload);

        const tokens = result.response?.tokens;
        const user = result.response?.user;

        if (
            result.error || !tokens || !tokens.accessToken || !tokens.refreshToken ||
            !user || user.id === undefined || user.name === undefined
        ) {
            this.commonErrorElement.style.display = 'block';
            return;
        }

        AuthUtils.setAuthInfo(tokens.accessToken, tokens.refreshToken, {
            id: user.id,
            name: user.name,
            lastName: user.lastName
        });

        this.openNewRoute('/');
    }
}