import {
	appear,
	markAppear,
	buttonAni,
	winn,
	strokeAni,
	setttingAni,
} from "./animation.js";
import { audioList } from "./sfx.js";
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
const setGear = document.querySelector(".gear");
const setCon = document.querySelector(".settings");
const musicBtn = document.getElementById("music");
const soundBtn = document.getElementById("stopSounds");
const refresh = document.querySelector(".refresh");

// Game Variables
let turnO = true,
	turns = [],
	count = 0,
	play1 = 0,
	play2 = 0,
	gameMode = "",
	won = false,
	sound = false,
	music = false,
	setShow = true;
const { mark, click, swoosh, click1, bg } = audioList;

// Markers
const O = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="15vmin" height="15vmin" class="appear">
    <circle cx="50" cy="50" r="40" stroke="blue" stroke-width="10" fill="none" />
  </svg>`;
const X = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="15vmin" height="15vmin" class="appear">
    <line x1="20" y1="20" x2="80" y2="80" stroke="red" stroke-width="10" />
    <line x1="80" y1="20" x2="20" y2="80" stroke="red" stroke-width="10" />
  </svg>`;
const enaSound = `<path
            d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"
            />`;
const disaSound = `<path
            d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"
            />`;
const enaMusic = `<path
            d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z"
            />`;
const disaMusic = `<path
            d="M792-56 56-792l56-56 736 736-56 56ZM560-514l-80-80v-246h240v160H560v166ZM400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-62l80 80v120q0 66-47 113t-113 47Z"
            />`;

// Winning Patterns
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

// Reset Game
const resetGame = () => {
	turnO = true;
	won = false;
	turns = [];
	playSound(click1, 0.153);
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
	setupSounds();
	swoosh.play();
	buttonAni();
	bg.play();
	playSound(click1, 0.153);
};

function setupSounds() {
	bg.volume = 0.02;
	bg.loop = true;
	click1.volume = 0.7;
	music = sound = true;
	click.volume = 0.5;
	mark.volume = 0.4;
	swoosh.volume = 0.1;
}

const modeSlt = (mode) => {
	gameMode = mode;
	addHide(modeSelect);
	addHide(starter);
	rmHide(gameContainer);
	rmHide(resetBtn);
	swoosh.play();
	appear();
	playSound(click1, 0.153);
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
	disableBoxes();
	winn();
	if (winner === "X" && gameMode === "AI") {
		msg.innerText = `Sorry, Winner is ${winner} Try Again!`;
		return;
	} else {
		confettiAnimation();
	}
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

function toggleSettings() {
	playSound(click1, 0.153);
	if (setShow) {
		setCon.style.display = "flex";
	} else {
		setTimeout(() => {
			setCon.style.display = "none";
		}, 2000);
	}
	setttingAni();
	setShow = !setShow;
}

function toggleMusic() {
	music = !music;
	if (music) {
		bg.loop = true;
		bg.play();
		musicBtn.innerHTML = enaMusic;
	} else {
		bg.pause();
		musicBtn.innerHTML = disaMusic;
	}
	playSound(click1, 0.153);
}

function toggleSounds() {
	sound = !sound;
	if (sound) {
		setupSounds();
		soundBtn.innerHTML = enaSound;
	} else {
		muteAllSounds();
		soundBtn.innerHTML = disaSound;
	}
	playSound(click1, 0.153);
}

function muteAllSounds() {
	Object.values(audioList).forEach((audio) => {
		if (audio !== bg) {
			audio.pause();
			audio.currentTime = 0;
			audio.volume = 0;
		}
	});
}

function playSound(audio, currentTime = 0) {
	audio.currentTime = currentTime;
	audio.play();
}

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

const aiTurn = async () => {
	if (turnO || won) return;

	const emptyBoxes = Array.from(boxes).filter((box) => !box.innerHTML);
	let chosenBox =
		emptyBoxes.find((box) => canWin(box, "X")) ||
		emptyBoxes.find((box) => canWin(box, "O"));
	if (!chosenBox) {
		chosenBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
	}

	await caller(chosenBox, "X", 800);

	if (!won) {
		turnO = true;
		turnID.innerText = "O's Turn";
	}
	count++;
};

const caller = (box, marker, timeout) => {
	try {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(placeMarker(box, marker));
			}, timeout);
		});
	} catch (error) {
		//console.log(error);
	}
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

resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", initializer);
musicBtn.addEventListener("click", toggleMusic);
soundBtn.addEventListener("click", toggleSounds);
setGear.addEventListener("click", () => toggleSettings());
refresh.addEventListener("click", () => location.reload());
document.addEventListener("visibilitychange", function () {
	document.hidden ? bg.pause() : bg.play();
});

document.addEventListener("DOMContentLoaded", () => {
	const modeSelection = document.querySelectorAll(".ms");
	modeSelection.forEach((button) =>
		button.addEventListener("click", (event) =>
			modeSlt(event.target.dataset.mode)
		)
	);
});
