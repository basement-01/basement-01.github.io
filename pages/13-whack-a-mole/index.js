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
let score = 0;
let time = 60000;

//! 시작버튼 이벤트
$start.addEventListener("click", () => {
  if (started) {
    return;
  }
  started = true;
  console.log("시작");
  const timerId = setInterval(() => {
    time = time - 100;
    $timer.textContent = time / 1000 + "초";
    if (time === 0) {
      clearInterval(timerId);
      clearInterval(tickId);
      console.log("게임 오버! " + score + "점입니다.");
    }
  }, 100);
  const tickId = setInterval(tick, 1000);
});

//! 두더지, 폭탄 위치 보여주기
let gopherPercent = 0.3;
let bombPercent = 0.5;
function tick() {
  holes.forEach((hole, index) => {
    if (hole) {
      return;
    }
    const randomValue = Math.random();
    if (Math.random() < gopherPercent) {
      const $gopher = $$cells[index].querySelector(".gopher");
      holes[index] = setTimeout(() => {
        $gopher.classList.add("hidden");
        holes[index] = 0;
      }, 1000);
      $gopher.classList.remove("hidden");
    } else if (Math.random() < bombPercent) {
      const $bomb = $$cells[index].querySelector(".bomb");
      holes[index] = setTimeout(() => {
        $bomb.classList.add("hidden");
        holes[index] = 0;
      }, 1000);
      $bomb.classList.remove("hidden");
    }
  });
}

//! 두더지, 폭탄 클릭 이벤트
$$cells.forEach(($cell, index) => {
  $cell.querySelector(".gopher").addEventListener("click", (event) => {
    if (!event.target.classList.contains("dead")) {
      score += 1;
      $score.textContent = score + "점";
    }
    event.target.classList.add("dead");
    event.target.classList.add("hidden");
    clearTimeout(holes[index]);
    setTimeout(() => {
      holes[index] = 0;
      event.target.classList.remove("dead");
    }, 1000);
  });
  $cell.querySelector(".bomb").addEventListener("click", (event) => {
    event.target.classList.add("boom");
    event.target.classList.add("hidden");
    clearTimeout(holes[index]);
    setTimeout(() => {
      holes[index] = 0;
      event.target.classList.remove("boom");
    }, 1000);
  });
});
