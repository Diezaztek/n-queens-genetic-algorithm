import { Board } from "./classes.js";

let solutionDetails

function createModal(queens, genes){
  let resultHTML = `<table class="chessboard">`

  for(let i = 0; i < queens; i++){
    resultHTML += `<tr class="chessboard">`
    for(let j = 0; j < queens; j++){
      resultHTML += `<td id=modal-${i+1}-${j+1} class="chessboard"></td>`
    }
    resultHTML += '</tr>'
  }

  resultHTML += `</table>`
  $('#resultModal').append(resultHTML)
  for(let i = 0; i < genes.length; i++){
    $(`#modal-${i+1}-${parseInt(genes[i])+1}`).append(`<img src="images/wQ.png" class="img-fluid" alt="Responsive image">`)
  }
}

function displaySolutionDetails(){
  $('#resultDetails').append(`<h2>Result details</h2>
                              <br>`)
  let resultDetailsDOM = $('#resultDetails')
  for(let i = 0; i < solutionDetails.length; i++){
    let tableHTML = ` <div class="showDetails" data-toggle="collapse" href="#details${i+1}"
                        type="button" role="button" aria-expanded="false"
                        aria-controls="details${i+1}">
                        <i class="fa-lg fas fa-caret-down"></i>
                        &nbsp;
                        <h4 style="display:inline"> Generation ${i+1} </h4>
                      </div>
                        <div class="collapse" id="details${i+1}">
                        <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">Position</th>
                                <th scope="col">Score</th>
                                <th scope="col">Generation</th>
                                <th scope="col">Genotype</th>
                                <th scope="col">Phenotype</th>
                              </tr>
                            </thead>
                            <tbody>`
    for(let j = 0; j < solutionDetails[i].length; j++){
      tableHTML += `<tr>
                      <th scope="row">${j+1}</th>
                      <td>${solutionDetails[i][j].score}</td>
                      <td>${solutionDetails[i][j].generation}</td>
                      <td class="genes">[${solutionDetails[i][j].genes}]</td>
                      <td>
                        <p class="showModal" type="button" role="button" style="color:#007bff">
                          Show phenotype
                        </p>
                      </td>
                    </tr>`
    }

    tableHTML += `  </tbody>
                  </table>
                </div>
                <br>`

    $('#resultDetails').append(tableHTML)
  }
}


function displayResult(queens, solution, generationsNumber){
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

                            <br>
                            <div id="showResultDetailsContainer" class="container d-flex justify-content-center">
                              <button class="btn btn-primary" id="showResultDetailsButton">Show calculations details</button>
                            </div>

                            <hr>
                            <div class="container" id="resultDetails">
                              <div id="detailsSpinnerLoad" class=""></div>
                              <div id="printingDetails" class="container d-flex justify-content-center">
                            </div>
                      </div>`
  $('#results').append(resultHTML)


  let genes = solution.genes.slice()
  for(let i = 0; i < genes.length; i++){
    $(`#${i+1}-${genes[i]+1}`).append(`<img src="images/wQ.png" class="img-fluid" alt="Responsive image">`)
  }

  $('#numberOfGenerationsNeeded').text(generationsNumber)
  $('#genes').text(`[${genes}]`)

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
        return a.score - b.score;
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

      newGeneration.push(newBoard)
    }

    population = newGeneration

  }

  solutionDetails = historicalPopulation

  return [population[0], generations]

}

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
    $('#runningDetails').empty()
    $('#runningDetails').append(`<p>Calculating solution...</p>`)
    setTimeout(function () {
      var start = new Date().getTime();
      let results = calculateResult(numberOfQueens)
      var end = new Date().getTime()
      var time = end - start
      console.log(results[0])

      displayResult(numberOfQueens, results[0], results[1])
      $('#runningDetails').empty()
      $('#runningDetails').append(`<p>Calculation took ${time/1000} seconds </p>`)
      $('#spinnerLoad').removeClass('pl pl-puzzle')
      $('#calculateButton').attr("disabled", false)

    }, 1000);
  }
});

$(document).on('click', '#showResultDetailsButton', function(){
  $('#detailsSpinnerLoad').addClass('pl pl-puzzle')
  $('#showResultDetailsButton').toggle()
  $('#printingDetails').empty()
  $('#printingDetails').append(`<p>Printing solution details...</p>`)

  setTimeout(function(){
    displaySolutionDetails()
    $('#printingDetails').empty()
    $('#detailsSpinnerLoad').removeClass('pl pl-puzzle')
  }, 1000);
});


$(document).on('click', '.showDetails', function(){
  if($(this).find('svg').attr('class') == 'svg-inline--fa fa-caret-down fa-w-10 fa-lg'){
    $(this).find('svg').attr('class', 'svg-inline--fa fa-caret-right fa-w-10 fa-lg')
  }else{
    $(this).find('svg').attr('class', 'svg-inline--fa fa-caret-down fa-w-10 fa-lg')
  }

});

$(document).on('click', '.showModal', function(){
  var genes = $(this).closest("tr")
                       .find(".genes")
                       .text()
                       .replace('[', '')
                       .replace(']', '')
                       .split(',')
  let numberOfQueens = parseInt($('#numberOfQueens').val())

  $('#resultModal').empty()
  createModal(numberOfQueens, genes)
  $('#detailModal').modal('toggle');

});
