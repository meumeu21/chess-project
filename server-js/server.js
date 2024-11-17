const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { validateFEN } = require('./fenUtils');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/chess/fen', (req, res) => {
  const { fen } = req.body;

  if (!fen || !validateFEN(fen)) {
    return res.status(400).json({ success: false, message: 'Некорректный FEN-код.' });
  }
  return res.json({ success: true, fen });
});

app.post('/upload-game-state', upload.single('gameStateFile'), (req, res) => {
  const filePath = req.file.path;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      res.status(500).send({ error: 'Ошибка чтения файла' });
      return;
    }

    try {
      const gameState = JSON.parse(data);
      if (!gameState || typeof gameState !== 'object' || gameState.isGameStarted === undefined) {
        res.status(400).send({ error: 'Неверный формат файла состояния игры' });
      } else {
        if (gameState.viewedFEN && !validateFEN(gameState.viewedFEN)) {
          res.status(400).send({ error: 'Некорректное поле FEN в состоянии игры' });
        } else {
          res.status(200).send({ message: 'Файл успешно обработан', gameState });
        }
      }
    } catch (e) {
      console.error('Ошибка разбора JSON:', e);
      res.status(400).send({ error: 'Неверный JSON в файле состояния игры' });
    } finally {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Ошибка удаления временного файла:', unlinkErr);
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
