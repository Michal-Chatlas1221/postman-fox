(function () {
    'use strict';

    const appStates = {LOGIN: 'LOGIN', GAME: 'GAME', LEADERBOARD: 'LEADERBOARD'};

    var socket = io('http://localhost:1923');

    socket.on('connect', function () {
        console.log('yup its connect');

    });

    socket.on('connected', function(data) {
        console.log('connected', data);
    });

    socket.on('start', startNewGame);
    socket.on('stop', stopGame);

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
                    // emmit join
                    socket.emit('join', {
                        id: JSON.parse(response)._id,
                        username: app.username
                    });
                });
            },
            state: appStates.LOGIN,
            game: null,
            onStateChange: function (state) {
                if(Object.keys(appStates).indexOf(state) === -1) return;
                app.state = state;
            }
        }
    });

    function startNewGame(data) {
        console.log('start', data);
        app.state = appStates.GAME;
        if(!app.game) {
            app.game = gameFactory();
            return;
        }

        if(document.getElementsByTagName('canvas').length > 0) document.getElementsByTagName('canvas')[0].classList.remove('hidden');
        // app.game = gameFactory();
    }

    function stopGame(data) {
        console.log('stop', data);
        app.state = appStates.LEADERBOARD;
        if(document.getElementsByTagName('canvas').length > 0) document.getElementsByTagName('canvas')[0].classList.add('hidden');
        // app.game = null;
    }
})();