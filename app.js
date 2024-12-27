let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; //playerX, playerO
let count = 0; //To Track Draw

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

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            //playerO
            placeMarker(box, 'O')
            box.classList.add("O");
            turnO = false;
        } else {
            //playerX
            placeMarker(box, 'X')
            turnO = true;
            box.classList.add("X");
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();

        if (count === 9 && !isWinner) {
            gameDraw();
        }
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
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
};

const placeMarker = (box, marker) => {
    if (!box.innerHTML) {
        box.innerHTML = marker === 'O' ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
              <circle cx="50" cy="50" r="40" stroke="blue" stroke-width="10" fill="none" />
            </svg>` : `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
              <line x1="20" y1="20" x2="80" y2="80" stroke="red" stroke-width="10" />
              <line x1="80" y1="20" x2="20" y2="80" stroke="red" stroke-width="10" />
            </svg>`;
    }
}


newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);