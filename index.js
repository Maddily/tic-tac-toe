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
});
