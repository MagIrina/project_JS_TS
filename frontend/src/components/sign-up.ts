import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import {TokensType} from "../types/tokens.type";
import {UserInfoType} from "../types/user-info.type";
import {HttpResponseType} from "../types/http-response.type";

export class SignUp {
    readonly openNewRoute: (route: string) => void;

    private initialsElement!: HTMLInputElement;
    private emailElement!: HTMLInputElement;
    private passwordElement!: HTMLInputElement;
    private passwordRepeatElement!: HTMLInputElement;
    private commonErrorElement!: HTMLElement;

    private lastName: string = '';
    private firstName: string = '';

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        const initials = document.getElementById('initials') as HTMLInputElement | null;
        const email = document.getElementById('email') as HTMLInputElement | null;
        const password = document.getElementById('password') as HTMLInputElement | null;
        const passwordRepeat = document.getElementById('password-repeat') as HTMLInputElement | null;
        const commonError = document.getElementById('common-error') as HTMLElement | null;
        const processButton = document.getElementById('process-button');

        if (!initials || !email || !password || !passwordRepeat || !commonError || !processButton) {
            throw new Error('Required DOM elements not found');
        }

        this.initialsElement = initials;
        this.emailElement = email;
        this.passwordElement = password;
        this.passwordRepeatElement = passwordRepeat;
        this.commonErrorElement = commonError;

        processButton.addEventListener('click', this.signUp.bind(this));
        this.initialsElement.addEventListener('blur', this.formatAndValidateInitials.bind(this));
    }

    private formatName(value: string): string {
        return value
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
            )
            .join(' ');
    }

    private formatAndValidateInitials(): boolean {
        const error = document.getElementById('initials-error') as HTMLElement | null;
        if (!error) return false;

        const value = this.formatName(this.initialsElement.value);
        this.initialsElement.value = value;

        const pattern = /^([А-ЯЁ][а-яё]+)(\s[А-ЯЁ][а-яё]+){1,2}$/;

        if (pattern.test(value)) {
            error.style.display = 'none';
            this.initialsElement.classList.remove('is-invalid');
            this.initialsElement.classList.add('is-valid');

            const parts = value.split(' ');
            this.lastName = parts[0];
            this.firstName = parts[1];
            return true;
        } else {
            error.style.display = 'block';
            this.initialsElement.classList.add('is-invalid');
            this.initialsElement.classList.remove('is-valid');
            return false;
        }
    }

    private validateForm(): boolean {
        let isValid = true;
        if (!this.formatAndValidateInitials()) {
            isValid = false;
        }

        const emailPattern = /^\w+([-.']?\w+)*@\w+([-.]\w+)*\.\w{2,}$/;
        if (this.emailElement.value && emailPattern.test(this.emailElement.value)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        const password = this.passwordElement.value;
        const passwordRepeat = this.passwordRepeatElement.value;
        const passwordPattern = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/;

        if (passwordPattern.test(password)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (password && password === passwordRepeat) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    private async signUp(): Promise<void> {
        this.commonErrorElement.style.display = 'none';

        if (!this.validateForm()) return;

        const registerResult: HttpResponseType<any> = await HttpUtils.request(
            '/signup',
            'POST',
            false,
            {
            email: this.emailElement.value,
            password: this.passwordElement.value,
            passwordRepeat: this.passwordRepeatElement.value,
            lastName: this.lastName,
            name: this.firstName
        });

        if (
            registerResult.error ||
            !registerResult.response ||
            !registerResult.response.user
        ) {
            this.commonErrorElement.style.display = 'block';
            return;
        }

        const loginResult = await HttpUtils.request<{
            tokens: TokensType;
            user: UserInfoType;
        }>('/login', 'POST', false, {
            email: this.emailElement.value,
            password: this.passwordElement.value,
            rememberMe: true
        });

        const {tokens, user} = loginResult.response ?? {};

        if (
            loginResult.error ||
            !tokens?.accessToken ||
            !tokens.refreshToken ||
            !user
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

