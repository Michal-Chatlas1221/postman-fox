let store = {
    username: localStorage.getItem('username') || '',
    uid: '',
    leaderboard: []
};

function setUser(username, uid) {
    store = Object.assign({}, store, {
        username,
        uid
    });
}

function getUser() {
    return {
        username: store.username,
        uid: store.uid
    };
}

function setLeaderBoard(leaederboard) {
    store =  store = Object.assign({}, store, {leaederboard});
}

function getLeaderBoard() {
    return [...leaderboard];
}

module.exports = {
    setUser,
    getUser,
    setLeaderBoard,
    getLeaderBoard
};