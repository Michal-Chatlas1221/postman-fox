/* globals __DEV__ */
import Phaser from 'phaser'
// import Mushroom from '../sprites/Mushroom'
// import {setResponsiveWidth} from '../utils'
import {onTargetCollision, onPackagePick} from '../sockets';
import {getCurrentUserScore} from '../store';
import Fox from '../sprites/Fox';
import Planet from '../sprites/Planet';

export default class Game extends Phaser.State {
    create() {
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
            type: 'SOURCE'
        });

        this.targetPlanet = new Planet({
            game: this,
            x: (this.game.width - Math.random() * 150) - 60,
            y: (Math.random() * 1000) % (this.game.height - 100) + 50,
            type: 'TARGET'
        });

        this.planetGroup = this.game.add.physicsGroup();
        this.planetGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.planetGroup.enableBody = true;

        for (var i = 0; i < 10; i++)
        {
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

    }

    update() {
        this.physics.arcade.collide(this.fox, this.sourcePlanet, () => {
            if (!this.fox.hasPackage) onPackagePick();
            this.fox.hasPackage = true;
        });

        this.physics.arcade.collide(this.fox, this.targetPlanet, () => {
            if (this.fox.hasPackage) onTargetCollision();
            this.fox.hasPackage = false;
        });

        //todo: debounce maybe?
        this.currentScore.text = getCurrentUserScore();

        if (this.game.physics.arcade.collide(this.fox, this.planetGroup, c => {
                console.log('collision event', c);
            }, e => {
                console.log('some process handler it is', e)
            }, this))
        {
            console.log('boom');
        }
    }
}
