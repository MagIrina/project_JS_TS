import { AuthGuard } from "../utils/auth-guard";
import { HttpUtils } from "../utils/http-utils";
import $ from 'jquery';

type OperationType = {
    type: "income" | "expense";
    category: string;
    amount: number;
    date: string;
    comment?: string;
};

export class EditingIncomeExpenses {
    public operationId: string | null;
    readonly openNewRoute: (path: string) => void;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.operationId = new URLSearchParams(location.search).get('id');
        this.init().then();
    }

    private async init(): Promise<void> {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        if (!this.operationId) {
            this.openNewRoute('/income&expenses');
            return;
        }

        const operation = await this.loadOperation();
        if (!operation) return;

        ($('#type-select') as JQuery<HTMLSelectElement>).val(operation.type);
        const selectedCategoryId = await this.loadCategoriesByTitle(operation.type, operation.category);
        if (selectedCategoryId) {
            ($('#category-select') as JQuery<HTMLSelectElement>).val(selectedCategoryId);
        }

        ($('[name="amount"]') as JQuery<HTMLInputElement>).val(String(operation.amount));
        ($('[name="date"]') as JQuery<HTMLInputElement>).val(operation.date);
        ($('[name="comment"]') as JQuery<HTMLInputElement>).val(operation.comment || ' ');

        $('#type-select').on('change', async (e) => {
            const selectedType = (e.target as HTMLSelectElement).value as "income" | "expense";
            await this.loadCategoriesByTitle(selectedType);
        });

        $('#edit-form').on('submit', async (e) => {
            e.preventDefault();

            const form = document.getElementById('edit-form') as HTMLFormElement;
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
                type: $('#type-select').val() as string,
                category_id: categoryId,
                amount: Number(($('[name="amount"]').val() as string)),
                date: $('[name="date"]').val() as string,
                comment: ($('[name="comment"]').val() as string).trim() || " "
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

    private async loadOperation(): Promise<OperationType | null> {
        const result = await HttpUtils.request<OperationType>(`/operations/${this.operationId}`, 'GET');
        if (result.error) {
            alert('Не удалось загрузить операцию');
            this.openNewRoute('/income&expenses');
            return null;
        }
        return result.response || null;
    }

    private async loadCategoriesByTitle(type: string, categoryTitle: string | null = null): Promise<number | null> {
        const result = await HttpUtils.request<{ id: number; title: string }[]>(`/categories/${type}`, 'GET');
        const $select = $('#category-select');
        $select.empty();
        $select.append('<option style="color: #6C757D;" value="" disabled selected hidden>Выберите категорию...</option>');

        if (Array.isArray(result.response)) {
            let selectedId: number | null = null;
            result.response.forEach((category) => {
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


