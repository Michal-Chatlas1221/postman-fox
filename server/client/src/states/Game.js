/* globals __DEV__ */
import Phaser from 'phaser'
// import Mushroom from '../sprites/Mushroom'
// import {setResponsiveWidth} from '../utils'
import {onTargetCollision, onPackagePick, stopGame, onObstacleCollision, onDelivery} from '../sockets';
import {getCurrentUserScore, getLeaderBoard} from '../store';
import {getTimer} from '../timer';
import Fox from '../sprites/Fox';
import Planet from '../sprites/Planet';

export default class Game extends Phaser.State {

  preload() {
    this.game.load.audio('unicorn', ['assets/audio/music.mp3']);
  }

  create() {

    var music = this.game.add.audio('unicorn');
    music.play();

    this.addObstacle = () => {
      var singleObstacle = this.planetGroup.create(this.game.world.randomX, this.game.world.randomY, 'asteroid');

      singleObstacle.anchor.set(0);
      this.game.physics.enable(singleObstacle, Phaser.Physics.ARCADE);

      singleObstacle.body.collideWorldBounds = true;
      singleObstacle.body.checkCollision.up = true;
      singleObstacle.body.checkCollision.down = true;
      singleObstacle.body.immovable = false;
      singleObstacle.body.bounce.set(1);
      singleObstacle.body.setCircle(15);

      singleObstacle.body.velocity.x = game.rnd.integerInRange(-200, 200);
      singleObstacle.body.velocity.y = game.rnd.integerInRange(-200, 200);
    };

    this.foxInTargetZone = (planet, fox) => {
      return Math.sqrt(Math.pow(planet.position.x +30 - fox.position.x, 2) + Math.pow(planet.position.y + 30 - fox.position.y, 2)) < 100;
    };

    this.markPlanet = (planet, toRemove) => {
      toRemove.graphics = toRemove.game.add.graphics(0, 0);
      toRemove.graphics.lineStyle(2, 0xFF0000, 1);
      toRemove.graphics.drawCircle(toRemove.x+30, toRemove.y+30, 200);

      planet.graphics = planet.game.add.graphics(0, 0);
      planet.graphics.lineStyle(2, 0x00FF00, 1);
      planet.graphics.drawCircle(planet.x+30, planet.y+30, 200);
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

    for (var i = 0; i < 3; i++) {
      this.addObstacle();
    }

    this.game.add.existing(this.fox);
    this.game.add.existing(this.sourcePlanet);
    this.game.add.existing(this.targetPlanet);

    this.physics.enable(this.targetPlanet, Phaser.Physics.ARCADE);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    this.currentScore = this.game.add.text(10, 10, '',
      {font: "bold 28px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
    this.currentScore.text = getCurrentUserScore();

    this.currentLeaderBoard = this.game.add.text(10, 42, '',
        {font: "16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});

    this.currentTimer = this.game.add.text(this.game.width - 60, 10, '',
      {font: "bold 28px Arial", fill: "#eee", boundsAlignH: "right", boundsAlignV: "right"});

    game.time.events.repeat(Phaser.Timer.SECOND * 1, 100, function () {
      this.currentTimer.text =  getTimer();
    }, this);
  }

  update() {

    this.physics.arcade.collide(this.fox, this.sourcePlanet);
    this.physics.arcade.collide(this.planetGroup, this.planetGroup);
    this.physics.arcade.collide(this.planetGroup, this.sourcePlanet);
    this.physics.arcade.collide(this.planetGroup, this.targetPlanet);

    if (Phaser.Point.equals(this.fox.body.velocity,new Phaser.Point(0,0) ) ){
      if (this.foxInTargetZone(this.sourcePlanet, this.fox) && !this.fox.hasPackage) {
        this.fox.hasPackage = true;
        this.markPlanet(this.targetPlanet, this.sourcePlanet);
        onPackagePick();
      }
    }

    this.physics.arcade.collide(this.fox, this.targetPlanet, () => {
      if (this.fox.hasPackage)  {
        this.fox.hasPackage = false;
        this.markPlanet(this.sourcePlanet, this.targetPlanet);
        onTargetCollision();
      }
    });

    if (this.game.physics.arcade.collide(this.fox, this.planetGroup, c => {
      }, e => {
      }, this)) {
      this.markPlanet(this.sourcePlanet, this.targetPlanet);
      if (this.fox.hasPackage) onObstacleCollision();
      this.fox.hasPackage = false;
    }

    if (Phaser.Point.equals(this.fox.body.velocity,new Phaser.Point(0,0) ) ){
      if (this.foxInTargetZone(this.targetPlanet, this.fox) && this.fox.hasPackage) {
        this.fox.hasPackage = false;
        this.markPlanet(this.sourcePlanet, this.targetPlanet);
        onDelivery();
        [1,2,3].forEach(this.addObstacle);
      }
    }

    this.currentScore.text = getCurrentUserScore();

    var firstScore = (getLeaderBoard()[0] != null ? ('1. ' + getLeaderBoard()[0].name + ':' +getLeaderBoard()[0].score + '\n') : '');
    this.currentLeaderBoard.text = firstScore + [0, 1, 2].reduce(i =>
          getLeaderBoard()[i] != null ? ((i + 1).toString() + '. ' + getLeaderBoard()[i].name + ':' +getLeaderBoard()[i].score + '\n') : ''
        );
  }
}
