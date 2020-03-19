function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getArrayOfNumsInclusive(num){
    var nums =[];
    for (var i = 0; i <= num; i++) {
        nums.push(i);
    }
    return nums;
}

function getNeighborsSum(board, cellI, cellJ) {
    var sum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].content === MINE) sum++;
        }
    }
    return sum;
}

// function printMat(mat, selector) {
//     var strHTML = '<table border="0"><tbody>';
//     for (var i = 0; i < mat.length; i++) {
//       strHTML += '<tr>';
//       for (var j = 0; j < mat[0].length; j++) {
//         var cell = mat[i][j];
//         var className = 'cell cell' + i + '-' + j;
//         strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
//       }
//       strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>';
//     var elContainer = document.querySelector(selector);
//     elContainer.innerHTML = strHTML;
//   }
  
  function renderCell(i,j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = value;
  }