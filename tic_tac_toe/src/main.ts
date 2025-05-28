import './style.css'
import { setupTicTacToeApp } from './tictactoe'

// Clear #app and inject the TicTacToe App component
const appDiv = document.querySelector<HTMLDivElement>('#app')!;
appDiv.innerHTML = ``;
setupTicTacToeApp(appDiv);
