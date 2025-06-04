/**
 * Main entry point for the Grew Stock Tracker
 */

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the UI
  initializeUI();
  
  // Add a welcome notification
  setTimeout(() => {
    showNotification('Welcome to Grew Stock Tracker! Search for a stock or select from trending stocks to begin.', 'success');
  }, 1000);
});