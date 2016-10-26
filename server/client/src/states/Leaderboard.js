import Phaser from 'phaser';
import {getLeaderBoard} from '../store';

export default class LeaderBoard extends Phaser.State {
    preload() {
        this.leaderBoard = getLeaderBoard();
    }

    create() {
        this.currentScore = this.game.add.text(this.game.world.centerX, this.game.world.centerY, getLeaderBoard(),
            {font: "regular 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
        this.currentScore.anchor.set(0.5);
    }

    update() {
        this.leaderBoard = getLeaderBoard();
        this.currentScore.text = this.leaderBoard.map(e => `${e.name} : ${e.score}`).join('\n');
    }
}
