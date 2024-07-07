// apiRequest.js
import axios from 'axios';

const apiRequest = async (url, options = {}) => {
  try {
    const response = await axios({
      url: `/api${url}`,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers, // Include custom headers
      },
      data: options.body || null,
    });
    return response;
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
};

export default apiRequest;
