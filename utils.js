let score = 0;

function $(id) {
    return document.querySelector(id);
}

function generateBotHorizontalPos() {

    let i = Math.floor(Math.random() * NUM_COLS);
    let left = i * COL_WIDTH + 5;
    return left;
}

function generateBotVerticalPos() {
    let bottom = Math.random() * 100;

    return -bottom;
}

function botStrikeBot(bot1, bot2) {
    if(bot1.x != bot2.x) return false;

    // bot1 is above bot2
    if(bot1.y > bot2.y) {
        let temp = bot1;
        bot1 = bot2;
        bot2 = temp;
    }

    let t1 = (bot2.y - bot1.y - CAR_HEIGHT) / (bot1.speed - bot2.speed);
    let t2 = (CONTAINER_HEIGHT - bot1.y) / bot1.speed;

    if(t1 > 0 && t1 < t2)
        return true;
    
    return false;
}

function crashes(car, otherCar) {
    let myLeft = car.x;
    let myRight = car.x + CAR_WIDTH;
    let myTop = car.y;
    let myBottom = car.y + CAR_HEIGHT;

    let otherLeft = otherCar.x;
    let otherRight = otherCar.x + CAR_WIDTH;
    let otherTop = otherCar.y;
    let otherBottom = otherCar.y + CAR_HEIGHT;

    if(Math.abs(myLeft - otherLeft) < CAR_WIDTH && Math.abs(myTop - otherTop) < CAR_HEIGHT)
        return true;
    
    return false;
}

const soundContainer = $('#sound');

function isOverlapping(rect, botCars) {
    let overlapped = false;
    // console.log(rect, botCars);
    botCars.forEach(botCar => {
        let overlapping = areRectOverlapping(rect, botCar.getBoundingClientRect())
        // console.log(rect, botCar.getBoundingClientRect(), overlapping);
        if(overlapping) overlapped = true;
    })

    return overlapped;
}

function areRectOverlapping({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    if(Math.abs(x1 - x2) < CAR_WIDTH && Math.abs(y1 - y2) < CAR_HEIGHT) {
        return true;
    }

    return false;
}
let prevFib = 1, curFib = 1;

function incrementScore(gameArea) {
    gameArea.score++;
    if(gameArea.score == prevFib + curFib) {
        gameArea.step++;
        let temp = prevFib;
        prevFib = curFib;
        curFib += temp;
    }
}

function playSound() {
    $('#sound').play();
}