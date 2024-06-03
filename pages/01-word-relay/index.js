const numberOfPlayers1 = Number();
const $input = document.querySelector("input");
const $button = document.querySelector("button");
const $word = document.querySelector("#word");
const $order = document.querySelector("#order");
const $player = document.getElementById("player");
const $lastWord = document.getElementById("lastWord");

let currentWord;
let previousWord;

//! 시작 인구 정하는 함수
function numberOfPlayers() {
    $player.style.display = "none";
    $lastWord.style.display = "none";
    document.querySelector("#anno").textContent = "참가자는 몇 명인가요?";
    $input.placeholder = "숫자만 입력해주세요";
}

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
        alert("세 글자만 입력 가능합니다.");
        return false;
    }
    if (previousWord && previousWord[2] !== currentWord[0]) {
        alert("틀린 단어입니다.");
        return false;
    }
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
$button.addEventListener("click", handleClick);

//# 게임 시작
numberOfPlayers();
