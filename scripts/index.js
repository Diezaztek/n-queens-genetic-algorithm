import { Board } from "./classes.js";


function displayResult(solution, generations, generationsNumber){
  $('#results').append(`<div class="container">
                          <br>

                          <div class="card text-center">
                            <div class="card-header">
                              Solution found!
                            </div>
                            <div class="card-body">
                              <h5 class="card-title">Phenotype</h5>
                              <div id="myBoard" style="width: 400px;
                              text-align:center
                              display: block;
                              margin-left: auto;
                              margin-right: auto;"
                              ></div>
                              <hr>
                              <h5 class="card-title">Genotype</h5>
                              <p class="card-text"><span id="genes"></span></p>
                            </div>
                            <div class="card-footer text-muted">
                              Generations needed: <span id="numberOfGenerationsNeeded"></span>
                            </div>
                          </div>

                          <hr>
                          <div class="container" id="resultDetails">
                            <h2>Result details</h2>
                            <br>
                          </div>

                        </div>`)


    let genes = solution.genes.slice()
    let meaning = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    let positions = {
    }
    for(let i = 0; i < genes.length; i++){
      positions[`${meaning[genes[i]]}${genes.length-i}`] = 'wQ'
    }

    $('#numberOfGenerationsNeeded').text(generationsNumber)
    $('#genes').text(`[${genes}]`)

    var board = Chessboard('myBoard', positions)

    let resultDetailsDOM = $('#resultDetails')
    for(let i = 0; i < generations.length; i++){
      let tableHTML = ` <div class="showDetails" data-toggle="collapse" href="#details${i+1}"
                          type="button" role="button" aria-expanded="false"
                          aria-controls="details${i+1}">
                          <h4 style="display:inline"> Generation ${i+1} </h4>
                          &nbsp;
                          <i class="fa-lg fas fa-caret-down"></i>
                        </div>
                          <div class="collapse" id="details${i+1}">
                          <table class="table">
                              <thead>
                                <tr>
                                  <th scope="col">Position</th>
                                  <th scope="col">Score</th>
                                  <th scope="col">Genotype</th>
                                </tr>
                              </thead>
                              <tbody>`
      for(let j = 0; j < generations[i].length; j++){
        tableHTML += `<tr>
                        <th scope="row">${j+1}</th>
                        <td>${generations[i][j].score}</td>
                        <td>[${generations[i][j].genes}]</td>
                      </tr>`
      }

      tableHTML += `  </tbody>
                    </table>
                  </div>
                  <br>`

      $('#resultDetails').append(tableHTML)
    }
}


function calculateResult(){
  const POPULATION_SIZE = 100
  const NUMBER_OF_QUEENS = 8
  const BOARD_WIDHT = 8
  const BOARD_HEIGHT = 8

  let generations = 1

  let population = []
  let historicalPopulation = []
  for(let i = 0; i < POPULATION_SIZE; i++){
    population.push(new Board(NUMBER_OF_QUEENS,BOARD_WIDHT,BOARD_HEIGHT))
  }

  while(true){
    //Sort population by attributes
    population.sort(function(a, b) {
        return a.calculateScore() - b.calculateScore();
    });

    historicalPopulation.push(population)

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

  return [population[0], historicalPopulation, generations]

}

$( document ).ready(function() {

});

$('#calculateButton').click(function(e) {
  e.preventDefault()
  $('#spinnerLoad').addClass('pl pl-puzzle')
  $('#results').empty()
  setTimeout(function () {
    let results = calculateResult()
    $('#spinnerLoad').removeClass('pl pl-puzzle')
    displayResult(results[0], results[1], results[2])
  }, 2000);

});
