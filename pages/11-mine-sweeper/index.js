//! 축약
const $tbody = document.querySelector("#table tbody");
const $result = document.querySelector("#result");
const $timer = document.querySelector("#timer");
const $form = document.querySelector("#form");

//! 상수
const DIFFICULTY = 20; //난이도 (가로 * 세로의 길이)
const MINE = 10; //지뢰의 갯수
const CODE = {
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    MINE: -6,
    OPENED: 0, // 0이상이면 모두 열린 칸
};

//! 변수
let row;
let cell;
let mine;
let data;
let openCount = 0;
let startTime;
let interval;
let normalCellFound = false;
let searched;
let firstClick = true;

//! 첫 클릭 지뢰체크
function transferMine(rI, cI) {
    if (normalCellFound) {
        return;
    }
    if (rI < 0 || rI >= row || cI < 0 || cI >= cell) {
        return;
    }
    if (searched[rI][cI]) {
        return;
    }
    if (data[rI][cI] === CODE.NORMAL) {
        normalCellFound = true;
        data[rI][cI] = CODE.MINE;
    }
    // 옮겼는데도 지뢰인 경우 8방향 탐색
    else {
        searched[rI][cI] = true;
        transferMine(rI - 1, cI - 1);
        transferMine(rI - 1, cI);
        transferMine(rI - 1, cI + 1);
        transferMine(rI, cI - 1);
        transferMine(rI, cI + 1);
        transferMine(rI + 1, cI - 1);
        transferMine(rI + 1, cI);
        transferMine(rI + 1, cI + 1);
    }
}

//! submit 이벤트
function onSubmit(event) {
    event.preventDefault();
    row = parseInt(event.target.row.value);
    cell = parseInt(event.target.cell.value);
    mine = parseInt(event.target.mine.value);
    if (row * cell <= mine) {
        $result.textContent = "지뢰 갯수가 전체 갯수보다 많습니다.";
        clearInterval(interval);
        $timer.textContent = "";
        $tbody.innerHTML = "";

        return;
    }
    openCount = 0;
    normalCellFound = false;
    searched = null;
    firstClick = true;
    clearInterval(interval);
    $tbody.innerHTML = "";
    $result.innerHTML = "";

    drawTable(); // 맵 그리기
    startTime = new Date(); // 시간 측정 시작
    interval = setInterval(() => {
        const time = Math.floor((new Date() - startTime) / 1000);
        $timer.textContent = `${time}초`;
    }, 1);
}

$form.addEventListener("submit", onSubmit); // 이벤트 등록

//! 행렬 생성 + 무작위 마인 설치 함수
function plantMine() {
    // 피셔-예이츠 셔플
    const candidate = Array(row * cell)
        .fill()
        .map((v, i) => i);
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    // DIFFICULTY의 갯수만큼 행렬을 만드는 기능 (빈 행 n개에 각각 n만큼의 값 추가)
    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        data.push(rowData);
        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL);
        }
    }
    // DIFFICULTY의 갯수만큼 n진법으로 만드는 기능
    for (let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }
    return data;
}

//! 클릭한 칸 열어주는 함수
function open(rowIndex, cellIndex) {
    if (data[rowIndex]?.[cellIndex] >= CODE.OPENED) {
        return;
    }
    const target = $tbody.children[rowIndex]?.children[cellIndex];
    if (!target) {
        return;
    }
    const count = countMine(rowIndex, cellIndex);
    target.textContent = count || "";
    target.className = "opened";
    data[rowIndex][cellIndex] = count;
    openCount++;
    if (openCount === row * cell - mine) {
        const time = (new Date() - startTime) / 1000;
        clearInterval(interval);
        $tbody.removeEventListener("contextmenu", onRightClick);
        $tbody.removeEventListener("click", onLeftClick);
        $result.textContent = `승리했습니다! ${time}초가 걸렸습니다.`;
        showFlags();
    }
    return count;
}

//! 지뢰 클릭했을 때 전체 위치 알려주는 함수
function showMines() {
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    data.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (mines.includes(cell)) {
                $tbody.children[rowIndex].children[cellIndex].textContent = "💣";
            }
        });
    });
}

//! 클리어했을 때 전체 지뢰 위치 알려주는 함수
function showFlags() {
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    data.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (mines.includes(cell)) {
                $tbody.children[rowIndex].children[cellIndex].textContent = "🚩";
            }
        });
    });
}

