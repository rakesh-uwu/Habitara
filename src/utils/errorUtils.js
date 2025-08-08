/**
 * Error utilities for tracking and handling errors throughout the application
 */

let errorListeners = [];

/**
 * Initialize global error handlers
 * Call this function early in your application startup
 */
export const initializeErrorTracking = () => {
  // Set up global error handler for unhandled JS errors
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Notify all listeners
    notifyErrorListeners(error, isFatal);
    
    // Call the original handler
    originalErrorHandler(error, isFatal);
  });
  
  // Set up promise rejection tracking
  const unhandledRejectionTracking = require('promise/setimmediate/rejection-tracking');
  
  unhandledRejectionTracking.enable({
    allRejections: true,
    onUnhandled: (id, error) => {
      notifyErrorListeners(error, false);
    },
    onHandled: () => {}
  });
};

/**
 * Add a listener to be notified when errors occur
 * @param {Function} listener - Function to call when an error occurs
 * @returns {Function} Function to remove the listener
 */
export const addErrorListener = (listener) => {
  errorListeners.push(listener);
  
  // Return a function to remove this listener
  return () => {
    errorListeners = errorListeners.filter(l => l !== listener);
  };
};

/**
 * Notify all registered error listeners
 * @param {Error} error - The error that occurred
 * @param {boolean} isFatal - Whether the error is fatal
 */
const notifyErrorListeners = (error, isFatal) => {
  errorListeners.forEach(listener => {
    try {
      listener(error, isFatal);
    } catch (listenerError) {
      // Silent catch for production
    }
  });
};

/**
 * Log an error with additional context information
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context information
 */
export const logErrorWithContext = (error, context = {}) => {
  console.error(
    'Error occurred:',
    error,
    'Context:',
    JSON.stringify(context)
  );
  
  // You could send this to a remote logging service here
};

/**
 * Create a safe version of a function that catches errors
 * @param {Function} fn - The function to wrap
 * @param {Function} errorHandler - Optional custom error handler
 * @returns {Function} Wrapped function that catches errors
 */
export const createSafeFunction = (fn, errorHandler) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error, ...args);
      } else {
        console.error('Error in safe function:', error);
        return null;
      }
    }
  };
};