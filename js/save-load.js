window.addEventListener("beforeunload", saveGameState);
document.addEventListener("DOMContentLoaded", loadGameState);

function saveGameState() {
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
    recreateHTMLFromPGN(pgn);
    const timerElement = document.getElementById("timer");
    timerElement.innerText = formatTime(seconds);
    timerInterval = setInterval(updateTimer, 1000);
    displayTurn();
    checkForCheckMateAndStaleMate();
  }
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

  setupBoardSquares();
  setupPieces();
}
