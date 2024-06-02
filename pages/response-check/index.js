// 축약 //
const $screen = document.querySelector("#screen");
const $result = document.querySelector("#result");

const records = [];

const START_TEXT = "클릭해서 테스트를 시작하세요";

// 변수 //
let startTime;
let endTime;
let timeoutId;

// 클릭 기능 //

$screen.textContent = START_TEXT;

$screen.addEventListener("click", function () {
    if ($screen.classList.contains("waiting")) {
        clearTimeout(timeoutId);
        $screen.classList.replace("waiting", "ready");
        $screen.textContent = "초록색이 되면 클릭하세요";
        timeoutId = setTimeout(function () {
            startTime = new Date();
            $screen.classList.replace("ready", "now");
            $screen.textContent = "클릭하세요!!";
        }, Math.floor(Math.random() * 1000) + 2000);
    } else if ($screen.classList.contains("ready")) {
        clearTimeout(timeoutId);
        $screen.classList.replace("ready", "waiting");
        $screen.textContent = "너무 성급하군요!";
        timeoutId = setTimeout(() => {
            $screen.textContent = START_TEXT;
        }, 1000);
    } else if ($screen.classList.contains("now")) {
        endTime = new Date();
        const current = endTime - startTime;
        records.push(current);
        const average = records.reduce((acc, cur) => acc + cur) / records.length;
        $result.textContent = `현재 ${current}ms, 평균 ${average.toFixed(1)}ms`;

        const topFive = records.sort((p, c) => p - c).slice(0, 5);
        topFive.forEach((top, index) => {
            $result.append(document.createElement("br"), `${index + 1}위: ${top}ms`);
        });

        startTime = null;
        endTime = null;
        $screen.classList.replace("now", "waiting");
        $screen.textContent = START_TEXT;
    }
});
