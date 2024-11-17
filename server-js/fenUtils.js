function getPieceDetails(piece) {
  const pieceMap = {
    p: "pawn", r: "rook", n: "knight", b: "bishop", q: "queen", k: "king"
  };
  const color = piece === piece.toLowerCase() ? "black" : "white";
  const pieceType = pieceMap[piece.toLowerCase()];
  return { pieceType, color, img: `${pieceType}-${color[0]}.svg`, alt: `${color[0]}${pieceType}` };
}

function parseFEN(fen) {
  const [position, turn, castling, enPassant, halfMoveClock_, fullMoveNumber_] = fen.split(" ");
  const rows = position.split("/");
  const positionsFromFen = [];

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  rows.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (!isNaN(char)) {
        fileIndex += parseInt(char);
      } else {
        const square = `${files[fileIndex]}${8 - rowIndex}`;
        const { pieceType, color, img, alt } = getPieceDetails(char);
        positionsFromFen.push({ id: square, pieceType, color, img, alt });
        fileIndex++;
      }
    }
  });

  let halfmoveClock = +halfMoveClock_;
  let fullmoveNumber = +fullMoveNumber_;

  resetBoard();
  boardGenerate(positionsFromFen);
  clearHighlight();
  setupBoardSquares();
  setupPieces();
  fillBoardSquaresArray();
  positionArray = [];
  moves = [];
  isWhiteTurn = turn === "w";
  halfMoveClock = halfmoveClock;
  fullMoveNumber = fullmoveNumber;
  enPassantSquare = "blank";
  allowMovement = true;
  currentPosition = fen;
  viewedFEN = currentPosition;
  fenBoard.innerHTML = viewedFEN;
  positionArray.push(currentPosition);

  return { positionsFromFen };
}

function validateFEN(fen) {
  const fenParts = fen.trim().split(" ");
  if (fenParts.length !== 6) {
    return false;
  }
  const [positions, turn, castling, enPassant, fiftyMoveCounter, moveCount] = fenParts;
  const rows = positions.split("/");
  if (rows.length !== 8) {
    return false;
  }
  for (const row of rows) {
    let squares = 0;
    for (const char of row) {
      if (/[1-8]/.test(char)) {
        squares += parseInt(char);
      } else if (/[prnbqkPRNBQK]/.test(char)) {
        squares += 1;
      } else {
        return false;
      }
    }
    if (squares !== 8) {
      return false;
    }
  }
  if (!/^[wb]$/.test(turn)) {
    return false;
  }
  if (!/^(KQ?k?q?|-)$/i.test(castling)) {
    return false;
  }
  if (!/^(-|[a-h][36])$/.test(enPassant)) {
    return false;
  }
  if (isNaN(parseInt(fiftyMoveCounter)) || parseInt(fiftyMoveCounter) < 0) {
    return false;
  }
  if (isNaN(parseInt(moveCount)) || parseInt(moveCount) < 1) {
    return false;
  }
  return true;
}

export { getPieceDetails, parseFEN, validateFEN };
