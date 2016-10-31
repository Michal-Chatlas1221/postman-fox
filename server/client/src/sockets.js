import io from 'socket.io-client';
import store from './store';
import {getTimer, timerStart, timerDecrease, setTimer} from './timer';
const socket = io(':1923');

socket.on('start', startNewGame);
socket.on('stop', stopGame);
socket.on('time', setTime);

socket.on('scores', onScoresReceive);

function onPackagePick() {
  socket.emit('gameEvent', {id: store.getUser().uid, name: 'picked'});
}

function onTargetCollision() {
  socket.emit('gameEvent', {id: store.getUser().uid, name: 'delivered'});
}

function onObstacleCollision() {
  socket.emit('gameEvent', {id: store.getUser().uid, name: 'crashed'});
}

function onScoresReceive(data) {
  store.setLeaderBoard(data.eventSpecific);
}

function startNewGame() {
  if (store.getUser().uid) {
    window.game.state.start('Game');
    store.setLeaderBoard([]);
  }
}
function stopGame() {
  if (store.getUser().uid) {
    window.game.state.start('Leaderboard');
  }
}

function joinRoom(username, uid) {
  socket.emit('join', {
    id: uid,
    username: username
  });
}

function setTime(event) {
  setTimer(event);
}

module.exports = {
  onPackagePick,
  onScoresReceive,
  onTargetCollision,
  joinRoom,
  stopGame,
  setTime,
  onObstacleCollision
};