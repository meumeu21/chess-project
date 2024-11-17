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
positionArray.push(currentPosition);
console.log(currentPosition);
const fenBoard = document.getElementById("fen-board-viewer");
fenBoard.innerHTML = currentPosition;

let whiteKingMoved = false;
let blackKingMoved = false;
let whiteQueenMoved = false;
let blackQueenMoved = false;
let halfMoveClock = 0;
let fullMoveNumber = 1;

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

function generateFEN(
  boardSquares, whiteKingMoved,
  whiteQueenMoved, blackKingMoved,
  blackQueenMoved, halfMoveClock,
  fullMoveNumber
) {
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
    !whiteKingMoved;
  let longCastlePossibleForWhite =
    !whiteQueenMoved;
  let shortCastlePossibleForBlack =
    !blackKingMoved;
  let longCastlePossibleForBlack =
    !blackQueenMoved;

  if (shortCastlePossibleForWhite) castlingString += "K";
  if (longCastlePossibleForWhite) castlingString += "Q";
  if (shortCastlePossibleForBlack) castlingString += "k";
  if (longCastlePossibleForBlack) castlingString += "q";
  if (castlingString == "") castlingString += "-";
  castlingString += " ";
  fen += castlingString;

  fen += enPassantSquare == "blank" ? "-" : enPassantSquare;

  fen += " " + halfMoveClock;
  fen += " " + fullMoveNumber;
  console.log(fen);
  fenBoard.innerHTML = fen;
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
    highlightPossibleMoves(legalSquares);
    let legalSquaresJson = JSON.stringify(legalSquares);
    ev.dataTransfer.setData("application/json", legalSquaresJson);
  }
}

function drop(ev) {
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
    generateFEN(boardSquaresArray, whiteKingMoved,
      whiteQueenMoved, blackKingMoved,
      blackQueenMoved, halfMoveClock,
      fullMoveNumber);
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
    generateFEN(boardSquaresArray, whiteKingMoved,
      whiteQueenMoved, blackKingMoved,
      blackQueenMoved, halfMoveClock,
      fullMoveNumber)
    return;
  }
}

function getPieceAtSquare(squareId, boardSquaresArray) {
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === squareId
  );
  const color = currentSquare.pieceColor;
  const pieceType = currentSquare.pieceType;
  const pieceId = currentSquare.pieceId;
  return { pieceColor: color, pieceType: pieceType, pieceId: pieceId };
}

function getSqaureColor(squareId) {
  let squareElement = document.getElementById(squareId);
  let squareColor = squareElement.classList.contains("white")
    ? "white"
    : "black";
  return squareColor;
}

function getAllPossibleMoves(squaresArray, color) {
  return squaresArray
    .filter((square) => square.pieceColor === color)
    .flatMap((square) => {
      const { pieceColor, pieceType, pieceId } = getPieceAtSquare(
        square.squareId,
        squaresArray
      );
      if (pieceId === "blank") return [];
      let squaresArrayCopy = deepCopyArray(squaresArray);
      const pieceObject = {
        pieceColor: pieceColor,
        pieceType: pieceType,
        pieceId: pieceId,
      };
      let legalSquares = getPossibleMoves(
        square.squareId,
        pieceObject,
        squaresArrayCopy
      );
      return legalSquares;
    });
}

function getKingSquare(color,squareArray) {
  let kingSquare = squareArray.find(square=>square.pieceType.toLowerCase()==="king" && square.pieceColor === color);

  return kingSquare ? kingSquare.squareId : null;
}
