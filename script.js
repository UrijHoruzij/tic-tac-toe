function gameClass() {
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
	let choice, huPlayer, aiPlayer, origBoard, cells;
	const startBtn = document.querySelector('[data-start]');
	const message = document.querySelector('.message');
	const radios = document.querySelectorAll('input[type="radio"]');
	const game = document.querySelector('.game');
	this.build = () => {
		for (let i = 0; i < 9; i++) {
			game.innerHTML += `<div class="cell" id="${i}"></div>`;
		}
		cells = document.querySelectorAll('.cell');
		checkSymbol();
		for (let i = 0; i < radios.length; i++) {
			radios[i].addEventListener('click', checkSymbol);
		}
		startBtn.addEventListener('click', startGame);
	};
	const startGame = () => {
		startBtn.style.visibility = 'hidden';
		origBoard = Array.from(Array(9).keys());
		for (let i = 0; i < cells.length; i++) {
			cells[i].classList.remove('lose');
			cells[i].classList.remove('win');
			cells[i].innerText = '';
			message.style.opacity = '0';
			cells[i].addEventListener('click', turnClick, false);
		}
	};
	const checkSymbol = () => {
		for (let i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				choice = radios[i].value;
			}
		}
		switch (choice) {
			case '1':
				huPlayer = 'O';
				aiPlayer = 'X';
				break;
			case '0':
				huPlayer = 'X';
				aiPlayer = 'O';
				break;
		}
	};
	const turnClick = (square) => {
		if (typeof origBoard[square.target.id] == 'number') {
			turn(square.target.id, huPlayer);
			if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
		}
	};
	const turn = (squareId, player) => {
		origBoard[squareId] = player;
		document.getElementById(squareId).innerText = player;
		let gameWon = checkWin(origBoard, player);
		if (gameWon) gameOver(gameWon);
	};
	const checkWin = (board, player) => {
		let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
		let gameWon = null;
		for (let [index, win] of winCombos.entries()) {
			if (win.every((elem) => plays.indexOf(elem) > -1)) {
				gameWon = { index: index, player: player };
				break;
			}
		}
		return gameWon;
	};
	const winCells = (index, status) => {
		for (let i = 0; i < winCombos[index].length; i++) {
			cells[winCombos[index][i]].classList.add(status ? 'win' : 'lose');
		}
	};
	const gameOver = (gameWon) => {
		for (let i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', turnClick, false);
		}
		if (gameWon.player == huPlayer) {
			declareWinner(`Вы победили!`);
			winCells(gameWon.index, true);
		} else {
			declareWinner(`Вы проиграли.`);
			winCells(gameWon.index, false);
		}
		startBtn.style.visibility = 'visible';
	};
	const declareWinner = (who) => {
		message.style.opacity = '1';
		message.innerText = who;
	};
	const emptySquares = () => origBoard.filter((s) => typeof s == 'number');
	const bestSpot = () => minimax(origBoard, aiPlayer).index;
	const checkTie = () => {
		if (emptySquares().length == 0) {
			for (let i = 0; i < cells.length; i++) {
				cells[i].removeEventListener('click', turnClick, false);
			}
			declareWinner('Ничья!');
			startBtn.style.visibility = 'visible';
			return true;
		}
		return false;
	};
	const minimax = (newBoard, player) => {
		let availSpots = emptySquares();
		if (checkWin(newBoard, huPlayer)) {
			return { score: -1 };
		} else if (checkWin(newBoard, aiPlayer)) {
			return { score: 1 };
		} else if (availSpots.length === 0) {
			return { score: 0 };
		}
		let moves = [];
		for (let i = 0; i < availSpots.length; i++) {
			let move = {};
			move.index = newBoard[availSpots[i]];
			newBoard[availSpots[i]] = player;
			if (player == aiPlayer) {
				let result = minimax(newBoard, huPlayer);
				move.score = result.score;
			} else {
				let result = minimax(newBoard, aiPlayer);
				move.score = result.score;
			}
			newBoard[availSpots[i]] = move.index;
			moves.push(move);
		}
		let bestMove;
		if (player === aiPlayer) {
			let bestScore = -1000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			let bestScore = 1000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}
		return moves[bestMove];
	};
}

const enableDarkMode = () => {
	document.body.classList.add('darkmode');
	localStorage.setItem('darkMode', 'enabled');
};
const disableDarkMode = () => {
	document.body.classList.remove('darkmode');
	localStorage.setItem('darkMode', null);
};
const defaultDarkMode = () => {
	let darkMode = localStorage.getItem('darkMode');
	darkMode != 'enabled' ? document.body.classList.add('darkmode') : document.body.classList.remove('darkmode');
};
const checkDarkMode = () => {
	let darkMode = localStorage.getItem('darkMode');
	darkMode != 'enabled' ? enableDarkMode() : disableDarkMode();
};

window.addEventListener('DOMContentLoaded', function () {
	const country = 'Russia';
	document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${country}')`;
	defaultDarkMode();
	const darkModeToggle = document.querySelector('.toggle-btn');
	darkModeToggle.addEventListener('click', checkDarkMode);
	const game = new gameClass();
	game.build();
});
