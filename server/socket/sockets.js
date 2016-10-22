const setup = () => {

    var app = require('express')();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    server.listen(1923);

    io.on('connection', function(socket){
        socket.on('join', (data) => {
            console.log('asd', data);
            socket.broadcast.emit('connected', {
                username: data.username
            });
        });
    });

    var time = 0;
    var gameTime = 10;
    var pauseTime = 1;
    var timeUnit = 10;

    setInterval(() => {
        time ++;
        if (time % (gameTime + pauseTime) === gameTime) {
            io.emit('start');
        } else if(time % (gameTime + pauseTime) === 0) {
            io.emit('stop');
        }
        time = time % (gameTime+pauseTime);
    }, 10000);
};

module.exports = setup;