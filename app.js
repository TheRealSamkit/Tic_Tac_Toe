let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; //playerX, playerO
let O = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65">
              <circle cx="50" cy="50" r="40" stroke="blue" stroke-width="10" fill="none" />
            </svg>`;
let X = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65">
              <line x1="20" y1="20" x2="80" y2="80" stroke="red" stroke-width="10" />
              <line x1="80" y1="20" x2="20" y2="80" stroke="red" stroke-width="10" />
            </svg>`;
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

let turns = [];

const resetGame = () => {
    turnO = true;
    turns = [];
    enableBoxes();
    msg.classList.add("hide");
    boxes.forEach((box) => {
        box.removeAttribute("data-marker")
    })
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            //playerO
            placeMarker(box, 'O')
            turnO = false;
        } else {
            //playerX
            placeMarker(box, 'X')
            turnO = true;
        }
        box.disabled = true;
        turns.unshift(box);
        if (turns.length > 4) {
            let vanishBox = turns[turns.length - 1];
            let svg = vanishBox.querySelector("svg");
            svg.classList.add("vanish");
        }
        if (turns.length > 5) {
            let lastTurn = turns.pop();
            lastTurn.disabled = false;
            lastTurn.innerHTML = "";
            lastTurn.removeAttribute("data-marker");
        }

        checkWinner();
    });
});

const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    }
    )
};


const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("X", "O");
    }
    )
};

const showWinner = (winner) => {
    console.log(winner)
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msg.classList.remove("hide");
    resetBtn.innerText = "New Game..?"
    disableBoxes();
    confettiAnimation();
};
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1 = boxes[pattern[0]];
        let pos2 = boxes[pattern[1]];
        let pos3 = boxes[pattern[2]];

        let pos1Marker = pos1.getAttribute("data-marker");
        let pos2Marker = pos2.getAttribute("data-marker");
        let pos3Marker = pos3.getAttribute("data-marker");

        if (pos1Marker && pos1Marker === pos2Marker && pos2Marker === pos3Marker) {
            console.log("Winning pattern:", pattern); // Debugging
            showWinner(pos1Marker); // Pass the actual winner
            return true;
        }
    }
    return false; // No winner found
};


const placeMarker = (box, marker) => {
    if (!box.innerHTML) {
        box.innerHTML = (marker === 'O' ? O : X);
        box.setAttribute("data-marker", marker);
    }
}

const confettiAnimation = () => {
    let duration = 5 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    let interval = setInterval(function () {
        let timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        let particleCount = 50 * (timeLeft / duration);
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
}

resetBtn.addEventListener("click", resetGame);