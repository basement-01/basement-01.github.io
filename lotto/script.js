//---document.quertSelector를 짧게 축약---//
const $main = document.querySelector('#main');
const $arr = document.querySelector('#arr');
const $valid = document.querySelector('#valid');
const $clear = document.querySelector('#clear');

//---초기 변수---//
let numbers = [];

//---리셋---//
const resetArr = () => {
  //---변수를 초기화하고 1부터 45까지 숫자를 배열에 넣는 기능---//
  numbers = [];
  $main.textContent = '';
  for (let i = 1; i <= 45; i++) {
    numbers.push(i);
  }
  updateArr();
};

//---그냥 배열 표시---//
const updateArr = () => {
  $arr.textContent = '';
  $arr.append(numbers.join(', '), document.createElement('br'));
};

//---뽑기 버튼 클릭 시 1~전체숫자 중에 랜덤하게 7개 뽑아서 나타내는 기능---//
$valid.addEventListener('click', () => {
  for (let i = 1; i <= 7; i++) {
    const lottoIndex = Math.floor(Math.random() * numbers.length);
    const lottoNumber = numbers.splice(lottoIndex, 1);

    if (numbers.length === 0) {
      $main.append('No more numbers!', document.createElement('br'));
      return;
    }
    $main.append(lottoNumber, document.createElement('br'));
  }
  $main.append('---', document.createElement('br'));
  updateArr();
});

//---리셋 버튼 클릭 시 내용 삭제해주는 기능---//
$clear.addEventListener('click', () => {
  resetArr();
});

resetArr();
