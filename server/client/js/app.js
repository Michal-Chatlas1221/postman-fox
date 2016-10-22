(function () {
    'use strict';

    const appStates = {LOGIN: 'LOGIN', GAME: 'GAME', LEADERBOARD: 'LEADERBOARD'};

    var app = new Vue({
        el: '#app',
        data: {
            username: '',
            onLogin: function () {
                app.state = appStates.GAME;
                app.game = gameFactory();
                fetch('/users', {
                    method: 'post',
                    data: {
                        name: app.username
                    }
                }).then(function (response) {
                   console.log(response);
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