import { Board } from "./classes.js";


function displayResult(queens, solution, generations, generationsNumber){
  let resultHTML = `<div class="container">
                          <br>

                          <div class="card text-center">
                            <div class="card-header">
                              Solution found!
                            </div>
                            <div class="card-body">
                              <h5 class="card-title">Phenotype</h5>
                              <table class="chessboard">`

  for(let i = 0; i < queens; i++){
    resultHTML += `<tr class="chessboard">`
    for(let j = 0; j < queens; j++){
      resultHTML += `<td id=${i+1}-${j+1} class="chessboard"></td>`
    }
    resultHTML += '</tr>'
  }

  resultHTML += `         </table>
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
                      </div>`
  $('#results').append(resultHTML)


  let genes = solution.genes.slice()
  for(let i = 0; i < genes.length; i++){
    $(`#${i+1}-${genes[i]+1}`).append(`<img src="images/wQ.png" class="img-fluid" alt="Responsive image">`)
  }

  $('#numberOfGenerationsNeeded').text(generationsNumber)
  $('#genes').text(`[${genes}]`)

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
                                <th scope="col">Generation</th>
                                <th scope="col">Genotype</th>
                              </tr>
                            </thead>
                            <tbody>`
    for(let j = 0; j < generations[i].length; j++){
      tableHTML += `<tr>
                      <th scope="row">${j+1}</th>
                      <td>${generations[i][j].score}</td>
                      <td>${generations[i][j].generation}</td>
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


function calculateResult(numberOfQueens){
  const POPULATION_SIZE = 100
  let boardWidth = numberOfQueens
  let boardHeight = numberOfQueens

  let generations = 1

  let population = []
  let historicalPopulation = []
  for(let i = 0; i < POPULATION_SIZE; i++){
    population.push(new Board(numberOfQueens,boardWidth,boardHeight, generations))
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

    generations++

    for(let i = 0; i < subPopulationSize; i++){
      let parentA = moreAdaptedParents[Math.floor(Math.random() * moreAdaptedParents.length)].genes
      let parentB = moreAdaptedParents[Math.floor(Math.random() * moreAdaptedParents.length)].genes

      let newBoard = new Board(numberOfQueens,
                                  boardWidth,
                                  boardHeight,
                                  generations,
                                  parentA,
                                  parentB)
      let probabilityMutate = Math.random()
      if(probabilityMutate > 0.1){
        newBoard.mutate()
      }
      newGeneration.push(newBoard)
    }

    population = newGeneration

  }

  return [population[0], historicalPopulation, generations]

}

$( document ).ready(function() {

});

$('#calculateButton').click(function(e) {
  e.preventDefault()
  $('#calculateButton').attr("disabled", true)
  $('#spinnerLoad').addClass('pl pl-puzzle')
  let numberOfQueens = parseInt($('#numberOfQueens').val())
  if(isNaN(numberOfQueens)){
    alert("Select a valid value")
    $('#spinnerLoad').removeClass('pl pl-puzzle')
    $('#calculateButton').attr("disabled", false)
  }else{
    $('#results').empty()
    setTimeout(function () {
      let results = calculateResult(numberOfQueens)
      $('#calculateButton').attr("disabled", false)
      $('#spinnerLoad').removeClass('pl pl-puzzle')
      displayResult(numberOfQueens, results[0], results[1], results[2])
    }, 2000);
  }


});
