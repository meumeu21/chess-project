window.addEventListener("beforeunload", saveGameState);
document.addEventListener("DOMContentLoaded", loadGameState);


function saveGameState() {
  saveHighlightedCells();
  const gameState = {
    isGameStarted: isGameStarted,
    timerInterval: timerInterval,
    seconds: seconds,
    boardSquaresArray: boardSquaresArray,
    positionArray: positionArray,
    moves: moves,
    isWhiteTurn: isWhiteTurn,
    enPassantSquare: enPassantSquare,
    allowMovement: allowMovement,
    currentPosition: currentPosition,
    pgn: pgn,
    alertDisplay: document.getElementById("winning-message").style.display,
    alertMessage: document.getElementById("winning-message").innerText,
    turnDisplay: document.getElementsByClassName("turn")[0].style.display,
  };
  localStorage.setItem('chessGameState', JSON.stringify(gameState));
}

function loadGameState() {
  const savedGameState = localStorage.getItem('chessGameState');
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    isGameStarted = gameState.isGameStarted;
    timerInterval = gameState.timerInterval;
    seconds = gameState.seconds;
    boardSquaresArray = gameState.boardSquaresArray;
    positionArray = gameState.positionArray;
    moves = gameState.moves;
    isWhiteTurn = gameState.isWhiteTurn;
    enPassantSquare = gameState.enPassantSquare;
    allowMovement = gameState.allowMovement;
    currentPosition = gameState.currentPosition;
    pgn = gameState.pgn;

    renderChessBoard(boardSquaresArray);
    restoreHighlightedCells();
    recreateHTMLFromPGN(pgn);
    if (positionArray.length != 0) highlightMove(positionArray.length - 1);
    displayTurn();
    checkForCheckMateAndStaleMate();
    document.getElementById("winning-message").style.display = gameState.alertDisplay || "none";
    document.getElementById("winning-message").innerText = gameState.alertMessage;
    document.getElementsByClassName("turn")[0].style.display = gameState.turnDisplay || "none";
    loadTime();
  }
}

function saveHighlightedCells() {
  const highlightedCells = Array.from(document.querySelectorAll(".highlight-last-move"))
    .map(cell => cell.id);
  localStorage.setItem("highlightedCells", JSON.stringify(highlightedCells));
}

function restoreHighlightedCells() {
  const highlightedCells = JSON.parse(localStorage.getItem("highlightedCells")) || [];
  highlightedCells.forEach(cellId => {
    const cell = document.getElementById(cellId);
    if (cell) {
      cell.classList.add("highlight-last-move");
    }
  });
}

function renderChessBoard(boardSquaresArray) {
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

  boardSquaresArray.forEach(pos => {
    const square = document.getElementById(pos.squareId);

    if (pos.pieceType != "blank") {
      const piece = document.createElement("div");
      piece.classList.add("piece", pos.pieceType);
      piece.setAttribute("color", pos.pieceColor);
      const img = document.createElement("img");
      img.src = `static/chess-pieces/${pos.pieceType}-${pos.pieceColor[0]}.svg`;
      img.alt = `${pos.pieceColor[0]}${pos.pieceType}`;
      piece.appendChild(img);
      square.appendChild(piece);
    }
  });

  // if (highlightedArray.length != 0) {
  //   highlightedArray.forEach(pos => {
  //     const square = document.getElementById(pos.squareId);
  //     square.classList.add("highlight-last-move");
  //   })
  // }

  setupBoardSquares();
  setupPieces();
}
