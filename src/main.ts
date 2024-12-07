import {Game} from './game/game';

window.onload = () =>
{
    console.log("Game started");
    const game = new Game();
    game.initialize().then(() => console.log("Game initialized"));
}