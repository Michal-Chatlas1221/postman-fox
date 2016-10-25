import Phaser from 'phaser'

export default class extends Phaser.Sprite {

    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset);

        this.game = game;
        this.hasPackage = false;
        this.anchor.set(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true;
        this.body.drag.set(100);
        this.body.maxVelocity.set(200);
    }
    
    update() {
        if (this.game.cursors.up.isDown) {
            this.game.physics.arcade.accelerationFromRotation(this.rotation, 200, this.body.acceleration);
        }
        else {
            this.body.acceleration.set(0);
        }
        if (this.game.cursors.left.isDown) {
            this.body.angularVelocity = -300;
        }
        else if (this.game.cursors.right.isDown) {
            this.body.angularVelocity = 300;
        }
        else {
            this.body.angularVelocity = 0;
        }
    }
}
