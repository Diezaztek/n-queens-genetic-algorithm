const { Board } = require("./libs/classes");

myBoard = new Board(8, 8, 8, boardA, boardB)
myBoard.printBoard()
console.log(myBoard.calculateScore())
