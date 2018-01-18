let piece;

const CONTAINER_HEIGHT = 600;
const CONTAINER_WIDTH = 400;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 65;
const LINT_HEIGHT = 100;
const NUM_LINES = 3;
const BOT_COUNT = 7;
const NUM_COLS = 12;
const COL_WIDTH = (CONTAINER_WIDTH) / NUM_COLS;

function willStrike(car, isBot) {
    let flag = false;
    bots.forEach(bot => {
        if(bot == car) return false;
        if(isBot && botStrikeBot(car, bot)) {
            flag = true;
        }
        if (crashes(car, bot)) {
            flag = true;
        }
    })

    return flag;
}

function Strip(x, y) {
    this.x = x;
    this.y = y;

    this.update = function() {
        this.y += myGameArea.step;
        if(this.y > 600) this.y = -100;
        let ctx = myGameArea.ctx;
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, 10, LINT_HEIGHT);    
    }

    this.update();
}

function Car(isBot, x, y) {
    let img = document.createElement('img');
    img.src = isBot ? 'img/car.png' : 'img/my-car.png';
    this.width = CAR_WIDTH;
    this.height = CAR_HEIGHT;
    let ctx = myGameArea.ctx;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    
    this.refresh = function() {
        this.x = isBot ? generateBotHorizontalPos() : x;
        this.y = isBot ? generateBotVerticalPos() : y;
        this.speed = Math.random();
        if(this.speed < .5) this.speed = .5;
        if(willStrike(this, true)) {
            this.refresh();
        }
    }

    this.refresh();
    
    this.update = function() {
        let ctx = myGameArea.ctx;
        ctx.drawImage(img, this.x, this.y, CAR_WIDTH, CAR_HEIGHT);
    }

    this.tick = function() {
        this.y += this.speed * myGameArea.step;
        if(this.y > CONTAINER_HEIGHT + 20) {
            playSound();
            incrementScore(myGameArea);
            setHighScore(myGameArea.score);
            this.refresh();
        }
        this.update();
    }
}

function updateGameArea() {
    myGameArea.clear();
    const { direction } = myGameArea;
    let A = 5;
    if(direction) {
        switch(direction) {
            case 37:
                // left
                piece.x -= A;
                break;
            case 38:
                piece.y -= A
                break;
            case 39:
                piece.x += A;
                break;
            case 40:
                piece.y += A;
        }
        if(piece.x > CONTAINER_WIDTH - CAR_WIDTH) piece.x = CONTAINER_WIDTH - CAR_WIDTH;
        else if(piece.x < 0) piece.x = 0;
        
        if(piece.y > CONTAINER_HEIGHT - CAR_HEIGHT) piece.y = CONTAINER_HEIGHT - CAR_HEIGHT;
        else if(piece.y < 0) piece.y = 0; 
    
    }  
    myGameArea.updateScore();
    for(let i = 0; i < strips.length; i++) {
        strips[i].update();
    }
    for(let i = 0; i < bots.length; i++) {
        bots[i].tick();
    }
    
    if(willStrike(piece)) {
        showMenu();
        myGameArea.reset();
        resetGlobals();
        clearInterval(myGameArea.interval);
    }
    piece.update();
}

const myGameArea = {
    canvas : document.createElement("canvas"),
    step: 5,
    score: 0,
    init: function() {
        this.canvas.width = CONTAINER_WIDTH;
        this.canvas.height = CONTAINER_HEIGHT;
        this.ctx = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        window.addEventListener('keydown', function(e) {
            const { keyCode } = e;
            myGameArea.direction = keyCode;
        })
        window.addEventListener("keyup", function(e) {
            myGameArea.direction = null;
        })

        this.clear();
    },
    start : function() {
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    updateScore: function() {
        this.ctx.fillStyle = '#fff'
        this.ctx.font = "30px Arial";
        this.ctx.fillText(this.score, 10, 30);
    },
    reset: function() {
        clearInterval(this.interval);
        this.clear();
        this.score = 0;
        this.step = 5;
    }
}

let bots = [];
const strips = [];

function startGame() {
    myGameArea.start();
    piece = new Car(false, 30, 400);
    for(let i = 0; i < BOT_COUNT; i++) {
        bots[i] = new Car(true);
    }
    const emptyBetweenLines = CONTAINER_HEIGHT - (NUM_LINES - 1) * LINT_HEIGHT; 

    let x = CONTAINER_WIDTH / 2 - 5;
    
    strips[0] = new Strip(x, -LINT_HEIGHT);
    strips[1] = new Strip(x, emptyBetweenLines/ 3);
    strips[2] = new Strip(x, LINT_HEIGHT + emptyBetweenLines / 3 * 2);
}

// startGame();

myGameArea.init();
$('#high-score').innerText = getHighScore();