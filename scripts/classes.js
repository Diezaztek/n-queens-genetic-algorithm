import { getRandomInt } from "./utils.js";

class Board{

  //Initialize board with the n queens positionated in random places
  constructor(numberOfqueens, width, height, parentA, parentB){
    this.numberOfQueens = numberOfqueens
    this.width = width
    this.height = height

    if(parentA == undefined && parentB == undefined){
      this.createRandomGenes()
    }else{
      this.createMixedGenes(parentA, parentB)
    }

  }

  createRandomGenes(){
    this.genes = []
    for(let i = 0; i < this.height; i++){
      let randomPosition = getRandomInt(0, this.numberOfQueens - 1)
      if(this.genes.includes(randomPosition)){
        i--
        continue
      }
      this.genes.push(randomPosition)
    }
  }

  createMixedGenes(parentA, parentB){
    this.genes = new Array(this.numberOfQueens).fill(-1)

    let lowerCrossOverIndex = getRandomInt(0, this.numberOfQueens - 2)
    let upperCrossOverIndex = getRandomInt(lowerCrossOverIndex + 1, this.numberOfQueens - 1)

    for(let i = lowerCrossOverIndex; i < upperCrossOverIndex + 1; i++ ){
      this.genes[i] = parentA[i]
    }

    for(let i = 0; i < this.numberOfQueens; i++){
      if(this.genes[i] < 0){
        for(let j = 0; j < parentB.length; j++){
          if(!this.genes.includes(parentB[j])){
            this.genes[i] = parentB[j]
            break
          }else{
            console.log()
          }
        }
      }
    }
  }

  mutate(){
    let firstRandomIndex = getRandomInt(0, this.numberOfQueens - 1)
    let secondRandomIndex = getRandomInt(0, this.numberOfQueens - 1)

    let aux = this.genes[firstRandomIndex]
    this.genes[firstRandomIndex] = this.genes[secondRandomIndex]
    this.genes[secondRandomIndex] = aux

  }


  createBoard(){
    this.createBoard()
    this.board = []
    for(let i = 0; i < this.height; i++){
      let row = []
      for(let j = 0; j < this.width; j++){
        if(j == this.genes[i]){
          row.push(1)
        }else{
          row.push(0)
        }
      }
      this.board.push(row)
    }
  }

  printBoard(){
    for(let i = 0; i < this.width; i++){
      let row = ""
      for(let j = 0; j < this.height; j++){
        row += ` ${this.board[i][j]} `
      }
      console.log(row)
    }
  }

  evaluatePrincipalDiagonal(){
    let points = 0

    let dim = this.width
    for( let k = 0 ; k < dim * 2 ; k++ ) {
      let hasQueen = false
      for( let j = 0 ; j <= k ; j++ ) {
        let i = k - j;
        if( i < dim && j < dim ) {
          if(this.board[i][j] == 1 && hasQueen){
            points++
          }else if(this.board[i][j]){
            hasQueen = true
          }
        }
      }
    }

    return points
  }

  evaluateInverseDiagonal(){
    let points = 0

    for (let n = -this.width; n <= this.width; n++) {
      let hasQueen = false
      for(let i = 0; i < this.height; i++){
        if((i-n>=0)&&(i-n < this.height)){
          if(this.board[i][i-n] == 1 && hasQueen){
            points++
          }else if(this.board[i][i-n]){
            hasQueen = true
          }
        }
      }
    }

    return points
  }

  calculateScore(){
    this.score = this.evaluatePrincipalDiagonal() +
      this.evaluateInverseDiagonal()
    return this.evaluatePrincipalDiagonal() +
      this.evaluateInverseDiagonal()
  }
}

export {
    Board
};
