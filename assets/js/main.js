document.addEventListener('DOMContentLoaded', () => {
  initializeUI();

  setTimeout(() => {
    showNotification('Welcome to Grew Stock Tracker! Search for a stock or select from trending stocks to begin.', 'success');
  }, 1000);
});
