export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        console.log('INCOME')

        $('.btn-edit-income').on('click', () => {
            this.openNewRoute('/editing-income');
        });

        $(function() {
            $('.btn-delete-income').on('click', function() {
                $('.modal').css('display', 'block');
            });

            $('.close-modal-income').on('click', function() {
                $('.modal').css('display', 'none');
            });
        });
    }
}