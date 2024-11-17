function performCastling(
  piece,
  pieceColor,
  startingSquareId,
  destinationSquareId,
  boardSquaresArray
) {
  let rookId, rookDestinationSquareId, checkSquareId;
  if (destinationSquareId == "g1") {
    rookId = "rookh1";
    rookDestinationSquareId = "f1";
    checkSquareId = "f1";
  } else if (destinationSquareId == "c1") {
    rookId = "rooka1";
    rookDestinationSquareId = "d1";
    checkSquareId = "d1";
  } else if (destinationSquareId == "g8") {
    rookId = "rookh8";
    rookDestinationSquareId = "f8";
    checkSquareId = "f8";
  } else if (destinationSquareId == "c8") {
    rookId = "rooka8";
    rookDestinationSquareId = "d8";
    checkSquareId = "d8";
  }
  if (isKingInCheck(checkSquareId, pieceColor, boardSquaresArray)) return;
  let rook = document.getElementById(rookId);
  let rookDestinationSquare = document.getElementById(rookDestinationSquareId);
  rookDestinationSquare.appendChild(rook);
  updateBoardSquaresArray(
    rook.id.slice(-2),
    rookDestinationSquare.id,
    boardSquaresArray
  );

  const destinationSquare = document.getElementById(destinationSquareId);
  destinationSquare.appendChild(piece);
  isWhiteTurn = !isWhiteTurn;
  updatePGN(startingSquareId, destinationSquareId, isWhiteTurn);
  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray
  );
  let captured = false;
  makeMove(startingSquareId, destinationSquareId, "king", pieceColor, captured);

  displayTurn();
  checkForEndGame();
  return;
}
function performEnPassant(
  piece,
  pieceColor,
  startingSquareId,
  destinationSquareId
) {
  let file = destinationSquareId[0];
  let rank = parseInt(destinationSquareId[1]);
  rank += pieceColor === "white" ? -1 : 1;
  let squareBehindId = file + rank;

  const squareBehindElement = document.getElementById(squareBehindId);
  while (squareBehindElement.firstChild) {
    squareBehindElement.removeChild(squareBehindElement.firstChild);
  }

  let squareBehind = boardSquaresArray.find(
    (element) => element.squareId === squareBehindId
  );
  squareBehind.pieceColor = "blank";
  squareBehind.pieceType = "blank";
  squareBehind.pieceId = "blank";

  const destinationSquare = document.getElementById(destinationSquareId);
  destinationSquare.appendChild(piece);
  isWhiteTurn = !isWhiteTurn;
  updatePGN(startingSquareId, destinationSquareId, isWhiteTurn);
  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray
  );
  let captured = true;
  makeMove(startingSquareId, destinationSquareId, "pawn", pieceColor, captured);
  enPassantSquare = "blank";

  displayTurn();
  checkForEndGame();
  return;
}

function displayPromotionChoices(
  pieceId,
  pieceColor,
  startingSquareId,
  destinationSquareId,
  captured
) {
  let file = destinationSquareId[0];
  let rank = parseInt(destinationSquareId[1]);
  let rank1 = pieceColor === "white" ? rank - 1 : rank + 1;
  let rank2 = pieceColor === "white" ? rank - 2 : rank + 2;
  let rank3 = pieceColor === "white" ? rank - 3 : rank + 3;

  let squareBehindId1 = file + rank1;
  let squareBehindId2 = file + rank2;
  let squareBehindId3 = file + rank3;

  const destinationSquare = document.getElementById(destinationSquareId);
  const squareBehind1 = document.getElementById(squareBehindId1);
  const squareBehind2 = document.getElementById(squareBehindId2);
  const squareBehind3 = document.getElementById(squareBehindId3);

  const pawnSquare = squareBehind1.querySelector("div");
  pawnSquare.style.display = 'none';

  let piece1 = createChessPiece("queen", pieceColor, "promotionOption");
  let piece2 = createChessPiece("knight", pieceColor, "promotionOption");
  let piece3 = createChessPiece("rook", pieceColor, "promotionOption");
  let piece4 = createChessPiece("bishop", pieceColor, "promotionOption");

  destinationSquare.appendChild(piece1);
  squareBehind1.appendChild(piece2);
  squareBehind2.appendChild(piece3);
  squareBehind3.appendChild(piece4);

  let promotionOptions = document.getElementsByClassName("promotionOption");
  for (let i = 0; i < promotionOptions.length; i++) {
    let pieceType = promotionOptions[i].classList[1];
    promotionOptions[i].addEventListener("click", function () {
      performPromotion(
        pieceId,
        pieceType,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        captured
      );
    });
  }
}

