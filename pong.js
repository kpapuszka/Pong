const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_WIDTH = 8;
const PLAYER_HEIGHT = 60;
const MARGIN_B0TTOM = 10;
const MARGIN_TOP = 40;
const FIELD_LINE_WIDTH = 4;
const MOVE_MIN = MARGIN_TOP + FIELD_LINE_WIDTH * 0.5 + 1;
const MOVE_MAX = HEIGHT - PLAYER_HEIGHT - MARGIN_B0TTOM - FIELD_LINE_WIDTH * 0.5 - 1;
const CENTER_X = WIDTH * 0.5;
const CENETR_Y = Math.round((HEIGHT + MARGIN_TOP - MARGIN_B0TTOM) * 0.5)
const PLAYER_INITIALY_Y = Math.round((HEIGHT - MARGIN_TOP - MARGIN_B0TTOM - PLAYER_HEIGHT) * 0.5 + MARGIN_TOP)
const BALL_SIZE = 12
const deg2rad = deg => deg * Math.PI / 180;



class Background {
    constructor (width, height) {
        this.canvas = document.createElement('CANVAS');
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.width = width;
        this.height = height;

        this.create();
    }

    create() {
        const ctx = this.canvas.getContext('2d');

        ctx.fillRect(0,0,this.width,this.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = FIELD_LINE_WIDTH;

        ctx.beginPath();
        ctx.moveTo(MARGIN_B0TTOM,MARGIN_TOP);
        ctx.lineTo(this.width - 10, MARGIN_TOP);

        ctx.moveTo(MARGIN_B0TTOM, this.height - 10);
        ctx.lineTo(this.width - 10, this.height - 10);

        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([10, 6]); //przerywana linia
        ctx.moveTo(this.width / 2, 40);
        ctx.lineTo(this.width / 2, this.height - 10);

        ctx.stroke();

    }
    draw(ctx) {
        ctx.drawImage(this.canvas,0,0);
    }
}

class Ball {
    constructor() {
        this.canvas = document.createElement('CANVAS');
        this.canvas.setAttribute("width", BALL_SIZE);
        this.canvas.setAttribute("height", BALL_SIZE);

        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,BALL_SIZE,BALL_SIZE);

        this.reset();
    }

    generate() {
        return {
            angle: Math.round(Math.random() * 30 + 30), 
            dir: {
                x: Math.round(Math.random()) > 0 ? 1 : -1,
                y: Math.round(Math.random()) > 0 ? 1 : -1
            }
        };
         
    }

    reset() {
        const data = this.generate();  
        this.x = CENTER_X - BALL_SIZE * 0.5;
        this.y = CENETR_Y - BALL_SIZE * 0.5;
        this.m = {
            x: Math.cos(deg2rad(data.angle)) * data.dir.x,
            y: Math.sin(deg2rad(data.angle) * data.dir.y)};
        this.over = false
        this.speed = 5
        

    }

    move(leftPlayerY, rightPlayerY) {
        if(this.y <= MOVE_MIN && this.m.y < 0) {
            this.m.y = 1
            this.speed += 0.1;
        }
        if(this.y >= (MOVE_MAX + PLAYER_HEIGHT - BALL_SIZE) && this.m.y > 0) {
            this.m.y = -1
            this.speed += 0.1;
        }
        if (!this.over && this.x <= (15 + PLAYER_WIDTH) && this.m.x < 0 ) {
            if ((this.y + BALL_SIZE) >= leftPlayerY && this.y <= (leftPlayerY + PLAYER_HEIGHT)) {
                this.m.x = 1;
                this.speed += 0.1;
            } else {
                this.over = true
            }
        }
        if (!this.over && this.x >= (785 - PLAYER_WIDTH - PLAYER_WIDTH) && this.m.x > 0 ) {
            if ((this.y + BALL_SIZE) >= rightPlayerY && this.y <= (rightPlayerY + PLAYER_HEIGHT)) {
                this.m.x = 1;
                this.speed += 0.1;
            } else {
                this.over = true
            }
        }
        /*if(this.x >= (WIDTH - BALL_SIZE) && this.m.x > 0) {
            this.m.x = -1
            this.speed += 0.1;
        }*/
        
        this.x += this.m.x * this.speed;
        this.y += this.m.y * this.speed;
    }

    draw (ctx) {
        ctx.drawImage(this.canvas, this.x, this.y);
    }
}

