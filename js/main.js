let isServerUsed = false;

let isGameStarted = false;
let timerInterval;
let seconds = 0;
let highlightedArray = [];

let boardSquaresArray = [];
let positionArray = [];
let moves = [];
const castlingSquares = ["g1", "g8", "c1", "c8"];
let isWhiteTurn = true;
let enPassantSquare = "blank";
let allowMovement = true;
let currentPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let pgn = "";
let viewedFEN = currentPosition;
let viewedIndex = 0;
positionArray.push(currentPosition);
console.log(currentPosition);
const fenBoard = document.getElementById("fen-board");
fenBoard.value = currentPosition;

const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");
const chessBoard = document.querySelector(".chess-board");
const topLines = document.getElementById("topLines");
setupBoardSquares();
setupPieces();
fillBoardSquaresArray();

function fillBoardSquaresArray() {
  const boardSquares = document.getElementsByClassName("square");
  for (let i = 0; i < boardSquares.length; i++) {
    let row = 8 - Math.floor(i / 8);
    let column = String.fromCharCode(97 + (i % 8));
    let square = boardSquares[i];
    square.id = column + row;
    let color = "";
    let pieceType = "";
    let pieceId = "";
    if (square.querySelector(".piece")) {
      color = square.querySelector(".piece").getAttribute("color");
      pieceType = square.querySelector(".piece").classList[1];
      pieceId = square.querySelector(".piece").id;
    } else {
      color = "blank";
      pieceType = "blank";
      pieceId = "blank";
    }
    let arrayElement = {
      squareId: square.id,
      pieceColor: color,
      pieceType: pieceType,
      pieceId: pieceId,
    };
    boardSquaresArray.push(arrayElement);
  }
}
function updateBoardSquaresArray(
  currentSquareId,
  destinationSquareId,
  boardSquaresArray,
  promotionOption = "blank"
) {
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === currentSquareId
  );
  let destinationSquareElement = boardSquaresArray.find(
    (element) => element.squareId === destinationSquareId
  );
  let pieceColor = currentSquare.pieceColor;
  let pieceType =
    promotionOption == "blank" ? currentSquare.pieceType : promotionOption;
  let pieceId =
    promotionOption == "blank"
      ? currentSquare.pieceId
      : promotionOption + currentSquare.pieceId;
  destinationSquareElement.pieceColor = pieceColor;
  destinationSquareElement.pieceType = pieceType;
  destinationSquareElement.pieceId = pieceId;
  currentSquare.pieceColor = "blank";
  currentSquare.pieceType = "blank";
  currentSquare.pieceId = "blank";
}

function makeMove(
  startingSquareId,
  destinationSquareId,
  pieceType,
  pieceColor,
  captured,
  promotedTo = "blank"
) {
  moves.push({
    from: startingSquareId,
    to: destinationSquareId,
    pieceType: pieceType,
    pieceColor: pieceColor,
    captured: captured,
    promotedTo: promotedTo,
  });
}

