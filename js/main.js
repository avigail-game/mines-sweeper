// todo:  add rightclick=flagged, add css 
var gBoardLength = 4;
var gMinesAmount = 2;
var gBoard;
var gMinesLocations;

var EMPTY = '';
var MINE = '💣';
var nbrsNumber;//nbr= neighbor

function init() {
    closeModal();
    gMinesLocations = createLocations(gMinesAmount, gBoardLength - 1);
    gBoard = buildBoard();
    renderBoard(gBoard);

}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gBoardLength; i++) {
        board[i] = [];
        for (var j = 0; j < gBoardLength; j++) {
            board[i][j] = {
                isFlagged: false,
                isShown: false,
                content: EMPTY
            }
        }
    }

    for (var i = 0; i < gMinesLocations.length; i++) {
        var cellI = gMinesLocations[i].i;
        var cellJ = gMinesLocations[i].j;
        board[cellI][cellJ].content = MINE;
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            nbrsNumber = getNeighborsSum(board, i, j);
            if (nbrsNumber > 0 && board[i][j].content !== MINE) board[i][j].content = nbrsNumber;
        }
    }

    return board;
}

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // var cell = board[i][j].content;
            strHTML += `<td onclick="cellClicked(${i},${j})" `;
            strHTML += `class="cell cell-${i}-${j}  "> ${EMPTY} </td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHTML;
}


//todo- right now there will never be two mines in the same row/colum
function createLocations(amount, maxIdx) {
    //create two arrays of indexes
    var iOptions = getArrayOfNumsInclusive(maxIdx);
    var jOptions = getArrayOfNumsInclusive(maxIdx);

    var positions = [];
    for (var i = 0; i < amount; i++) {
        var rndI = getRandomInt(0, iOptions.length);
        var rndJ = getRandomInt(0, jOptions.length);
        rndI = iOptions.splice(rndI, 1);
        rndJ = jOptions.splice(rndJ, 1);
        var pos = {
            i: rndI[0],
            j: rndJ[0]
        }
        positions.push(pos);
    }
    return positions;
}

function changeLevel(cellAmount, minesAmount) {
    gBoardLength = cellAmount;
    gMinesAmount = minesAmount;
    init();
}

function cellClicked(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ];
    if (cell.content === MINE) {
        renderCell(cellI, cellJ);
        gameOver();
    } else if (cell.content === EMPTY) {
        showNbrs(gBoard, cellI, cellJ);
    } else renderCell(cellI, cellJ);
}

function renderCell(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ];
    if(cell.isShown) return;
    cell.isShown = true;
    elCell = document.querySelector(`.cell-${cellI}-${cellJ}`);
    var strHTML = `<td onclick="cellClicked(${cellI},${cellJ})" `;
    strHTML += `class="clicked  cell cell-${cellI}-${cellJ}  ">  ${cell.content}</td>`;
    elCell.outerHTML = strHTML;
}

function showNbrs(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].content !== MINE) renderCell(i, j);
        }
    }
}

function gameOver(){
    var elModal = document.querySelector('.modal');
    elModal.style.display ='block';
    var strHTML ='GAME OVER <button onclick="init()">start again</button>';
    elModal.innerHTML =strHTML;
}

function closeModal(){
    document.querySelector('.modal').style.display ='none';
}