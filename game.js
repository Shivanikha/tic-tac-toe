
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modeButton = document.getElementById('mode');
const difficultyButton = document.getElementById('difficulty');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isTwoPlayerMode = true; // Toggle between two-player and AI mode
let isEasyAI = true; // Toggle between easy and hard AI

// Function to handle cell click
function handleClick(event) {
    const cell = event.target;
    const cellIndex = cell.dataset.cell;

    if (board[cellIndex] === '' && isGameActive) {
        board[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWinner()) return;
        if (isTwoPlayerMode) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
        } else if (currentPlayer === 'X') {
            currentPlayer = 'O';
            status.textContent = `Player ${currentPlayer}'s turn`;
            aiPlay();
        }
    }
}

// Function for AI to make a move
function aiPlay() {
    if (!isGameActive) return;

    let availableCells = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    if (availableCells.length === 0) return;

    let bestMove = isEasyAI ? availableCells[Math.floor(Math.random() * availableCells.length)] : findBestMove();
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    if (checkWinner()) return;
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
}

// Function to find the best move for hard AI
function findBestMove() {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
    let scores = { 'X': -1, 'O': 1, 'draw': 0 };

    let result = checkWinner(true);
    if (result !== null) return scores[result];

    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? 'O' : 'X';
            let score = minimax(board, depth + 1, !isMaximizing);
            board[i] = '';
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }
    return bestScore;
}

// Function to check if there's a winner
function checkWinner(earlyExit = false) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            isGameActive = false;
            status.textContent = `Player ${board[a]} wins!`;
            combo.forEach(index => cells[index].style.backgroundColor = '#4CAF50');
            return board[a];
        }
    }

    if (!board.includes('')) {
        isGameActive = false;
        status.textContent = 'It\'s a draw!';
        return 'draw';
    }

    return null;
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#fff';
    });
}

// Function to toggle game mode
function toggleMode() {
    isTwoPlayerMode = !isTwoPlayerMode;
    modeButton.textContent = isTwoPlayerMode ? 'Switch to AI Mode' : 'Switch to Two-Player Mode';
    resetGame();
}

// Function to toggle AI difficulty
function toggleDifficulty() {
    isEasyAI = !isEasyAI;
    difficultyButton.textContent = isEasyAI ? 'Switch to Hard AI' : 'Switch to Easy AI';
}

// Attach event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
modeButton.addEventListener('click', toggleMode);
difficultyButton.addEventListener('click', toggleDifficulty);
