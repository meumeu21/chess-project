import { parseFEN, validateFEN } from '../../server-js/fenUtils.js';

const closePopupButton = document.getElementById('close-fen-popup');
const fenPopup = document.getElementById('set-fen-popup');

document.getElementById('set-position').addEventListener('click', function () {
  fenPopup.classList.add('show');
});

closePopupButton.addEventListener('click', function () {
  fenPopup.classList.remove('show');
});

async function sendFENToServer(fen) {
  try {
    const response = await fetch('http://localhost:3000/api/chess/fen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fen }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Ошибка: ${errorData.message}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при отправке FEN на сервер:', error);
    alert('Не удалось подключиться к серверу.');
    return null;
  }
}

document.getElementById('popup-fen-button').addEventListener('click', async function () {
  const fen = document.getElementById('fen-board');
  let fenText = fen.value.trim();
  if (fenText === "") {
    alert('FEN-код не введён.');
    return;
  }

  if (isServerUsed) {
    const serverResponse = await sendFENToServer(fenText);
    if (serverResponse && serverResponse.success) {
      const { positionsFromFen } = parseFEN(fenText);
      alert("Позиция успешно обновлена!");
      console.log("Positions from FEN:", positionsFromFen);
      fen.value = "";
      fenPopup.classList.remove('show');
    }
  } else {
    if (validateFEN(fenText)) {
      const { positionsFromFen } = parseFEN(fenText);
      alert("Позиция успешно обновлена!");
      console.log("Positions from FEN:", positionsFromFen);
      fen.value = "";
      fenPopup.classList.remove('show');
    } else {
      alert('Некорректный FEN-код.');
    }
  }
});
