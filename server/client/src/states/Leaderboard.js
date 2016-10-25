import Phaser from 'phaser';
import {getLeaderBoard} from '../store';

export default class LeaderBoard extends Phaser.State {
    preload() {
        this.leaderBoard = getLeaderBoard();
    }

    create() {
        this.font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        this.leaderBoard.map((e, i) => {
            var img = this.game.add.image(this.game.world.centerX, 6 + i * 32 + 30, this.font);
            img.anchor.set(0.5, 1);
        });
    }

    update() {
        this.leaderBoard = getLeaderBoard();
        this.font.text = this.leaderBoard.map(e => `${e.name} ${e.score}`).join('\n\b');
    }
}
