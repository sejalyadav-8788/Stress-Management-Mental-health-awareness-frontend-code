const API_BASE_URL = 'http://localhost:8080'; // UPDATE THIS to your Spring Boot URL
const USER_ID = 1; // UPDATE THIS with actual user ID from session/localStorage

let isLoading = false;

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    addBotMessage("Hello! I'm here to support you with your mental health and stress management. Feel free to share what's on your mind, and I'll do my best to help. How are you feeling today?", "NEUTRAL");
    
    // Load chat history
    loadChatHistory();
});

// Add bot message to chat
function addBotMessage(text, sentiment = "NEUTRAL") {
    const messagesArea = document.getElementById('messagesArea');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(text)}</div>
            ${getSentimentBadge(sentiment)}
        </div>
    `;
    
    messagesArea.appendChild(messageDiv);
    scrollToBottom();
}

// Add user message to chat
function addUserMessage(text) {
    const messagesArea = document.getElementById('messagesArea');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(text)}</div>
        </div>
    `;
    
    messagesArea.appendChild(messageDiv);
    scrollToBottom();
}

// Show loading animation
function showLoading() {
    const messagesArea = document.getElementById('messagesArea');
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.id = 'loadingMessage';
    
    loadingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    messagesArea.appendChild(loadingDiv);
    scrollToBottom();
}

// Remove loading animation
function removeLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Get sentiment badge HTML
function getSentimentBadge(sentiment) {
    if (!sentiment) return '';
    
    const badges = {
        'POSITIVE': '<span class="sentiment-badge sentiment-positive">Positive</span>',
        'NEGATIVE': '<span class="sentiment-badge sentiment-negative">Negative</span>',
        'NEUTRAL': '<span class="sentiment-badge sentiment-neutral">Neutral</span>'
    };
    
    return badges[sentiment] || '';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Scroll to bottom of messages
function scrollToBottom() {
    const messagesArea = document.getElementById('messagesArea');
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Handle key press (Enter to send)
function handleKeyPress(event) {
    if (event.key === 'Enter' && !isLoading) {
        sendMessage();
    }
}

// Send quick message
function sendQuickMessage(message) {
    if (isLoading) return;
    document.getElementById('messageInput').value = message;
    sendMessage();
}

// Send message to backend
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = input.value.trim();
    
    if (!message || isLoading) return;
    
    // Disable input
    isLoading = true;
    input.disabled = true;
    sendBtn.disabled = true;
    document.querySelectorAll('.quick-action-btn').forEach(btn => btn.disabled = true);
    
    // Add user message
    addUserMessage(message);
    input.value = '';
    
    // Show loading
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed
                // 'Authorization': 'Bearer ' + getAuthToken()
            },
            body: JSON.stringify({
                userId: USER_ID,
                message: message
            })
        });
        
        removeLoading();
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        const data = await response.json();
        
        // Add bot response
        addBotMessage(data.data.responseText, data.data.sentiment);

        
    } catch (error) {
        console.error('Error sending message:', error);
        removeLoading();
        addBotMessage("I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", "NEUTRAL");
    } finally {
        // Re-enable input
        isLoading = false;
        input.disabled = false;
        sendBtn.disabled = false;
        document.querySelectorAll('.quick-action-btn').forEach(btn => btn.disabled = false);
        input.focus();
    }
}

// Load chat history from backend
async function loadChatHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${USER_ID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed
                // 'Authorization': 'Bearer ' + getAuthToken()
            }
        });
        
        if (response.ok) {
           const json = await response.json();
const history = json.data;

            if (history && history.length > 0) {
                // Clear initial message if history exists
                const messagesArea = document.getElementById('messagesArea');
                messagesArea.innerHTML = '';
                
                // Add all messages from history
                history.forEach(chat => {
                    addUserMessage(chat.messageText);
                    addBotMessage(chat.responseText, chat.sentiment);
                });
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        // Don't show error to user, just continue with empty history
    }
}

// Get auth token (implement based on your auth system)
function getAuthToken() {
    // Return token from localStorage, sessionStorage, or cookie
    return localStorage.getItem('authToken') || '';
}