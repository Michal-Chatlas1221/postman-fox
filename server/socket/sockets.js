const setup = () => {

    const eventValues = [
        {name: 'delivered', value: 100},
        {name: 'crashed', value: -10},
        {name: 'damaged', value: 50},
        {name: 'picked', value: 5}
    ];

    let publicState = {
        time: 0,
        gameTime: 10,
        pauseTime: 1,
        timeUnit: 10
    };

    let leaderBoard = [];

    var app = require('express')();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    var User = require('../models/user');

    server.listen(1923);

    io.on('connection', function(socket){

        socket.on('join', (data) => {
            console.log('asd', data);
            socket.broadcast.emit('connected', {
                state: publicState,
                eventSpecific: {
                    username: data.username
                }
            });
        });

        socket.on('gameEvent', (data) => {

            let leaderBoardIndex = leaderBoard.findIndex(e => e.id === data.id);
            if (leaderBoardIndex !== -1) {
                leaderBoard[leaderBoardIndex].score += eventValues.find(e => e.name === data.name).value;
            } else {
                let user = User.findOne({_id: data.id});
                leaderBoard.push({
                    id: user._id,
                    name: user.name,
                    score: 0
                });
                leaderBoard[leaderBoard.length - 1].score += eventValues.find(e => e.name === data.name).value;
            }

            io.emit('scores', {
                state: publicState,
                eventSpecific: leaderBoard
            })
        });
    });

    setInterval(() => {
        publicState.time ++;
        if (publicState.time % (publicState.gameTime + publicState.pauseTime) === publicState.gameTime) {
            io.emit('stop', {
                state: publicState
            });
            io.emit('leaderBoard', {
                state: publicState,
                eventSpecific: leaderBoard
            });
            leaderBoard = [];
        } else if(publicState.time % (publicState.gameTime + publicState.pauseTime) === 0) {
            io.emit('start', {
                state: publicState
            });
        }
        publicState.time = publicState.time % (publicState.gameTime+publicState.pauseTime);
    }, 1000 * publicState.timeUnit);
};

module.exports = setup;