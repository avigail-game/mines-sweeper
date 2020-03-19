'use strict'

// todo: add css 

// todo: first click never mine

var gBoardLength = 4;
var gMinesAmount = 2;
var gBoard;
var gMinesLocations;
var gWatch;
var gIsPlaying;
var gIsGameOver;
var gFlagCount;
var gHintsCount;
var gIsHintMode;

var EMPTY = '';
var MINE = '💣';
var FLAG = '🚩';
var SMILEY = '😊';
var WINNER = '🥳';
var LOSER = '😵';
var HINT = '🔍';
var nbrsNumber;//nbr= neighbor

function init() {
    gIsGameOver = false;
    gIsPlaying = false;

    gHintsCount = 3;
    gIsHintMode = false;

    gFlagCount = gMinesAmount;
    gMinesLocations = [];


    if (gWatch) clearInterval(gWatch);
    gWatch = null;


    gBoard = buildBoard();

    renderBoard(gBoard);
    renderSmiley(SMILEY);
    closeModal();
    renderTime('0');
    renderFlagCount();
    renderHintsCount();

}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gBoardLength; i++) {
        board[i] = [];
        for (var j = 0; j < gBoardLength; j++) {
            board[i][j] = {
                isFlagged: false,
                isClicked: false,
                content: EMPTY
            }
        }
    }

    gMinesLocations = [];
    for (var i = 0; i < gMinesAmount; i++) {

        var cell = {
            i: getRandomInt(0, board.length),
            j: getRandomInt(0, board.length)
        }
        if (board[cell.i][cell.j].content === MINE) i--;
        else {
            gMinesLocations.push(cell);
            board[cell.i][cell.j].content = MINE;
        }
    }
    console.log(gMinesLocations);

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            nbrsNumber = getNeighborsSum(board, i, j);
            var cell = board[i][j];
            if (nbrsNumber > 0 && cell.content !== MINE) {
                cell.content = nbrsNumber;
            }
        }
    }
    console.log(board);
    return board;
}

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td onmousedown="cellClicked(event ,${i},${j})"`;
            strHTML += `class="cell cell-${i}-${j}"> ${EMPTY} </td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHTML;
}

function changeLevel(length, minesAmount) {
    gBoardLength = length;
    gMinesAmount = minesAmount;
    init();
}

function cellClicked(event, i, j) {
    if (gIsGameOver) return;

    if (gIsHintMode) {
        showHint(gBoard, i, j);
        return;
    }

    //first mouse event start watch
    if (!gIsPlaying) {
        startWatch();
        gIsPlaying = true;
    }

    var cell = gBoard[i][j];

    //togele flag
    if (event.button === 2) {
        cell.isFlagged = !cell.isFlagged;
        if (cell.isFlagged) {
            gFlagCount--;
            var symbol = FLAG;
        } else {
            gFlagCount++;
            var symbol = '';
        }
        if (gFlagCount === 0) {
            isWinner();
        }
        renderFlag(symbol, i, j);
        renderFlagCount();
        return;
    }

    if (cell.isFlagged || cell.isClicked) return;

    cell.isClicked = true;



    switch (cell.content) {
        case MINE:
            setGameOver(false);
            break;
        case EMPTY:
            showNbrs(gBoard, i, j);
            break;
        default:
            renderClickedCell(i, j);
            break;
    }

    isWinner();

}

function renderClickedCell(i, j) {
    var cell = gBoard[i][j];
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    var strHTML = `<td class="cell clicked `;
    // if (cell.content === MINE && !gIsGameOver) strHTML += ` first-mine `;
    strHTML += ` cell-${i}-${j}">  ${cell.content}</td>`;
    elCell.outerHTML = strHTML;
}

function isWinner() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            console.log(cell);
            console.log(cell.content !== MINE && cell.isClicked);
            console.log(cell.content === MINE && cell.isFlagged);
            if ((cell.content !== MINE && cell.isClicked) ||
                (cell.content === MINE && cell.isFlagged)) {
                continue;
            }
            return false;
        }
    }

    setGameOver(true);
}

function setGameOver(isWin) {
    if (isWin) {
        var msg = 'you win!'
        renderSmiley(WINNER);
    } else {
        var msg = 'GAME OVER'
        renderSmiley(LOSER);
        for (var idx = 0; idx < gMinesLocations.length; idx++) {
            var currLocation = gMinesLocations[idx];
            renderClickedCell(currLocation.i, currLocation.j);
        }
    }
    showModal(msg);

    clearInterval(gWatch);
    gWatch = null;
    gIsGameOver = true;
}

function getHint() {
    gHintsCount--;
    gIsHintMode = true;
    renderHintsCount();
}

function useHint(board, cellI, cellJ, isShown) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var cell = board[i][j];
            if (j < 0 || j >= board[i].length || cell.isClicked) continue;

            if (isShown) var value = cell.content;
            else if (cell.isFlagged) {
                var value = FLAG;
            } else var value = EMPTY;
            renderCell(i, j, value);
        }
    }
}

function showHint(board, cellI, cellJ) {
    useHint(board, cellI, cellJ, true);
    setTimeout(function () {
        useHint(board, cellI, cellJ, false);
        gIsHintMode = false;
    }, 1000);
}



function showNbrs(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var cell = board[i][j];
            if ((j < 0 || j >= board[i].length) ||
                (cell.content === MINE) ||
                cell.isFlagged) continue;
            cell.isClicked = true;
            renderClickedCell(i, j);
        }
    }
}

function startWatch() {
    var startTime = Date.now();
    gWatch = setInterval(function () {
        var currTime = Date.now();
        var totalTime = Math.floor((currTime - startTime) / 1000);
        renderTime(totalTime);
    }, 1);
}

function showModal(msg) {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    var strHTML = `${msg} <button onclick="init()">play again</button>`;
    elModal.innerHTML = strHTML;
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}

function renderTime(time) {
    document.querySelector('.watch').innerText = `time: ${time}`;
}

function renderSmiley(symbol) {
    document.querySelector('.smiley').innerHTML = `${symbol}`;
}

function renderFlagCount() {
    document.querySelector('.flags').innerHTML = `${gFlagCount}`;
}

function renderHintsCount() {
    var strHTML = '<div class="hints" onclick="getHint()">';
    for (var i = 0; i < gHintsCount; i++) {
        strHTML += ` ${HINT} `;
    }
    strHTML += '</div>';
    document.querySelector('.hints').outerHTML = `${strHTML}`;
}

function renderFlag(symbol, cellI, cellJ) {
    document.querySelector(`.cell-${cellI}-${cellJ}`).innerHTML = `${symbol}`;
}
