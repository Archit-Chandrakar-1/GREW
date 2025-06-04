/**
 * Utility functions for the Grew Stock Tracker
 */

// Format number as Indian currency (₹)
function formatCurrency(number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(number);
}

// Format large numbers with commas (Indian format)
function formatNumber(number) {
  return new Intl.NumberFormat('en-IN').format(number);
}

// Format percentage
function formatPercentage(number) {
  const parsedNumber = parseFloat(number);
  return `${parsedNumber > 0 ? '+' : ''}${parsedNumber.toFixed(2)}%`;
}

// Show notification
function showNotification(message, type = 'default') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification';
  notification.classList.add(type);
  notification.classList.add('active');

  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
}

// Show loading state
function showLoading() {
  const loading = document.getElementById('loading');
  loading.classList.add('active');
}

// Hide loading state
function hideLoading() {
  const loading = document.getElementById('loading');
  loading.classList.remove('active');
}

// Generate random data for testing when API is not available
function generateRandomStockData(symbol, days = 30) {
  const today = new Date();
  const data = {
    symbol: symbol,
    name: getCompanyName(symbol),
    price: Math.random() * 5000 + 500,
    change: (Math.random() * 10 - 5).toFixed(2),
    percentChange: (Math.random() * 10 - 5).toFixed(2),
    volume: Math.floor(Math.random() * 10000000) + 100000,
    dayHigh: 0,
    dayLow: 0,
    yearHigh: 0,
    yearLow: 0,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    historicalData: []
  };
  
  data.dayHigh = (data.price * (1 + Math.random() * 0.05)).toFixed(2);
  data.dayLow = (data.price * (1 - Math.random() * 0.05)).toFixed(2);
  data.yearHigh = (data.price * (1 + Math.random() * 0.2)).toFixed(2);
  data.yearLow = (data.price * (1 - Math.random() * 0.2)).toFixed(2);
  
  // Generate historical data
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a somewhat realistic price variation
    const basePrice = data.price * (1 + (Math.random() * 0.4 - 0.2));
    
    data.historicalData.push({
      date: date.toISOString().split('T')[0],
      price: basePrice
    });
  }
  
  return data;
}

// Get company name from symbol (simplified mock version)
function getCompanyName(symbol) {
  const companies = {
    'RELIANCE': 'Reliance Industries Ltd.',
    'TCS': 'Tata Consultancy Services Ltd.',
    'HDFCBANK': 'HDFC Bank Ltd.',
    'INFY': 'Infosys Ltd.',
    'ICICIBANK': 'ICICI Bank Ltd.',
    'HINDUNILVR': 'Hindustan Unilever Ltd.',
    'ITC': 'ITC Ltd.',
    'SBIN': 'State Bank of India',
    'BHARTIARTL': 'Bharti Airtel Ltd.',
    'KOTAKBANK': 'Kotak Mahindra Bank Ltd.',
    'WIPRO': 'Wipro Ltd.',
    'AXISBANK': 'Axis Bank Ltd.',
    'LT': 'Larsen & Toubro Ltd.',
    'ASIANPAINT': 'Asian Paints Ltd.',
    'MARUTI': 'Maruti Suzuki India Ltd.'
  };
  
  return companies[symbol] || `${symbol} Inc.`;
}

// Generate trending stocks (Top 10 Indian stocks)
function getTrendingStocks() {
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
    { symbol: 'ITC', name: 'ITC Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' }
  ];
}

// Store data in local storage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get data from local storage
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Check if a stock is already in comparison
function isStockInComparison(symbol) {
  const comparisonStocks = getFromLocalStorage('comparisonStocks') || [];
  return comparisonStocks.some(stock => stock.symbol === symbol);
}

// Add stock to comparison
function addStockToComparison(stockData) {
  const comparisonStocks = getFromLocalStorage('comparisonStocks') || [];
  
  if (!isStockInComparison(stockData.symbol)) {
    comparisonStocks.push({
      symbol: stockData.symbol,
      name: stockData.name,
      price: stockData.price,
      percentChange: stockData.percentChange,
      volume: stockData.volume
    });
    
    saveToLocalStorage('comparisonStocks', comparisonStocks);
    return true;
  }
  
  return false;
}

// Remove stock from comparison
function removeStockFromComparison(symbol) {
  let comparisonStocks = getFromLocalStorage('comparisonStocks') || [];
  comparisonStocks = comparisonStocks.filter(stock => stock.symbol !== symbol);
  saveToLocalStorage('comparisonStocks', comparisonStocks);
}