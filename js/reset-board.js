document.getElementById("start").addEventListener("click", resetBoard);

const initialPositions = [
  { id: "a1", pieceType: "chess-piece_rook", color: "white", img: "rook-w.svg", alt: "wrook" },
  { id: "b1", pieceType: "chess-piece_knight", color: "white", img: "knight-w.svg", alt: "wknight" },
  { id: "c1", pieceType: "chess-piece_bishop", color: "white", img: "bishop-w.svg", alt: "wbishop" },
  { id: "d1", pieceType: "chess-piece_queen", color: "white", img: "queen-w.svg", alt: "wqueen" },
  { id: "e1", pieceType: "chess-piece_king", color: "white", img: "king-w.svg", alt: "wking" },
  { id: "f1", pieceType: "chess-piece_bishop", color: "white", img: "bishop-w.svg", alt: "wbishop" },
  { id: "g1", pieceType: "chess-piece_knight", color: "white", img: "knight-w.svg", alt: "wknight" },
  { id: "h1", pieceType: "chess-piece_rook", color: "white", img: "rook-w.svg", alt: "wrook" },
  { id: "a2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "b2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "c2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "d2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "e2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "f2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "g2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "h2", pieceType: "chess-piece_pawn", color: "white", img: "pawn-w.svg", alt: "wpawn" },
  { id: "a7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "b7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "c7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "d7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "e7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "f7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "g7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "h7", pieceType: "chess-piece_pawn", color: "black", img: "pawn-b.svg", alt: "bpawn" },
  { id: "a8", pieceType: "chess-piece_rook", color: "black", img: "rook-b.svg", alt: "brook" },
  { id: "b8", pieceType: "chess-piece_knight", color: "black", img: "knight-b.svg", alt: "bknight" },
  { id: "c8", pieceType: "chess-piece_bishop", color: "black", img: "bishop-b.svg", alt: "bbishop" },
  { id: "d8", pieceType: "chess-piece_queen", color: "black", img: "queen-b.svg", alt: "bqueen" },
  { id: "e8", pieceType: "chess-piece_king", color: "black", img: "king-b.svg", alt: "bking" },
  { id: "f8", pieceType: "chess-piece_bishop", color: "black", img: "bishop-b.svg", alt: "bbishop" },
  { id: "g8", pieceType: "chess-piece_knight", color: "black", img: "knight-b.svg", alt: "bknight" },
  { id: "h8", pieceType: "chess-piece_rook", color: "black", img: "rook-b.svg", alt: "brook" }
];

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

function resetBoard() {
  boardSquaresArray = [];
  isWhiteTurn = true;
  whiteKingSquare = "e1";
  blackKingSquare = "e8";

  for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].innerHTML = '';

    if (i >= 56) {
      const fileLabel = document.createElement("div");
      fileLabel.classList.add("chess-coordinate");
      fileLabel.innerText = files[i % 8];
      boardSquares[i].appendChild(fileLabel);
    }

    if ((i + 1) % 8 == 0) {
      const rankLabel = document.createElement("div");
      rankLabel.classList.add("chess-coordinate", "chess-rank");
      rankLabel.innerText = ranks[7 - Math.floor(i / 8)];
      boardSquares[i].appendChild(rankLabel);
    }
  }

  initialPositions.forEach(pos => {
    const square = document.getElementById(pos.id);

    const piece = document.createElement("div");
    piece.classList.add("chess-piece", pos.pieceType);
    piece.setAttribute("color", pos.color);

    const img = document.createElement("img");
    img.src = `static/chess-pieces/${pos.img}`;
    img.alt = pos.alt;
    piece.appendChild(img);

    square.appendChild(piece);

    boardSquaresArray.push({
      squareId: pos.id,
      pieceColor: pos.color,
      pieceType: pos.pieceType,
      pieceId: piece.id
    });
  });

  const alert= document.getElementById("winning-message");
  alert.style.display="none";

  setupBoardSquares();
  setupPieces();
  fillBoardSquaresArray();
  const timerElement = document.getElementById("timer");
  timerElement.innerText = "00:00";
}
