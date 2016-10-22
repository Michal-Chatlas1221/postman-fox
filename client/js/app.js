(function () {
    'use strict';

    const appStates = {LOGIN: 'LOGIN', GAME: 'GAME', LEADERBOARD: 'LEADERBOARD'};

    var app = new Vue({
        el: '#app',
        data: {
            username: '',
            onLogin: function () {
                app.state = appStates.GAME;
                console.log(app);
            },
            state: appStates.LOGIN
        }
    });

})();