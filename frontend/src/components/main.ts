import {AuthGuard} from "../utils/auth-guard";
import {FilterControls} from "../utils/filter-controls";
import {HttpUtils} from "../utils/http-utils";
// import {Chart} from "../plugins/chart.js/Chart.js"
import {Chart, ChartConfiguration } from 'Chart.js/auto'
import {OperationType} from "../types/operation.type";
import {ChartDataItemType} from "../types/chart-data-item.type";


export class Main {
    readonly openNewRoute: (route: string) => void;
    private token: string | null;
    private incomeChart: Chart<'pie', number[], unknown> | null = null;
    private expenseChart: Chart<'pie', number[], unknown> | null = null;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;
        this.token = null;
        this.incomeChart = null;
        this.expenseChart = null;

        $(async () => {
            await this.init();
        });
    }

    private async init(): Promise<void> {
        const isAuthenticated = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuthenticated) return;

        this.token = localStorage.getItem('accessToken');

        new FilterControls({
            onPeriodChange: ({period, dateFrom = '', dateTo = ''}: {
                period: string;
                dateFrom?: string;
                dateTo?: string;
            }) => {
                this.loadChartData(period, dateFrom, dateTo);
            }
        });

        $('.filter-btn[data-period="today"]').addClass('active').removeClass('btn-outline-secondary');
        this.loadChartData('today').then();
    }

    private async loadChartData(period: string, dateFrom = '', dateTo = ''): Promise<void> {
        let url = '/operations';
        url += period === 'interval' ?
            `?period=interval&dateFrom=${dateFrom}&dateTo=${dateTo}`
            : `?period=${period}`;

        try {
            const result = await HttpUtils.request(url, 'GET');
            if (result.error) throw new Error('Ошибка в данных');

            const operations: OperationType[] = result.response || [];

            const income: Record<string, number> = {};
            const expense: Record<string, number> = {};

            operations.forEach(op => {
                const target = op.type === 'income' ? income : expense;
                if (!target[op.category]) target[op.category] = 0;
                target[op.category] += op.amount;
            });

            const toChartData = (obj: Record<string, number>): ChartDataItemType[] =>
                Object.keys(obj).map(key => ({
                    category: key,
                    amount: obj[key]
                }));

            this.renderCharts({
                income: toChartData(income),
                expense: toChartData(expense)
            });

        } catch (err) {
            console.error('Ошибка загрузки графиков:', err);
        }
    }

    private renderCharts(
        {income, expense}: { income: ChartDataItemType[]; expense: ChartDataItemType[] }
    ): void {
        const drawChart = (
            ctxId: string,
            data: ChartDataItemType[],
            colors: string[],
            emptyText: string,
            chartProp: 'incomeChart' | 'expenseChart'
        ): void => {
            const ctx = (document.getElementById(ctxId) as HTMLCanvasElement)?.getContext('2d');
            if (!ctx) return;

            const chartInstance = this[chartProp] as Chart | null | undefined;
            if (chartInstance) {
                chartInstance.destroy();
            }

            const chartData = data.length
                ? {
                    labels: data.map(i => i.category),
                    datasets: [{
                        data: data.map(i => i.amount),
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                }
                : {
                    labels: [emptyText],
                    datasets: [
                        {
                            data: [1],
                            backgroundColor: ['#e0e0e0']
                        }]
                };

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    layout: {
                        padding: {
                            bottom: 40
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top' as const,
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            font: {
                                family: 'Roboto',
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem: any) => {
                                if (data.length === 0) return emptyText;
                                const label = tooltipItem.label || '';
                                const value = tooltipItem.formattedValue || '';
                                return `${label}: ${value}`;
                            }
                        }
                    },
                },

                elements: {
                    arc: {
                        hoverOffset: 50,
                        hoverBorderColor: 'turquoise',
                        hoverBorderWidth: 3
                    }
                }
            };

            this[chartProp] = new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: chartOptions
            } as ChartConfiguration<'pie', number[], unknown>);
        };

        drawChart(
            'pieChart',
            income,
            ['#0D6EFD', '#20C997', '#FFC107', '#FD7E14', '#DC3545'],
            'нет доходов',
            'incomeChart');

        drawChart(
            'pieChart2',
            expense,
            ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
            'нет расходов',
            'expenseChart');
    };
}

