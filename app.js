import { appear, markAppear, buttonAni, winn } from "./animation.js";

// DOM Elements
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const startBtn = document.querySelector("#start-btn");
const gameContainer = document.querySelector("#gameContainer");
const msg = document.querySelector("#msg");
const turnID = document.querySelector("#turnID");
const starter = document.querySelector("#initializer");

// Game Variables
let turnO = true;
let turns = [];
let count = 0;

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


buttonAni();

// Reset Game
const resetGame = () => {
    turnO = true;
    turns = [];
    msg.classList.add("hide");
    turnID.classList.remove("hide");
    boxes.forEach((box) => {
        box.innerHTML = "";
        box.disabled = false;
        box.removeAttribute("data-marker");
        box.classList.remove("vanish");
    });
    resetBtn.innerText = "Reset Game";
    count = 0;
};

const initializer = () => {
    starter.classList.add("hide");
    gameContainer.classList.remove("hide");
    resetBtn.classList.remove("hide");
    appear();
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
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msg.classList.remove("hide");
    turnID.classList.add("hide");
    resetBtn.innerText = "New Game..?";
    confettiAnimation();
    winn();
    disableBoxes();
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
            showWinner(marker1);
            return true;
        }
    }
    return false;
};

// Handle Draw
const gameDraw = () => {
    msg.innerText = `You have taken too much time game is Draw.`;
    msg.classList.remove("hide");
    disableBoxes();
};

// Remove Turns
const turnRemover = () => {
    if (turns.length > 4) {
        const vanishBox = turns[4];
        const svg = vanishBox?.querySelector("svg");
        svg?.classList.add("vanish");
    }
    if (turns.length > 5) {
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
