//! 축약
const $timer = document.querySelector("#timer");
const $score = document.querySelector("#score");
const $game = document.querySelector("#game");
const $start = document.querySelector("#start");
const $$cells = document.querySelectorAll(".cell");

//! 상수
const holes = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//! 변수
let started = false;

//! 시작버튼 이벤트
$start.addEventListener("click", () => {
  if (started) {
    return;
  }
  started = true;
  console.log("시작");
  const tickId = setInterval(tick, 1000);
  tick();
});

//! 두더지, 폭탄 위치 보여주기
function tick() {
  holes.forEach((hole, index) => {
    if (hole) {
      return;
    }
    const $gopher = $$cells[index].querySelector(".gopher");
    holes[index] = setTimeout(() => {
      $gopher.classList.add("hidden");
      holes[index] = 0;
    }, 1000);
    $gopher.classList.remove("hidden");
  });
}
