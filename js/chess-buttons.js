stepBackward.addEventListener("click",()=>{
  moveBackward();
});
stepForward.addEventListener("click",()=>{
  moveForward();
});
fastBackward.addEventListener("click",()=>{
  moveToStart();
});
fastForward.addEventListener("click",()=>{
  moveToEnd();
});

function moveBackward() {
  if(viewedIndex>0) {
    viewedIndex--;
    viewedIndex>0 ?  highlightMove(viewedIndex) : {};
    allowMovement = false;
  }
  updatePosition();
}
function moveForward() {
  if(viewedIndex < positionArray.length-1) {
    viewedIndex++;
    highlightMove(viewedIndex);
    updatePosition();
  }
  if(viewedIndex === positionArray.length-1)
    allowMovement = true;
}
function moveToStart() {
  if(viewedIndex >=0) {
    viewedIndex =1;
    highlightMove(1);
    updatePosition();
  }
  allowMovement = false;
}
function moveToEnd() {
  if(viewedIndex>=0) {
    viewedIndex = positionArray.length-1;
    updatePosition();
  }
  if(viewedIndex>0)
    highlightMove(viewedIndex);
  allowMovement = true;
}

function highlightMove(viewedIndex) {
  let moveElement = document.getElementById(viewedIndex-1);
  clearHighlight();
  highlightLastMove(viewedIndex);
  document.querySelectorAll(".highlighted").forEach(element=>{
    element.classList.remove("highlighted");
  });
  if (moveElement) {
    moveElement.classList.add("highlighted");
  }
}
function updatePosition() {
  viewedFEN = positionArray[viewedIndex];
  loadPositionFromFEN(viewedFEN);
}

function loadPositionFromFEN(fen) {
  const pieceMap = {
    'p': 'pawn',
    'r': 'rook',
    'n': 'knight',
    'b': 'bishop',
    'q': 'queen',
    'k': 'king',
    'P': 'pawn',
    'R': 'rook',
    'N': 'knight',
    'B': 'bishop',
    'Q': 'queen',
    'K': 'king'
  };

  const rows = fen.split(' ')[0].split('/');
  const board = document.getElementById('chess-board');

  clearBoard();

  rows.forEach((row, rowIndex) => {
    let columnIndex = 0;
    for (const char of row) {
      if (isNaN(char)) {
        const pieceType = pieceMap[char];
        const color = char === char.toUpperCase() ? 'white' : 'black';
        const squareId = String.fromCharCode(97 + columnIndex) + (8 - rowIndex);

        const piece = createChessPiece(pieceType, color, "piece") ;

        const square = document.getElementById(squareId);
        square.appendChild(piece);

        columnIndex++;
      } else {
        columnIndex += parseInt(char);
      }
    }
  });
  setupPieces();
  boardSquaresArray = [];
  fillBoardSquaresArray();
}

function clearBoard() {
  for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].innerHTML = '';

    if (i >= 56) {
      const fileLabel = document.createElement("div");
      fileLabel.classList.add("coordinate");
      fileLabel.innerText = files[i % 8];
      boardSquares[i].appendChild(fileLabel);
    }

    if ((i + 1) % 8 == 0) {
      const rankLabel = document.createElement("div");
      rankLabel.classList.add("coordinate", "rank");
      rankLabel.innerText = ranks[7 - Math.floor(i / 8)];
      boardSquares[i].appendChild(rankLabel);
    }
  }
}

function showAlert(message) {
  const alert= document.getElementById("winning-message");
  const turn = document.getElementsByClassName("turn")[0];
  alert.innerHTML=message;
  alert.style.display="block";
  turn.style.display = "none";
}


function updateTimer() {
  seconds++;
  const timerElement = document.getElementById("timer");
  timerElement.innerText = formatTime(seconds);
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function checkAndStartGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    seconds = 0;
    timerInterval = setInterval(updateTimer, 1000);
  }
}
function endGame() {
  clearInterval(timerInterval);
  isGameStarted = false;
}
function loadTime() {
  const timerElement = document.getElementById("timer");
  if (document.getElementById("winning-message").style.display != "block") {
    if (isGameStarted) {
      timerElement.innerText = formatTime(seconds);
      timerInterval = setInterval(updateTimer, 1000);
    } else {
      seconds = 0;
      timerElement.innerText = "00:00";
    }
  } else {
    timerElement.innerText = formatTime(seconds);
  }
}

function highlightPossibleMoves(legalSquares) {
  legalSquares.forEach((squareId) => {
    const square = document.getElementById(squareId);
    if (square) {
      square.classList.add("highlight");
    }
  });
}
function clearHighlight() {
  Array.from(boardSquares).forEach((square) => {
    square.classList.remove("highlight");
    square.classList.remove("highlight-last-move");
  });
}
chessBoard.addEventListener("drop", () => {
  clearHighlight();
  highlightLastMove(viewedIndex);
});
function highlightLastMove(viewedIndex) {
  if (moves.length === 0) return;
  let lastMove = moves[viewedIndex - 1];
  let fromSquare = document.getElementById(lastMove.from);
  let toSquare = document.getElementById(lastMove.to);
  fromSquare.classList.add("highlight-last-move");
  toSquare.classList.add("highlight-last-move");
}

function displayTurn() {
  let turnText = document.getElementById("turn");
  turnText.innerText = isWhiteTurn ? "белых" : "чёрных";
}
