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
  highlightLastMove(moves.length);
});
function highlightLastMove(viewedIndex) {
  if (moves.length === 0) return;
  let lastMove = moves[viewedIndex - 1];
  let fromSquare = document.getElementById(lastMove.from);
  let toSquare = document.getElementById(lastMove.to);
  fromSquare.classList.add("highlight-last-move");
  toSquare.classList.add("highlight-last-move");
}


document.getElementById('toggle-iswhite').addEventListener('change', function () {
  if (this.checked) {
    isWhiteTurn = true;
  } else {
    isWhiteTurn = false;
  }
  generateFEN(boardSquaresArray, whiteKingMoved,
    whiteQueenMoved, blackKingMoved,
    blackQueenMoved, halfMoveClock,
    fullMoveNumber);
});
document.getElementById('toggle-iswhiteking').addEventListener('change', function () {
  if (this.checked) {
    whiteKingMoved = false;
  } else {
    whiteKingMoved = true;
  }
  generateFEN(boardSquaresArray, whiteKingMoved,
    whiteQueenMoved, blackKingMoved,
    blackQueenMoved, halfMoveClock,
    fullMoveNumber);
});
document.getElementById('toggle-iswhitequeen').addEventListener('change', function () {
  if (this.checked) {
    whiteQueenMoved = false;
  } else {
    whiteQueenMoved = true;
  }
  generateFEN(boardSquaresArray, whiteKingMoved,
    whiteQueenMoved, blackKingMoved,
    blackQueenMoved, halfMoveClock,
    fullMoveNumber);
});
document.getElementById('toggle-isblackking').addEventListener('change', function () {
  if (this.checked) {
    blackKingMoved = false;
  } else {
    blackKingMoved = true;
  }
  generateFEN(boardSquaresArray, whiteKingMoved,
    whiteQueenMoved, blackKingMoved,
    blackQueenMoved, halfMoveClock,
    fullMoveNumber);
});
document.getElementById('toggle-isblackqueen').addEventListener('change', function () {
  if (this.checked) {
    blackQueenMoved = false;
  } else {
    blackQueenMoved = true;
  }
  generateFEN(boardSquaresArray, whiteKingMoved,
    whiteQueenMoved, blackKingMoved,
    blackQueenMoved, halfMoveClock,
    fullMoveNumber);
});
