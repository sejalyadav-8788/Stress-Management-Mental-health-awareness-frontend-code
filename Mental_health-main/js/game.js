let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let breathingInterval = null;

function showGame(gameType) {
    const gameArea = document.getElementById('gameArea');
    
    if (gameType === 'breathing') {
        gameArea.innerHTML = `
            <div class="game-container">
                <h3 style="text-align: center; color: #667eea;">Deep Breathing Exercise</h3>
                <p style="text-align: center; margin-bottom: 2rem;">Follow the circle: Breathe in as it grows, breathe out as it shrinks</p>
                <div class="breathing-circle"></div>
                <div class="breathing-text" id="breathingText">Breathe In...</div>
            </div>
        `;
        startBreathingExercise();
        
    } else if (gameType === 'memory') {
        gameArea.innerHTML = `
            <div class="game-container">
                <h3 style="text-align: center; color: #667eea;">Memory Match Game</h3>
                <p style="text-align: center;">Match the pairs. Take your time and relax! 🧘</p>
                <div id="memoryGame"></div>
                <button class="btn-restart" onclick="showGame('memory')">New Game</button>
            </div>
        `;
        startMemoryGame();
        
    } else if (gameType === 'drawing') {
        gameArea.innerHTML = `
            <div class="game-container">
                <h3 style="text-align: center; color: #667eea;">Zen Drawing Canvas</h3>
                <p style="text-align: center;">Draw anything you like. Let your creativity flow! 🎨</p>
                <canvas id="drawingCanvas" width="600" height="400"></canvas>
                <div style="text-align: center; margin-top: 1rem;">
                    <button class="btn-restart" onclick="clearCanvas()">Clear Canvas</button>
                </div>
            </div>
        `;
        initDrawingCanvas();
    }
}

function startBreathingExercise() {
    const text = document.getElementById('breathingText');
    
    // Clear any existing interval
    if (breathingInterval) {
        clearInterval(breathingInterval);
    }
    
    breathingInterval = setInterval(() => {
        setTimeout(() => {
            text.textContent = "Breathe Out...";
        }, 4000);
        text.textContent = "Breathe In...";
    }, 8000);
}

function startMemoryGame() {
    const emojis = ['🌸', '🌺', '🌻', '🌷', '🌼', '🌹', '🍀', '🌿'];
    const gameEmojis = [...emojis, ...emojis];
    gameEmojis.sort(() => Math.random() - 0.5);
    
    const gameBoard = document.getElementById('memoryGame');
    gameBoard.innerHTML = '';
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;
    
    gameEmojis.forEach((emoji, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = idx;
        card.textContent = '?';
        card.onclick = () => flipCard(card);
        gameBoard.appendChild(card);
        memoryCards.push(card);
    });
}

function flipCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === 8) {
            setTimeout(() => {
                alert('Congratulations! You matched all pairs! 🎉');
                saveGameScore('memory', 8);
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '?';
        card2.textContent = '?';
    }
    
    flippedCards = [];
}

function initDrawingCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#667eea';
    
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });
    
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (drawing) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
        }
    });

    canvas.addEventListener('touchend', () => drawing = false);
}

function clearCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function saveGameScore(gameType, score) {
    try {
        const scoreData = {
            gameType: gameType,
            score: score,
            timestamp: new Date().toISOString()
        };
        
        await API.saveGameScore(scoreData);
        console.log('Game score saved successfully');
    } catch (error) {
        console.error('Failed to save game score:', error);
    }
}