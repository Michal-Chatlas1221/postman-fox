import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import LoginState from './states/Login';
import GameState from './states/Game';
import Leaderboard from './states/Leaderboard';

class Game extends Phaser.Game {

  constructor () {
    super(800, 600, Phaser.AUTO, 'content', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Splash', LoginState, false);
    this.state.add('Game', GameState, false);
    this.state.add('Leaderboard', Leaderboard, false);

    this.state.start('Boot');
  }
}

window.game = new Game();
