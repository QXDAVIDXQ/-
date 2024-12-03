const rows = 6;
const cols = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;
let playerWins = 0;
let isComputerMode = false;

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleClick(col));
            boardElement.appendChild(cell);
            board[row][col] = null;
        }
    }
}

function handleClick(col) {
    if (gameOver || isComputerMode && currentPlayer === 'yellow') return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            updateBoard();
            if (checkWinner(row, col)) {
                setTimeout(() => {
                    playerWins++;
                    document.getElementById('wins').textContent = `Siege: ${playerWins}`;
                    document.getElementById('status').textContent = `${currentPlayer === 'red' ? 'Der rote' : 'Der gelbe'} Spieler hat gewonnen!`;
                    gameOver = true;
                    triggerConfetti();
                }, 500);
                return;
            }
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            document.getElementById('status').textContent = `Es ist der Zug des ${currentPlayer === 'red' ? 'roten' : 'gelben'} Spielers.`;
            if (isComputerMode && currentPlayer === 'yellow') {
                setTimeout(computerMove, 500);
            }
            return;
        }
    }
}

function computerMove() {
    const emptyCols = [];
    for (let col = 0; col < cols; col++) {
        if (!board[0][col]) emptyCols.push(col);
    }
    const randomCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
    handleClick(randomCol);
}

function updateBoard() {
    const boardElement = document.getElementById('board');
    let index = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = boardElement.children[index];
            if (board[row][col]) {
                cell.classList.add(board[row][col]);
            } else {
                cell.classList.remove('red', 'yellow');
            }
            index++;
        }
    }
}

function checkWinner(row, col) {
    if (checkDirection(row, col, 0, 1)) return true;
    if (checkDirection(row, col, 1, 0)) return true;
    if (checkDirection(row, col, 1, 1)) return true;
    if (checkDirection(row, col, 1, -1)) return true;
    return false;
}

function checkDirection(row, col, rowDir, colDir) {
    const color = board[row][col];
    let count = 1;
    let r = row + rowDir;
    let c = col + colDir;

    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === color) {
        count++;
        r += rowDir;
        c += colDir;
    }

    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === color) {
        count++;
        r -= rowDir;
        c -= colDir;
    }

    return count >= 4;
}

function triggerConfetti() {
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
    });
}

function resetGame() {
    board = [];
    currentPlayer = 'red';
    gameOver = false;
    document.getElementById('status').textContent = `Es ist der Zug des roten Spielers.`;
    createBoard();
}

function toggleMode() {
    isComputerMode = !isComputerMode;
    document.getElementById('mode-toggle').textContent = isComputerMode ? 'Gegen Menschen spielen' : 'Gegen Computer spielen';
    resetGame();
}

createBoard();
