const boardElement = document.getElementById('chess-board');
const board = Array(8).fill(null).map(() => Array(8).fill(null));

// Обозначение фигур
const pieces = {
  pawn: '♙',
  rook: '♖',
  knight: '♘',
  bishop: '♗',
  queen: '♕',
  king: '♔'
};

// Инициализация доски и расстановка фигур
function initializeBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.dataset.row = row;
      square.dataset.col = col;
      boardElement.appendChild(square);

      // Расставляем пешки
      if (row === 1) board[row][col] = '♙';
      if (row === 6) board[row][col] = '♙';

      // Расставляем остальные фигуры
      if (row === 0 || row === 7) {
        const pieceRow = row === 0 ? 'white' : 'black';
        const piecesRow = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
        board[row][col] = pieceRow === 'white' ? piecesRow[col] : piecesRow[col].toLowerCase();
      }

      // Отображаем фигуры на доске
      square.textContent = board[row][col] || '';
    }
  }
}

initializeBoard();
