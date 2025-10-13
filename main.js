
// 1. Despot some money 
// 2. Determine number of lines to bet on 
// 3. Collect a bet amount 
// 4. Spin the slot machine 
// 5. check if the user won 
// 6. give the user their winning 
// 7. play again 

const ROWS = 3;
const COLS = 3; 
const SYMBOLS_COUNT = { '🍒': 6, '🍋': 8, '🍊': 10, '🍇': 12 };
const SYMBOL_VALUES = { '🍒': 5, '🍋': 4, '🍊': 3, '🍇': 2 };
 let gameBalance = 0;
 



function showMessage(text, color) {
    const messageBox = document.getElementById('message');
    messageBox.textContent = text; 
    messageBox.style.color = color; 
}
 
function displayInitialReelsFixed() {
  const initialReels = [
    ['🍋', '🍒', '🍊'],  // Reel 1
    ['🍊', '🍋', '🍒'],  // Reel 2
    ['🍇', '🍊', '🍋']   // Reel 3
  ];

  for (let i = 0; i < COLS; i++) {
    document.getElementById(`reel${i+1}`).textContent = initialReels[i].join('\n');
  }
};
 
window.addEventListener('DOMContentLoaded', displayInitialReelsFixed);



function depositGame() {
const depositInput = document.getElementById('cash'); 
const depositAmount = parseFloat(depositInput.value); 

if(isNaN(depositAmount) || depositAmount <= 0) {
  showMessage('Please Enter an valid Deposit Amount', 'red'); 
  return;
}

gameBalance += depositAmount; 

const balanceDisplay = document.getElementById('balance-display'); 
balanceDisplay.textContent = ` balance ${gameBalance} `; 

showMessage(`Deposit of $${depositAmount} successful!`, 'green');

depositInput.value = '';
}; 
document.getElementById('deposit-btn').addEventListener('click', depositGame);


function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}




function betAmount() {
  const betInput = document.getElementById('bet');
  const linesInput = document.getElementById('lines');

  const betAmountFor = parseFloat(betInput.value);
  const numberLinesFor = parseFloat(linesInput.value);


  if (isNaN(betAmountFor) || betAmountFor <= 0) {
    showMessage('Please enter a valid bet amount', 'red');
    return;
  }

  if (isNaN(numberLinesFor) || numberLinesFor < 1 || numberLinesFor > 3) {
    showMessage('Please enter a valid number of lines', 'red');
    return;
  }

  const totalBet = betAmountFor * numberLinesFor;

  if (totalBet > gameBalance) {
    showMessage('Not enough balance to place this bet!', 'red');
    return;
  }

  gameBalance -= totalBet;
  currentBet = betAmountFor;
  currentLines = numberLinesFor;
  document.getElementById('balance-display').textContent = `Balance: $${gameBalance}`;
  showMessage(`Bet of $${betAmountFor} placed on ${numberLinesFor} lines!`, 'green');

  betInput.value = '';
};



 function spinReels() {
  const betInput = document.getElementById('bet');
  const linesInput = document.getElementById('lines');

  const betAmount = parseFloat(betInput.value);
  const numberLines = parseFloat(linesInput.value);

  if (isNaN(betAmount) || betAmount <= 0) {
    showMessage('Please enter a valid bet amount!', 'red');
    return;
  }
  if (isNaN(numberLines) || numberLines < 1 || numberLines > 3) {
    showMessage('Please enter a valid number of lines!', 'red');
    return;
  }

  const totalBet = betAmount * numberLines;
  if (totalBet > gameBalance) {
    showMessage('Not enough balance for this bet!', 'red');
    return;
  }

  gameBalance -= totalBet;
  document.getElementById('balance-display').textContent = `Balance: $${gameBalance}`;

  
  const reels = spin();
  for (let i = 0; i < COLS; i++) {
    document.getElementById(`reel${i + 1}`).textContent = reels[i].join('\n');
  }

   
  let winnings = 0;
  for (let line = 0; line < numberLines; line++) {
    if (reels[0][line] === reels[1][line] && reels[1][line] === reels[2][line]) {
      const symbol = reels[0][line];
      winnings += betAmount * SYMBOL_VALUES[symbol];
    }
  }

 
  if (winnings > 0) {
    gameBalance += winnings;
    showMessage(`You won $${winnings}! 🎉`, 'green');
  } else {
    showMessage('No win this time. Try again!', 'red');
  }

  document.getElementById('balance-display').textContent = `Balance: $${gameBalance}`;
  betInput.value = '';
  linesInput.value = '';
}

document.getElementById('spin-btn').addEventListener('click', spinReels);