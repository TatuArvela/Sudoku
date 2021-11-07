/*
  Sudoku
  Tatu Arvela, 2018
*/

function generateInputGrid() {
  for (let i = 1; i <= 81; i++) {
    const newCell = document.createElement('input');
    newCell.setAttribute('id', i.toString(10));
    newCell.setAttribute('class', 'cell');
    newCell.setAttribute('type', 'text');
    newCell.setAttribute('maxlength', '1');
    document.getElementById('grid').appendChild(newCell);
  }
}

function getCellValues() {
  let input = '';
  for (let i = 1; i <= 81; i++) {
    const rawValue = document.getElementById(i.toString(10)).value;
    const value = (parseInt(rawValue) > 0) ? rawValue : '.';
    input += value;
  }
  return input;
}

function setCellValues(values) {
  const outputValues = values.split('');
  for (let i = 1; i <= 81; i++) {
    let value = parseInt(outputValues[i - 1]) || 0;
    const element = document.getElementById(i.toString(10));
    element.value = value;
    setNumberImage(element, value);
  }
  updateBrainAnimation();
}

function setNumberImage(element, value) {
  if (value > 0)
    element.style.backgroundImage = 'url("' + value + '.png")';
  else
    element.style.backgroundImage = 'none';
}

function hintCount() {
  const cells = document.getElementsByClassName('cell');
  let hints = 0;
  for (let i = 1; i <= 81; i++) {
    const value = parseInt(cells[i - 1].value);
    if (value > 0) {
      hints++;
    }
  }
  return hints;
}

function updateBrainAnimation() {
  const solution = solver(getCellValues(), 10);

  document.getElementById('brain').classList.remove('will-solve');
  document.getElementById('brain').classList.remove('no-solution');
  document.getElementById('brain').classList.remove('single-solution');
  document.getElementById('brain').classList.remove('multiple-solutions');

  if (solution.length === 0) {
    document.getElementById('brain').classList.add('no-solution');
  }
  else {
    if ((hintCount() >= 15) && (hintCount() < 81)) {
      document.getElementById('brain').classList.add('will-solve');
    }

    if (solution.length === 1) {
      document.getElementById('brain').classList.add('single-solution');
    }
    else if (solution.length > 1) {
      document.getElementById('brain').classList.add('multiple-solutions');
    }
  }
}

function hint() {
  const cellValues = getCellValues();
  const hasEmpty = cellValues.indexOf('.');
  if (hasEmpty >= 0) {
    const solution = solver(cellValues, 1);
    if (solution.length > 0) {
      const value = solution[0][activeCell - 1];
      const element = document.getElementById(activeCell);

      element.value = value;
      setNumberImage(element, value);
    }
  }
  updateBrainAnimation();
}

function solve() {
  const solution = solver(getCellValues(), 1);

  if (solution.length === 0) {
    return false;
  }

  const parsedSolution = solution[0].join('');
  setCellValues(parsedSolution);
}

function clear() {
  setCellValues('.'.repeat(81));
}

function newPuzzle() {
  const newPuzzle = generateNewPuzzle();
  setCellValues(newPuzzle);
}

const keycodeMap = {
  // Empty
  32: ' ',
  // Number keys
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5,
  54: 6,
  55: 7,
  56: 8,
  57: 9,
  // Numpad
  97: 1,
  98: 2,
  99: 3,
  100: 4,
  101: 5,
  102: 6,
  103: 7,
  104: 8,
  105: 9,
  // Letters to numbers
  65: 1,
  66: 2,
  67: 3,
  68: 4,
  69: 5,
  70: 6,
  71: 7,
  72: 8,
  73: 9
};

let activeCell = 81;
let activeButton = 'hint';

function handleCellKeypress(event) {
  const active = parseInt(document.activeElement.id);
  const curr = event.target;
  let next;

  switch (true) {
    // Arrow keys
    case (event.keyCode === 37): // left
      next = document.getElementById((active - 1).toString(10));
      if (next != null)
        next.focus();
      break;
    case (event.keyCode === 38): // up
      next = document.getElementById((active - 9).toString(10));
      if (next != null)
        next.focus();
      break;
    case (event.keyCode === 39): // right
      next = document.getElementById((active + 1).toString(10));
      if (next != null)
        next.focus();
      break;
    case (event.keyCode === 40): // down
      next = document.getElementById((active + 9).toString(10));
      if (next != null) {
        next.focus();
      } else {
        activeCell = active;
        document.getElementById(activeButton).focus();
      }
      break;

    // Backspace
    case (event.keyCode === 8 || event.keyCode === 46):
      curr.value = ' ';
      setNumberImage(curr, -1);
      updateBrainAnimation();
      next = document.getElementById((active - 1).toString(10));
      if (next != null) {
        next.focus();
      }
      event.preventDefault();
      break;

    // Numbers
    case (keycodeMap[event.keyCode] != null):
      curr.value = keycodeMap[event.keyCode];
      setNumberImage(curr, keycodeMap[event.keyCode]);
      updateBrainAnimation();
      next = document.getElementById((active + 1).toString(10));
      if (next != null) {
        next.focus();
      }
      event.preventDefault();
      break;

    case (event.keyCode === 27 || event.keyCode === 9 || event.keyCode === 16):
      break;

    default:
      curr.value = ' ';
      setNumberImage(curr, -1);
      break;
  }
}

function registerCellHandlers() {
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < cells.length; i++) {
    cells[i].onkeydown = handleCellKeypress;
    cells[i].addEventListener('focusout', function (event) {
      activeCell = event.target.id;
    });
  }
}

function registerButtonHandlers() {
  document.getElementById('hint').onclick = hint;
  document.getElementById('solve').onclick = solve;
  document.getElementById('clear').onclick = clear;
  document.getElementById('newPuzzle').onclick = newPuzzle;

  const buttons = document.getElementsByClassName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onkeydown = function (event) {
      const active = document.activeElement.id;
      switch (event.keyCode) {
        case 37:
          if (active === 'solve')
            document.getElementById('hint').focus();
          else if (active === 'clear')
            document.getElementById('solve').focus();
          break;

        case 38:
          document.getElementById(activeCell).focus();
          break;

        case 39:
          if (active === 'hint')
            document.getElementById('solve').focus();
          else if (active === 'solve')
            document.getElementById('clear').focus();
          break;
      }
    };

    buttons[i].addEventListener('focusout', function (event) {
      activeButton = event.target.id;
    });
  }
}

generateInputGrid();
registerCellHandlers();
registerButtonHandlers();
updateBrainAnimation();
