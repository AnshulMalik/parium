function $(id) {
    return document.querySelector(id);
}

// TODO:
// Sound on score increment
// Try to use canvas

// Make the car look good
// Add scoreboard
// Avoid bot overlap
// Detect collision
// Resolve cars going up


let score = 0;
let step = 4;
const CONTAINER_HEIGHT = 600;
const CONTAINER_WIDTH = 400;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 65;
const LINT_HEIGHT = 100;
const NUM_LINES = 3;
const BOT_COUNT = 5;
const NUM_COLS = 6;
const COL_WIDTH = (CONTAINER_WIDTH) / NUM_COLS;

const container = $('.game-container');
const scoreContainer = $('#score');

const botSpeeds = [];

function getRoadBars() {
    return [$('#line-1'), $('#line-2'), $('#line-3')];
}
function getBotCars() {
    return document.querySelectorAll('.car');
}
function parse(val) {
    return parseInt(val.slice(0, -2)) || 0;
}

function generateNewBot(i, randomHorizontal) {
    const bots = getBotCars();
    const newBot = document.createElement('div');
    newBot.setAttribute('class', 'car');
    let y = -50;

    if(randomHorizontal) {
        y = generateBotVerticalPos();
    }

    newBot.style.top = y;
    newBot.style.left = generateBotHorizontalPos();

    if(isOverlapping({ x: parse(newBot.style.left), y }, bots)) {
        return generateNewBot();
    }

    botSpeeds[i] = Math.random() + 1;

    container.appendChild(newBot);
}

function generateBotHorizontalPos() {

    let i = Math.floor(Math.random() * 6);
    let left = i * COL_WIDTH + 5;
    return left;
}

function generateBotVerticalPos() {
    let bottom = Math.random() * CONTAINER_HEIGHT;
        
    while(bottom > CONTAINER_HEIGHT / 2) {
        bottom = Math.random() * CONTAINER_HEIGHT;
    }
    return bottom;
}

function init() {
    const emptyBetweenLines = CONTAINER_HEIGHT - (NUM_LINES - 1) * LINT_HEIGHT; 
    const bars = getRoadBars();

    bars[0].style.top = -LINT_HEIGHT;
    bars[1].style.top = emptyBetweenLines / 3;
    bars[2].style.top = 100 + emptyBetweenLines / 3 * 2;

    const car = $('#car');
    car.style.bottom = 0;
    car.style.left = CONTAINER_WIDTH / 4 - CAR_WIDTH / 2;

    for(let i = 0; i < BOT_COUNT; i++) {
        generateNewBot(i, true);
    }
}

function animateBots() {
    const botCars = getBotCars();
    botCars.forEach((bot, i) => {
        botTop = parse(bot.style.top);
        if(botTop > 600) {
            generateNewBot(i);
            incrementScore();
            return container.removeChild(bot);
        }

        bot.style.top = botTop + step * botSpeeds[i] - 1;
    });
}

function animateRoad() {
    const bars = getRoadBars();

    bars.forEach(bar => {
        barTop = parse(bar.style.top);
        if(barTop > 600) barTop = -100;
        bar.style.top = barTop + step;
    })
    
}

document.addEventListener('keydown', (event) => {
    const { keyCode } = event;
    const car = $('#car');
    const { bottom, left } = car.style;
    let carBottom = parse(bottom);
    let carLeft = parse(left);
    const A = 25;

    switch(keyCode) {
        case 37:
            // left
            carLeft -= A;
            break;
        case 38:
            // up
            carBottom += A;
            break;
        case 39:
            // right;
            carLeft += A;
            break;
        case 40:
            // down
            carBottom -= A;
            break;
    }

    if(carLeft > CONTAINER_WIDTH - CAR_WIDTH) carLeft = CONTAINER_WIDTH - CAR_WIDTH;
    if(carLeft < 0) carLeft = 0;
    if(carBottom > CONTAINER_HEIGHT - CAR_HEIGHT) carBottom = CONTAINER_HEIGHT - CAR_HEIGHT;
    if(carBottom < 0) carBottom = 0; 

    car.style.left = carLeft;
    car.style.bottom = carBottom;
})

function start() {
    const container = $('.game-container');
    const myCar = $('#car');
    animateRoad();
    animateBots();

    const botCars = getBotCars();

    if(isOverlapping(myCar.getBoundingClientRect(), botCars)) {
        return console.log("Game Over!");
    }

    setTimeout(start, 40);
}

init();
start();