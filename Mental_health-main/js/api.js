// api.js - API calls for authentication and other features

// Auth API
const AuthAPI = {
    // Login user
    login: async (credentials) => {
        try {
            console.log('AuthAPI.login called with:', credentials);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            console.log('Login response status:', response.status);

            const data = await response.json();
            console.log('Login response data:', data);

            if (response.ok) {
                return {
                    success: true,
                    data: {
                        userId: data.userId,
                        id: data.userId, // Alias for compatibility
                        name: data.name,
                        email: data.email,
                        token: data.token || 'Bearer_' + Date.now(),
                        role: data.role || 'USER'
                    }
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('AuthAPI.login error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    },

    // Register new user
    register: async (userData) => {
        try {
            console.log('AuthAPI.register called with:', userData);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password
                })
            });

            console.log('Register response status:', response.status);

            const data = await response.json();
            console.log('Register response data:', data);

            if (response.ok) {
                return {
                    success: true,
                    data: {
                        userId: data.userId,
                        name: data.name,
                        email: data.email,
                        message: data.message
                    }
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Registration failed'
                };
            }
        } catch (error) {
            console.error('AuthAPI.register error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
};

// Chat API
const ChatAPI = {
    // Send message to chatbot
    sendMessage: async (userId, message) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/send`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    userId: userId,
                    message: message
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: {
                        messageId: data.messageId,
                        responseText: data.responseText,
                        sentiment: data.sentiment
                    }
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Failed to send message'
                };
            }
        } catch (error) {
            console.error('ChatAPI.sendMessage error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    },

    // Get chat history
    getChatHistory: async (userId) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat/history/${userId}`, {
                method: 'GET',
                headers: API_CONFIG.HEADERS
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to load chat history'
                };
            }
        } catch (error) {
            console.error('ChatAPI.getChatHistory error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    }
};

// Assessment API
const AssessmentAPI = {
    // Submit assessment
    submitAssessment: async (userId, answers) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/assessment/submit`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    userId: userId,
                    answers: answers
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to submit assessment'
                };
            }
        } catch (error) {
            console.error('AssessmentAPI.submitAssessment error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    },

    // Get assessment history
    getHistory: async (userId) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/assessment/history/${userId}`, {
                method: 'GET',
                headers: API_CONFIG.HEADERS
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to load assessment history'
                };
            }
        } catch (error) {
            console.error('AssessmentAPI.getHistory error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    }
};