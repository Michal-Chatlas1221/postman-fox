import Phaser from 'phaser'

export default class Planet extends Phaser.Sprite {

    constructor ({ game, x, y, type }) {
        const asset = type === 'SOURCE' ? 'planet' : 'targetPlanet';

        super(game, x, y, asset);

        this.game = game;
        this.anchor.set(0);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true;
        this.body.immovable = true;
        this.body.bounce.set(1);
        this.body.setCircle(30);
    }
    
}
