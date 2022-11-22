const name = 'Russia';
document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;

for (let i = 0; i < 9; i++) {
	document.getElementById('game').innerHTML += '<div class="block" id="' + i + '"></div>';
}
let choice, huPlayer, aiPlayer, origBoard;
const block = document.querySelectorAll('.block'),
	reset = document.getElementById('reset'),
	message = document.getElementById('message'),
	btnradio = document.getElementById('radiocheck'),
	radios = document.querySelectorAll('input[type="radio"]');
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2],
];

radiocheck();
for (var i = 0; i < radios.length; i++) {
	radios[i].addEventListener('click', radiocheck);
}
function radiocheck() {
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			choice = radios[i].value;
		}
	}
	switch (choice) {
		case '1':
			huPlayer = 'O';
			aiPlayer = 'X';
			turn(bestSpot(), aiPlayer);
			break;
		case '0':
			huPlayer = 'X';
			aiPlayer = 'O';
			break;
	}
}
startGame();
function startGame() {
	origBoard = Array.from(Array(9).keys());
	for (let i = 0; i < block.length; i++) {
		block[i].innerText = '';
		message.style.opacity = '0';
		block[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every((elem) => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (var i = 0; i < block.length; i++) {
		block[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? 'Вы победили!' : 'Вы проиграли.');
}

function declareWinner(who) {
	message.style.opacity = '1';
	message.innerText = who;
}

function emptySquares() {
	return origBoard.filter((s) => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < block.length; i++) {
			block[i].removeEventListener('click', turnClick, false);
		}
		declareWinner('Ничья!');
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return { score: -1 };
	} else if (checkWin(newBoard, aiPlayer)) {
		return { score: 1 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -1000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 1000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}
reset.addEventListener('click', function () {
	if (choice == 1) {
		startGame();
		turn(bestSpot(), aiPlayer);
	} else {
		startGame();
	}
});
