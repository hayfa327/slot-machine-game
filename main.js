
// 1. Despot some money 
// 2. Determine number of lines to bet on 
// 3. Collect a bet amount 
// 4. Spin the slot machine 
// 5. check if the user won 
// 6. give the user their winning 
// 7. play again 





/* ---------- background music (optional) ---------- */
const backgroundMusic = new Audio('background.mp3'); // if you have a file
backgroundMusic.loop = true;
backgroundMusic.volume = 0.25;
let musicAllowed = false;
document.getElementById('music').addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(e => console.log('play failed', e));
    musicAllowed = true;
  } else {
    backgroundMusic.pause();
    musicAllowed = false;
  }
});

const winSound = new Audio('win-music.mp3');  
winSound.volume = 0.6;

const loseSound = new Audio('lose-music.mp3');  
loseSound.volume = 0.6;


/* ---------- game variables ---------- */

 const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = { '🍒': 3, '🍋': 6, '🍊': 10, '🍇': 18 };
const SYMBOL_VALUES = { '🍒': 10, '🍋': 5, '🍊': 3, '🍇': 2 };
let gameBalance = 0;

 
function showMessage(text, color = 'black') {
  const messageBox = document.getElementById('message');
  messageBox.textContent = text;
  messageBox.style.color = color;
  if (color === 'green') winSound.play();
  if (color === 'red')  loseSound.play();
}
/* ---------- prepare symbol pool ---------- */
function buildSymbolsArray() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) symbols.push(symbol);
  }
  return symbols;
}

/* ---------- spin logic: produce final reels result ---------- */
function spin() {
  const symbols = buildSymbolsArray();
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let r = 0; r < ROWS; r++) {
      const idx = Math.floor(Math.random() * reelSymbols.length);
      reels[i].push(reelSymbols[idx]);
      reelSymbols.splice(idx, 1);
    }
  }
  console.log('final reels result:', reels);
  return reels;
}

/* ---------- render reels (given result array) ---------- */
function renderReels(reels) {
  for (let i = 0; i < COLS; i++) {
    const reelEl = document.getElementById(`reel${i+1}`);
    reelEl.innerHTML = '';
    reels[i].forEach(symbol => {
      const span = document.createElement('span');
      span.textContent = symbol;
      reelEl.appendChild(span);
    });
  }
}

/* ---------- initial display: fill with random symbols ---------- */
function displayInitial() {
  const pool = buildSymbolsArray();
  const initial = [];
  for (let i = 0; i < COLS; i++) {
    initial.push([]);
    for (let r = 0; r < ROWS; r++) {
      initial[i].push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }
  renderReels(initial);
}
window.addEventListener('DOMContentLoaded', displayInitial);

/* ---------- deposit ---------- */
document.getElementById('deposit-btn').addEventListener('click', () => {
  const depositInput = document.getElementById('cash');
  const amt = parseFloat(depositInput.value);
  if (isNaN(amt) || amt <= 0) { showMessage('Please enter a valid deposit', 'red'); return; }
  gameBalance += amt;
  document.getElementById('balance-display').textContent = `Balance: $${gameBalance}`;
  showMessage(`Deposit $${amt} successful`, 'green');
  depositInput.value = '';
});

 

/* ---------- spin button / animation / win detection ---------- */
document.getElementById('spin-btn').addEventListener('click', spinReelsAnimated);

function clearWinsVisuals() {
  for (let c = 1; c <= COLS; c++) {
    const reelEl = document.getElementById(`reel${c}`);
    Array.from(reelEl.children).forEach(ch => ch.classList.remove('win'));
  }
}

function spinReelsAnimated() {
  const betInput = document.getElementById('bet');
  const linesInput = document.getElementById('lines');
  const betAmount = parseFloat(betInput.value);
  const numberLines = parseInt(linesInput.value, 10);

  if (isNaN(betAmount) || betAmount <= 0) { showMessage('Enter valid bet', 'red'); return; }
  if (isNaN(numberLines) || numberLines < 1 || numberLines > 3) { showMessage('Enter valid lines (1-3)', 'red'); return; }
  const total = betAmount * numberLines;
  if (total > gameBalance) { showMessage('Not enough balance', 'red'); return; }

  // deduct bet
  gameBalance -= total;
  document.getElementById('balance-display').textContent = `Balance: $${gameBalance}`;
  showMessage('Spinning...', 'black');

  // clear previous wins visuals
  clearWinsVisuals();

  // add spin class to reels for visual motion
  const reelEls = document.querySelectorAll('.reel');
  reelEls.forEach(r => r.classList.add('spin-animation'));

  // show quick random flicker during spin (optional)
  const flickerInterval = setInterval(() => {
    const pool = buildSymbolsArray();
    for (let i = 0; i < COLS; i++) {
      const reelEl = document.getElementById(`reel${i+1}`);
      // temporarily fill with random choices
      reelEl.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        const s = pool[Math.floor(Math.random()*pool.length)];
        const span = document.createElement('span');
        span.textContent = s;
        reelEl.appendChild(span);
      }
    }
  }, 80);

  // after spinDuration, stop and show final result
  const spinDuration = 2000; // ms
  setTimeout(() => {
    clearInterval(flickerInterval);
    reelEls.forEach(r => r.classList.remove('spin-animation'));

    const reels = spin(); // final result
    renderReels(reels);

     
     // Check horizontal wins (rows)
      let winnings = 0;
  const winningSymbols = [];
  for (let row = 0; row < numberLines; row++) {
    if (reels[0][row] === reels[1][row] && reels[1][row] === reels[2][row]) {
      const sym = reels[0][row];
      winnings += betAmount * SYMBOL_VALUES[sym];
      for (let c = 0; c < COLS; c++) {
        const node = document.getElementById(`reel${c+1}`).children[row];
        if (node) {
          node.classList.add('win');
          winningSymbols.push(node);
        }
      }
    }
  }

  // 🎯 Check vertical wins (columns)
  for (let col = 0; col < COLS; col++) {
    if (reels[col][0] === reels[col][1] && reels[col][1] === reels[col][2]) {
      const sym = reels[col][0];
      winnings += betAmount * SYMBOL_VALUES[sym];
      for (let r = 0; r < ROWS; r++) {
        const node = document.getElementById(`reel${col+1}`).children[r];
        if (node) {
          node.classList.add('win');
          winningSymbols.push(node);
        }
      }
    }
  }

    if (winnings > 0) {
      gameBalance += winnings;
      showMessage(`🎉 You won $${winnings}`, 'green');
      winSound.currentTime = 0;
winSound.play();
    } else {
      showMessage('No win this time. Try again!', 'red');
    }
    document.getElementById('balance-display').textContent = `Balance: $${gameBalance}`;
 
  }, spinDuration);
}

/* Debug helper: show console message if errors occur */
window.onerror = function(msg, src, line, col, err) {
  console.error('Error captured:', msg, 'at', src, line, col, err);
  showMessage('An error occurred — check console (F12)', 'red');
};