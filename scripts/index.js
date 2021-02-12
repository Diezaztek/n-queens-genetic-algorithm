import { Board } from "./classes.js";

const POPULATION_SIZE = 100
const NUMBER_OF_QUEENS = 8
const BOARD_WIDHT = 8
const BOARD_HEIGHT = 8

let generations = 1

let population = []
for(let i = 0; i < POPULATION_SIZE; i++){
  population.push(new Board(NUMBER_OF_QUEENS,BOARD_WIDHT,BOARD_HEIGHT))
}

$( document ).ready(function() {
  while(true){
    //Sort population by attributes
    population.sort(function(a, b) {
        return a.calculateScore() - b.calculateScore();
    });

    //Evaluate if the goal is reached
    if(population[0].calculateScore() == 0){
      break
    }

    let newGeneration = []

    //Elitism: 10% of the best goes to next generation
    let subPopulationSize = Math.trunc(10*POPULATION_SIZE/100)
    for(let i = 0; i < subPopulationSize; i++){
      newGeneration.push(population[i])
    }

    //The remaining will be created fitting the 50% best candidates
    subPopulationSize = Math.trunc(90*POPULATION_SIZE/100)
    let halfPopulationSize = Math.trunc(50*POPULATION_SIZE/100)
    let moreAdaptedParents = []
    for(let i = 0; i < halfPopulationSize; i++){
      moreAdaptedParents.push(population[i])
    }

    for(let i = 0; i < subPopulationSize; i++){
      let parentA = moreAdaptedParents[Math.floor(Math.random() * moreAdaptedParents.length)].genes
      let parentB = moreAdaptedParents[Math.floor(Math.random() * moreAdaptedParents.length)].genes

      let newBoard = new Board(NUMBER_OF_QUEENS,
                                  BOARD_WIDHT,
                                  BOARD_HEIGHT,
                                  parentA,
                                  parentB)
      let probabilityMutate = Math.random()
      if(probabilityMutate > 0.1){
        newBoard.mutate()
      }
      newGeneration.push(newBoard)
    }

    generations++
    population = newGeneration

  }

  let genes = population[0].genes.slice()
  let meaning = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  let positions = {
  }
  for(let i = 0; i < genes.length; i++){
    positions[`${meaning[genes[i]]}${genes.length-i}`] = 'wQ'
  }

  $('#numberOfGenerationsNeeded').text(generations)
  $('#genes').text(genes)

  var board = Chessboard('myBoard', positions)

  console.log("Solution found: ")
  population[0].printBoard()
});
