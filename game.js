"use strict";

//generic methods
//inclusively generates number between min and max
const getRandomInt = (max, min = 0) => {
	const delta = max - min;
	return Math.round(Math.random() * delta + min);
}
const create2dArray = (x, y) => {
	let array = []
	for (let i = 0; i < x; i++) {
		array.push(new Array(y));
	}
	return array;
}

class Game {
	constructor (width, height, mines) {
		this.height = height;
		this.width = width;
		this.mines = mines;
	}
}

let canvas;
let game;
let knownGame;

const spriteSheet = new Image();
spriteSheet.src = "./sprites.png";

let zoom = 1;
let pan = false;
let xOffset = 0;
let yOffset = 0;

const easyGame = new Game(20, 20, 50);
const mediumGame = new Game(30, 30, 150);
const hardGame = new Game(50, 50, 700);

let createGame = (game) => {
	let columns = create2dArray(game.width, game.height)

	//lay mines
	let i = 0
	while (i < game.mines) {
		let x = getRandomInt(game.width - 1);
		let y = getRandomInt(game.height - 1);
		if (!columns[x][y]) {
			columns[x][y] = -1; //-1 means mine, other numbers will be mines around
			i++;
		}
	}

	//count numbers
	for (let column in columns) {
		column = Number(column)
		for (let row in columns) {
			row = Number(row)
			if (columns[column][row] == -1) {
				for (let dx = -1; dx < 2; dx++) {
					let x = column + dx;
					if (x == -1 || x == game.width) {
						continue;
					}

					for (let dy = -1; dy < 2; dy++) {
						let y = row + dy;
						if (y == -1 || y == game.height) {
							continue;
						}

						if (columns[x][y] != -1) {
							if (!columns[x][y]) {
								columns[x][y] = 1;
							} else {
								columns[x][y]++;
							}
						}
					}
				}
			}
		}
	}

	return columns;
}

let drawGame = (knownGame, context) => {
	let width = 20 * zoom;
	context.strokeStyle = "darkgray";
	context.fillStyle = "lightgray"
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let column = 0; column < knownGame.length; column++) {
		let x = column * (width) + xOffset;

		for (let row = 0; row < knownGame[0].length; row++) {
			let y = row * (width) + yOffset

			context.strokeRect(x, y, width, width);
			let tile = knownGame[column][row];
			if (!tile) {
				context.fillRect(x, y, width, width);
			} else if (tile > 0) {
				context.drawImage(spriteSheet, (knownGame[column][row] - 1) * 256, 0, 256, 256, x, y, width, width)
			} else if (tile == -1) {
				context.drawImage(spriteSheet, 2304, 0, 256, 256, x, y, width, width)
			}
		}
	}
	requestAnimationFrame(() => {drawGame(knownGame, context)});
}

let playGame = (gameType, context) => {

	game = createGame(gameType)

	knownGame = create2dArray(gameType.width, gameType.height);

	drawGame(knownGame, context); //for testing pass whole game, for gameplay pass only known game

	const revealTile = (x, y) => { //reveals tile, if blank reveal tiles around it recursively
		if ( x < 0 || x >= game.length || y < 0 || y >= game[0].length || knownGame[x][y]) {
			return;
		}
		if (game[x][y] == undefined) {
			knownGame[x][y] = -3;
			//todo: recursively check around
			for (let dx = -1; dx < 2; dx++) {
				let x1 = x + dx;
				if (x1 == -1 || x1 == game.width) {
					continue;
				}

				for (let dy = -1; dy < 2; dy++) {
					let y1 = y + dy;
					if (y1 == -1 || y1 == game.height) {
						continue;
					}
					revealTile(x1, y1);
				}
			}
		} else if (game[x][y] == -1) {
			for (let x1 = 0; x1 < game.length; x1++) {
				for (let y1 = 0; y1 < game[0].length; y1++) {
					if (!game[x1][y1]) {
						knownGame[x1][y1] = -3;
					} else {
						knownGame[x1][y1] = game[x1][y1];
					}
				}
			}
			//if mine, reveal entire screen
		} else {
			knownGame[x][y] = game[x][y];
		}
	}

	const placeFlag = (x, y) => {
		if ( x < 0 || x >= game.length || y < 0 || y >= game[0].length || (knownGame[x][y] && knownGame[x][y] != 9)) {
			return;
		}
		if(!knownGame[x][y]) {
			knownGame[x][y] = 9;
		} else if (knownGame[x][y] == 9) {
			knownGame[x][y] = undefined;
		}
	}

	canvas.addEventListener("pointerup", (event) => {
		if (!pan) {
			let column = Math.floor((event.clientX - xOffset) / (20 * zoom)) //inverse of column to coords
			let row = Math.floor(((event.clientY - window.innerHeight * .09) - yOffset) / (20 * zoom))
			if (event.button == 0) {
				revealTile(column, row);
			} else if (event.button == 2) {
				placeFlag(column, row);
			}
		}
	})

}

let $ = element => document.querySelector(element);

window.addEventListener("load",() => {
	$("#controls").addEventListener("click", (e) => {
		e.currentTarget.className = "invisible";
	})

	canvas = $("#theCanvas");

	canvas.width = window.innerWidth;
		canvas.height = window.innerHeight * .91;

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight * .91;
	})

	//let pan = false;
	let panTimeout;

	let prevX = 0;
	let prevY = 0;

	canvas.addEventListener("contextmenu", (event) => {
		event.preventDefault();
	})

	canvas.addEventListener("pointerdown", (event) => {
		prevX = event.clientX;
		prevY = event.clientY;
		if (event.button == 0) {
			panTimeout = setTimeout(() => {pan = true}, 250);
		}
	});

	canvas.addEventListener("pointerup", (event) => {
		setTimeout(() => { //delays to next event loop so revealing tiles doesnt get fired as well
			if (event.button == 0) {
				clearTimeout(panTimeout);
				pan = false;
			}
		}, 1)
	});



	canvas.addEventListener("pointermove", (event) => {
		if (pan == true) {
			xOffset += event.clientX - prevX;
			yOffset += event.clientY - prevY;
			prevX = event.clientX;
			prevY = event.clientY;
		}
	});

	window.addEventListener("keydown", (event) => {
		if (event.code == "Equal") {
			zoom *= (4/3);
		}
		if (event.code == "Minus") {
			zoom *= .75;
		}
	});

	$("#easy").addEventListener("click", () => {
		playGame(easyGame, ctx);
	})
	$("#medium").addEventListener("click", () => {
		playGame(mediumGame, ctx);
	})
	$("#hard").addEventListener("click", () => {
		playGame(hardGame, ctx);
	})
	$("#custom").addEventListener("click", () => {
		playGame(new Game(Number(prompt("Width")), Number(prompt("Height")), Number(prompt("Mines"))), ctx);
	})

	const ctx = canvas.getContext("2d");
	playGame(easyGame, ctx)
})