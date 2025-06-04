/**
 * UI functions for the GREW Stock Tracker
 */

// Initialize trending stocks dropdown
async function initializeTrendingStocksDropdown() {
  const trendingStocksSelect = document.getElementById('trendingStocks');
  const trendingStocks = await fetchTrendingStocks();
  
  // Clear existing options except the first one
  while (trendingStocksSelect.options.length > 1) {
    trendingStocksSelect.remove(1);
  }
  
  // Add options for each trending stock
  trendingStocks.forEach(stock => {
    const option = document.createElement('option');
    option.value = stock.symbol;
    option.textContent = `${stock.symbol} - ${stock.name}`;
    trendingStocksSelect.appendChild(option);
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Home link click
  document.querySelector('.home-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload();
  });

  // Search button click
  document.getElementById('searchBtn').addEventListener('click', () => {
    const searchInput = document.getElementById('stockSearch');
    const symbol = searchInput.value.trim().toUpperCase();
    
    if (symbol) {
      getStockData(symbol);
    } else {
      showNotification('Please enter a stock symbol', 'error');
    }
  });
  
  // Search input Enter key
  document.getElementById('stockSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const symbol = e.target.value.trim().toUpperCase();
      
      if (symbol) {
        getStockData(symbol);
      } else {
        showNotification('Please enter a stock symbol', 'error');
      }
    }
  });
  
  // Trending stocks dropdown change
  document.getElementById('trendingStocks').addEventListener('change', (e) => {
    const symbol = e.target.value;
    
    if (symbol) {
      getStockData(symbol);
    }
  });
}

// Initialize the UI
function initializeUI() {
  // Initialize trending stocks dropdown
  initializeTrendingStocksDropdown();
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Load and display comparison stocks
  updateComparisonTable();
  
  // Initial load with a default stock (optional)
  // getStockData('RELIANCE');
}