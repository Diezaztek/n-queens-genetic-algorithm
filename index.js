function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Board{

  //Initialize board with the n queens positionated in random places
  constructor(numberOfqueens, width, height){
    this.numberOfQueens = numberOfqueens
    this.width = width
    this.height = height

    this.createBoard()
    this.positionateRandomQueens()

  }

  createBoard(){
     this.board = new Array(this.width).fill(0).map(() =>
        new Array(this.height).fill(0)
      )
  }

  positionateRandomQueens(){
    for(let i = 0; i < this.numberOfQueens; i++){
      let x = getRandomInt(0, this.numberOfQueens - 1)
      let y = getRandomInt(0, this.numberOfQueens - 1)
      if(this.board[x][y] == 1){
        i--
      }else{
        this.board[x][y] = 1
      }
    }
  }

  printBoard(){
    for(let i = 0; i < this.width; i++){
      let row = "|"
      for(let j = 0; j < this.height; j++){
        row += ` ${this.board[i][j]} |`
      }
      console.log(row)
    }
  }

  evaluateHorizontally(){
    let points = 0

    for(let i = 0; i < this.width; i++){
      let hasQueen = false
      for(let j = 0; j < this.height; j++){
        if(this.board[i][j] == 1 && hasQueen){
          points++
        }else if(this.board[i][j]){
          hasQueen = true
        }
      }
    }

    return points
  }

  evaluateVertically(){
    let points = 0

    for(let i = 0; i < this.width; i++){
      let hasQueen = false
      for(let j = 0; j < this.height; j++){
        if(this.board[j][i] == 1 && hasQueen){
          points++
        }else if(this.board[j][i]){
          hasQueen = true
        }
      }
    }

    return points
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
    return [this.evaluateVertically(),
      this.evaluateHorizontally(),
      this.evaluatePrincipalDiagonal(),
      this.evaluateInverseDiagonal()]
  }
}

myBoard = new Board(8, 8, 8)
myBoard.printBoard()
console.log(myBoard.calculateScore())
