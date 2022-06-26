//PLAYER FACTORY
const Player = (name, sign) => {
	let score = 0;
	sign = sign.toUpperCase();

	const setName = (newName) => {
		name = newName.charAt(0).toUpperCase() + newName.toLowerCase().slice(1);
	};
	const getName = () => {
		return name;
	};
	const getScore = () => {
		return score;
	};
	const addScore = () => {
		score++;
	};
	const resetScore = () => {
		score = 0;
	};
	const changeSign = () => {
		sign = sign === "X" ? "O" : "X";
	};
	const getSign = () => {
		return sign;
	};
	return {
		addScore,
		getScore,
		getName,
		setName,
		changeSign,
		getSign,
		resetScore,
	};
};

const Player1 = (name, id) => {
	name = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
	id = id;
	const sign = "X";
	const addClass = () => "p1";

	const prototype = Player(name, sign);
	return Object.assign({}, prototype, { addClass, id });
};
const Player2 = (name, id) => {
	name = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
	id = id;
	const sign = "O";
	const addClass = () => "p2";

	const prototype = Player(name, sign);
	return Object.assign({}, prototype, { addClass, id });
};

// Create players
const huPlayer1 = Player1("player1", "pp1");
const huPlayer2 = Player2("player2", "pp2");
const huPlayer = Player1("player", "hu");
const aiPlayer = Player2("computer", "ai");

let p1 = huPlayer;
let p2 = aiPlayer;

let presentMode = "computer";
let huModeTie = 0;
let aiModeTie = 0;