function generateFEN(boardSquares) {
  let fen = "";
  let rank = 8;
  while (rank >= 1) {
    for (
      let file = "a";
      file <= "h";
      file = String.fromCharCode(file.charCodeAt(0) + 1)
    ) {
      const square = boardSquares.find(
        (element) => element.squareId === `${file}${rank}`
      );
      if (square && square.pieceType) {
        let pieceNotation = "";
        switch (square.pieceType) {
          case "pawn":
            pieceNotation = "p";
            break;
          case "bishop":
            pieceNotation = "b";
            break;
          case "knight":
            pieceNotation = "n";
            break;
          case "rook":
            pieceNotation = "r";
            break;
          case "queen":
            pieceNotation = "q";
            break;
          case "king":
            pieceNotation = "k";
            break;
          case "blank":
            pieceNotation = "blank";
            break;
        }
        fen +=
          square.pieceColor === "white"
            ? pieceNotation.toUpperCase()
            : pieceNotation;
      }
    }
    if (rank > 1) {
      fen += "/";
    }
    rank--;
  }
  fen = fen.replace(
    new RegExp("blankblankblankblankblankblankblankblank", "g"),
    "8"
  );
  fen = fen.replace(
    new RegExp("blankblankblankblankblankblankblank", "g"),
    "7"
  );
  fen = fen.replace(new RegExp("blankblankblankblankblankblank", "g"), "6");
  fen = fen.replace(new RegExp("blankblankblankblankblank", "g"), "5");
  fen = fen.replace(new RegExp("blankblankblankblank", "g"), "4");
  fen = fen.replace(new RegExp("blankblankblank", "g"), "3");
  fen = fen.replace(new RegExp("blankblank", "g"), "2");
  fen = fen.replace(new RegExp("blank", "g"), "1");

  fen += isWhiteTurn ? " w " : " b ";

  let castlingString = "";

  let shortCastlePossibleForWhite =
    !kingHasMoved("white") && !rookHasMoved("white", "h1");
  let longCastlePossibleForWhite =
    !kingHasMoved("white") && !rookHasMoved("white", "a1");
  let shortCastlePossibleForBlack =
    !kingHasMoved("black") && !rookHasMoved("black", "h8");
  let longCastlePossibleForBlack =
    !kingHasMoved("black") && !rookHasMoved("black", "a8");

  if (shortCastlePossibleForWhite) castlingString += "K";
  if (longCastlePossibleForWhite) castlingString += "Q";
  if (shortCastlePossibleForBlack) castlingString += "k";
  if (longCastlePossibleForBlack) castlingString += "q";
  if (castlingString == "") castlingString += "-";
  castlingString += " ";
  fen += castlingString;

  fen += enPassantSquare == "blank" ? "-" : enPassantSquare;

  let fiftyMovesRuleCount = getFiftyMovesRuleCount();
  fen += " " + fiftyMovesRuleCount;
  let moveCount = Math.floor(moves.length / 2) + 1;
  fen += " " + moveCount;
  console.log(fen);
  fenBoard.value = fen;
  return fen;
}

function deepCopyArray(array) {
  let arrayCopy = array.map((element) => {
    return { ...element };
  });
  return arrayCopy;
}

function setupBoardSquares() {
  for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].addEventListener("dragover", allowDrop);
    boardSquares[i].addEventListener("drop", drop);
    let row = 8 - Math.floor(i / 8);
    let column = String.fromCharCode(97 + (i % 8));
    let square = boardSquares[i];
    square.id = column + row;
  }
}
function setupPieces() {
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener("dragstart", drag);
    pieces[i].setAttribute("draggable", true);
    pieces[i].id =
      pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
  }
  for (let i = 0; i < piecesImages.length; i++) {
    piecesImages[i].setAttribute("draggable", false);
  }
}
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  if (!allowMovement) return;

  const piece = ev.target;
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];
  const pieceId = piece.id;
  if (
    (isWhiteTurn && pieceColor == "white") ||
    (!isWhiteTurn && pieceColor == "black")
  ) {
    const startingSquareId = piece.parentNode.id;
    ev.dataTransfer.setData("text", piece.id + "|" + startingSquareId);
    const pieceObject = {
      pieceColor: pieceColor,
      pieceType: pieceType,
      pieceId: pieceId,
    };
    let legalSquares = getPossibleMoves(
      startingSquareId,
      pieceObject,
      boardSquaresArray
    );
    let legalSquaresAgainstCheck = isMoveValidAgainstCheck(legalSquares, startingSquareId, pieceColor, pieceType);
    highlightPossibleMoves(legalSquaresAgainstCheck);
    let legalSquaresJson = JSON.stringify(legalSquares);
    ev.dataTransfer.setData("application/json", legalSquaresJson);
  }
}

