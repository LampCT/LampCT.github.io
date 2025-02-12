/*      Overview

https://www.chessprogramming.org/Square_Mapping_Considerations
https://www.chessprogramming.org/Magic_Bitboards
https://www.chessprogramming.org/General_Setwise_Operations#OneStepOnly

One-Step Only Shifts are used for my move generation on a 2D board.

I traverse every direction and if I find a piece of the same color I continue gathering information about the move
        This method is by recursion & considered by inefficient calculation

Another method is to use a bitboard representation and use bitwise operations to check for wins
        This method uses bitwise operations & considered by efficient calculation

Another method is to use a hash map to store all the possible wins (Access the hash map with a magic bitboard)
        This method uses constant time bitwise operations & 1 lookup it is considered the best method
*/


document.addEventListener("DOMContentLoaded", function() {
    console.log("Document is ready!");


const COLS = 7;
const ROWS = 6;

// Compass Rose: 0 South 1 SW 2 W 3 NE 4 N 5 NW 6 E
const SHIFT_DIRS = [
    -7, -6, -1, 6, 7, 8, 1
]

let boardElm = document.getElementById("board-container");
let game = document.createElement("div");
game.waiting = false;
game.id = "game";
game.turn = 'r';
boardElm.append(game);

let boardCells = game.board = [];

createBoard();

function createBoard() {
    for (let i = 0; i < COLS*ROWS; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.id = i;
        cell.state = 0;
        cell.piece = 0;
        cell.onclick = cellClicked;
        boardElm.append(cell);
        boardCells.push(cell);
    }
}

function cellClicked() {
    let col = this.id % COLS
    let row = Math.floor(this.id / 7)
    let dropSquare = drop(col);
    if (dropSquare === -1) {
        return;
    }
    
    animateDrop(dropSquare);
    if (checkWin(dropSquare)) {
        console.log("win");
        return;
    }

    game.turn = game.turn === 'r' ? 'y' : 'r';
}

//  Check all directions for a win
function checkWin(dropSquare) {
    for (let i = 0; i < COLS; i++) {
        if (checkDirection(dropSquare, i)) {
            return true;
        }
    }
}


//  Check if a direction has 4 in a row
function checkDirection(currSquare, dir, count = 1) {
    let shift = SHIFT_DIRS[dir];

    // Check if count is 4, win
    if (count === 4) {
        return true;
    }

    // Check if out of bounds, dont check
    if (currSquare + shift < 0 || currSquare + shift >= COLS*ROWS) {
        return false;
    }

    // Check if empty, dont check
    if (boardCells[currSquare + shift].state === 0) {
        return false;
    }

    // Check if piece is same as current turn, check
    if (boardCells[currSquare + shift].piece === game.turn) {
        return checkDirection(currSquare + shift, dir, count + 1);
    }

    // Piece is opponent's, dont check
    return false;
}

function drop(col, n = 0) {
    // If the column is full, return
    if (boardCells[col].state === 1) {
        return -1;
    }

    // If the bottom of column is reached, drop piece
    if (n === ROWS - 1 || boardCells[ (n*COLS + col) + COLS ].state === 1) {
        
        let piece = document.createElement("img");
        piece.id = game.turn;
        piece.src = '../assets/' + game.turn + '.svg';
        boardCells[n*COLS + col].state = 1;
        boardCells[n*COLS + col].piece = game.turn;
        boardCells[n*COLS + col].imga = piece;
        //boardCells[n*COLS + col].append(piece);
        return n*COLS + col;
    }

    // Continue falling
return drop(col, n + 1);
}


//  Tried to mimic a canvas animation method
//  I would like to get rid of the numbers in frames and use a constant instead
function animateDrop(dropSquare) {
    // Layout where the piece will go through
    let frames = [
        dropSquare % 7,
        dropSquare - 35,
        dropSquare - 28,
        dropSquare - 21,
        dropSquare - 14,
        dropSquare - 7,
        dropSquare
    ]

    // Adjust for negative index from single filled column
    let i = 0;
    let piece = boardCells[dropSquare].imga;
    if (frames[i] < 0) {
        i = 1;
    }


    for (let j = i; j < frames.length; j++) {
        setTimeout(() => {
            if (!game.waiting) {
            boardCells[frames[j]].append(piece);
            }
        }, 50 *j);
    }
}
});