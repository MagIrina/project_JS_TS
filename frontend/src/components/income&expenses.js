export class IncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        console.log('income&expenses');

        $('.btn-editing-income-expenses').on('click', () => {
            this.openNewRoute('/editing-income&expenses');
        });
        $('.btn-create-income-expenses').on('click', () => {
            this.openNewRoute('/create-income&expenses');
        });

        $(function() {
            $('.btn-delete-operation').on('click', function() {
                $('.modal').css('display', 'block');
            });

            $('.close-modal-income-expenses').on('click', function() {
                $('.modal').css('display', 'none');
            });
        });
    }
}


