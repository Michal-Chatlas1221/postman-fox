(function () {
    'use strict';

    const appStates = {LOGIN: 'LOGIN', GAME: 'GAME', LEADERBOARD: 'LEADERBOARD'};


    var app = new Vue({
        el: '#app',
        data: {
            username: localStorage.getItem('username') || '',
            onLogin: function () {
                localStorage.setItem('username', app.username);
                fetch('/users', {
                    method: 'POST',
                    headers: {
                      'content-type': 'application/json'
                    },
                    body: JSON.stringify({name: app.username})
                })
                    .then(function(response) {
                        return response.text()
                    }).then(function (response) {
                    app.state = appStates.GAME;
                    app.game = gameFactory();
                    console.log(JSON.parse(response)._id);

                    var socket = io('http://localhost:1923');

                    socket.on('connection', function (msg) {
                        socket.emit('join', {
                           id: JSON.parse(response)._id,
                            username: app.username
                        });
                        console.log('msg', msg);
                    });

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