//! 주변 칸 자동으로 열어주는 함수
async function openAround(rI, cI) {
    const count = open(rI, cI);
    if (count === 0) {
        await Promise.all([
            openAround(rI - 1, cI - 1),
            openAround(rI - 1, cI),
            openAround(rI - 1, cI + 1),
            openAround(rI, cI - 1),
            openAround(rI, cI + 1),
            openAround(rI + 1, cI - 1),
            openAround(rI + 1, cI),
            openAround(rI + 1, cI + 1),
        ]);
    }
}
//! 지뢰 표시 함수
function openMine() {}
//! 우클릭 동작
function onRightClick(event) {
    event.preventDefault(); // 기본기능 정지
    const target = event.target; // 이벤트된 타겟 축약
    const rowIndex = target.parentNode.rowIndex; // 우클릭한 셀의 행 정보
    const cellIndex = target.cellIndex; // 우클릭한 셀의 열 정보
    const cellData = data[rowIndex][cellIndex]; // 셀 데이터는 데이터의 행렬값
    // 만약 선택한 셀이 지뢰라면
    if (cellData === CODE.MINE) {
        data[rowIndex][cellIndex] = CODE.FLAG_MINE; // 깃발 지뢰로 변경
        target.className = "flag";
        target.textContent = "🚩";
    }
    // 만약 선택한 셀이 깃발 지뢰라면
    else if (cellData === CODE.FLAG_MINE) {
        data[rowIndex][cellIndex] = CODE.QUESTION_MINE; // 물음표 지뢰로 변경
        target.className = "question";
        target.textContent = "❓";
    }
    // 만약 선택한 셀이 물음표 지뢰라면
    else if (cellData === CODE.QUESTION_MINE) {
        data[rowIndex][cellIndex] = CODE.MINE; // 지뢰로 변경
        target.className = "";
        target.textContent = "";
    }
    // 만약 선택한 셀이 닫힌 칸이라면
    else if (cellData === CODE.NORMAL) {
        data[rowIndex][cellIndex] = CODE.FLAG; // 깃발로 변경
        target.className = "flag";
        target.textContent = "🚩";
    }
    // 만약 선택한 셀이 깃발이라면
    else if (cellData === CODE.FLAG) {
        data[rowIndex][cellIndex] = CODE.QUESTION; // 물음표로 변경
        target.className = "question";
        target.textContent = "❓";
    }
    // 만약 선택한 셀이 물음표라면
    else if (cellData === CODE.QUESTION) {
        data[rowIndex][cellIndex] = CODE.NORMAL; // 닫힌 칸으로 변경
        target.className = "";
        target.textContent = "";
    }
}

//! 좌클릭 동작
function onLeftClick(event) {
    const target = event.target; // 이벤트된 타겟 축약
    const rowIndex = target.parentNode.rowIndex; // 좌클릭한 셀의 행 정보
    const cellIndex = target.cellIndex; // 좌클릭한 셀의 열 정보
    const cellData = data[rowIndex][cellIndex]; // 셀 데이터는 데이터의 행렬값
    if (firstClick) {
        firstClick = false;
        searched = Array(row)
            .fill()
            .map(() => []);
        if (cellData === CODE.MINE) {
            transferMine(rowIndex, cellIndex);
            // data[rowIndex][cellIndex] = CODE.NORMAL;
            openAround(rowIndex, cellIndex);
            cellData = CODE.NORMAL;
        }
    }
    // 만약 선택한 셀이 닫힌 칸이라면
    if (cellData === CODE.NORMAL) {
        openAround(rowIndex, cellIndex);
    }
    // 만약 선택한 셀이 지뢰라면
    if (cellData === CODE.MINE) {
        showMines();
        target.textContent = "💥";
        target.className = "opened";
        clearInterval(interval);
        $result.textContent = `지뢰를 밟았습니다.`;
        $tbody.removeEventListener("contextmenu", onRightClick);
        $tbody.removeEventListener("click", onLeftClick);
    }
}

//! 주변 지뢰 갯수 파악하는 함수
function countMine(rowIndex, cellIndex) {
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    let i = 0;
    mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
    mines.includes(data[rowIndex][cellIndex - 1]) && i++;
    mines.includes(data[rowIndex][cellIndex + 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;
    return i;
}

//! 맵 그래픽 생성 함수
function drawTable() {
    // 무작위 마인 설치 함수 실행

    data = plantMine();
    console.log(data);
    // 행의 갯수만큼  #tr 생성 (row 만큼)
    data.forEach((row) => {
        const $tr = document.createElement("tr");
        // 열의 갯수만큼 #td 생성 (cell 만큼)
        row.forEach((cell) => {
            const $td = document.createElement("td");
            if (cell === CODE.MINE) {
                $td.textContent = "";
            }
            $tr.append($td);
        });
        $tbody.append($tr);
    });
    $tbody.addEventListener("contextmenu", onRightClick);
    $tbody.addEventListener("click", onLeftClick);
}
