const saveLoadGamePopup = document.getElementById('save-load-popup');
const saveLoadGamePopupOpenButton = document.getElementById('save-load-game-popup-button');
const closePopupButton = document.getElementById('close-sl-popup');

saveLoadGamePopupOpenButton.addEventListener('click', function () {
  saveLoadGamePopup.classList.add('show');
});

closePopupButton.addEventListener('click', function () {
  saveLoadGamePopup.classList.remove('show');
});

function saveGameToFile() {
  saveGameState();
  const gameState = localStorage.getItem('chessGameState');
  if (gameState) {
    const blob = new Blob([gameState], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chessGameState.json';
    link.click();
  } else {
    alert('Нет сохранённого состояния игры!');
  }
}
document.getElementById('save-game-file').addEventListener('click', saveGameToFile);


function loadGameFromFileServer(event) {
  const file = event.target.files[0];
  if (file) {
    if (isServerUsed) {
      const formData = new FormData();
      formData.append('gameStateFile', file);

      fetch('http://localhost:3000/upload-game-state', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert(`Ошибка: ${data.error}`);
          } else {
            const gameState = data.gameState;
            localStorage.setItem('chessGameState', JSON.stringify(gameState));
            loadGameState();
            alert('Состояние игры успешно загружено!');
            saveLoadGamePopup.classList.remove('show');
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки файла на сервер:', error);
          alert('Ошибка загрузки файла. Попробуйте ещё раз.');
        });
    } else {
      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const gameState = JSON.parse(event.target.result);
          if (gameState && typeof gameState === 'object' && gameState.isGameStarted !== undefined) {
            localStorage.setItem('chessGameState', JSON.stringify(gameState));
            loadGameState();
            alert('Состояние игры успешно загружено!');
            saveLoadGamePopup.classList.remove('show');
          } else {
            alert('Файл не соответствует формату состояния игры.');
          }
        } catch (e) {
          alert('Ошибка при чтении файла. Проверьте его содержимое.');
        }
      };
      reader.readAsText(file);
    }
  }
}
document.getElementById('upload-game-file').addEventListener('click', () => {
  document.getElementById('load-game-file').click();
});
document.getElementById('load-game-file').addEventListener('change', loadGameFromFileServer);
