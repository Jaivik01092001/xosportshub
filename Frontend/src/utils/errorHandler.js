/**
 * Format error response from API
 * @param {Error} error - The error object from axios
 * @returns {Object} Formatted error object with message and status
 */
export const formatError = (error) => {
  // Default error object
  const formattedError = {
    message: 'Something went wrong. Please try again.',
    status: 500,
    errors: null,
  };

  if (!error.response) {
    // Network error or server not responding
    formattedError.message = 'Network error. Please check your connection.';
    return formattedError;
  }

  // Get status code from response
  formattedError.status = error.response.status;

  // Handle different status codes
  switch (error.response.status) {
    case 400:
      // Bad request - usually validation errors
      formattedError.message = 'Invalid request. Please check your data.';
      
      // If there are validation errors, include them
      if (error.response.data && error.response.data.errors) {
        formattedError.errors = error.response.data.errors;
      }
      break;
    
    case 401:
      // Unauthorized
      formattedError.message = 'Authentication required. Please login.';
      break;
    
    case 403:
      // Forbidden
      formattedError.message = 'You do not have permission to perform this action.';
      break;
    
    case 404:
      // Not found
      formattedError.message = 'The requested resource was not found.';
      break;
    
    case 422:
      // Unprocessable entity - validation errors
      formattedError.message = 'Validation failed. Please check your data.';
      
      // If there are validation errors, include them
      if (error.response.data && error.response.data.errors) {
        formattedError.errors = error.response.data.errors;
      }
      break;
    
    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      formattedError.message = 'Server error. Please try again later.';
      break;
    
    default:
      // Use the error message from the response if available
      if (error.response.data && error.response.data.message) {
        formattedError.message = error.response.data.message;
      }
  }

  return formattedError;
};

/**
 * Extract validation error messages from API response
 * @param {Object} errors - The errors object from API response
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const extractValidationErrors = (errors) => {
  if (!errors) return {};

  const validationErrors = {};
  
  // Handle array of error objects (Express Validator format)
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      validationErrors[error.param] = error.msg;
    });
  } 
  // Handle object with field names as keys
  else if (typeof errors === 'object') {
    Object.keys(errors).forEach(key => {
      validationErrors[key] = errors[key];
    });
  }

  return validationErrors;
};

export default {
  formatError,
  extractValidationErrors,
};
