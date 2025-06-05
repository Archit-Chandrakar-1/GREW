// Your Alpha Vantage API Key
const apiKey = 'BKI7RRZK1S4LVGKE';

// Grabbing DOM elements for interaction and output
const stockSearch = document.getElementById('stockSearch');
const searchButton = document.getElementById('searchButton');
const stockDetails = document.getElementById('stockDetails');
const stockTable = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
const ctx = document.getElementById('stockChart').getContext('2d');

let stockChart; // Chart instance

const stockDropdown = document.getElementById('stockDropdown');
const loadStockButton = document.getElementById('loadStockButton');

/**
 * Fetches daily stock data for a given stock symbol
 */
async function getStockData(stockSymbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`);
    const data = await response.json();
    return data['Time Series (Daily)'];
}

/**
 * Mock function to return top 10 trending stocks
 * (Alpha Vantage doesn't provide actual trending data in free tier)
 */
async function getTrendingStocks() {
    // Fetching IBM intraday data just to use the API endpoint
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${apiKey}`);
    const data = await response.json();
    
    // Mocked list of trending stock symbols
    const trendingStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'BABA', 'INTC'];
    return trendingStocks;
}

/**
 * Populates the dropdown menu with trending stocks
 */
async function populateDropdown() {
    const trendingStocks = await getTrendingStocks();
    trendingStocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock;
        option.text = stock;
        stockDropdown.appendChild(option);
    });
}

/**
 * Displays detailed stock information for the selected stock
 */
function displayStockDetails(stockData, symbol) {
    const latestDate = Object.keys(stockData)[0]; // Most recent trading date
    const latestData = stockData[latestDate];
    const price = latestData['4. close'];
    const volume = latestData['5. volume'];

    // Calculate price change from previous day
    const change = (latestData['4. close'] - stockData[Object.keys(stockData)[1]]['4. close']).toFixed(2);

    // Update stock details section
    stockDetails.innerHTML = `
        <h3>${symbol}</h3>
        <p>Price: $${price}</p>
        <p>Change: $${change}</p>
        <p>Volume: ${volume}</p>
    `;

    // Update comparison table with this stock
    updateStockTable(symbol, price, change, volume);
}

/**
 * Adds a new row to the comparison table
 */
function updateStockTable(symbol, price, change, volume) {
    const newRow = stockTable.insertRow();
    newRow.innerHTML = `
        <td>${symbol}</td>
        <td>$${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
    `;
}

/**
 * Displays the stock price chart using Chart.js
 */
function displayStockGraph(stockData) {
    const labels = Object.keys(stockData).slice(0, 30).reverse(); // Get last 30 days
    const data = labels.map(date => stockData[date]['4. close']); // Closing prices

    // Destroy previous chart instance to avoid overlap
    if (stockChart) {
        stockChart.destroy();
    }

    // Create new chart
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: false
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

/**
 * Event listener for Search Button
 */
searchButton.addEventListener('click', async () => {
    const stockSymbol = stockSearch.value.toUpperCase(); // Convert input to uppercase
    const stockData = await getStockData(stockSymbol);

    if (stockData) {
        displayStockDetails(stockData, stockSymbol);
        displayStockGraph(stockData);
    } else {
        stockDetails.innerHTML = `<p>Stock symbol not found.</p>`;
    }
});

/**
 * Event listener for Load Stock Button (dropdown)
 */
loadStockButton.addEventListener('click', async () => {
    const selectedStock = stockDropdown.value;
    const stockData = await getStockData(selectedStock);

    if (stockData) {
        displayStockDetails(stockData, selectedStock);
        displayStockGraph(stockData);
    } else {
        stockDetails.innerHTML = `<p>Stock data not available for ${selectedStock}.</p>`;
    }
});

// Populate trending stock dropdown on page load
stockDropdown.addEventListener('change', async () => {
    const selectedStock = stockDropdown.value;
    const stockData = await getStockData(selectedStock);

    if (stockData) {
        displayStockDetails(stockData, selectedStock);
        displayStockGraph(stockData);
    } else {
        stockDetails.innerHTML = `<p>Stock data not available for ${selectedStock}.</p>`;
    }
});
populateDropdown();