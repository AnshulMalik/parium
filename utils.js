function isOverlapping(rect, botCars) {
    let overlapped = false;
    console.log(rect, botCars);
    botCars.forEach(botCar => {
        let overlapping = areRectOverlapping(rect, botCar.getBoundingClientRect())
        console.log(rect, botCar.getBoundingClientRect(), overlapping);
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

function incrementScore() {
    score++;
    if(score == prevFib + curFib) {
        step++;
        let temp = prevFib;
        prevFib = curFib;
        curFib += temp;
    }
    scoreContainer.innerHTML = score;
}