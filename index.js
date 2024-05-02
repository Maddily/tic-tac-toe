document.addEventListener('DOMContentLoaded', () => {
  // Gameboard object
  const gameBoard = (function () {
    let board = ['', '', '', '', '', '', '', '', ''];

    return {board};
  })();

  // Player object
  function createPlayer(xOrO) {
    return {xOrO};
  }

  // Object to control the flow of the game
  function game(player) {
    let board = gameBoard.board;
    let winner;
    const computer = (player.xOrO === 'x') ? 'o' : 'x';

    // Function to place x/o into tiles
    function play(xOrO, position) {
      board[position] = xOrO;
    }

    // Function to check if the game is over
    function checkWinnerOrTie() {
      const [a, b, c, d, e, f, g, h, i] = board;

      // Check for horizontal, vertical, and diagonal wins
      if (a && ((a === e && a === i) || (a === b && a === c) || (a === d && a === g))) {
        winner = a;
      } else if (c && ((c === e && c === g) || (c === f && c === i))) {
        winner = c;
      } else if (d && (d === e && d === f)) {
        winner = d;
      } else if (g && (g === h && g === i)) {
        winner = g;
      } else if (b && (b === e && b === h)) {
        winner = b;
      }

      // If the board is full and no one has won, it's a tie
      if (!winner && !board.includes('')) {
        winner = 'tie';
      }
    
      return winner;
    }

    // Function to return the computer's shape (x/o)
    function getComputer() {
      return computer;
    }

    return {play, checkWinnerOrTie, getComputer};
  }

  const displayController = (function () {
    const board = document.querySelector('.board');
    const xOrOButton = document.querySelectorAll('.x-o');
    const resultsScreen = document.querySelector('.results p');
    let playerChoice;
    let playerName;

    function renderBoard() {
      board.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-tile', i);
        tile.innerHTML = gameBoard.board[i];
        board.appendChild(tile);
      }
    }

    function selectXOrO(callback) {
        xOrOButton.forEach((button) => {
          button.addEventListener('click', () => {
          // If the board is still all empty, let the player choose x/o
            if (gameBoard.board.every((tile) => tile === '') && !playerChoice) {
              playerChoice = button.textContent.trim();
              button.classList.add(`${playerChoice}-selected`);
              callback(playerChoice);
            }
        });
      });
    }

    function handleTileClick (gameInstance, tile) {
      let winnerOrTie;
      let over = 0;
      if (tile.textContent.trim() === '') {
        gameInstance.play(playerChoice, tile.dataset.tile);
        renderBoard();
        winnerOrTie = gameInstance.checkWinnerOrTie();
        if (winnerOrTie === playerChoice) {
          if (playerName) {
            resultsScreen.textContent = `${playerName} wins!`;
          } else {
            resultsScreen.textContent = "You win!";
          }
          playerScore++;
          strikeThrough();
          over = 1;
        } else if (winnerOrTie === gameInstance.getComputer()) {
          if (playerName) {
            resultsScreen.textContent = `${playerName} loses!`;
          } else {
            resultsScreen.textContent = "You lose!";
          }
          computerScore++;
          strikeThrough();
          over = 1;
        } else if (winnerOrTie === 'tie') {
          resultsScreen.textContent = "It's a tie!";
          over = 1;
        } else {
          computerPlay(gameInstance);
          winnerOrTie = gameInstance.checkWinnerOrTie();
          if (winnerOrTie === playerChoice) {
            if (playerName) {
              resultsScreen.textContent = `${playerName} wins!`;
            } else {
              resultsScreen.textContent = "You win!";
            }
            playerScore++;
            strikeThrough();
            over = 1;
          } else if (winnerOrTie === gameInstance.getComputer()) {
            if (playerName) {
              resultsScreen.textContent = `${playerName} loses!`;
            } else {
              resultsScreen.textContent = "You lose!";
            }
            computerScore++;
            strikeThrough();
            over = 1;
          } else if (winnerOrTie === 'tie') {
            resultsScreen.textContent = "It's a tie!";
            over = 1;
          }
        }
      }
      if (!over) attachTileClickListener(gameInstance);
    }

    function computerPlay(gameInstance) {
      let randomTile;

      do {
        randomTile = Math.floor(Math.random() * 9);
      } while (gameBoard.board[randomTile] != '');

      gameInstance.play(gameInstance.getComputer(), randomTile);
      renderBoard();
    }

    function attachTileClickListener(gameInstance) {
      const tiles = document.querySelectorAll('.tile');

      tiles.forEach((tile) => {
        tile.addEventListener('click', () => handleTileClick(gameInstance, tile));
      });
    }

    function strikeThrough() {
      const [a, b, c, d, e, f, g, h, i] = gameBoard.board;
      let indices;

      if (a && (a === e && a === i)) {
        indices = [0, 4, 8];
      } else if (a && (a === b && a === c)) {
        indices = [0, 1, 2];
      } else if (a && (a === d && a === g)) {
        indices = [0, 3, 6];
      } else if (c && (c === e && c === g)) {
        indices = [2, 4, 6];
      } else if (c && (c === f && c === i)) {
        indices = [2, 5, 8];
      } else if (d && (d === e && d === f)) {
        indices = [3, 4, 5];
      } else if (g && (g === h && g === i)) {
        indices = [6, 7, 8];
      } else if (b && (b === e && b === h)) {
        indices = [1, 4, 7];
      }

      if (indices) {
        for (let i = 0; i < 3; i++) {
          const tile = document.querySelector(`[data-tile='${indices[i]}']`);
          tile.classList.add((tile.innerHTML === 'x') ? 'x-win' : 'o-win')
        }
      }
    }

    function reset() {
      if (!gameBoard.board.every((tile) => tile === '')) {
        gameBoard.board = ['', '', '', '', '', '', '', '', ''];
        renderBoard();

        xOrOButton.forEach((button) => {
          button.classList.remove(`${playerChoice}-selected`);
          });
        playerChoice = undefined;

        selectXOrO((playerChoice) => {
          const gameInstance = game(createPlayer(playerChoice));
        
          displayController.attachTileClickListener(gameInstance);
        });
      }
    }

    function registerName(name) {
      playerName = name;
    }

    return {renderBoard, selectXOrO, attachTileClickListener, strikeThrough, reset, registerName};
  })();

  displayController.renderBoard();

  displayController.selectXOrO((playerChoice) => {
    const gameInstance = game(createPlayer(playerChoice));

    displayController.attachTileClickListener(gameInstance);
  });

  const reset = document.querySelector('.start');

  reset.addEventListener('click', () => {
    const resultsScreen = document.querySelector('.results p');

    resultsScreen.textContent = '';
    displayController.reset();
  });

  const nameButton = document.querySelector('.name-container label');
  const nameInput = document.querySelector('.name-container input');
  nameButton.addEventListener('click', () => {
    displayController.registerName(nameInput.value);
  });
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      displayController.registerName(nameInput.value);
    }
  });
});
