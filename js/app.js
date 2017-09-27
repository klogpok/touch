"use strict";

var gBoard;
var elBoard;
var gNextNum;
var LENGTH;
var gState;
var gTimer;
var gInterval;



function getState() {
    return {
        isGameOn: false
    };
}

function getGameLevel() {
    var radios = document.getElementsByName('level');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}


function init() {
    gBoard = buildBoard(getGameLevel());
    LENGTH = Math.pow(gBoard.length, 2);
    elBoard = document.querySelector('table');
    renderBoard(gBoard, false);
}

function startGame() {

    gBoard = buildBoard(getGameLevel());
    LENGTH = Math.pow(gBoard.length, 2);
    elBoard = document.querySelector('table');
    renderBoard(gBoard, true);
    gNextNum = 1;
    gTimer = 0;
    gState = getState();
    gState.isGameOn = true;
    clearInterval(gInterval);
    var count =0;

    gInterval = setInterval(function () {
        if (!gState.isGameOn) {
            clearInterval(gInterval);
        } else {
            count++;
            displayTimer(count);
        }
    }, 1000);
}

function  getRandomSeq(num) {
    var seq = getSeq(num*num);
    return shuffle(seq);
}


function buildBoard(boardSize) {
    var board = [];
    var count = 0;
    var temp = getRandomSeq(boardSize);

    for (var i = 0; i < boardSize; i++) {
        var row = [];
        for (var j = 0; j < boardSize; j++) {
            row.push({value : temp[count], isMarked : false});
            count++;
        }
        board.push(row);
    }
    return board;
}

function clearBoard(boardSize) {
	var board = [];
	var count = 0;

	for (var i = 0; i < boardSize; i++) {
		var row = [];
		for (var j = 0; j < boardSize; j++) {
			row.push({value : '', isMarked : false});
			count++;
		}
		board.push(row);
	}
	return board;
}

function renderBoard(board, isStart) {
    var strHtml = '';
    board.forEach(function (row, i) {

        strHtml += '<tr>';
        row.forEach(function (cell, j) {
            var elClass = ' class="cell-' + i + '-' + j + '"';
            strHtml += '<td'+ elClass + ' onclick="cellClicked(this,'+i+',' + j +')">';
            if (isStart) {
                strHtml += gBoard[i][j].value + '</td>';
            } else {
                strHtml += '</td>';
            }
        });
        strHtml += '</tr>';
    });
    elBoard.innerHTML = strHtml;
}

function cellClicked(elem, i, j) {

    if (gBoard[i][j].isMarked || !gState.isGameOn) { return; }

    if (+elem.innerText !== gNextNum) {
        gState.isGameOn = false;
        clearInterval(gInterval);
        gameLose();
    } else {
        if (+elem.innerText === LENGTH) {
            elem.classList.add('clicked');
            gBoard[i][j].isMarked = true;
            gState.isGameOn = false;
            gameWin();
        } else {
            elem.classList.add('clicked');
            displayNextNum(gBoard[i][j].value+1);
            gBoard[i][j].isMarked = true;
            gNextNum++;
        }
    }
}

function displayNextNum(num) {
    var elNextNum = document.querySelector('.next-number > span');
    elNextNum.innerText = num;
}

function displayTimer(value) {
    var elTimer = document.querySelector('.game-time > span');
    elTimer.innerText = value;
}

function gameWin() {
    displayPopUp('You are win!!!');
}

function gameLose() {
    displayPopUp('You lose!!!');
}

function displayPopUp(txt) {
    var elPopUp = document.querySelector('.info-popUp');
    elPopUp.querySelector('h2').innerText = txt;
    elPopUp.style.display = 'block';
}

function closePopup(event) {
	var elPopUp = document.querySelector('.info-popUp');
	elPopUp.style.display = 'none';
	gBoard = clearBoard(getGameLevel());
	LENGTH = Math.pow(gBoard.length, 2);
	elBoard = document.querySelector('table');
	renderBoard(gBoard, true);
	displayNextNum(1);
	displayTimer(0);
}



