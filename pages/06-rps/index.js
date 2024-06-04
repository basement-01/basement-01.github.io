// 축약
const $computer = document.querySelector("#computer");
const $score = document.querySelector("#score");
const $scissors = document.querySelector("#scissors");
const $rock = document.querySelector("#rock");
const $paper = document.querySelector("#paper");

const IMG_URL = "img/rsp.png";
// 스타일 변경
$computer.style.background = `url(${IMG_URL}) 0 0`;
$computer.style.backgroundSize = "auto 200px";

// 좌표 저장
const rspX = {
    scissors: "0",
    rock: "-220px",
    paper: "-440px",
};

// 가위바위보 루프
let computerChoice = "scissors";
const changeComputerHand = () => {
    if (computerChoice === "rock") {
        computerChoice = "scissors";
    } else if (computerChoice === "scissors") {
        computerChoice = "paper";
    } else if (computerChoice === "paper") {
        computerChoice = "rock";
    }
    $computer.style.background = `url(${IMG_URL}) ${rspX[computerChoice]} 0`;
    $computer.style.backgroundSize = "auto 200px";
};

// 스코어계산
const scoreTable = {
    scissors: 1,
    rock: 0,
    paper: -1,
};

// 버튼이벤트
let intervalId = setInterval(changeComputerHand, 20);
let clickable = true;
let score = 0;
const clickButton = (event) => {
    if (clickable) {
        clearInterval(intervalId);
        clickable = false;
        const myChoice =
            event.target.textContent === "바위" ? "rock" : event.target.textContent === "가위" ? "scissors" : "paper";
        const myScore = scoreTable[myChoice];
        const computerScore = scoreTable[computerChoice];
        const diff = myScore - computerScore;
        let message;
        if ([2, -1].includes(diff)) {
            score += 1;
            message = "승리";
        } else if ([-2, 1].includes(diff)) {
            score -= 1;
            message = "패배";
        } else {
            message = "무승부";
        }
        $score.textContent = `${message} 총: ${score}점`;
        setTimeout(() => {
            clickable = true;
            intervalId = setInterval(changeComputerHand, 20);
        }, 1000);
    }
};
$rock.addEventListener("click", clickButton);
$scissors.addEventListener("click", clickButton);
$paper.addEventListener("click", clickButton);
