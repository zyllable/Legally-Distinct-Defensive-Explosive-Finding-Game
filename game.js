"use strict";

class Game {
	constructor (height, width, mines) {
		this.height = height;
		this.width = width;
		this.mines = mines;
	}
}

const easyGame = new Game(20, 20, 15)
const mediumGame = new Game(50, 50, 40)
const hardGame = new Game(100, 100, 100)

let createGame = (game) => {
	let columns = []
	for (let i = 0; i < game.width; i++) {
		columns.push(new Array(game.height))
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

	main(canvas)
})