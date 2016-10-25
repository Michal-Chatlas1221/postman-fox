import io from 'socket.io-client';
import store from './store';

const socket = io(':1923');

socket.on('connect', function () {
    console.log('CONNECTED TO SOCKET');
});

socket.on('start', startNewGame);
socket.on('stop', stopGame);

socket.on('scores', onScoresReceive);

function onPackagePick() {
    socket.emit('gameEvent', {id: store.getUser().uid, name: 'picked'});
}

function onTargetCollision() {
    socket.emit('gameEvent', {id: store.getUser().uid, name: 'delivered'});
}

function onScoresReceive(data) {
    console.log('SCORE', data.eventSpecific);
    store.setLeaderBoard(data.eventSpecific);
}

function startNewGame() {
    if(store.getUser().uid) {
        window.game.state.start('Game');
        store.setLeaderBoard([]);
    }
}
function stopGame() {
    console.log('stop');
    if(store.getUser().uid) window.game.state.start('Leaderboard');
}

function joinRoom(username, uid) {
    socket.emit('join', {
        id: uid,
        username: username
    });
}

module.exports = {
    onPackagePick,
    onScoresReceive,
    onTargetCollision,
    joinRoom
};