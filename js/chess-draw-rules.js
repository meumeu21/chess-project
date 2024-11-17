function isMoveValidAgainstCheck(
  legalSquares,
  startingSquareId,
  pieceColor,
  pieceType
) {
  let kingSquare = isWhiteTurn
    ? getkingLastMove("white")
    : getkingLastMove("black");
  let boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
  let legalSquaresCopy = legalSquares.slice();
  legalSquaresCopy.forEach((element) => {
    let destinationId = element;
    boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
    updateBoardSquaresArray(
      startingSquareId,
      destinationId,
      boardSquaresArrayCopy
    );
    if (
      pieceType != "king" &&
      isKingInCheck(kingSquare, pieceColor, boardSquaresArrayCopy)
    ) {
      legalSquares = legalSquares.filter((item) => item != destinationId);
    }
    if (
      pieceType == "king" &&
      isKingInCheck(destinationId, pieceColor, boardSquaresArrayCopy)
    ) {
      legalSquares = legalSquares.filter((item) => item != destinationId);
    }
  });
  return legalSquares;
}
function checkForEndGame() {
  checkForCheckMateAndStaleMate();
  let currentPosition = generateFEN(boardSquaresArray);
  positionArray.push(currentPosition);
  viewedIndex = positionArray.length -1;
  let threeFoldRepetition = isThreefoldRepetition();
  let insufficientMaterial = hasInsufficientMaterial(currentPosition);
  let fiftyMovesRuleCount = currentPosition.split(" ")[4];
  let fiftyMovesRule = fiftyMovesRuleCount != 50 ? false : true;
  let isDraw = threeFoldRepetition || insufficientMaterial || fiftyMovesRule;
  if (isDraw) {
    allowMovement = false;
    let message = "ничья"
    showAlert(message);
    endGame();

    document.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
    document.addEventListener("drop", function (event) {
      event.preventDefault();
    });
  }
}

function getFiftyMovesRuleCount() {
  let count = 0;
  for (let i = 0; i < moves.length; i++) {
    count++;
    if (
      moves[i].captured ||
      moves[i].pieceType === "pawn" ||
      moves[i].promotedTo != "blank"
    )
      count = 0;
  }
  return count;
}
function isThreefoldRepetition() {
  return positionArray.some((string) => {
    const fen = string.split(" ").slice(0, 4).join(" ");
    return (
      positionArray.filter(
        (element) => element.split(" ").slice(0, 4).join(" ") === fen
      ).length >= 3
    );
  });
}
function hasInsufficientMaterial(fen) {
  const piecePlacement = fen.split(" ")[0];

  const whiteBishops = piecePlacement
    .split("")
    .filter((char) => char === "B").length;
  const blackBishops = piecePlacement
    .split("")
    .filter((char) => char === "b").length;
  const whiteKnights = piecePlacement
    .split("")
    .filter((char) => char === "N").length;
  const blackKnights = piecePlacement
    .split("")
    .filter((char) => char === "n").length;
  const whiteQueens = piecePlacement
    .split("")
    .filter((char) => char === "Q").length;
  const blackQueens = piecePlacement
    .split("")
    .filter((char) => char === "q").length;
  const whiteRooks = piecePlacement
    .split("")
    .filter((char) => char === "R").length;
  const blackRooks = piecePlacement
    .split("")
    .filter((char) => char === "r").length;
  const whitePawns = piecePlacement
    .split("")
    .filter((char) => char === "P").length;
  const blackPawns = piecePlacement
    .split("")
    .filter((char) => char === "p").length;

  if (
    whiteQueens +
      blackQueens +
      whiteRooks +
      blackRooks +
      whitePawns +
      blackPawns >
    0
  ) {
    return false;
  }

  if (whiteKnights + blackKnights > 1) {
    return false;
  }
  if (whiteKnights + blackKnights > 1) {
    return false;
  }

  if ((whiteBishops > 0 || blackBishops > 0) && whiteKnights + blackKnights > 0)
    return false;

  if (whiteBishops > 1 || blackBishops > 1) return false;

  if (whiteBishops === 1 && blackBishops === 1) {
    let whiteBishopSquareColor, blackBishopSquareColor;

    let whiteBishopSquare = boardSquaresArray.find(
      (element) =>
        element.pieceType === "bishop" && element.pieceColor === "white"
    );
    let blackBishopSquare = boardSquaresArray.find(
      (element) =>
        element.pieceType === "bishop" && element.pieceColor === "black"
    );

    whiteBishopSquareColor = getSqaureColor(whiteBishopSquare.squareId);
    blackBishopSquareColor = getSqaureColor(blackBishopSquare.squareId);

    if (whiteBishopSquareColor !== blackBishopSquareColor) {
      return false;
    }
  }
  return true;
}
