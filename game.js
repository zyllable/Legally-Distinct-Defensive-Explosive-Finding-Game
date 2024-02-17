"use strict";

//generic methods
//inclusively generates number between min and max
const getRandomInt = (max, min = 0) => {
	const delta = max - min;
	return Math.round(Math.random() * delta + min);
}

class Game {
	constructor (height, width, mines) {
		this.height = height;
		this.width = width;
		this.mines = mines;
	}
}

const easyGame = new Game(20, 20, 15);
const mediumGame = new Game(50, 50, 40);
const hardGame = new Game(100, 100, 100);

let createGame = (game) => {
	let columns = []
	for (let i = 0; i < game.width; i++) {
		columns.push(new Array(game.height));
	}

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
					console.log(x, columns[x])
					if (x == -1 || x == game.width) {
						break;
					}

					for (let dy = -1; dy < 2; dy++) {
						let y = row + dy;
						if (y == -1 || y == game.height) {
							break;
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

let playGame = (game, context) => {

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

	const canvas = $("canvas");

	main(canvas);
})