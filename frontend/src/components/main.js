export class Main {
    constructor() {
        console.log('MAIN');

        $(function () {
            let pieChartCanvas = $('#pieChart').get(0).getContext('2d');

            let pieData = {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'].reverse(),
                datasets: [{
                    data: [700, 900, 400, 300, 200].reverse(),
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'].reverse(),
                    borderWidth: 1,
                    hoverBorderColor: ['#00ffc0', '#00ffc0', '#00ffc0', '#00ffc0', '#00ffc0'],
                    hoverBorderWidth: 2,
                }]
            };

            let pieOptions = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'top',
                }
            };

            new Chart(pieChartCanvas, {
                type: 'pie',
                data: pieData,
                options: pieOptions
            });


            let pieRightChartCanvas = $('#pieChart2').get(0).getContext('2d');

            let pieRightData = {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    data: [100, 200, 700, 400, 300],
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                    borderWidth: 1,
                    hoverBorderColor: ['#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000'],
                    hoverBorderWidth: 2
                }]
            };

            let pieRightOptions = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'top',
                }
            };

            new Chart(pieRightChartCanvas, {
                type: 'pie',
                data: pieRightData,
                options: pieRightOptions
            });
        });
    }
}


