import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";

export class SignUp {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.initialsElement = document.getElementById('initials');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

        this.initialsElement.addEventListener('blur', this.formatAndValidateInitials.bind(this));
    }

    formatName(value) {
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

    formatAndValidateInitials() {
        const error = document.getElementById('initials-error');
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

    validateForm() {
        let isValid = true;

        if (!this.formatAndValidateInitials()) {
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-.']?\w+)*@\w+([-.]\w+)*\.\w{2,}$/)) {
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

    async signUp() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {
            const registerResult = await HttpUtils.request('/signup', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
                lastName: this.lastName,
                name: this.firstName
            });

            if (registerResult.error || !registerResult.response || !registerResult.response.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            const loginResult = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: true
            });

            const {tokens, user} = loginResult.response;
            if (!tokens || !tokens.accessToken || !tokens.refreshToken || !user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            const {accessToken, refreshToken} = tokens;
            if (!accessToken || !refreshToken) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(accessToken, refreshToken, {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName
            });

            this.openNewRoute('/');
        }
    }
}

