//! 축약
const $wrapper = document.querySelector("#wrapper");
const $watch = document.querySelector("#stopwatch");
const $start = document.querySelector("#startButton");
const $message = document.querySelector("#message");

//! 상수
const total = 12; // 전체 카드 수
const colors = ["red", "orange", "yellow", "green", "white", "pink"]; // 카드 색

//! 변수
let colorCopy = colors.concat(colors); // 카드 색 복사
let shuffled = []; // 섞은 카드 배열
let clicked = []; // 클릭한 카드 배열
let completed = []; // 완료 카드 배열
let clickable = false; // 클릭 가능 여부
let startTime; // 시작 시간
let updatedTime; // 경과 시간
let difference; // 둘의 차이
let tInterval; // 1ms마다 업데이트
let running = false; // 초시계 멈춤제어

//! 카드 셔플 함수
function shuffle() {
    // 피셔-예이츠 셔플 알고리즘
    for (; colorCopy.length > 0; ) {
        const randomIndex = Math.floor(Math.random() * colorCopy.length);
        shuffled = shuffled.concat(colorCopy.splice(randomIndex, 1));
    }
}

//! 카드 생성 함수
function createCard(i) {
    const card = document.createElement("div");
    card.className = "card"; // .card 태그 생성
    const cardInner = document.createElement("div");
    cardInner.className = "card-inner"; // .card-inner 태그 생성
    const cardBack = document.createElement("div");
    cardBack.className = "card-back"; // .card-back 태그 생성
    const cardFront = document.createElement("div");
    cardFront.className = "card-front"; // .card-front 태그 생성
    cardFront.style.backgroundColor = shuffled[i]; // 카드 색
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    card.appendChild(cardInner);
    return card;
}

//! 게임 시작 함수
function startGame() {
    $start.style.display = "none";
    $watch.innerHTML = "0.000" + "초";
    $wrapper.innerHTML = "";
    $message.innerHTML = "";
    shuffle();
    for (let i = 0; i < total; i++) {
        const card = createCard(i);
        card.addEventListener("click", onClickCard);
        $wrapper.appendChild(card);
    }
    document.querySelectorAll(".card").forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("flipped");
        }, 1000 + 100 * index);
    });
    setTimeout(() => {
        document.querySelectorAll(".card").forEach((card) => {
            card.classList.remove("flipped");
        });
        setTimeout(() => {
            clickable = true;
            stopwatch();
        }, 800);
    }, 5000);
}

//! 클릭한 카드 확인 함수
function onClickCard() {
    if (!clickable || completed.includes(this) || clicked[0] === this) {
        return;
    }
    this.classList.toggle("flipped");
    clicked.push(this);
    if (clicked.length !== 2) {
        return;
    }
    const front1Color = clicked[0].querySelector(".card-front").style.backgroundColor;
    const front2Color = clicked[1].querySelector(".card-front").style.backgroundColor;
    if (front1Color === front2Color) {
        completed.push(clicked[0]);
        completed.push(clicked[1]);
        clicked = [];
        if (completed.length !== total) {
            return;
        }
        setTimeout(() => {
            clearInterval(tInterval);
            $message.append("축하합니다! 기록은 " + (difference / 1000).toFixed(3) + "초 입니다.");
            resetGame();
        }, 800);
        return;
    }
    clickable = false;
    setTimeout(() => {
        clicked[0].classList.remove("flipped");
        clicked[1].classList.remove("flipped");
        clicked = [];
        setTimeout(() => {
            clickable = true;
        }, 800);
    }, 800);
}

//! 초시계 함수
function stopwatch() {
    if (!running) {
        startTime = new Date().getTime();
        tInterval = setInterval(updateTime, 1);
        running = true;
    }
}
//! 초시계 업데이트 함수
function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    $watch.innerHTML = (difference / 1000).toFixed(3) + "초";
}

//! 게임 리셋 함수
function resetGame() {
    document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("flipped");
    });
    running = false;
    clickable = false;
    colorCopy = colors.concat(colors);
    shuffled = [];
    completed = [];
    setTimeout(() => {
        $watch.innerHTML = "0.000" + "ms";
        $start.style.display = "block";
    }, 800);
}

//# 게임 시작
$start.onclick = () => {
    startGame();
};

//# 기본 세팅
for (let i = 0; i < total; i++) {
    const card = createCard(i);
    card.addEventListener("click", onClickCard);
    $wrapper.appendChild(card);
}
$watch.innerHTML = "0.000" + "초";
