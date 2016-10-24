import Phaser from 'phaser';
import {setUser} from '../store';
import {joinRoom} from '../sockets';

export default class Login extends Phaser.State {
    constructor() {
        super(...arguments);
        this.input = document.getElementById('username');
        this.form = document.getElementById('form');
        this.loginSection = document.getElementById('login');

        this.form.addEventListener('submit', e => this.onSubmit(e), false);
    }

    init() {
        this.inputValue = localStorage.getItem('username') || '';
        this.input.value = this.inputValue;
    }

    onSubmit() {
        const username = this.input.value;

        fetch('/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({name: username})
        })
            .then(response => response.text())
            .then(response => {
                const uid = JSON.parse(response)._id;
                setUser(username, uid);
                joinRoom(username, uid);
                localStorage.setItem('username', username);
                this.updateGameState();
            });
    }

    updateGameState() {
        this.state.start('Game');
        this.loginSection.classList.add('hidden');
    }
}
