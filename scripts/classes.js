import { getRandomInt } from "./utils.js";

class Board{

  //Initialize board with the n queens positionated in random places
  constructor(numberOfqueens, width, height, generation, parentA, parentB){
    this.numberOfQueens = numberOfqueens
    this.width = width
    this.height = height
    this.generation = generation

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

  calculateScore(){
    let main_diag_frequency = new Array(2 * this.numberOfQueens).fill(0)
    let secondary_diag_frequency = new Array(2 * this.numberOfQueens).fill(0)

    for(let i = 0; i < this.numberOfQueens; i++){
      main_diag_frequency[this.genes[i] + i] += 1
      secondary_diag_frequency[this.numberOfQueens - this.genes[i] + i] += 1
    }

    let conflicts = 0
    //formula: (N * (N - 1)) / 2
    for(let i = 0; i < (2 * this.numberOfQueens); i++){
      conflicts += (main_diag_frequency[i] * (main_diag_frequency[i]-1)) / 2
      conflicts += (secondary_diag_frequency[i] * (secondary_diag_frequency[i]-1)) / 2
    }

    this.score = conflicts

    return conflicts
  }
}

export {
    Board
};
