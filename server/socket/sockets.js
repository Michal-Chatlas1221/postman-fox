const setup = () => {

    let publicState = {
        time: 0,
        gameTime: 10,
        pauseTime: 1,
        timeUnit: 10
    };

    var app = require('express')();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

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
    });

    setInterval(() => {
        publicState.time ++;
        if (publicState.time % (publicState.gameTime + publicState.pauseTime) === publicState.gameTime) {
            io.emit('start');
        } else if(publicState.time % (publicState.gameTime + publicState.pauseTime) === 0) {
            io.emit('stop');
        }
        publicState.time = publicState.time % (gameTime+pauseTime);
    }, 10000);
};

module.exports = setup;