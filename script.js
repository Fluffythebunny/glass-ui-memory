let currentLevel = 1;
const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎫', '🎬', '🎤', '🎧', '🎵', '🎹', '🎷', '🎺', '🌹', '🎂', '🎄', '🎢', '🔮'];
let matchedPairs = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.card').forEach(card => {
        const speed = 5;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        card.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

function createCard(emoji) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.framework = emoji;
    card.innerHTML = `
        <div class="front-face">${emoji}</div>
        <div class="back-face">❓</div>
    `;
    return card;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    
    const totalPairs = (currentLevel + 2);
    if (matchedPairs === totalPairs) {
        setTimeout(() => {
            nextLevel();
        }, 1000);
    }
    
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function nextLevel() {
    currentLevel++;
    matchedPairs = 0;
    document.getElementById('level-display').textContent = currentLevel;
    
    const gameContainer = document.querySelector('.memory-game');
    gameContainer.innerHTML = '';
    
    const pairsCount = currentLevel + 2;
    const selectedEmojis = emojis.slice(0, pairsCount);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    cardPairs.sort(() => Math.random() - 0.5);
    
    const columns = Math.ceil(Math.sqrt(cardPairs.length));
    gameContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    cardPairs.forEach(emoji => {
        const card = createCard(emoji);
        gameContainer.appendChild(card);
    });
    
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

nextLevel();
