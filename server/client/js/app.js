(function () {
    'use strict';

    const appStates = {LOGIN: 'LOGIN', GAME: 'GAME', LEADERBOARD: 'LEADERBOARD'};

    var socket = io('http://localhost:1923');

    socket.on('connection', function (msg) {
        console.log('msg', msg);
    } );

    // io.on('connection', function(socket){
    //     console.log('a user connected');
    //     socket.on('disconnect', function(){
    //         console.log('user disconnected');
    //     });
    // });

    var app = new Vue({
        el: '#app',
        data: {
            username: '',
            onLogin: function () {
                fetch('/users', {
                    method: 'POST',
                    headers: {
                      'content-type': 'application/json'
                    },
                    body: JSON.stringify({name: app.username})
                }).then(function (response) {
                    app.state = appStates.GAME;
                    app.game = gameFactory();
                });
            },
            state: appStates.LOGIN,
            game: {},
            onStateChange: function (state) {
                if(Object.keys(appStates).indexOf(state) === -1) return;
                app.state = state;
            }
        }
    });

})();