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
	constructor (height, width, mines) {
		this.height = height;
		this.width = width;
		this.mines = mines;
	}
}

let canvas;

const spriteSheet = new Image();
spriteSheet.src = "./sprites.png";

const easyGame = new Game(20, 20, 30);
const mediumGame = new Game(50, 50, 80);
const hardGame = new Game(100, 100, 200);

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
	context.clearRect(0, 0, context.width, context.height);
	for (let column = 0; column < knownGame.length; column++) {
		for (let row = 0; row < knownGame[0].length; row++) {
			context.strokeRect(column * 20, row * 20, 20, 20);
			let tile = knownGame[column][row];
			if (!tile) {
				context.fillRect(column * 20, row * 20, 20, 20);
			} else if (tile > 0) {
				context.drawImage(spriteSheet, (knownGame[column][row] - 1) * 256, 0, 256, 256, column * 20, row * 20, 20, 20)
			} else if (tile == -1) {
				context.drawImage(spriteSheet, 2304, 0, 256, 256, column * 20, row * 20, 20, 20)
			}
		}
	}
	requestAnimationFrame(() => {drawGame(knownGame, context)});
}

let playGame = (gameType, context) => {
	context.strokeStyle = "darkgray";
	context.fillStyle = "lightgray"

	let game = createGame(gameType)

	let knownGame = create2dArray(gameType.width, gameType.height);

	drawGame(knownGame, context); //for testing pass whole game, for gameplay pass only known game

	const revealTile = () => { //reveals tile, if blank reveal tiles around it recursively

	}

	//for panning, add eventlistener after pointerdown if button == 2, remove on pointer up
	//for flag, dont add after pointerup if lasted longer than 250 ms
	canvas.addEventListener()

}

let main = (canvas) => {
	let currentGame = easyGame;
	const ctx = canvas.getContext("2d");
	playGame(currentGame, ctx)
}



let $ = element => document.querySelector(element);

window.addEventListener("load",() => {
	$("#controls").addEventListener("click", (e) => {
		e.currentTarget.className = "invisible";
	})

	canvas = $("canvas");

	canvas.width = window.innerWidth;
		canvas.height = window.innerHeight * .91;

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight * .91;
	})

	main(canvas);
})