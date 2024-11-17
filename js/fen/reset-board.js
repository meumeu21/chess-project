document.getElementById("start").addEventListener("click", resetBoard);

const initialPositions = [
  { id: "a1", pieceType: "rook", color: "white", img: "rook-w.svg", alt: "wrook" },
  { id: "b1", pieceType: "knight", color: "white", img: "knight-w.svg", alt: "wknight" },
  { id: "c1", pieceType: "bishop", color: "white", img: "bishop-w.svg", alt: "wbishop" },
  { id: "d1", pieceType: "queen", color: "white", img: "queen-w.svg", alt: "wqueen" },
  { id: "e1", pieceType: "king", color: "white", img: "king-w.svg", alt: "wking" },
  { id: "f1", pieceType: "bishop", color: "white", img: "bishop-w.svg", alt: "wbishop" },
  { id: "g1", pieceType: "knight", color: "white", img: "knight-w.svg", alt: "wknight" },
  { id: "h1", pieceType: "rook", color: "white", img: "rook-w.svg", alt: "wrook" },
  { id: "a2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "b2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "c2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "d2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "e2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "f2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "g2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "h2", pieceType: "pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "a7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "b7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "c7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "d7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "e7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "f7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "g7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "h7", pieceType: "pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "a8", pieceType: "rook", color: "black", img: "rook-b.svg", alt: "brook" },
  { id: "b8", pieceType: "knight", color: "black", img: "knight-b.svg", alt: "bknight" },
  { id: "c8", pieceType: "bishop", color: "black", img: "bishop-b.svg", alt: "bbishop" },
  { id: "d8", pieceType: "queen", color: "black", img: "queen-b.svg", alt: "bqueen" },
  { id: "e8", pieceType: "king", color: "black", img: "king-b.svg", alt: "bking" },
  { id: "f8", pieceType: "bishop", color: "black", img: "bishop-b.svg", alt: "bbishop" },
  { id: "g8", pieceType: "knight", color: "black", img: "knight-b.svg", alt: "bknight" },
  { id: "h8", pieceType: "rook", color: "black", img: "rook-b.svg", alt: "brook" }
];

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

function boardGenerate(massPositions) {

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

  massPositions.forEach(pos => {
    const square = document.getElementById(pos.id);

    const piece = document.createElement("div");
    piece.classList.add("piece", pos.pieceType);
    piece.setAttribute("color", pos.color);

    const img = document.createElement("img");
    img.src = `static/chess-pieces/${pos.img}`;
    img.alt = pos.alt;
    piece.appendChild(img);

    square.appendChild(piece);
  });
}

function resetBoard() {
  boardSquaresArray = [];
  isWhiteTurn = true;
  whiteKingSquare = "e1";
  blackKingSquare = "e8";

  boardGenerate(initialPositions);

  clearHighlight();
  setupBoardSquares();
  setupPieces();
  fillBoardSquaresArray();
  positionArray=[];
  moves = [];
  isWhiteTurn = true;
  enPassantSquare = "blank";
  allowMovement = true;
  currentPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  viewedFEN = currentPosition;
  fenBoard.innerHTML = viewedFEN;
  positionArray.push(currentPosition);

  const toggles = document.querySelectorAll('.toggle-checkbox');
  toggles.forEach(toggle => {
    toggle.checked = true;
  });
}
