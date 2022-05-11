class Pong {
    constructor() {}
    init() {
        const canvas = document.getElementById('game');
        this.ctx = canvas.getContext('2d');
        this.ctx.fillRect(0,0,800,600);
    }
}

const game = new Pong();

window.addEventListener('DOMContentLoaded', () => game.init());