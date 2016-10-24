import Phaser from 'phaser';
import {getLeaderBoard} from '../store';

export default class LeaderBoard extends Phaser.State {
    preload() {
        this.game.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');
        this.leaderBoard = getLeaderBoard();
    }

    create() {
        this.font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
        console.log('asd', this.leaderBoard);

        this.leaderBoard.map((e, i) => {
            var img = this.game.add.image(this.game.world.centerX, 6 + i * 32, this.font);
            img.tint = Math.random() * 0xFFFFFF;
            img.anchor.set(0.5, 1);
            console.log(e, i);
        });
    }

    update() {
        this.leaderBoard = getLeaderBoard();
        this.font.text = this.leaderBoard.map(e => `${e.id} ${e.name} ${e.score}`).join('waaat');
    }
}
