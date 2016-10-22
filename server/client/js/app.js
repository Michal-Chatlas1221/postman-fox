(function () {
    'use strict';

    const appStates = {LOGIN: 'LOGIN', GAME: 'GAME', LEADERBOARD: 'LEADERBOARD'};

    var socket = io(':1923');

    socket.on('connect', function () {
        console.log('yup its connect');

    });

    socket.on('connected', function (data) {
        console.log('connected', data);
    });

    socket.on('start', startNewGame);
    socket.on('stop', stopGame);
    socket.on('scores', onScoresRecieve);

    var app = new Vue({
        el: '#app',
        data: {
            username: localStorage.getItem('username') || '',
            uid: '',
            loaded: false,
            onLogin: function () {
                localStorage.setItem('username', app.username);
                fetch('/users', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({name: app.username})
                })
                    .then(function (response) {
                        return response.text()
                    }).then(function (response) {
                    // emmit join
                    app.state = appStates.GAME;
                    app.uid = JSON.parse(response)._id;
                    socket.emit('join', {
                        id: app.uid,
                        username: app.username
                    });
                });
            },
            state: appStates.LOGIN,
            game: null,
            onStateChange: function (state) {
                if (Object.keys(appStates).indexOf(state) === -1) return;
                app.state = state;
            }
        }
    });

    function startNewGame(data) {
        app.loaded = true;
        console.log('start', data);
        app.state = appStates.GAME;
        if (!app.game) {
            app.game = gameFactory(onPackagePick, onTargetCollision);
            return;
        }

        if (document.getElementsByTagName('canvas').length > 0) {
            document.getElementsByTagName('canvas')[0].classList.remove('hidden');
        }
    }

    function stopGame(data) {
        console.log('stop', data);
        app.state = appStates.LEADERBOARD;
        if (document.getElementsByTagName('canvas').length > 0) document.getElementsByTagName('canvas')[0].classList.add('hidden');
    }

    function onPackagePick() {
        console.log('PACKAGE PICK');
        socket.emit('gameEvent', {id: app.uid, name: 'picked'});

    }

    function onTargetCollision() {
        console.log('TARGET TOUCHED');
        socket.emit('gameEvent', {id: app.uid, name: 'delivered'});
    }

    function onScoresRecieve (data) {
        console.log('SCORE', data);
    }
})();