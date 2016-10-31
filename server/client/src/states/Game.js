/* globals __DEV__ */
import Phaser from 'phaser'
// import Mushroom from '../sprites/Mushroom'
// import {setResponsiveWidth} from '../utils'
import {onTargetCollision, onPackagePick, stopGame, onObstacleCollision} from '../sockets';
import {getCurrentUserScore} from '../store';
import {getTimer} from '../timer';
import Fox from '../sprites/Fox';
import Planet from '../sprites/Planet';

export default class Game extends Phaser.State {

  create() {

    this.markPlanet = (planet, toRemove) => {
      toRemove.graphics = toRemove.game.add.graphics(0, 0);
      toRemove.graphics.lineStyle(2, 0xFF0000, 1);
      toRemove.graphics.drawCircle(toRemove.x+30, toRemove.y+30, 130);

      planet.graphics = planet.game.add.graphics(0, 0);
      planet.graphics.lineStyle(2, 0x00FF00, 1);
      planet.graphics.drawCircle(planet.x+30, planet.y+30, 130);
    };

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

    this.fox = new Fox({
      game: this,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'ship'
    });

    this.sourcePlanet = new Planet({
      game: this,
      x: Math.random() * 150 + 60,
      y: (Math.random() * 1000) % (this.game.height - 100) + 50,
      type: 'SOURCE',
    });

    this.targetPlanet = new Planet({
      game: this,
      x: (this.game.width - Math.random() * 150) - 60,
      y: (Math.random() * 1000) % (this.game.height - 100) + 50,
      type: 'TARGET'
    });

    this.markPlanet(this.sourcePlanet, this.targetPlanet);

    this.planetGroup = this.game.add.physicsGroup();
    this.planetGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.planetGroup.enableBody = true;

    for (var i = 0; i < 10; i++) {
      var singleObstacle = this.planetGroup.create(this.game.world.randomX, this.game.world.randomY, 'asteroid');

      singleObstacle.anchor.set(0);
      this.game.physics.enable(singleObstacle, Phaser.Physics.ARCADE);

      singleObstacle.body.collideWorldBounds = true;
      singleObstacle.body.checkCollision.up = true;
      singleObstacle.body.checkCollision.down = true;
      singleObstacle.body.immovable = false;
      singleObstacle.body.bounce.set(1);
      singleObstacle.body.setCircle(15);
    }

    this.game.add.existing(this.fox);
    this.game.add.existing(this.sourcePlanet);
    this.game.add.existing(this.targetPlanet);

    this.physics.enable(this.targetPlanet, Phaser.Physics.ARCADE);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    this.currentScore = this.game.add.text(10, 10, '',
      {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
    this.currentScore.text = getCurrentUserScore();

    this.currentTimer = this.game.add.text(600, 10, '',
      {font: "bold 32px Arial", fill: "#eee", boundsAlignH: "right", boundsAlignV: "right"});

    game.time.events.repeat(Phaser.Timer.SECOND * 1, 100, function () {
      this.currentTimer.text = "Time left: " + getTimer();
    }, this);

    console.log("state 27");
  }

  update() {
    this.physics.arcade.collide(this.fox, this.sourcePlanet, () => {
      if (!this.fox.hasPackage) onPackagePick();
      this.fox.hasPackage = true;
      this.markPlanet(this.targetPlanet, this.sourcePlanet);
    });

    this.physics.arcade.collide(this.fox, this.targetPlanet, () => {
      if (this.fox.hasPackage) onTargetCollision();
      this.fox.hasPackage = false;
      this.markPlanet(this.sourcePlanet, this.targetPlanet)
    });

    if (this.game.physics.arcade.collide(this.fox, this.planetGroup, c => {
      }, e => {
      }, this)) {
      //todo: drop the package and loose points
      this.markPlanet(this.sourcePlanet, this.targetPlanet);
      if (this.fox.hasPackage) onObstacleCollision();
      this.fox.hasPackage = false;
    }

    this.currentScore.text = getCurrentUserScore();
  }
}
