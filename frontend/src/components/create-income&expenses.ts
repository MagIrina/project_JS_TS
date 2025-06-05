import { AuthGuard } from "../utils/auth-guard";
import { HttpUtils } from "../utils/http-utils";
import $ from 'jquery';
import { CategoryType } from "../types/category.type";

export class CreateIncomeExpenses {
    readonly openNewRoute: (path: string) => void;

    constructor(openNewRoute: (path: string) => void) {
        this.openNewRoute = openNewRoute;
        this.init().then();
    }

    private async init(): Promise<void> {
        const isAuth = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuth) return;

        const params = new URLSearchParams(window.location.search);
        const typeFromURL = (params.get("type") || "income") as "income" | "expense";

        ($('#type-select') as JQuery<HTMLSelectElement>).val(typeFromURL);
        await this.loadCategories(typeFromURL);

        $('#type-select').on('change', async (e) => {
            const selectedType = (e.target as HTMLSelectElement).value as "income" | "expense";
            await this.loadCategories(selectedType);
        });

        $('#create-form').on('submit', async (e) => {
            e.preventDefault();
            const data = {
                type: ($('#type-select').val() as "income" | "expense"),
                category_id: Number($('#category-select').val()),
                amount: Number(($('[name="amount"]').val() as string)),
                date: $('[name="date"]').val() as string,
                comment: ($('[name="comment"]').val() as string)?.trim() || " "
            };

            const form = document.getElementById('create-form')! as HTMLFormElement;
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            const result = await HttpUtils.request<unknown>(
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

    private async loadCategories(type: "income" | "expense"): Promise<void> {
        const url = `/categories/${type}`;
        const result = await HttpUtils.request<CategoryType[]>(url, 'GET');

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