//GAME BOARD MODULE
const gameBoard = (() => {
	let board = ["X", "O", "", "O", "O", "", "X", "X", "X"];
	let hasWinner = false;

	let startingPlayer = p1;
	let currentPlayer = p1;

	const getCurrentPlayer = () => {
		return currentPlayer;
	};

	const changeCurrentPlayer = () => {
		currentPlayer = currentPlayer === p1 ? p2 : p1;
	};
	const changeStartingPlayer = () => {
		startingPlayer = startingPlayer === p1 ? p2 : p1;
	};
	const resetStartingPlayer = () => {
		startingPlayer = p1;
	};
	const resetCurrentPlayer = () => {
		currentPlayer = p1;
	};

	const checkWin = (board, player) => {
		let winningCombination = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		let winCombo;
		let winStat;
		winningCombination.forEach(([a, b, c]) => {
			if (
				player === board[a] &&
				board[a] === board[b] &&
				board[a] === board[c]
			) {
				winCombo = [a, b, c];
				winStat = true;
			}
		});
		return { winCombo, winStat };
	};

	const isTie = (board) => {
		if (!hasWinner && !haveEmpty()) {
			return true;
		}
		return false;
	};
	const isEmpty = () => {
		return board.every((i) => {
			if (i === "") {
				return true;
			}
		});
	};
	const haveEmpty = () => {
		return board.includes("");
	};
	const getEmptyCells = (board) => {
		cells = [];
		board.forEach((e, index) => {
			if (e === "") {
				cells.push(index);
			}
		});
		return cells;
	};

	const addMark = (index, element) => {
		board.splice(index, 1, currentPlayer.getSign());
		element.classList.add(currentPlayer.addClass());
		element.firstElementChild.classList.add("zoom-in");
		if (click) {
			click.play();
			click.volume = 0.5;
			click.currentTime = 0;
		}
	};

	const updateScore = () => {
		currentPlayer.addScore();
	};

	const showBoard = () => {
		gameView.cells.forEach((element, index) => {
			element.firstChild.textContent = board[index];
		});
	};

	const clearBoard = () => {
		board = ["", "", "", "", "", "", "", "", ""];

		gameView.cells.forEach((element) => {
			element.classList = "gameboard__cell";
			element.firstElementChild.classList = "";
		});
		showBoard();
	};

	const continueGame = () => {
		if (hasWinner || isTie()) {
			changeStartingPlayer();
		}
		currentPlayer = startingPlayer;
		hasWinner = false;
		clearBoard();
		gameView.updateNotif();
		gameView.announcement();
		gameView.removeResult();
		playGame();
	};

	const reloadGame = () => {
		gameView.removeResult();
		resetCurrentPlayer();
		resetStartingPlayer();
	};

	//GAME PLAY SEQUENCE
	const playGame = (index, element) => {
		if (!hasWinner && !isTie(board)) {
			if (currentPlayer.id === "ai") {
				setTimeout(() => {
					let choice = computerChoice(board, currentPlayer);
					if (board[choice] !== "") {
						return;
					}
					addMark(choice, gameView.cells[choice]);

					let hasWon = checkWin(board, currentPlayer.getSign());

					if (hasWon.winStat) {
						gameView.addWinAnimation(hasWon.winCombo);
						gameView.displayResult("win", currentPlayer);
						updateScore();
						hasWinner = true;
						if (roundOver) {
							roundOver.play();
							roundOver.volume = 0.5;
							roundOver.currentTime = 0;
						}
					}
					if (isTie()) {
						if (presentMode === "computer") {
							aiModeTie++;
						} else {
							huModeTie++;
						}
						if (roundOver) {
							roundOver.play();
							roundOver.volume = 0.5;
							roundOver.currentTime = 0;
						}
						gameView.displayResult("tie");
					}
					showBoard();
					changeCurrentPlayer();
					gameView.announcement(hasWinner, isTie());
					gameView.updateNotif(hasWinner, isTie());
					gameView.displayScores();
					playGame();
				}, 2000);
			} else if (
				currentPlayer.id === "hu" ||
				currentPlayer.id === "pp1" ||
				currentPlayer.id === "pp2"
			) {
				let choice = index;
				if (board[choice] !== "") {
					return;
				}
				addMark(choice, element);

				let hasWon = checkWin(board, currentPlayer.getSign());
				if (hasWon.winStat) {
					gameView.addWinAnimation(hasWon.winCombo);
					gameView.displayResult("win", currentPlayer);
					updateScore();
					hasWinner = true;
					if (roundOver) {
						roundOver.play();
						roundOver.volume = 0.5;
						roundOver.currentTime = 0;
					}
				}
				if (isTie()) {
					if (presentMode === "computer") {
						aiModeTie++;
					} else {
						huModeTie++;
					}
					gameView.displayResult("tie");
					if (roundOver) {
						roundOver.play();
						roundOver.volume = 0.5;
						roundOver.currentTime = 0;
					}
				}
				showBoard();
				changeCurrentPlayer();
				gameView.announcement(hasWinner, isTie());
				gameView.updateNotif(hasWinner, isTie());
				gameView.displayScores();
				playGame();
			}
		}
	};

	//COMPUTER LOGIC
	const computerChoice = (newBoard, player) => {
		const select = document.getElementById("difficulty");
		const value = select.options[select.selectedIndex].value;
		const gameCount = aiModeTie + huPlayer.getScore() + aiPlayer.getScore();

		// Difficulty levels
		let percent;
		switch (value) {
			case "easy":
				percent = 4;
				break;
			case "medium":
				percent = 6;
				break;
			case "hard":
				percent = 8;
				break;
			case "cumulative":
				if (gameCount > 10) {
					percent = 8;
				} else if (gameCount > 5) {
					percent = 6;
				} else {
					percent = 4;
				}
				break;
			case "unbeatable":
				percent = 10;
				break;
		}

		// Computer choice
		if (Math.floor(Math.random() * 10) + 1 > percent) {
			choice = randomAi();
		} else {
			choice = minimaxAi(newBoard, player).index;
		}
		return choice;
	};
	const randomAi = () => {
		cells = getEmptyCells(board);
		let move = Math.floor(Math.random() * cells.length);
		return cells[move];
	};
	const minimaxAi = (newBoard, player) => {
		let array = getEmptyCells(newBoard);

		if (checkWin(newBoard, p1.getSign()).winStat) {
			return {
				score: -10,
			};
		} else if (checkWin(newBoard, p2.getSign()).winStat) {
			return {
				score: 10,
			};
		} else if (array.length === 0) {
			return {
				score: 0,
			};
		}

		let moves = [];
		for (let i = 0; i < array.length; i++) {
			let move = {};
			move.index = array[i];

			newBoard[array[i]] = player.getSign();

			if (player.id === "ai") {
				let g = minimaxAi(newBoard, p1);
				move.score = g.score;
			} else {
				let g = minimaxAi(newBoard, p2);
				move.score = g.score;
			}
			newBoard[array[i]] = "";
			moves.push(move);
		}

		let bestMove;
		if (player.id === "ai") {
			let bestScore = -10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			let bestScore = 10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}
		return moves[bestMove];
	};

	//SOUND EFFECT
	let sound = document.querySelector(".option__sound");
	let toggle = 1;
	let click;
	let gameOn;
	let roundOver;
	const toggleSound = () => {
		if (toggle === 1) {
			click = document.querySelector('audio[data-key="1"]');
			gameOn = document.querySelector("audio[data-key='2']");
			roundOver = document.querySelector('audio[data-key="3"]');
			sound.firstElementChild.textContent = "volume_down";

			gameOn.pause();
			gameOn.currentTime = 0;
			toggle = 2;
		} else if (toggle === 3) {
			click = null;
			gameOn = document.querySelector("audio[data-key='2']");
			roundOver = null;

			gameOn.pause();
			gameOn.currentTime = 0;

			sound.firstElementChild.textContent = "volume_off";
			toggle = 1;
		} else if (toggle === 2) {
			toggle = 3;
			click = document.querySelector('audio[data-key="1"]');
			gameOn = document.querySelector("audio[data-key='2']");
			roundOver = document.querySelector('audio[data-key="3"]');

			if (gameOn) {
				gameOn.play();
				gameOn.currentTime = 0.5;
				gameOn.volume = 0.2;
				gameOn.loop = true;
			}
			sound.firstElementChild.textContent = "volume_up";
		}
	};
	toggleSound();

	return {
		isEmpty,
		continueGame,
		reloadGame,
		getCurrentPlayer,
		playGame,
		resetStartingPlayer,
		clearBoard,
		toggleSound,
	};
})();

