// config.js - Configuration file for API and app settings

const API_CONFIG = {
    // Base URL for API - UPDATE THIS FOR PRODUCTION
    BASE_URL: 'http://localhost:8080/api',
    
    // Default headers for API requests
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Get authorization header with token
    getAuthHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            ...API_CONFIG.HEADERS,
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
};

// App configuration
const APP_CONFIG = {
    APP_NAME: 'Mindful Balance',
    VERSION: '1.0.0',
    
    // Session timeout (in minutes)
    SESSION_TIMEOUT: 30,
    
    // Toast notification duration (in milliseconds)
    TOAST_DURATION: 3000
};