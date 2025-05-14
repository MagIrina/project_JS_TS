import {AuthGuard} from "../utils/auth-guard.js";
import {FilterControls} from "../utils/filter-controls.js";
import {HttpUtils} from "../utils/http-utils.js";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.token = null;

        this.incomeChart = null;
        this.expenseChart = null;

        $(async () => {
            await this.init();
        });
    }

    async init() {
        const isAuthenticated = await AuthGuard.checkAuth(this.openNewRoute);
        if (!isAuthenticated) return;

        this.token = localStorage.getItem('accessToken');

        new FilterControls({
            onPeriodChange: ({period, dateFrom = '', dateTo = ''}) => {
                this.loadChartData(period, dateFrom, dateTo);
            }
        });

        $('.filter-btn[data-period="today"]').addClass('active').removeClass('btn-outline-secondary');
        this.loadChartData('today').then();
    }

    async loadChartData(period, dateFrom = '', dateTo = '') {
        let url = '/operations';
        if (period === 'interval') {
            url += `?period=interval&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        } else {
            url += `?period=${period}`;
        }

        try {
            const result = await HttpUtils.request(url, 'GET');
            if (result.error) throw new Error('Ошибка в данных');

            const operations = result.response || [];

            const income = {};
            const expense = {};

            operations.forEach(op => {
                const target = op.type === 'income' ? income : expense;
                if (!target[op.category]) target[op.category] = 0;
                target[op.category] += op.amount;
            });

            const toChartData = (obj) => Object.keys(obj).map(key => ({
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

    renderCharts({income, expense}) {
        const drawChart = (ctxId, data, colors, emptyText, chartProp) => {
            const ctx = $(`#${ctxId}`).get(0)?.getContext('2d');
            if (!ctx) return;

            if (this[chartProp]) {
                this[chartProp].destroy();
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
                    datasets: [{
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
                        position: 'top',
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
                            label: (tooltipItem) => {
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
            });
        };

        drawChart('pieChart', income, ['#0D6EFD', '#20C997', '#FFC107', '#FD7E14', '#DC3545'], 'нет доходов', 'incomeChart');
        drawChart('pieChart2', expense, ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'], 'нет расходов', 'expenseChart');
    }
}


// хороший код - когда нет лишнего, оставила коментированный кусок кода, это для работы не денимических данных


// import {AuthGuard} from "../utils/auth-guard.js";
//
// export class Main {
//     constructor(openNewRoute) {
//         this.openNewRoute = openNewRoute;
//         console.log('MAIN');
//
//         $(async () => {
//             await this.init(); // Ждём инициализации после полной загрузки DOM
//         });
//     }
//
//     async init() {
//
//         const isAuthenticated = await AuthGuard.checkAuth(this.openNewRoute);
//         if (!isAuthenticated) return;
//
//         this.initCharts();
//     }
//
//     initCharts() {
//         // Первый график
//         const pieChartCanvas = $('#pieChart').get(0)?.getContext('2d');
//         if (!pieChartCanvas) {
//             console.warn('Элемент #pieChart не найден.');
//         } else {
//             const pieData = {
//                 labels: ['Blue', 'Green', 'Yellow', 'Orange', 'Red'],
//                 datasets: [{
//                     data: [200, 300, 400, 900, 700],
//                     backgroundColor: ['#0D6EFD', '#20C997', '#FFC107', '#FD7E14', '#DC3545'],
//                     borderWidth: 1,
//                     hoverBorderColor: Array(5).fill('#00ffc0'),
//                     hoverBorderWidth: 2,
//                 }]
//             };
//
//             const pieOptions = {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         display: true,
//                         position: 'top',
//                     }
//                 }
//             };
//
//             new Chart(pieChartCanvas, {
//                 type: 'pie',
//                 data: pieData,
//                 options: pieOptions
//             });
//         }
//
//         // Второй график
//         const pieRightChartCanvas = $('#pieChart2').get(0)?.getContext('2d');
//         if (!pieRightChartCanvas) {
//             console.warn('Элемент #pieChart2 не найден.');
//         } else {
//             const pieRightData = {
//                 labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
//                 datasets: [{
//                     data: [100, 200, 700, 400, 300],
//                     backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
//                     borderWidth: 1,
//                     hoverBorderColor: Array(5).fill('#ff0000'),
//                     hoverBorderWidth: 2
//                 }]
//             };
//
//             const pieRightOptions = {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         display: true,
//                         position: 'top',
//                     }
//                 }
//             };
//
//             new Chart(pieRightChartCanvas, {
//                 type: 'pie',
//                 data: pieRightData,
//                 options: pieRightOptions
//             });
//         }
//     }
// }

