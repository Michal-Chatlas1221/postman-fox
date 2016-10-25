import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#001743';
    this.fontsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Nunito']
      },
      active: this.fontsLoaded
    });

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts',
        { font: '16px Arial', fill: '#dddddd', align: 'center' });
    text.anchor.setTo(0.5, 0.5);

    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
    this.game.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');
    this.game.load.image('space', 'assets/games/asteroids/bg.png');
    this.game.load.image('bullet', 'assets/games/asteroids/bullets.png');
    this.game.load.image('ship', 'assets/games/asteroids/ship.png');
    this.game.load.image('planet', 'assets/games/asteroids/planet.png');
    this.game.load.image('targetPlanet', 'assets/games/asteroids/targetPlanet.png');
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash');
    }
  }

  fontsLoaded () {
    this.fontsReady = true;
  }
}
