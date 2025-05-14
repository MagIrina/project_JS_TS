export class FilterControls {
    constructor({ onPeriodChange }) {
        this.onPeriodChange = onPeriodChange;
        this.currentPeriod = 'today';

        this.initEvents();
        this.setActiveFilterButton('today');
        this.onPeriodChange({ period: 'today' });
    }

    initEvents() {
        $('.filter-btn').on('click', (e) => {
            const period = $(e.target).data('period');
            this.setActiveFilterButton(period);

            if (period !== 'interval') {
                this.currentPeriod = period;
                this.onPeriodChange({ period });
            }
        });

        $('#interval-button').on('click', () => {
            $('#intervalModal').show();
        });

        $('#cancel-interval').on('click', () => {
            $('#intervalModal').hide();
            this.setActiveFilterButton('today');
            this.currentPeriod = 'today';
            this.onPeriodChange({ period: 'today' });
        });

        $('#save-interval').on('click', () => {
            const dateFrom = $('#interval-start').val();
            const dateTo = $('#interval-end').val();

            if (dateFrom && dateTo) {
                $('#intervalModal').hide();
                $('#date-from-label').text(this.formatDate(dateFrom));
                $('#date-to-label').text(this.formatDate(dateTo));

                this.setActiveFilterButton('interval');
                this.onPeriodChange({
                    period: 'interval',
                    dateFrom,
                    dateTo,
                });
            }
        });
    }

    setActiveFilterButton(period) {
        $('.filter-btn').removeClass('active').addClass('btn-outline-secondary');
        $(`.filter-btn[data-period="${period}"]`).removeClass('btn-outline-secondary').addClass('active');
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU');
    }
}
