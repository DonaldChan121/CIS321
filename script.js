// Utility functions
const calculateMean = (data) => data.reduce((sum, value) => sum + value, 0) / data.length;

const calculateCorrelation = (dataX, dataY) => {
    // Calculate correlation between two datasets
    // You can use a library like simple-statistics for statistical calculations
};

const parseExcelData = (excelData) => {
    // Parse the Excel data using a library like SheetJS
    // Return an object with parsed data (sales, revenue, expenses)
    const workbook = XLSX.read(excelData, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const months = [];
    const salesData = [];
    const revenueData = [];
    const expensesData = [];

    data.forEach((row) => {
        months.push(row.month);
        salesData.push(row.sales);
        revenueData.push(row.revenue);
        expensesData.push(row.expenses);
    });

    return {
        months: months,
        sales: salesData,
        revenue: revenueData,
        expenses: expensesData
    };
};



// Higher-order function for creating charts
const createChart = (chartType, labels, datasets) => {
    const chartsContainer = document.getElementById('charts');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    chartsContainer.innerHTML = '';
    chartsContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    const chartData = {
        labels: labels,
        datasets: datasets.map((data, index) => ({
            label: labels[index],
            data: data,
            borderColor: getRandomColor(),
            fill: false
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Event listener for input
document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const fileInput = document.getElementById('file-input');
    const chartsContainer = document.getElementById('charts');
    const correlationContainer = document.getElementById('correlation');

    analyzeButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const excelData = event.target.result;
                const parsedData = parseExcelData(excelData);

                const months = parsedData.months;
                const salesData = parsedData.sales;
                const revenueData = parsedData.revenue;
                const expensesData = parsedData.expenses;

                // Perform statistical analysis
                const salesMean = calculateMean(salesData);
                const revenueMean = calculateMean(revenueData);
                const expensesMean = calculateMean(expensesData);

                // Display analysis results
                chartsContainer.innerHTML = '';
                correlationContainer.innerHTML = '';

                // Create charts
                createChart('line', ['Months','Sales', 'Revenue', 'Expenses'], [months, salesData, revenueData, expensesData]);

                // Perform and display correlation analysis
                const correlationCoefficient = calculateCorrelation(salesData, revenueData);
                correlationContainer.innerHTML = `Correlation Coefficient: ${correlationCoefficient.toFixed(2)}`;
            };

            reader.readAsArrayBuffer(file);
        }
    });
});