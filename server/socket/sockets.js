const setup = () => {

    var app = require('express')();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    server.listen(1923);

    io.on('connection', function(socket){
        console.log('Tomasz Lis connected');
    });
};

module.exports = setup;