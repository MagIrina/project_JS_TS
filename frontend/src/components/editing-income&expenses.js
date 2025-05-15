import { AuthGuard } from "../utils/auth-guard.js";
import { HttpUtils } from "../utils/http-utils.js";

export class EditingIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationId = new URLSearchParams(location.search).get('id');
        this.token = null;

        this.init().then();
    }

    async init() {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        const params = new URLSearchParams(window.location.search);
        this.operationId = params.get("id");
        if (!this.operationId) {
            this.openNewRoute('/income&expenses');
            return;
        }

        const operation = await this.loadOperation();
        if (!operation) return;
        $('#type-select').val(operation.type);
        const selectedCategoryId = await this.loadCategoriesByTitle(operation.type, operation.category);
        if (selectedCategoryId) {
            $('#category-select').val(selectedCategoryId);
        }
        $('[name="amount"]').val(operation.amount);
        $('[name="date"]').val(operation.date);
        $('[name="comment"]').val(operation.comment || ' ');
        $('#type-select').on('change', async (e) => {
            const selectedType = e.target.value;
            await this.loadCategoriesByTitle(selectedType);
        });

        $('#edit-form').on('submit', async (e) => {
            e.preventDefault();

            const form = document.getElementById('edit-form');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            const categoryId = Number($('#category-select').val());
            if (!categoryId) {
                alert('Пожалуйста, выберите категорию');
                return;
            }

            const data = {
                type: $('#type-select').val(),
                category_id: categoryId,
                amount: Number($('[name="amount"]').val()),
                date: $('[name="date"]').val(),
                comment: $('[name="comment"]').val().trim() || " "
            };

            const result = await HttpUtils.request(`/operations/${this.operationId}`, 'PUT', true, data);
            if (!result.error) {
                this.openNewRoute('/income&expenses');
            } else {
                alert('Ошибка при редактировании');
            }
        });

        $('#cancel-button').on('click', () => {
            this.openNewRoute('/income&expenses');
        });
    }

    async loadOperation() {
        const result = await HttpUtils.request(`/operations/${this.operationId}`, 'GET');
        if (result.error) {
            alert('Не удалось загрузить операцию');
            this.openNewRoute('/income&expenses');
            return null;
        }
        return result.response;
    }

    async loadCategoriesByTitle(type, categoryTitle = null) {
        const url = `/categories/${type}`;
        const result = await HttpUtils.request(url, 'GET');

        const $select = $('#category-select');
        $select.empty();
        $select.append('<option style="color: #6C757D;" value="" disabled selected hidden>Выберите категорию...</option>');

        if (Array.isArray(result.response)) {
            let selectedId = null;

            result.response.forEach(category => {
                $select.append(`<option value="${category.id}">${category.title}</option>`);
                if (categoryTitle && category.title === categoryTitle) {
                    selectedId = category.id;
                }
            });
            return selectedId;
        }
        return null;
    }
}

