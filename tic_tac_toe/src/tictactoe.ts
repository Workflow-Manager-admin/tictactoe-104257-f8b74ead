//
// Minimalist TicTacToe main container in Typescript (vanilla, no React; DOM-based)
// Color Scheme: primary #ffffff (bg), secondary #000000 (text/border), accent #2196f3 (turn/win indication)
//

/**
 * PUBLIC_INTERFACE
 * Initializes the TicTacToe app inside the given container element.
 */
export function setupTicTacToeApp(container: HTMLElement) {
  // --- Constants ---
  const COLOR_PRIMARY = '#ffffff';
  const COLOR_SECONDARY = '#000000';
  const COLOR_ACCENT = '#2196f3';

  // --- Game state ---
  type Player = 'X' | 'O';
  type Cell = Player | '';
  type Board = Cell[];
  let board: Board = Array(9).fill('');
  let currentPlayer: Player = 'X';
  let gameActive = true;
  let winner: Player | null = null;
  let draw = false;

  // --- UI elements ---
  container.innerHTML = `
    <div class="ttt-root">
      <div class="ttt-status" id="ttt-status"></div>
      <div class="ttt-board" id="ttt-board"></div>
      <button class="ttt-reset" id="ttt-reset">Reset Game</button>
    </div>
  `;

  const statusDiv = container.querySelector<HTMLDivElement>('#ttt-status')!;
  const boardDiv = container.querySelector<HTMLDivElement>('#ttt-board')!;
  const resetBtn = container.querySelector<HTMLButtonElement>('#ttt-reset')!;

  // --- Styles ---
  injectTicTacToeStyles();

  // --- Functions ---
  // PUBLIC_INTERFACE
  function renderBoard() {
    boardDiv.innerHTML = '';
    boardDiv.setAttribute('tabindex', '0');

    board.forEach((cell, idx) => {
      const cellBtn = document.createElement('button');
      cellBtn.className = 'ttt-cell';
      cellBtn.textContent = cell;
      cellBtn.disabled = !gameActive || !!cell;
      cellBtn.setAttribute('data-idx', idx.toString());
      if (cell) {
        cellBtn.style.color = cell === 'X' ? COLOR_SECONDARY : COLOR_ACCENT;
      }
      // Add roundish highlight if cell was in win line
      if (winner && getWinningLine(board, winner)?.includes(idx)) {
        cellBtn.style.background = COLOR_ACCENT + '22';
        cellBtn.style.fontWeight = 'bold';
      }
      cellBtn.addEventListener('click', () => handleCellClick(idx));
      boardDiv.appendChild(cellBtn);
    });
  }

  // PUBLIC_INTERFACE
  function renderStatus() {
    let html = '';
    if (winner) {
      html = `<span class="ttt-winner">Player <b style="color:${winner === 'X' ? COLOR_SECONDARY : COLOR_ACCENT}">${winner}</b> wins!</span>`;
    } else if (draw) {
      html = `<span class="ttt-draw">It's a draw!</span>`;
    } else {
      html = `Player <span class="ttt-turn" style="color:${currentPlayer === 'X' ? COLOR_SECONDARY : COLOR_ACCENT}">${currentPlayer}</span>'s turn`;
    }
    statusDiv.innerHTML = html;
  }

  function handleCellClick(idx: number) {
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    if (checkWin(board, currentPlayer)) {
      winner = currentPlayer;
      gameActive = false;
    } else if (board.every(cell => cell)) {
      draw = true;
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
    renderBoard();
    renderStatus();
  }

  function resetGame() {
    board = Array(9).fill('');
    winner = null;
    draw = false;
    gameActive = true;
    currentPlayer = 'X';
    renderBoard();
    renderStatus();
  }

  // PUBLIC_INTERFACE
  function checkWin(b: Board, player: Player): boolean {
    return !!getWinningLine(b, player);
  }

  // Returns indexes of a winning line or null
  function getWinningLine(b: Board, player: Player): number[] | null {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];
    for (const pattern of winPatterns) {
      if (pattern.every(idx => b[idx] === player)) return pattern;
    }
    return null;
  }

  // --- Event listeners ---
  resetBtn.addEventListener('click', resetGame);

  // --- Initial render ---
  renderBoard();
  renderStatus();

  // --- Style injection ---
  function injectTicTacToeStyles() {
    if (document.getElementById('ttt-style')) return;
    const style = document.createElement('style');
    style.id = 'ttt-style';
    style.textContent = `
      .ttt-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: ${COLOR_PRIMARY};
        color: ${COLOR_SECONDARY};
        border-radius: 20px;
        padding: 2rem 1.5rem 1.5rem 1.5rem;
        box-shadow: 0 2px 16px 0 #0001;
        min-width: 280px;
        width: min(96vw, 340px);
        margin: 0 auto;
        transition: background .2s;
      }
      .ttt-status {
        font-size: 1.15rem;
        margin-bottom: 1.3rem;
        height: 2.2em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ttt-board {
        display: grid;
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        gap: 10px;
        outline: none;
        margin: 0 auto 1.4rem auto;
      }
      .ttt-cell {
        width: 60px;
        height: 60px;
        background: ${COLOR_PRIMARY};
        color: ${COLOR_SECONDARY};
        font-size: 2.05rem;
        border: 2px solid ${COLOR_SECONDARY};
        border-radius: 16px;
        box-shadow: none;
        cursor: pointer;
        transition: background .15s, color .1s;
        font-family: inherit;
        text-align: center;
        font-weight: 500;
      }
      .ttt-cell:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .ttt-winner {
        font-size: 1.15em;
        color: ${COLOR_ACCENT};
        font-weight: 600;
        letter-spacing: 0.04em;
      }
      .ttt-draw {
        color: ${COLOR_SECONDARY};
        font-weight: 500;
        font-size: 1.1em;
      }
      .ttt-reset {
        margin-top: 0.1em;
        background: ${COLOR_ACCENT};
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 0.6em 1.2em;
        font-size: 1.07em;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 1px 6px 0 #2196f330;
        transition: background .2s, box-shadow .2s;
      }
      .ttt-reset:hover {
        background: #1760a4;
        color: #fff;
      }
    `;
    document.head.appendChild(style);
  }
}
