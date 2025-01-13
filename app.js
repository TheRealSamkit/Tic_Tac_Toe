import { appear, markAppear, buttonAni, winn, strokeAni } from "./animation.js";
import { audioList } from "./sfx.js"
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
const modeSelect = document.querySelector("#mode-selection");

// Game Variables
let turnO = true;
let turns = [];
let count = 0;
let play1 = 0;
let play2 = 0;
let gameMode = "";
let won = false;
let { mark, click, swoosh } = audioList;

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
    won = false;
    turns = [];
    swoosh.play();
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

    if (gameMode === "AI") {
        turnO = true;
        aiTurn();
    }
};

const initializer = () => {
    addHide(startBtn);
    rmHide(modeSelect);
    swoosh.play();
    buttonAni();
};

const modeSlt = (mode) => {
    gameMode = mode;
    addHide(modeSelect);
    addHide(starter);
    rmHide(gameContainer);
    rmHide(resetBtn);
    swoosh.play();
    appear();
};

const rmHide = (element) => {
    element.classList.remove("hide");
};

const addHide = (element) => {
    element.classList.add("hide");
};

const placeMarker = (box, marker) => {
    if (!box.innerHTML) {
        if (marker === "O") {
            box.innerHTML = O;
            mark.play();
        } else {
            box.innerHTML = X;
            click.play();
        }
        box.setAttribute("data-marker", marker);
        markAppear();
        const svg = box.querySelector("svg");
        setTimeout(() => {
            svg.classList.remove("appear");
        }, 600);
        count++;
        turns.unshift(box);
        turnRemover();
        checkWinner();
        turnO = !turnO;
    }
};

const disableBoxes = () => boxes.forEach((box) => (box.disabled = true));

const showWinner = (winner) => {
    winner === "X" ? play2++ : play1++;
    scoreBd.innerText = `O : ${play1} , X : ${play2}`;
    msg.innerText = `Congratulations, Winner is ${winner}`;
    rmHide(msg);
    addHide(turnID);
    resetBtn.innerText = "New Game..?";
    won = true;
    confettiAnimation();
    disableBoxes();
    winn();
};

const strokeEdi = ([a, b, c]) => {
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
        if (a === 0 && c === 6) {
            strokeAni("90deg", "-20vmin", "0vmin");
        } else {
            strokeAni("90deg", "20vmin", "0vmin");
        }
    }
};

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
            strokeEdi([a, b, c]);
            return true;
        }
    }
    return false;
};

const gameDraw = () => {
    msg.innerText = `You have taken too much time game is Draw.`;
    rmHide(msg);
    disableBoxes();
};

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

boxes.forEach((box) =>
    box.addEventListener("click", () => {
        if (box.disabled || (gameMode === "AI" && !turnO)) return;
        turnID.innerText = turnO ? "X's Turn" : "O's Turn";
        placeMarker(box, turnO ? "O" : "X");
        box.disabled = true;
        count++;
        if (count === 100) gameDraw();
        if (gameMode === "AI" && !turnO && !won) {
            setTimeout(aiTurn(), 1000);
        }
    })
);

const confettiAnimation = () => {
    const duration = 3000;
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

resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", initializer);

document.addEventListener("DOMContentLoaded", () => {
    const modeSelection = document.querySelectorAll('.ms');
    modeSelection.forEach((button) => button.addEventListener("click", (event) => modeSlt(event.target.dataset.mode)));
});

const aiTurn = async () => {
    if (turnO || won) return;

    const emptyBoxes = Array.from(boxes).filter(box => !box.innerHTML);
    let chosenBox = emptyBoxes.find(box => canWin(box, "X")) || emptyBoxes.find(box => canWin(box, "O"));
    if (!chosenBox) {
        chosenBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    }
    await new Promise(resolve => setTimeout(() => {
        placeMarker(chosenBox, "X");
        resolve();
    }, 1000));

    if (!won) {
        turnO = true;
        turnID.innerText = "O's Turn";
    }
    count++;
};

const canWin = (box, marker) => {
    box.setAttribute("data-marker", marker);
    const isWinning = winPatterns.some(([a, b, c]) => {
        const [m1, m2, m3] = [
            boxes[a].getAttribute("data-marker"),
            boxes[b].getAttribute("data-marker"),
            boxes[c].getAttribute("data-marker"),
        ];
        return m1 === marker && m2 === marker && m3 === marker;
    });
    box.removeAttribute("data-marker");
    return isWinning;
};
