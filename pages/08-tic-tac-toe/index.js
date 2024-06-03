//초기 설정
const $section = document.querySelector("section");
const $table = document.createElement("table");
const $result = document.createElement("div");
const rows = [];

//초기 변수
let turn = "O";

//승패 판단 함수
const checkWinner = (target) => {
    const rowIndex = target.parentNode.rowIndex; // tr의 행 인덱스
    const cellIndex = target.cellIndex; // td의 열 인덱스
    let hasWinner = false; // 세 칸이 같은 모양으로 채워졌는지
    if (
        // 가로 줄 검사
        rows[rowIndex][0].textContent === turn &&
        rows[rowIndex][1].textContent === turn &&
        rows[rowIndex][2].textContent === turn
    ) {
        hasWinner = true;
    }
    if (
        // 세로 줄 검사
        rows[0][cellIndex].textContent === turn &&
        rows[1][cellIndex].textContent === turn &&
        rows[2][cellIndex].textContent === turn
    ) {
        hasWinner = true;
    }
    if (
        // 하향대각선 검사
        rows[0][0].textContent === turn &&
        rows[1][1].textContent === turn &&
        rows[2][2].textContent === turn
    ) {
        hasWinner = true;
    }
    if (
        // 상향대각선 검사
        rows[0][2].textContent === turn &&
        rows[1][1].textContent === turn &&
        rows[2][0].textContent === turn
    ) {
        hasWinner = true;
    }
    return hasWinner;
};

//체크여부 판단해서 XO
const callback = (event) => {
    if (event.target.textContent !== "") {
        //빈칸이 아닌지
        console.log("빈칸이 아닙니다.");
        return;
    }
    //빈칸이면
    console.log("빈칸입니다.");
    event.target.textContent = turn;
    const hasWinner = checkWinner(event.target);
    // 승자가 있으면
    if (hasWinner) {
        $result.textContent = `${turn}님의 승리!`;
        $table.removeEventListener("click", callback);
        return;
    }
    // 승자가 없으면
    const draw = rows.flat().every((cell) => cell.textContent);
    if (draw) {
        $result.textContent = "무승부";
        return;
    }
    turn = turn === "X" ? "O" : "X";
    if (turn === "X") {
        const emptyCells = rows.flat().filter((v) => !v.textContent);
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = "X";
        const hasWinner = checkWinner(randomCell);
        if (hasWinner) {
            $result.textContent = `${turn}님의 승리!`;
            return;
        }
        const draw = rows.flat().every((cell) => cell.textContent);
        if (draw) {
            $result.textContent = "무승부";
            return;
        }
        turn = turn === "X" ? "O" : "X";
    }
};

//게임판 그려주는 함수 + 클릭이벤트 연결
for (let i = 1; i <= 3; i++) {
    const $tr = document.createElement("tr");
    const cells = [];
    for (let j = 1; j <= 3; j++) {
        const $td = document.createElement("td");

        cells.push($td);
        $tr.appendChild($td);
    }
    rows.push(cells);
    $table.appendChild($tr);
    $table.addEventListener("click", callback);
}
$section.appendChild($table);
$section.appendChild($result);
