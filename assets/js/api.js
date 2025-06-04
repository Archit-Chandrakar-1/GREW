// api.js – Fully mocked version for reliable deployment

const API_KEY = 'demo'; // Not used in mocks
const BASE_URL = 'https://www.alphavantage.co/query'; // Not used

// Mock trending stocks
const trendingStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "BABA", name: "Alibaba Group" },
  { symbol: "ADBE", name: "Adobe Inc." }
];

// Generate random current stock data
function generateRandomStockData(symbol) {
  const price = (Math.random() * 200 + 100).toFixed(2);
  const change = (Math.random() * 10 - 5).toFixed(2);
  const volume = Math.floor(Math.random() * 10000000);

  return {
    symbol,
    name: trendingStocks.find(s => s.symbol === symbol)?.name || "Unknown Company",
    price,
    change,
    volume,
    historicalData: generateHistoricalData(price)
  };
}

// Generate mock historical data
function generateHistoricalData(currentPrice) {
  const data = [];
  let price = parseFloat(currentPrice);

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price += (Math.random() * 4 - 2); // small daily fluctuation
    data.push({
      date: date.toISOString().split('T')[0],
      price: price.toFixed(2)
    });
  }

  return data;
}

// Fetch stock details (mock)
async function fetchStockData(symbol) {
  showLoading();
  await delay(500);
  hideLoading();
  return generateRandomStockData(symbol);
}

// Fetch historical data (mock)
async function fetchHistoricalData(symbol) {
  showLoading();
  await delay(500);
  hideLoading();
  return generateRandomStockData(symbol).historicalData;
}

// Return trending stocks (mock)
async function fetchTrendingStocks() {
  await delay(300);
  return trendingStocks;
}

// Search stocks (mock)
async function searchStock(query) {
  showLoading();
  await delay(300);
  hideLoading();
  return trendingStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
}

// Utility delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
