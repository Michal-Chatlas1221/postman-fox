import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset);

        this.game = game;
        this.anchor.setTo(0.5);
    }

    create() {
        this.fox.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true;
        this.body.drag.set(100);
        this.body.maxVelocity.set(200);
    }
}