class Player {
    constructor(x) {
        this.canvas = document.createElement('CANVAS');
        this.canvas.setAttribute("width", PLAYER_WIDTH);
        this.canvas.setAttribute("height", PLAYER_HEIGHT);
        
        this.x = x;
        this.y = PLAYER_INITIALY_Y;
        this.isMoving = false;
        this.speed = 0;
        this.points = 0

        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,PLAYER_WIDTH,PLAYER_HEIGHT);
    }



    draw (ctx) {
        ctx.drawImage(this.canvas, this.x, this.y);
    }

    addPoints() {
        switch(this.points) {
            case 0: 
                this.points = 15;
                break;
            case 15: 
                this.points = 30;
                break;
            case 30: 
                this.points = 40;
                break;
            case 40: 
                this.points = 0;
                break;
        }
    }

    stop() {
        this.speed = 0;
        this.isMoving = false;
    }
    moveUP() {
        if(this.isMoving) {
            return
        }
        this.speed = -8;
        this.isMoving = true;
        this.move();
    }
    MoveDown() {
        if(this.isMoving) {
            return
        }
        this.speed = 8;
        this.isMoving = true;
        this.move();
    }

    move() {
        this.y += this.speed;
        if(this.y > MOVE_MAX) {
            this.y = MOVE_MAX;
            this.stop();
        } else if (this.y < MOVE_MIN) {
            this.y = MOVE_MIN;
            this.stop();
        } 

        if(this.isMoving ) {
            setTimeout(() => this.move(), 20);
        }
    }
    
}

class Pong {
    constructor(width = 800, height = 600) {
        this.background = new Background(width,height);
        this.player = new Player(15);
        this.playerB = new Player(785 - PLAYER_WIDTH);
        this.started = false
        this.Ball = new Ball;
        this.canvas = document.createElement('CANVAS');
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        //this.player

        //this.canvas.addEventListener('mousemove', e => {
            //this.player.move(e.offsetY);
            //this.playerB.move(e.offsetY);
            //this.draw();
        //});

        this.ctx = this.canvas.getContext('2d');
        
        this.width = width;
        this.height = height;

    }


    draw() {
        this.background.draw(this.ctx);
        this.ctx.fillStyle = "white";
        this.ctx.font = "normal 26px 'Nova Square'"; 
        this.ctx.fillText (`Player A: ${this.player.points}`, 30, 30)
        this.ctx.fillText (`Player B: ${this.playerB.points}`, 630, 30)

        this.player.draw(this.ctx);
        this.playerB.draw(this.ctx);
        this.Ball.draw(this.ctx);

        if (this.started) {
            this.Ball.move(this.player.y)
            if (this.Ball.over) {
                this.status = "Player B wins!"; 
                this.playerB.addPoints();
                this.started = false;
                this.Ball.reset();
            }
            //this.started = !this.Ball.over
        }


        if(this.status) {
            this.ctx.fillText(this.status,310,30);
        }

        window.requestAnimationFrame(() => this.draw());
    }

    handleKey(state, event) {
        console.log(`Key ${event.key} is ${state} (${event.repeat})`)
        const keyIsPressed = state == 'down';
        switch(event.code) {
            case 'Space':
                this.started = true;
                this.status = "";
                break;
            case 'ArrowUp':
                keyIsPressed ? this.player.moveUP() : this.player.stop();
                break;
            case 'ArrowDown':
                keyIsPressed ? this.player.MoveDown() : this.player.stop();
                break
            case 'KeyW':
                keyIsPressed ? this.playerB.moveUP() : this.playerB.stop();
                break;
            case 'KeyS':
                keyIsPressed ? this.playerB.MoveDown() : this.playerB.stop();
                break
        }
        if (state === 'down' && event.key === 'ArrowUp') {
            this.player.moveUP();
        }else if(state === 'down' && event.key === 'ArrowDown') {
            this.player.MoveDown();
        } else {
            this.player.stop();
        }
    }

    init() {
        document.body.appendChild(this.canvas);
        this.draw();

        //const canvas = document.getElementById('game');
        //this.ctx = canvas.getContext('2d');
        //this.ctx.fillRect(0,0,800,600);
    }
}

const game = new Pong();

window.addEventListener('keydown', event => !event.repeat && game.handleKey('down',event))
window.addEventListener('keyup', event => !event.repeat && game.handleKey('up',event))
window.addEventListener('DOMContentLoaded', () => game.init());