function createChessPiece(pieceType, color, pieceClass) {
  let pieceName =
    pieceType.slice() +
    "-" +
    color.charAt(0) +
    ".svg";
  let pieceDiv = document.createElement("div");
  pieceDiv.className = `${pieceClass} ${pieceType}`;
  pieceDiv.setAttribute("color", color);
  let img = document.createElement("img");
  img.src = "static/chess-pieces/" + pieceName;
  img.alt = pieceType;
  pieceDiv.appendChild(img);
  return pieceDiv;
}

chessBoard.addEventListener("click", clearPromotionOptions);

function clearPromotionOptions() {
  for (let i = 0; i < boardSquares.length; i++) {
    let style = getComputedStyle(boardSquares[i]);
    let backgroundColor = style.backgroundColor;
    let rgbaColor = backgroundColor.replace("0.5)", "1)");
    boardSquares[i].style.backgroundColor = rgbaColor;
    boardSquares[i].style.opacity = 1;

    if (boardSquares[i].querySelector(".piece"))
      boardSquares[i].querySelector(".piece").style.opacity = 1;
  }
  let elementsToRemove = chessBoard.querySelectorAll(".promotionOption");
  elementsToRemove.forEach(function (element) {
    element.parentElement.removeChild(element);
  });
  allowMovement = true;
}

function updateBoardSquaresOpacity(startingSquareId) {
  for (let i = 0; i < boardSquares.length; i++) {
    if (boardSquares[i].id == startingSquareId)
      boardSquares[i].querySelector(".piece").style.opacity = 0;

    if (!boardSquares[i].querySelector(".promotionOption")) {
      boardSquares[i].style.opacity = 0.5;
    } else {
      let style = getComputedStyle(boardSquares[i]);
      let backgroundColor = style.backgroundColor;
      let rgbaColor = backgroundColor
        .replace("rgb", "rgba")
        .replace(")", ",0.5)");
      boardSquares[i].style.backgroundColor = rgbaColor;

      if (boardSquares[i].querySelector(".piece"))
        boardSquares[i].querySelector(".piece").style.opacity = 0;
    }
  }
}

function performPromotion(
  pieceId,
  pieceType,
  pieceColor,
  startingSquareId,
  destinationSquareId,
  captured
) {
  clearPromotionOptions();
  promotionPiece = pieceType;
  piece = createChessPiece(pieceType, pieceColor, "piece");

  piece.addEventListener("dragstart", drag);
  piece.setAttribute("draggable", true);
  piece.firstChild.setAttribute("draggable", false);
  piece.id = pieceType + pieceId;

  const startingSquare = document.getElementById(startingSquareId);
  while (startingSquare.firstChild) {
    startingSquare.removeChild(startingSquare.firstChild);
  }
  const destinationSquare = document.getElementById(destinationSquareId);

  if (captured) {
    let children = destinationSquare.children;
    for (let i = 0; i < children.length; i++) {
      if (!children[i].classList.contains("coordinate")) {
        destinationSquare.removeChild(children[i]);
      }
    }
  }

  destinationSquare.appendChild(piece);
  isWhiteTurn = !isWhiteTurn;
  updatePGN(startingSquareId, destinationSquareId, isWhiteTurn, pieceType);
  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray,
    pieceType
  );
  makeMove(
    startingSquareId,
    destinationSquareId,
    pieceType,
    pieceColor,
    captured,
    pieceType
  );

  displayTurn();
  checkForEndGame();
  return;
}
