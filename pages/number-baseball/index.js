const $form = document.querySelector("#form");
const $input = document.querySelector("#input");
const $logs = document.querySelector("#logs");
const numbers = [];
const tries = [];
const answer = [];
let out = 0;
for (let n = 1; n <= 9; n += 1) {
    numbers.push(n);
}

for (let n = 0; n <= 2; n += 1) {
    const index = Math.floor(Math.random() * numbers.length);
    answer.push(numbers[index]);
    numbers.splice(index, 1);
}
function checkInput(input) {
    if (input.length !== 3) {
        return alert("3자리 숫자를 입력하세요.");
    }
    if (new Set(input).size !== 3) {
        return alert("중복된 숫자를 입력했습니다.");
    }
    if (tries.includes(input)) {
        return alert("이미 시도한 값입니다.");
    }
    return true;
}
$form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = $input.value;
    $input.value = "";
    const valid = checkInput(value);
    if (!valid) return;
    if (answer.join("") === value) {
        $logs.textContent = "홈런!";
        return;
    }
    if (tries.length >= 9) {
        const message = document.createTextNode(`패배! 정답은 ${answer.join("")}`);
        $logs.appendChild(message);
        return;
    }
    let strike = 0;
    let ball = 0;
    answer.forEach((number, aIndex) => {
        const index = value.indexOf(String(number));
        if (index > -1) {
            if (index === aIndex) {
                strike += 1;
            } else {
                ball += 1;
            }
        }
    });
    if (strike === 0 && ball === 0) {
        out += 1;
        $logs.append(`${value}: ${out} 아웃!`, document.createElement("br"));
    } else {
        $logs.append(`${value}: ${strike} 스트라이크 ${ball} 볼`, document.createElement("br"));
    }
    if (out === 3) {
        const message = document.createTextNode(`3아웃 패배! 정답은 ${answer.join("")}`);
        $logs.appendChild(message);
        return;
    }
    tries.push(value);
});
