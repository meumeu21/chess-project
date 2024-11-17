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
      legalSquares = isMoveValidAgainstCheck(
        legalSquares,
        square.squareId,
        pieceColor,
        pieceType
      );
      return legalSquares;
    });
}

function convertToStandardNotation(move){
  let standardMove = "";
  let boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);

  {
    let from = move.substring(0,2);
    let to =  move.substring(2,4);
    let promotion = move.length>4? move.charAt(4) : null;
    let fromSquare = boardSquaresArrayCopy.find(square=>square.squareId===from);
    let toSquare = getPieceAtSquare(to,boardSquaresArrayCopy);
    if(fromSquare&&toSquare) {
      let fromPiece = fromSquare.pieceType;
      switch(fromPiece.toLowerCase()) {
        case "pawn":
          fromPiece="";
          break;
        case "knight":
          fromPiece="N";
          break;
        case "bishop":
          fromPiece="B";
          break;
        case "rook":
          fromPiece="R";
          break;
        case "queen":
          fromPiece="Q";
          break;
        case "king":
          fromPiece="K";
          break;
      }
      let captureSymbol="";
      if((toSquare.pieceType !=="blank") || (toSquare.pieceType=="blank" && fromSquare.pieceType.toLowerCase()==="pawn" && from.charAt(0)!=to.charAt(0))){
        captureSymbol="x";
        if(fromSquare.pieceType.toLowerCase()==="pawn") {
          fromPiece = from.charAt(0);
        }
      }
      standardMove = `${fromPiece}${captureSymbol}${to}`;
      if(promotion){
        switch(promotion.toLowerCase()){
          case "q":
          standardMove+="=Q";
          break;
          case "r":
            standardMove+="=R";
            break;
          case "b":
            standardMove+="=B";
            break;
          case "n":
            standardMove+="=N";
            break;
        }
      }
      let kingColor = fromSquare.pieceColor == "white" ? "black":"white";
      let kingSquareId = getKingSquare(kingColor,boardSquaresArrayCopy);
      updateBoardSquaresArray(from,to,boardSquaresArrayCopy);

      if(isKingInCheck(kingSquareId,kingColor,boardSquaresArrayCopy)) {
        standardMove +="+";
      }
      if((standardMove =="Kg8" && fromSquare.squareId=="e8")||(standardMove == "Kg1" && fromSquare.squareId=="e1")) {
        if(standardMove ==="Kg8")
         updateBoardSquaresArray("h8","f8",boardSquaresArrayCopy);
        else
         updateBoardSquaresArray("h1","f1",boardSquaresArrayCopy);
         standardMove = "O-O";

      }
      if((standardMove =="Kc8" && fromSquare.squareId=="e8")||(standardMove == "Kc1" && fromSquare.squareId=="e1")) {
        if(standardMove ==="Kc8")
         updateBoardSquaresArray("a8","d8",boardSquaresArrayCopy);
        else
         updateBoardSquaresArray("a1","d1",boardSquaresArrayCopy);
        standardMove = "O-O-O";
      }

    }
  }
  return standardMove.trim();
}

function getKingSquare(color,squareArray) {
  let kingSquare = squareArray.find(square=>square.pieceType.toLowerCase()==="king" && square.pieceColor === color);

  return kingSquare ? kingSquare.squareId : null;
}

function updatePGN(startingSquareId, destinationSquareId, whiteTurn, promotedTo="") {
  let move = startingSquareId+destinationSquareId+promotedTo;
  let standardMove = convertToStandardNotation(move);
  let moveNumber = moves.length/2+1;
  if(whiteTurn) {
    let newMove = createMoveElement(standardMove,"playerMove");
    pgnContainer.appendChild(newMove);
    pgn+=" "+standardMove;
  } else {
    let number = createMoveElement(moveNumber,"moveNumber");
    let newMove = createMoveElement(standardMove,"playerMove");
    pgnContainer.appendChild(number);
    pgnContainer.appendChild(newMove);
    pgn+=" "+moveNumber+". "+standardMove;
  }
  pgnContainer.scrollTop = pgnContainer.scrollHeight;
}

function createMoveElement(standardMove,elementClass) {
  let playerMove = document.createElement("div");
  let moveNumber = moves.length;
  playerMove.classList.add(elementClass);
  if(elementClass == "playerMove") {
    playerMove.id = moveNumber;
    playerMove.addEventListener("click",()=>{
      viewedIndex = parseInt(playerMove.id)+1;
      highlightMove(viewedIndex);
      updatePosition();
      (viewedIndex != positionArray.length-1) ?
       allowMovement = false : allowMovement = true;
    });
  }
  playerMove.innerHTML = standardMove;
  return playerMove;
}

function recreateHTMLFromPGN(pgn) {
  if(pgn === "") return;
  pgnContainer.innerHTML = "";
  let moveArray = pgn.trim().split(/\s+/);
  let moveNumber = 1;
  let moveId =-1;
  for(let i=0;i<moveArray.length;i++) {
    if(moveArray[i].includes(".")) {
      let number = createMoveElement(moveNumber,"moveNumber");
      pgnContainer.appendChild(number);
      moveNumber++;
    } else {
      let newMove = createMoveElement(moveArray[i],"playerMove");
      moveId++;
      newMove.id = moveId;
      pgnContainer.appendChild(newMove);
    }
  }
  pgnContainer.scrollTop = pgnContainer.scrollHeight;
}
