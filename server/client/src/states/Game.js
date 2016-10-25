/* globals __DEV__ */
import Phaser from 'phaser'
// import Mushroom from '../sprites/Mushroom'
// import {setResponsiveWidth} from '../utils'
import {onTargetCollision, onPackagePick} from '../sockets';
import {getCurrentUserScore} from '../store';
import Fox from '../sprites/Fox'

export default class Game extends Phaser.State {
  preload() {
    this.load.image('space', 'assets/skies/deep-space.jpg');
    this.load.image('bullet', 'assets/games/asteroids/bullets.png');
    this.load.image('ship', 'assets/games/asteroids/ship.png');
    this.load.image('planet', 'assets/games/asteroids/planet.png');
    this.load.image('targetPlanet', 'assets/games/asteroids/targetPlanet.png');
  }

  create() {
    this.hasPackage = false;
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');


    this.fox = new Fox({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'ship'
    });

    this.game.add.existing(this.fox);

    this.planetSprite = this.add.sprite(60, 300, 'planet');
    this.planetSprite.anchor.set(0.5);

    this.targetPlanetSprite = this.add.sprite(700, 300, 'targetPlanet');
    this.targetPlanetSprite.anchor.set(0.5);

    this.physics.enable(this.fox, Phaser.Physics.ARCADE);
    this.physics.enable(this.planetSprite, Phaser.Physics.ARCADE);
    this.physics.enable(this.targetPlanetSprite, Phaser.Physics.ARCADE);

    this.planetSprite.body.collideWorldBounds = true;
    this.planetSprite.body.checkCollision.up = true;
    this.planetSprite.body.checkCollision.down = true;
    this.planetSprite.body.immovable = true;
    this.planetSprite.body.setCircle(28);

    this.targetPlanetSprite.body.collideWorldBounds = true;
    this.targetPlanetSprite.body.checkCollision.up = true;
    this.targetPlanetSprite.body.checkCollision.down = true;
    this.targetPlanetSprite.body.immovable = true;
    this.targetPlanetSprite.body.setCircle(28);

    //  Game input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    this.currentScore = this.game.add.text(0, 0, '', style);
    this.currentScore.text = getCurrentUserScore();
  }

  update() {
    if (this.cursors.up.isDown) {
      this.physics.arcade.accelerationFromRotation(this.fox.rotation, 200, this.fox.body.acceleration);
    }
    else {
      this.fox.body.acceleration.set(0);
    }
    if (this.cursors.left.isDown) {
      this.fox.body.angularVelocity = -300;
    }
    else if (this.cursors.right.isDown) {
      this.fox.body.angularVelocity = 300;
    }
    else {
      this.fox.body.angularVelocity = 0;
    }

    this.screenWrap(this.fox);

    this.physics.arcade.collide(this.fox, this.planetSprite, () => {
      if (!this.hasPackage) onPackagePick();
      this.hasPackage = true;
    });

    this.physics.arcade.collide(this.fox, this.targetPlanetSprite, () => {
      if (this.hasPackage) onTargetCollision();
      this.hasPackage = false;
    });

    //todo: debounce maybe?
    this.currentScore.text = getCurrentUserScore();
  }

   screenWrap(sprite) {
    if (sprite.x < 0) {
      sprite.x = this.game.width;
    }
    else if (sprite.x > this.game.width) {
      sprite.x = 0;
    }

    if (sprite.y < 0) {
      sprite.y = this.game.height;
    }
    else if (sprite.y > this.game.height) {
      sprite.y = 0;
    }
  }

  render() {
  }
}
