import { Board } from "./classes.js";

const POPULATION_SIZE = 100
const NUMBER_OF_QUEENS = 8
const BOARD_WIDHT = 8
const BOARD_HEIGHT = 8

let generations = 0

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

    newGeneration = []

    //Elitism: 10% of the best goes to next generation
    subPopulationSize = Math.trunc(10*POPULATION_SIZE/100)
    for(let i = 0; i < subPopulationSize; i++){
      newGeneration.push(population[i])
    }

    //The remaining will be created fitting the 50% best candidates
    subPopulationSize = Math.trunc(90*POPULATION_SIZE/100)
    halfPopulationSize = Math.trunc(50*POPULATION_SIZE/100)
    moreAdaptedParents = []
    for(let i = 0; i < halfPopulationSize; i++){
      moreAdaptedParents.push(population[i])
    }

    for(let i = 0; i < subPopulationSize; i++){
      parentA = moreAdaptedParents[Math.floor(Math.random() * moreAdaptedParents.length)].genes
      parentB = moreAdaptedParents[Math.floor(Math.random() * moreAdaptedParents.length)].genes

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

  console.log("Solution found: ")
  population[0].printBoard()
  console.log(`Generations needed: ${generations}`)
});
