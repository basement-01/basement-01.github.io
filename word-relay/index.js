const numberOfPlayers = Number(prompt('참가자는 몇 명인가요?'));
const $input = document.querySelector('input');
$input.focus();
const $button = document.querySelector('button');
const $word = document.querySelector('#word');
const $order = document.querySelector('#order');

let currentWord;
let previousWord;

//---화면을 업데이트시켜주는 함수---//
const updateDisplay = () => {
  $word.textContent = currentWord;
  $order.textContent = (Number($order.textContent) % numberOfPlayers) + 1;
  $input.value = '';
  $input.focus();
};

//---단어체크하는 함수---ㅖ//
const validateWord = () => {
  if (currentWord.length !== 3) {
    alert('세 글자만 입력 가능합니다.');
    return false;
  }
  if (previousWord && previousWord[2] !== currentWord[0]) {
    alert('틀린 단어입니다.');
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
$input.addEventListener('input', handleInput);
$input.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    handleClick();
  }
});
$button.addEventListener('click', handleClick);
