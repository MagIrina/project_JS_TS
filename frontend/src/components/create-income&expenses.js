import { AuthGuard } from "../utils/auth-guard.js";
import { HttpUtils } from "../utils/http-utils.js";

export class CreateIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.token = null;

        this.init().then();
    }

    async init() {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        const params = new URLSearchParams(window.location.search);
        const typeFromURL = params.get("type") || "income";

        $('#type-select').val(typeFromURL);
        await this.loadCategories(typeFromURL);

        $('#type-select').on('change', async (e) => {
            const selectedType = e.target.value;
            await this.loadCategories(selectedType);
        });

        $('#create-form').on('submit', async (e) => {
            e.preventDefault();
            const data = {
                type: $('#type-select').val(),
                category_id: Number($('#category-select').val()),
                amount: Number($('[name="amount"]').val()),
                date: $('[name="date"]').val(),
                comment: $('[name="comment"]').val().trim() || " "
            };

            const form = document.getElementById('create-form');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            const result = await HttpUtils.request(
                '/operations',
                'POST',
                true,
                data
            );

            if (!result.error) {
                this.openNewRoute('/income&expenses');
            } else {
                alert('Ошибка при создании операции');
            }
        });

        $('#cancel-button').on('click', () => history.back());
    }

    async loadCategories(type) {
        const url = `/categories/${type}`;
        const result = await HttpUtils.request(url, 'GET');

        const $select = $('#category-select');
        $select.empty();
        $select.append('<option style="color: #6C757D;" value="" disabled selected hidden>Выберите категорию...</option>');

        if (Array.isArray(result.response)) {
            result.response.forEach(category => {
                $select.append(`<option value="${category.id}">${category.title}</option>`);
            });
        }
    }
}