//GAME VIEW MODULE
const gameView = (() => {
	const cells = Array.from(document.querySelectorAll(".gameboard__cell"));

	const scoreboard = document.querySelector(".scoreboard__players");
	const result = document.querySelector(".result");
	const modal = document.querySelector(".modal");

	const game = document.querySelector(".game");
	const intro = document.querySelector(".intro");

	game.style.display = "none";
	intro.style.display = "block";

	// Show the winner popup
	const displayResult = (cond, player) => {
		result.style.display = "block";
		if (cond === "win") {
			result.firstElementChild.innerHTML = `<p class="result__text--player">${player.getName()}</p>
						<p class="result__text--sign ${player.addClass()}">${player.getSign()}</p>
						<p class="result__text--declare">WINNER!</p> `;
		} else {
			result.firstElementChild.innerHTML = `
						<p class="result__text--sign"><span class=${p1.addClass()}>${p1.getSign()}</span><span class=${p2.addClass()}>${p2.getSign()}</span></p>
						<p class="result__text--declare">DRAW!</p> `;
		}
	};
	// Remove the winner popup
	const removeResult = () => {
		result.style.display = "none";
	};

	// Add blinking animation to the winning cells
	const addWinAnimation = (arr) => {
		cells[arr[0]].firstElementChild.classList = "winners";
		cells[arr[1]].firstElementChild.classList = "winners";
		cells[arr[2]].firstElementChild.classList = "winners";
	};

	// Clear all scores and reload entire game
	const clearScores = () => {
		huModeTie = 0;
		aiModeTie = 0;
		gameBoard.resetStartingPlayer();
		huPlayer.resetScore();
		huPlayer1.resetScore();
		huPlayer2.resetScore();
		aiPlayer.resetScore();
		displayScores();
		gameBoard.continueGame();
		gameBoard.reloadGame();
		gameView.updateNotif();
	};

	// Change the view showing players turn
	const updates = document.querySelector(".updates__text");
	const announcement = (win, draw) => {
		let playerSign = gameBoard.getCurrentPlayer().getSign();
		let playerId = gameBoard.getCurrentPlayer().id;

		if (gameBoard.isEmpty() && playerId === "hu") {
			updates.classList.remove("colorize");
			updates.innerHTML = `<p>Start game</p>`;
		} else if (win || draw) {
			updates.classList.add("colorize");
			updates.innerHTML = `<p>Reload to start next round</p>`;
		} else {
			updates.classList.remove("colorize");
			updates.innerHTML = `<p><span>${playerSign}</span> Turn</p>`;
		}
	};

	// Update the players sign, name, score and current player indicator
	const updateNotif = (hasWinner, tie) => {
		let blink1 = gameBoard.getCurrentPlayer().addClass() === "p1" ? "on" : "";
		let blink2 = gameBoard.getCurrentPlayer().addClass() === "p2" ? "on" : "";
		if (hasWinner || tie) {
			blink1 = "";
			blink2 = "";
		}

		scoreboard.innerHTML = `<div class="scoreboard__player1 ${blink1}">
		<p class='player-name'>${p1
			.getSign()
			.toLowerCase()}|${p1.getName()}</p> <span>${p1.getScore()}</span>
		</div>
		<div class="scoreboard__player2 ${blink2}">
		<p class='player-name'>${p2
			.getSign()
			.toLowerCase()}|${p2.getName()}</p> <span>${p2.getScore()}</span>
		</div>`;
	};

	// Change game play mode between human vs computer or human vs human
	let mode = document.querySelector(".option__players");
	const changeGameMode = () => {
		presentMode = presentMode === "humans" ? "computer" : "humans";
		if (presentMode === "humans") {
			p1 = huPlayer1;
			p2 = huPlayer2;
			mode.firstElementChild.textContent = "group";
			mode.lastElementChild.textContent = "Mode 2";
		} else if (presentMode === "computer") {
			p1 = huPlayer;
			p2 = aiPlayer;
			mode.firstElementChild.textContent = "person";
			mode.lastElementChild.textContent = "Mode 1";
		}
	};

	// Show the game full stats
	let iti = 1;
	const showFullScores = () => {
		background = document.querySelector(".scoreboard__background");
		wrapper = document.querySelector(".scoreboard__wrapper");

		if (iti === 1) {
			background.style.height = "55rem";
			wrapper.style.height = "auto";
			wrapper.style.zIndex = "1";
			document.querySelector(".gameboard").style.zIndex = -1;
			iti = 2;
		} else if (iti === 2) {
			background.style.height = "0";
			wrapper.style.height = "8.5rem";
			iti = 1;
			document.querySelector(".gameboard").style.zIndex = 0;
		}
	};

	// Update the Scores in the full stats
	const displayScores = () => {
		document.querySelector("#aipscore").textContent =
			aiModeTie + huPlayer.getScore() + aiPlayer.getScore();
		document.querySelector("#aitscore").textContent = aiModeTie;
		document.querySelector("#ai1score").textContent = huPlayer.getScore();
		document.querySelector("#ai2score").textContent = aiPlayer.getScore();
		document.querySelector("#hupscore").textContent =
			huModeTie + huPlayer1.getScore() + huPlayer2.getScore();
		document.querySelector("#hutscore").textContent = huModeTie;
		document.querySelector("#hu1score").textContent = huPlayer1.getScore();
		document.querySelector("#hu2score").textContent = huPlayer2.getScore();
	};

	// Change the name of players from settings view
	const changeName = () => {
		if (presentMode === "computer") {
			val = document.querySelector(".player1 input").value;
			if (val !== "") {
				p1.setName(val);
				document.querySelector(".player1 input").value = "";
			}
		} else if (presentMode === "humans") {
			val1 = document.querySelector(".player1 input").value;
			val2 = document.querySelector(".player2 input").value;
			if (val1 !== "") {
				p1.setName(val1);
				document.querySelector(".player1 input").value = "";
			}
			if (val2 !== "") {
				p2.setName(val2);
				document.querySelector(".player2 input").value = "";
			}
		}
	};

	// Change the Setting's (change name) Input to reflect the current game mode
	const inputQuery = () => {
		document.querySelector(
			".player1 label"
		).innerHTML = `${p1.getSign()}|Current Name: ${p1.getName()}`;

		document.querySelector(
			".player2 label"
		).innerHTML = `${p2.getSign()}|Current Name: ${p2.getName()}`;
		if (presentMode === "computer") {
			document.querySelector(".player1").style.display = "block";
			document.querySelector(".player2").style.display = "none";
			document.querySelector(".difficulty").style.display = "flex";

			document.querySelector(".player2 model");
		} else if (presentMode === "humans") {
			document.querySelector(".player1").style.display = "block";
			document.querySelector(".player2").style.display = "block";
			document.querySelector(".difficulty").style.display = "none";
		}
	};

	// Remove Intro view and show Game view to start the game
	const startGame = () => {
		val = document.querySelector("#change-name-hu").value;
		if (val !== "") {
			p1.setName(val);
			document.querySelector("#change-name-hu").value = "";
		}
		game.style.display = "block";
		intro.style.display = "none";
		gameBoard.continueGame();
	};

	announcement();
	updateNotif();
	displayScores();

	// EVENT LISTENERS
	// On Cells click
	cells.forEach((element, index) => {
		element.addEventListener("click", () => {
			if (gameBoard.getCurrentPlayer().id === "ai") {
				return;
			}
			gameBoard.playGame(index, element);
		});
	});
	// On reload button click
	document
		.querySelector(".option__restart")
		.addEventListener("click", gameBoard.continueGame);
	// On mode button click
	document.querySelector(".option__players").addEventListener("click", () => {
		changeGameMode();
		gameBoard.reloadGame();
		gameBoard.continueGame();
	});
	// On reset score button in setting view click
	document.querySelector("#resetscore").addEventListener("click", () => {
		clearScores();
	});
	// On sound button click
	document
		.querySelector(".option__sound")
		.addEventListener("click", gameBoard.toggleSound);
	// On scoreboard click
	document
		.querySelector(".scoreboard")
		.addEventListener("click", showFullScores);

	// On settings button click
	document.querySelector(".setting__btn").addEventListener("click", () => {
		inputQuery();
		if (modal.style.display === "block") {
			modal.style.display = "none";
		} else {
			modal.style.display = "block";
		}
	});
	// On cancel button in setting view
	document.querySelector(".btn-cancel").addEventListener("click", () => {
		modal.style.display = "none";
	});
	// On okay button in setting view
	document.querySelector(".btn-okay").addEventListener("click", () => {
		changeName();
		gameBoard.continueGame();
		modal.style.display = "none";
	});
	// On quit button in setting view
	document.querySelector(".setting .btn-quit").addEventListener("click", () => {
		game.style.display = "none";
		intro.style.display = "block";
		modal.style.display = "none";
		clearScores();
	});
	// On start button in intro view
	document.querySelector(".btn-start").addEventListener("click", startGame);

	return {
		cells,
		announcement,
		updateNotif,
		displayResult,
		removeResult,
		displayScores,
		addWinAnimation,
	};
})();

gameBoard.playGame();
