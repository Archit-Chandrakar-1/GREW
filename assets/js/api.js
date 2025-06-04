/**
 * API functions for the Grew Stock Tracker
 * Note: This uses mock data as Alpha Vantage API requires a real API key
 */

// Mock API key (in a real app, this would be securely stored)
const API_KEY = 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Fetch stock data from Alpha Vantage API
async function fetchStockData(symbol) {
  showLoading();
  
  try {
    // In a real implementation, we would fetch from the API
    // Since we're using a demo key with limited requests, we'll use mock data for demonstration
    // const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    // const data = await response.json();
    
    // For demonstration purposes, we're using mock data
    const data = generateRandomStockData(symbol);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    hideLoading();
    return data;
  } catch (error) {
    hideLoading();
    showNotification('Error fetching stock data. Please try again.', 'error');
    console.error('Error fetching stock data:', error);
    return null;
  }
}

// Fetch historical data for a stock
async function fetchHistoricalData(symbol, timeframe = 'monthly') {
  showLoading();
  
  try {
    // In a real implementation, we would fetch from the API
    // const response = await fetch(`${BASE_URL}?function=TIME_SERIES_${timeframe.toUpperCase()}&symbol=${symbol}&apikey=${API_KEY}`);
    // const data = await response.json();
    
    // For demonstration purposes, we're using mock data
    const data = generateRandomStockData(symbol);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    hideLoading();
    return data.historicalData;
  } catch (error) {
    hideLoading();
    showNotification('Error fetching historical data. Please try again.', 'error');
    console.error('Error fetching historical data:', error);
    return [];
  }
}

// Fetch trending stocks from the API
async function fetchTrendingStocks() {
  try {
    // In a real implementation, we would fetch from the API
    // const response = await fetch(`${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`);
    // const data = await response.json();
    
    // For demonstration purposes, we're using mock data
    const trendingStocks = getTrendingStocks();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return trendingStocks;
  } catch (error) {
    showNotification('Error fetching trending stocks. Please try again.', 'error');
    console.error('Error fetching trending stocks:', error);
    return [];
  }
}

// Search for a stock by symbol or name
async function searchStock(query) {
  showLoading();
  
  try {
    // In a real implementation, we would fetch from the API
    // const response = await fetch(`${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`);
    // const data = await response.json();
    
    // For demonstration purposes, we're using mock data
    const trendingStocks = getTrendingStocks();
    const results = trendingStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    hideLoading();
    return results;
  } catch (error) {
    hideLoading();
    showNotification('Error searching for stocks. Please try again.', 'error');
    console.error('Error searching for stocks:', error);
    return [];
  }
}