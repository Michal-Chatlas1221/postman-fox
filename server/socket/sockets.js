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
};

module.exports = setup;