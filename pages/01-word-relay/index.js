const $input = document.querySelector("input");
const $button = document.querySelector("button");
const $word = document.querySelector("#word");
const $log = document.querySelector("#log");
const $order = document.querySelector("#order");
const $player = document.getElementById("player");
const $lastWord = document.getElementById("lastWord");

let numberOfPlayers;
let currentWord;
let previousWord;
let firstPlayer = true;

//---화면을 업데이트시켜주는 함수---//
const updateDisplay = () => {
    $word.textContent = currentWord;
    $order.textContent = (Number($order.textContent) % numberOfPlayers) + 1;
    $input.value = "";
    $input.focus();
};

//---단어체크하는 함수---ㅖ//
const validateWord = () => {
    if (currentWord.length !== 3) {
        $log.textContent = "세 글자만 입력 가능합니다";
        $input.value = "";
        $input.focus();
        return false;
    }
    if (previousWord && previousWord[2] !== currentWord[0]) {
        $log.textContent = "틀린 단어입니다";
        $input.value = "";
        $input.focus();
        return false;
    }
    $log.textContent = "";
    document.querySelector("#log1").prepend(currentWord, document.createElement("br"));
    return true;
};

//---인풋반환하는 함수---//
const handleInput = (event) => {
    currentWord = event.target.value;
};

//---단어체크 true면 제시어 저장하고 화면 업데이트하는 함수---//
const handleClick = () => {
    if (validateWord()) {
        previousWord = currentWord;
        updateDisplay();
    }
};

//---입력버튼 함수---//
$input.addEventListener("input", handleInput);
$input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        playerNum();
    }
});
$button.addEventListener("click", playerNum);

function playerNum() {
    if (!firstPlayer) {
        handleClick();
        return;
    }
    if (!Number(currentWord) || currentWord.includes(" ")) {
        $log.textContent = "숫자만 입력해주세요";
        return;
    }
    firstPlayer = false;
    numberOfPlayers = currentWord;
    document.getElementById("anno").style.display = "none";
    $player.style.display = "block";
    $lastWord.style.display = "block";
    $input.value = "";
    $input.placeholder = "세 글자 단어를 입력해주세요";
    $log.textContent = "첫 제시어를 입력해주세요";
    $input.focus();
}

//# 게임 시작
$player.style.display = "none";
$lastWord.style.display = "none";
document.querySelector("#anno").textContent = "참가자는 몇 명인가요?";
$input.placeholder = "숫자만 입력해주세요";
