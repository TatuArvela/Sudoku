/*
  sudoku-solver-js
  Tatu Arvela, 2018
*/

// User interface

var arrowKeys = [37, 38, 39, 40];
var keycodeMap = {
  // Empty
  32:   " ",
  // Number keys
  49:   1,  50:   2,  51:   3,
  52:   4,  53:   5,  54:   6,
  55:   7,  56:   8,  57:   9,
  // Numpad
  97:   1,  98:   2,  99:   3,
  100:  4,  101:  5,  102:  6,
  103:  7,  104:  8,  105:  9,
  // Letters to numbers
  65:   1,  66:   2,  67:   3,
  68:   4,  69:   5,  70:   6,
  71:   7,  72:   8,  73:   9
}
var gridIdToReturnTo = "i81";

function generateInputGrid() {
  for (i = 1; i <= 9; i++) {
    var newRow = document.createElement('div');
    newRow.setAttribute('id', 'row-input-'+i);
    newRow.setAttribute('class', 'row');
    document.getElementById('grid-input').appendChild(newRow);
    for (j = 1; j <= 9; j++) {
      var newCell = document.createElement('input');
      newCell.setAttribute('id', 'i' + (((i - 1) * 9) + j));
      newCell.setAttribute('class', 'cell cell-input');
      newCell.setAttribute('type', 'text');
      newCell.setAttribute('maxlength', 1);
      document.getElementById('row-input-'+i).appendChild(newCell);
    }
  }
}

function generateOutputGrid() {
  for (i = 1; i <= 9; i++) {
    var newRow = document.createElement('div');
    newRow.setAttribute('id', 'row-output-'+i);
    newRow.setAttribute('class', 'row');
    document.getElementById('grid-output').appendChild(newRow);
    for (j = 1; j <= 9; j++) {
      var newCell = document.createElement('input');
      newCell.setAttribute('id', 'o' + (((i - 1) * 9) + j));
      newCell.setAttribute('class', 'cell cell-output');
      newCell.setAttribute('type', 'text');
      newCell.setAttribute('disabled', true);
      newCell.value = " ";
      document.getElementById('row-output-'+i).appendChild(newCell);
    }
  }
}

function registerInputHandlers() {
  var inputCells = document.getElementsByClassName('cell-input');
  for (var i = 0; i < inputCells.length; i++) {
    
    // Arrow controls
    inputCells[i].addEventListener('keydown', function(event) {
      clearError();

      var active = parseInt(document.activeElement.id.substring(1));
      var curr = event.target;
      var currId = parseInt(curr.id.substring(1))
      var prev = document.getElementById('i' + (currId - 1));
      var next = document.getElementById('i' + (currId + 1));

      switch (true) {
        // Movement
        case (event.keyCode === 37): // left
          var next = document.getElementById('i' + (active - 1))
          if (next != null)
            next.focus();
          break;
        case (event.keyCode === 38): // up
          var next = document.getElementById('i' + (active - 9))
          if (next != null)
            next.focus();
          break;
        case (event.keyCode === 39): // right
          var next = document.getElementById('i' + (active + 1))
          if (next != null)
            next.focus();
          break;
        case (event.keyCode === 40): // down
          var next = document.getElementById('i' + (active + 9))
          if (next != null) {
            next.focus();
          }
          else {
            gridIdToReturnTo = 'i' + active;
            document.getElementById('solve').focus();
          }
          break;

        // Blank
        case (event.keyCode == 8 || event.keyCode == 46):
          curr.value = " ";
          setNumberImage(curr, keycodeMap[event.keyCode]);
          checkInputValues();
          if (prev != null) {
            prev.focus();
          }
          break;

        // Numbers
        case (keycodeMap[event.keyCode] != null):
          curr.value = keycodeMap[event.keyCode];
          setNumberImage(curr, keycodeMap[event.keyCode]);
          checkInputValues();
          if (next != null) {
            next.focus();
          }
          event.preventDefault();
          break;
      }
    });
  }
  
  document.getElementById('solve').addEventListener('keydown', function(event) {
    if(event.keyCode === 38) {
      document.getElementById(gridIdToReturnTo).focus();
    }
  });
}

// The solver algorithm needs 15 hints for accurate results
function checkInputValues() {
  var inputCells = document.getElementsByClassName('cell-input');
  var hints = 0;
  for (i = 1; i <= 81; i++) {
    var value = parseInt(inputCells[i-1].value);
    if (value > 0)
      hints++;
  }
  document.getElementById('solve').disabled = (hints < 15);
}

function getInputValues() {
  var input = "";
  for (i = 1; i <= 81; i++) {
    var rawValue = document.getElementById("i" + i).value;
    var value = parseInt(rawValue) || ".";
    input += value;
  }
  return input;
}

function setValues(values, target) {
  var outputValues = values.split("");
  for (i = 1; i <= 81; i++) {
    var value = parseInt(outputValues[i-1]) || " ";
    var element = document.getElementById(target + i);
    element.value = value;
    setNumberImage(element, value);
  }
}

function solveAction() {
  var inputGrid = getInputValues();
  var outputGrid = solve(inputGrid);
  if (!outputGrid)
    showError();
  else
    setValues(outputGrid, "o");
}
document.getElementById("solve").onclick = solveAction;

function setNumberImage(element, value) {
  element.style.backgroundImage = "url('" + value + ".png')";
}

function showError() {
  var inputGrid = document.getElementById("grid-input");
  inputGrid.classList.add("error");
}

function clearError() {
  var inputGrid = document.getElementById("grid-input");
  inputGrid.classList.remove("error");
}

// Solution magic with Kudoku.js
var solver = sudoku_solver();
function solve() {
  document.getElementById("fail").style.opacity = 0;
  document.getElementById("single").style.opacity = 0;
  document.getElementById("multi").style.opacity = 0;
  var solution = solver(getInputValues());
  if (solution.length == 0) {
    document.getElementById("fail").style.opacity = 1;
    console.log("No solutions")
    return false;
  }
  if (solution.length == 1) {
    document.getElementById("single").style.opacity = 1;
    console.log("Unique solution")
  }
  if (solution.length > 1) {
    document.getElementById("multi").style.opacity = 1;
    console.log("Multiple solutions")
  }
  var parsedSolution = solution[0].join('');
  return parsedSolution;
}


// Init

generateInputGrid();
generateOutputGrid();
registerInputHandlers();