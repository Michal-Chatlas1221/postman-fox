var app = require('express')();
var io = require('socket.io')(1923);

const setup = () => {
    io.on('connection', function(socket){
        console.log('Tomasz Lis connected');
    });
};

module.exports = setup;