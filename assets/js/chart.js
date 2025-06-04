/**
 * Chart functions for the Grew Stock Tracker
 */

let stockChart = null;

// Initialize chart with data
function initializeChart(historicalData) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (stockChart) {
    stockChart.destroy();
  }
  
  // Prepare data for chart
  const labels = historicalData.map(data => data.date);
  const prices = historicalData.map(data => data.price);
  
  // Get min and max for better y-axis display
  const min = Math.min(...prices) * 0.95;
  const max = Math.max(...prices) * 1.05;
  
  // Create gradient for area under the line
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
  
  // Create new chart
  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock Price (₹)',
        data: prices,
        borderColor: '#10B981',
        backgroundColor: gradient,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#10B981',
        pointHoverBackgroundColor: '#1E3A8A',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#495057',
            font: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          },
          backgroundColor: 'rgba(30, 58, 138, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          padding: 10
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 10
            },
            color: '#495057'
          }
        },
        y: {
          beginAtZero: false,
          suggestedMin: min,
          suggestedMax: max,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            },
            font: {
              size: 10
            },
            color: '#495057'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      animation: {
        duration: 1000
      }
    }
  });
  
  return stockChart;
}

// Update chart with new data
function updateChart(historicalData, symbol) {
  initializeChart(historicalData);
  stockChart.data.datasets[0].label = `${symbol} Price (₹)`;
  stockChart.update();
}

// Clear chart when no data is available
function clearChart() {
  if (stockChart) {
    stockChart.destroy();
    stockChart = null;
  }
  
  const ctx = document.getElementById('stockChart').getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}