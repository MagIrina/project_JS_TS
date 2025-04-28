export  class Expenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        console.log('expenses')

        $('.btn-edit-expenses').on('click', () => {
            this.openNewRoute('/editing-expenses');
        });

        $(function() {
            $('.btn-delete-expenses').on('click', function() {
                $('.modal').css('display', 'block');
            });

            $('.close-modal-expenses').on('click', function() {
                $('.modal').css('display', 'none');
            });
        });
    }
}