function drop(ev) {
  checkAndStartGame();
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  let [pieceId, startingSquareId] = data.split("|");
  let legalSquaresJson = ev.dataTransfer.getData("application/json");
  if (legalSquaresJson.length == 0) return;
  let legalSquares = JSON.parse(legalSquaresJson);

  const piece = document.getElementById(pieceId);
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];

  const destinationSquare = ev.currentTarget;
  let destinationSquareId = destinationSquare.id;

  legalSquares = isMoveValidAgainstCheck(
    legalSquares,
    startingSquareId,
    pieceColor,
    pieceType
  );

  if (pieceType == "king") {
    let isCheck = isKingInCheck(
      destinationSquareId,
      pieceColor,
      boardSquaresArray
    );
    if (isCheck) {

      return;
    }
  }

  let squareContent = getPieceAtSquare(destinationSquareId, boardSquaresArray);
  if (
    squareContent.pieceColor == "blank" &&
    legalSquares.includes(destinationSquareId)
  ) {
    let isCheck = false;
    if (pieceType == "king")
      isCheck = isKingInCheck(startingSquareId, pieceColor, boardSquaresArray);
    if (
      pieceType == "king" &&
      !kingHasMoved(pieceColor) &&
      castlingSquares.includes(destinationSquareId) &&
      !isCheck
    ) {
      performCastling(
        piece,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        boardSquaresArray
      );
      return;
    }
    if (
      pieceType == "king" &&
      !kingHasMoved(pieceColor) &&
      castlingSquares.includes(destinationSquareId) &&
      isCheck
    )
      return;

    if (pieceType == "pawn" && enPassantSquare == destinationSquareId) {
      performEnPassant(
        piece,
        pieceColor,
        startingSquareId,
        destinationSquareId
      );
      return;
    }
    enPassantSquare = "blank";
    if (
      pieceType == "pawn" &&
      (destinationSquareId.charAt(1) == 8 || destinationSquareId.charAt(1) == 1)
    ) {
      allowMovement = false;
      displayPromotionChoices(
        pieceId,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        false
      );
      updateBoardSquaresOpacity(startingSquareId);
      return;
    }
    destinationSquare.appendChild(piece);
    isWhiteTurn = !isWhiteTurn;
    updatePGN(startingSquareId, destinationSquareId, isWhiteTurn);
    updateBoardSquaresArray(
      startingSquareId,
      destinationSquareId,
      boardSquaresArray
    );
    let captured = false;
    makeMove(
      startingSquareId,
      destinationSquareId,
      pieceType,
      pieceColor,
      captured
    );
    displayTurn();
    highlightMove(positionArray.length);
    checkForEndGame();
    return;
  }
  if (
    squareContent.pieceColor != "blank" &&
    legalSquares.includes(destinationSquareId)
  ) {
    if (
      pieceType == "pawn" &&
      (destinationSquareId.charAt(1) == 8 || destinationSquareId.charAt(1) == 1)
    ) {
      allowMovement = false;
      displayPromotionChoices(
        pieceId,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        true
      );
      updateBoardSquaresOpacity(startingSquareId);
      return;
    }

    let children = destinationSquare.children;
    for (let i = 0; i < children.length; i++) {
      if (!children[i].classList.contains("coordinate")) {
        destinationSquare.removeChild(children[i]);
      }
    }
    destinationSquare.appendChild(piece);
    isWhiteTurn = !isWhiteTurn;
    updatePGN(startingSquareId, destinationSquareId, isWhiteTurn);
    updateBoardSquaresArray(
      startingSquareId,
      destinationSquareId,
      boardSquaresArray
    );
    let captured = true;
    makeMove(
      startingSquareId,
      destinationSquareId,
      pieceType,
      pieceColor,
      captured
    );
    displayTurn();
    highlightMove(positionArray.length);
    checkForEndGame();
    return;
  }
}


// not negotiable

function checkForCheckMateAndStaleMate() {
  let kingSquare = isWhiteTurn
    ? getkingLastMove("white")
    : getkingLastMove("black");
  let pieceColor = isWhiteTurn ? "white" : "black";
  let boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
  let kingIsCheck = isKingInCheck(
    kingSquare,
    pieceColor,
    boardSquaresArrayCopy
  );
  let possibleMoves = getAllPossibleMoves(boardSquaresArrayCopy, pieceColor);
  if (possibleMoves.length > 0) return;
  let message = "";
  if (kingIsCheck)
    isWhiteTurn ? (message = "черные выиграли!") : (message = "белые выиграли!");
  else message = "ничья";
  showAlert(message);
  endGame();
}
