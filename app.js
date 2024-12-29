import { appear, markAppear, buttonAni, winn, strokeAni, rotate, translateY, translateX } from "./animation.js";

// DOM Elements
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const startBtn = document.querySelector("#start-btn");
const gameContainer = document.querySelector("#gameContainer");
const msg = document.querySelector("#msg");
const turnID = document.querySelector("#turnID");
const starter = document.querySelector("#initializer");
const stroke = document.querySelector(".stroke");
const scoreBd = document.querySelector(".score");

// Game Variables
let turnO = true;
let turns = [];
let count = 0;
let play1 = 0;
let play2 = 0;

// Markers
const O = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65" class="appear">
    <circle cx="50" cy="50" r="40" stroke="blue" stroke-width="10" fill="none" />
  </svg>`;
const X = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65" class="appear">
    <line x1="20" y1="20" x2="80" y2="80" stroke="red" stroke-width="10" />
    <line x1="80" y1="20" x2="20" y2="80" stroke="red" stroke-width="10" />
  </svg>`;

// Winning Patterns
const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8],
];

// Reset Game
const resetGame = () => {
    turnO = true;
    turns = [];
    addHide(msg);
    rmHide(turnID);
    addHide(stroke);
    boxes.forEach((box) => {
        box.innerHTML = "";
        box.disabled = false;
        box.removeAttribute("data-marker");
        box.classList.remove("vanish");
    });
    turnID.innerText = turnO ? "O's Turn" : "X's Turn";
    resetBtn.innerText = "Reset Game";
    count = 0;
};

const initializer = () => {
    addHide(starter);
    rmHide(gameContainer);
    rmHide(resetBtn);
    appear();
    buttonAni();
}

const rmHide = (element) => {
    element.classList.remove("hide");
}

const addHide = (element) => {
    element.classList.add("hide");
}


// Place Marker
const placeMarker = (box, marker) => {
    if (!box.innerHTML) {
        box.innerHTML = marker === "O" ? O : X;
        box.setAttribute("data-marker", marker);
        markAppear();
        const svg = box.querySelector("svg");
        setTimeout(() => {
            svg.classList.remove("appear");
        }, 600);
    }
};

// Disable All Boxes
const disableBoxes = () => boxes.forEach((box) => (box.disabled = true));

// Show Winner
const showWinner = (winner, [a, b, c]) => {
    winner === "X" ? play2++ : play1++;
    scoreBd.innerText = `O : ${play1} , X : ${play2}`;
    msg.innerText = `Congratulations, Winner is ${winner}`;
    rmHide(msg)
    addHide(turnID);
    resetBtn.innerText = "New Game..?";
    confettiAnimation();
    disableBoxes();
    winn();

    rmHide(stroke);
    if (b === 4) {
        if (a === 2 && c === 6) {
            strokeAni("-45deg", "0vmin", "0vmin");
        } else if (a === 0 && c === 8) {
            strokeAni("45deg", "0vmin", "0vmin");
        } else if (a === 1 && c === 7) {
            strokeAni("90deg", "0vmin", "0vmin");
        } else {
            strokeAni("0deg", "0vmin", "0vmin");
        }
    } else if (b === 1 || b === 7) {
        if (a === 0 && c === 2) {
            strokeAni("0deg", "0vmin", "-20vmin");
        } else {
            strokeAni("0deg", "0vmin", "20vmin");
        }
    } else {
        console.log("in");
        if (a === 0 && c === 6) {
            strokeAni("90deg", "0vmin", "-20vmin");
        } else {
            strokeAni("90deg", "0vmin", "20vmin");
        }
    }

};

// Check for Winner
const checkWinner = () => {
    for (let [a, b, c] of winPatterns) {
        const [pos1, pos2, pos3] = [boxes[a], boxes[b], boxes[c]];
        const [marker1, marker2, marker3] = [
            pos1.getAttribute("data-marker"),
            pos2.getAttribute("data-marker"),
            pos3.getAttribute("data-marker"),
        ];
        if (marker1 && marker1 === marker2 && marker2 === marker3) {
            showWinner(marker1, [a, b, c]);
            return true;
        }
    }
    return false;
};

// Handle Draw
const gameDraw = () => {
    msg.innerText = `You have taken too much time game is Draw.`;
    rmHide(msg);
    disableBoxes();
};

// Remove Turns
const turnRemover = () => {
    if (turns.length > 5) {
        const vanishBox = turns[5];
        const svg = vanishBox?.querySelector("svg");
        svg?.classList.add("vanish");
    }
    if (turns.length > 6) {
        const lastTurn = turns.pop();
        lastTurn.disabled = false;
        lastTurn.innerHTML = "";
        lastTurn.removeAttribute("data-marker");
        lastTurn.querySelector("svg")?.classList.remove("vanish");
    }
};

// Box Click Handler
boxes.forEach((box) =>
    box.addEventListener("click", () => {
        turnID.innerText = turnO ? "X's Turn" : "O's Turn";
        placeMarker(box, turnO ? "O" : "X");
        turns.unshift(box);
        turnRemover();
        turnO = !turnO;
        box.disabled = true;
        count++;
        if (count === 150) gameDraw();
        checkWinner();
    })
);

// Confetti Animation
const confettiAnimation = () => {
    const duration = 5000; // 5 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        const createConfetti = (x) =>
            confetti({
                ...defaults,
                particleCount,
                origin: { x, y: Math.random() - 0.2 },
            });
        createConfetti(0.2);
        createConfetti(0.8);
    }, 250);
};

// Reset Button Event
resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", initializer);
