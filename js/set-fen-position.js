function getPieceDetails(piece) {
  const pieceMap = {
    p: "pawn", r: "rook", n: "knight", b: "bishop", q: "queen", k: "king"
  };
  const color = piece === piece.toLowerCase() ? "black" : "white";
  const pieceType = pieceMap[piece.toLowerCase()];
  return { pieceType, color, img: `${pieceType}-${color[0]}.svg`, alt: `${color[0]}${pieceType}` };
}

function parseFEN(fen) {
  const [position, turn, castling, enPassant, halfMoveClock, fullMoveNumber] = fen.split(" ");
  const rows = position.split("/");
  const positionsFromFen = [];
  const moves = [];

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  initialPositions.forEach(piece => {
    piece.pieceId = `${piece.alt}${piece.id}`;
  });

  console.log(initialPositions);

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

  function findPiece(positions, pieceType, color, id) {
    return positions.find(piece => piece.pieceType === pieceType && piece.color === color && piece.id === id);
  }

  if (!castling.includes("K")) {
    const initialKing = findPiece(initialPositions, "king", "white", "e1");
    const initialRookH1 = findPiece(initialPositions, "rook", "white", "h1");
    const currentKing = findPiece(positionsFromFen, "king", "white", initialKing.id);
    const currentRookH1 = findPiece(positionsFromFen, "rook", "white", initialRookH1.id);

    if (currentKing && currentKing.id !== initialKing.id) {
      moves.push({ pieceType: "king", color: "white", from: "e1", to: currentKing.id });
    }
    if (currentRookH1 && currentRookH1.id !== initialRookH1.id) {
      moves.push({ pieceType: "rook", color: "white", from: "h1", to: currentRookH1.id });
    }
  }
  if (!castling.includes("Q")) {
    const initialRookA1 = findPiece(initialPositions, "rook", "white", "a1");
    const currentRookA1 = findPiece(positionsFromFen, "rook", "white", initialRookA1.id);

    if (currentRookA1 && currentRookA1.id !== initialRookA1.id) {
      moves.push({ pieceType: "rook", color: "white", from: "a1", to: currentRookA1.id });
    }
  }
  if (!castling.includes("k")) {
    const initialKingB = findPiece(initialPositions, "king", "black", "e8");
    const initialRookH8 = findPiece(initialPositions, "rook", "black", "h8");
    const currentKingB = findPiece(positionsFromFen, "king", "black", initialKingB.id);
    const currentRookH8 = findPiece(positionsFromFen, "rook", "black", initialRookH8.id);

    if (currentKingB && currentKingB.id !== initialKingB.id) {
      moves.push({ pieceType: "king", color: "black", from: "e8", to: currentKingB.id });
    }
    if (currentRookH8 && currentRookH8.id !== initialRookH8.id) {
      moves.push({ pieceType: "rook", color: "black", from: "h8", to: currentRookH8.id });
    }
  }
  if (!castling.includes("q")) {
    const initialRookA8 = findPiece(initialPositions, "rook", "black", "a8");
    const currentRookA8 = findPiece(positionsFromFen, "rook", "black", initialRookA8.id);

    if (currentRookA8 && currentRookA8.id !== initialRookA8.id) {
      moves.push({ pieceType: "rook", color: "black", from: "a8", to: currentRookA8.id });
    }
  }

  const nonPawnMovesCount = parseInt(halfMoveClock);
  const additionalMovesCount = (parseInt(fullMoveNumber) - 1) * 2;
  if (turn === "w") {
    additionalMovesCount++;
  }

  function moveExists(pieceType, pieceColor) {
    return moves.some(
      move => move.pieceType === pieceType && move.pieceColor === pieceColor
    );
  }

  for (const currentPiece of positionsFromFen) {
    const initialPiece = initialPositions.find(
      piece => piece.pieceType === currentPiece.pieceType &&
      piece.color === currentPiece.color
    );

    if (initialPiece && initialPiece.id !== currentPiece.id) {
      if (
        (currentPiece.pieceType === "king" || currentPiece.pieceType === "rook") &&
        moveExists(currentPiece.pieceType, currentPiece.color)
      ) {
        continue;
      }

      moves.push({
        pieceType: currentPiece.pieceType,
        pieceColor: currentPiece.color,
        from: initialPiece.id,
        to: currentPiece.id
      });
    }
  }

  while (moves.length < additionalMovesCount) {
    moves.push({
      pieceType: "unknown",
      from: "unknown",
      to: "unknown",
      pieceColor: "white",
      captured: false,
      promotedTo: "blank"
    });
  }

  return { positionsFromFen, moves, isWhiteTurn: turn === "w", additionalMovesCount };
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

document.getElementById("set-position").addEventListener("click", () => {
  const fen = prompt("Введите FEN-код для установки позиции:");
  if (fen) {
    if (validateFEN(fen)) {
      try {
        const { positionsFromFen, moves, isWhiteTurn, additionalMovesCount } = parseFEN(fen);
        alert("Позиция успешно обновлена!");
        console.log("Positions from FEN:", positionsFromFen);
        console.log("Moves:", moves);
        console.log("Is white's turn:", isWhiteTurn);
        console.log(additionalMovesCount);
      } catch (error) {
        alert("Ошибка при установке позиции.");
        console.log(error);
      }
    } else {
      alert("Некорректный FEN-код.");
    }
  } else {
    alert("FEN-код не был введен.");
  }
});
