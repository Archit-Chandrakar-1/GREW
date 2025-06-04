/**
 * Stock data handling functions for the Grew Stock Tracker
 */

// Current active stock
let currentStock = null;

// Get stock data
async function getStockData(symbol) {
  if (!symbol) return;
  
  // Fetch stock data from API
  const stockData = await fetchStockData(symbol);
  
  if (stockData) {
    // Store as current stock
    currentStock = stockData;
    
    // Display stock information
    displayStockInfo(stockData);
    
    // Update chart with historical data
    updateChart(stockData.historicalData, stockData.symbol);
    
    return stockData;
  }
  
  return null;
}

// Display stock information
function displayStockInfo(stockData) {
  const currentStockSection = document.getElementById('currentStock');
  
  // Clear existing content
  currentStockSection.innerHTML = '';
  
  // Create stock info cards
  const overviewCard = createStockCard(
    'Overview',
    stockData.symbol,
    stockData.name,
    stockData.price,
    stockData.percentChange
  );
  
  const detailsCard = createStockDetailsCard(
    'Trading Details',
    stockData.dayHigh,
    stockData.dayLow,
    stockData.yearHigh,
    stockData.yearLow,
    stockData.volume
  );
  
  const marketCard = createMarketCard(
    'Market Data',
    stockData.marketCap
  );
  
  // Add cards to the section
  currentStockSection.appendChild(overviewCard);
  currentStockSection.appendChild(detailsCard);
  currentStockSection.appendChild(marketCard);
  
  // Add a button to add to comparison
  const actionCard = document.createElement('div');
  actionCard.className = 'stock-card';
  actionCard.innerHTML = `
    <h3>Actions</h3>
    <button id="addToComparisonBtn" class="add-to-comparison">
      Add to Comparison
    </button>
  `;
  
  // Check if already in comparison
  if (isStockInComparison(stockData.symbol)) {
    const addButton = actionCard.querySelector('#addToComparisonBtn');
    addButton.disabled = true;
    addButton.textContent = 'Already in Comparison';
    addButton.style.backgroundColor = 'var(--medium-gray)';
    addButton.style.cursor = 'not-allowed';
  }
  
  currentStockSection.appendChild(actionCard);
  
  // Add event listener for the comparison button
  document.getElementById('addToComparisonBtn').addEventListener('click', () => {
    addCurrentStockToComparison();
  });
}

// Create a stock card
function createStockCard(title, symbol, name, price, percentChange) {
  const card = document.createElement('div');
  card.className = 'stock-card';
  
  const isPositive = parseFloat(percentChange) >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const changeIcon = isPositive ? '↑' : '↓';
  
  card.innerHTML = `
    <h3>${title}</h3>
    <div class="stock-info">
      <div class="stock-symbol">${symbol} - ${name}</div>
      <div class="stock-price">${formatCurrency(price)}</div>
      <div class="stock-change ${changeClass}">
        ${changeIcon} ${formatPercentage(percentChange)}
      </div>
    </div>
  `;
  
  return card;
}

// Create a stock details card
function createStockDetailsCard(title, dayHigh, dayLow, yearHigh, yearLow, volume) {
  const card = document.createElement('div');
  card.className = 'stock-card';
  
  card.innerHTML = `
    <h3>${title}</h3>
    <div class="stock-details">
      <div>Day Range: <span>${formatCurrency(dayLow)} - ${formatCurrency(dayHigh)}</span></div>
      <div>52 Week Range: <span>${formatCurrency(yearLow)} - ${formatCurrency(yearHigh)}</span></div>
      <div>Volume: <span>${formatNumber(volume)}</span></div>
    </div>
  `;
  
  return card;
}

// Create a market data card
function createMarketCard(title, marketCap) {
  const card = document.createElement('div');
  card.className = 'stock-card';
  
  card.innerHTML = `
    <h3>${title}</h3>
    <div class="stock-details">
      <div>Market Cap: <span>${formatCurrency(marketCap)}</span></div>
    </div>
  `;
  
  return card;
}

// Add current stock to comparison
function addCurrentStockToComparison() {
  if (!currentStock) {
    showNotification('No stock selected to add to comparison', 'error');
    return;
  }
  
  const added = addStockToComparison(currentStock);
  
  if (added) {
    showNotification(`${currentStock.symbol} added to comparison`, 'success');
    updateComparisonTable();
    
    // Update the add button
    const addButton = document.getElementById('addToComparisonBtn');
    if (addButton) {
      addButton.disabled = true;
      addButton.textContent = 'Already in Comparison';
      addButton.style.backgroundColor = 'var(--medium-gray)';
      addButton.style.cursor = 'not-allowed';
    }
  } else {
    showNotification(`${currentStock.symbol} is already in comparison`, 'error');
  }
}

// Load comparison stocks
function loadComparisonStocks() {
  const comparisonStocks = getFromLocalStorage('comparisonStocks') || [];
  return comparisonStocks;
}

// Update the comparison table
function updateComparisonTable() {
  const comparisonStocks = loadComparisonStocks();
  const tableBody = document.getElementById('comparisonTableBody');
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  if (comparisonStocks.length === 0) {
    // Show a message when no stocks are in comparison
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="5" style="text-align: center;">No stocks added to comparison yet</td>
    `;
    tableBody.appendChild(row);
    return;
  }
  
  // Add rows for each stock
  comparisonStocks.forEach(stock => {
    const row = document.createElement('tr');
    const isPositive = parseFloat(stock.percentChange) >= 0;
    const changeClass = isPositive ? 'positive' : 'negative';
    
    row.innerHTML = `
      <td>${stock.symbol}</td>
      <td>${formatCurrency(stock.price)}</td>
      <td class="${changeClass}">${formatPercentage(stock.percentChange)}</td>
      <td>${formatNumber(stock.volume)}</td>
      <td>
        <button class="remove-btn" data-symbol="${stock.symbol}">Remove</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const symbol = e.target.getAttribute('data-symbol');
      removeStockFromComparison(symbol);
      updateComparisonTable();
      
      // Update the add button if the current stock is the one removed
      if (currentStock && currentStock.symbol === symbol) {
        const addButton = document.getElementById('addToComparisonBtn');
        if (addButton) {
          addButton.disabled = false;
          addButton.textContent = 'Add to Comparison';
          addButton.style.backgroundColor = '';
          addButton.style.cursor = '';
        }
      }
      
      showNotification(`${symbol} removed from comparison`, 'success');
    });
  });
}