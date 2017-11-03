let store = {
    username: localStorage.getItem('username') || '',
    uid: '',
    leaderBoard: []
};

function setUser(username, uid) {
    localStorage.setItem('username', username);
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

function setLeaderBoard(leaderBoard) {
    store = Object.assign({}, store, {leaderBoard});
}

function getLeaderBoard() {
    return [...store.leaderBoard];
}

function getCurrentUserScore() {
    const found = store.leaderBoard.find(e => e.id === store.uid);
    return found ? found.score : '0';
}

module.exports = {
    setUser,
    getUser,
    setLeaderBoard,
    getLeaderBoard,
    getCurrentUserScore
};