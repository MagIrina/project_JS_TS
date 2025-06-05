import {FilterControlsOptions, PeriodChangeType} from "../types/period-change.type";
import $ from 'jquery';

export class FilterControls {

    readonly onPeriodChange: (payload: PeriodChangeType) => void;
    private currentPeriod: PeriodChangeType['period'];

    constructor({ onPeriodChange }: FilterControlsOptions) {
        this.onPeriodChange = onPeriodChange;
        this.currentPeriod = 'today';

        this.initEvents();
        this.setActiveFilterButton('today');
        this.onPeriodChange({ period: 'today' });
    }

    private initEvents(): void {
        $('.filter-btn').on('click', (e) => {
            const period = ($(e.target).data('period')  as string) || 'today';
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
            const dateFrom = $('#interval-start').val() as string;
            const dateTo = $('#interval-end').val() as string;

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

    private setActiveFilterButton(period: PeriodChangeType['period']): void {
        $('.filter-btn').removeClass('active').addClass('btn-outline-secondary');
        $(`.filter-btn[data-period="${period}"]`).removeClass('btn-outline-secondary').addClass('active');
    }

    private formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU');
    }
}
