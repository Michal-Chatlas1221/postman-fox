import Phaser from 'phaser';
import {getLeaderBoard} from '../store';
import {destruct} from '../timer';

export default class LeaderBoard extends Phaser.State {
  preload() {
    this.leaderBoard = getLeaderBoard();
  }

  create() {
    this.currentScoreTitle = this.game.add.text(330, 10, '',
      {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
    this.currentScoreTitle.text = "SCORE";
    this.currentScore = this.game.add.text(this.game.world.centerX, this.game.world.centerY, getLeaderBoard(),
      {font: "regular 24px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
    this.currentScore.anchor.set(0.5);
  }

  update() {
    this.leaderBoard = getLeaderBoard();
    this.currentScore.text = this.leaderBoard.map(e => `${e.name} : ${e.score}`).join('\n');
  }
}
