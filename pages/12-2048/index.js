//@ 축약
const $table = document.getElementById("table");
const $score = document.getElementById("score");
const $log = document.getElementById("log");
const $upButton = document.querySelector("#up");
const $downButton = document.querySelector("#down");
const $leftButton = document.querySelector("#left");
const $rightButton = document.querySelector("#right");

//@ 변수
let data = []; // 맵 데이터
let startCoord; // 마우스 이동 기준 좌표 (시작점)
let $Imoveable = true; // 이동가능여부
let score = 0;

//@ 함수
//! 4 * 4 표 그리기
function startGame() {
    const $fragment = document.createDocumentFragment();
    [1, 2, 3, 4].forEach(function () {
        const rowData = [];
        data.push(rowData);
        const $tr = document.createElement("tr");
        [1, 2, 3, 4].forEach(() => {
            rowData.push(0);
            const $td = document.createElement("td");
            $tr.appendChild($td);
        });
        $fragment.appendChild($tr);
    });
    $table.appendChild($fragment);
    put2ToRandomCell();
    draw();
}

//! 빈칸을 찾아 무작위로 숫자 2 넣기
function put2ToRandomCell() {
    const emptyCells = [];
    data.forEach(function (rowData, i) {
        rowData.forEach(function (cellData, j) {
            if (!cellData) {
                emptyCells.push([i, j]);
            }
        });
    });
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    data[randomCell[0]][randomCell[1]] = 2;
}

//! 표에 16개 칸 그리기
function draw() {
    data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
            const $target = $table.children[i].children[j];
            if (cellData > 0) {
                $target.textContent = cellData;
                $target.className = "color-" + cellData;
            } else {
                $target.textContent = "";
                $target.className = "";
            }
        });
    });
}

//! 숫자 이동 함수
function moveCells(direction) {
    if (!$Imoveable) {
        return;
    }
    switch (direction) {
        case "left": {
            // 왼쪽 정렬
            const newData = [[], [], [], []]; // 임시 저장용
            data.forEach((rowData, i) => {
                rowData.forEach((cellData, j) => {
                    if (cellData) {
                        // 숫자가 0이 아니면
                        const currentRow = newData[i];
                        const prevData = currentRow.at(-1);
                        if (prevData === cellData) {
                            addScore(currentRow);
                            currentRow[currentRow.length - 1] *= -2;
                        } else {
                            newData[i].push(cellData);
                        }
                    }
                });
            });
            [0, 1, 2, 3].forEach((rowData, i) => {
                [0, 1, 2, 3].forEach((cellData, j) => {
                    data[i][j] = Math.abs(newData[i][j]) || 0;
                });
            });
            break;
        }
        case "right": {
            // 오른쪽 정렬
            const newData = [[], [], [], []]; // 임시 저장용
            data.forEach((rowData, i) => {
                rowData.forEach((cellData, j) => {
                    if (rowData[3 - j]) {
                        // 숫자가 0이 아니면
                        const currentRow = newData[i];
                        const prevData = currentRow.at(-1);
                        if (prevData === rowData[3 - j]) {
                            addScore(currentRow);
                            currentRow[currentRow.length - 1] *= -2;
                        } else {
                            newData[i].push(rowData[3 - j]);
                        }
                    }
                });
            });
            [0, 1, 2, 3].forEach((rowData, i) => {
                [0, 1, 2, 3].forEach((cellData, j) => {
                    data[i][3 - j] = Math.abs(newData[i][j]) || 0;
                });
            });
            break;
        }
        case "up": {
            // 위쪽 정렬
            const newData = [[], [], [], []]; // 임시 저장용
            data.forEach((rowData, i) => {
                rowData.forEach((cellData, j) => {
                    if (cellData) {
                        // 숫자가 0이 아니면
                        const currentRow = newData[j];
                        const prevData = currentRow.at(-1);
                        if (prevData === cellData) {
                            addScore(currentRow);
                            currentRow[currentRow.length - 1] *= -2;
                        } else {
                            newData[j].push(cellData);
                        }
                    }
                });
            });
            [0, 1, 2, 3].forEach((rowData, i) => {
                [0, 1, 2, 3].forEach((cellData, j) => {
                    data[j][i] = Math.abs(newData[i][j]) || 0;
                });
            });
            break;
        }
        case "down": {
            // 아래쪽 정렬
            const newData = [[], [], [], []]; // 임시 저장용
            data.forEach((rowData, i) => {
                rowData.forEach((cellData, j) => {
                    if (data[3 - i][j]) {
                        // 숫자가 0이 아니면
                        const currentRow = newData[j];
                        const prevData = currentRow.at(-1);
                        if (prevData === data[3 - i][j]) {
                            addScore(currentRow);
                            currentRow[currentRow.length - 1] *= -2;
                        } else {
                            newData[j].push(data[3 - i][j]);
                        }
                    }
                });
            });
            [0, 1, 2, 3].forEach((rowData, i) => {
                [0, 1, 2, 3].forEach((cellData, j) => {
                    data[3 - j][i] = Math.abs(newData[i][j]) || 0;
                });
            });
            break;
        }
    }
    if (data.flat().includes(2048)) {
        draw();
        $log.textContent = `축하합니다! 2048을 만들었습니다! 점수는 ${score}점!!`;
        $Imoveable = false;
    } else if (!data.flat().includes(0)) {
        $log.textContent = `패배했습니다 ㅠ ${score}점 입니다`;
        $Imoveable = false;
    } else {
        put2ToRandomCell();
        draw();
    }
}

//! 점수 추가 함수
function addScore(currentRow) {
    const sumScore = score + currentRow.at(-1) * 2;
    score += currentRow.at(-1) * 2;
    $score.textContent = `SCORE : ${sumScore}`;
}

//! 키보드 이벤트 함수
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        moveCells("up");
    } else if (event.key === "ArrowDown") {
        moveCells("down");
    } else if (event.key === "ArrowLeft") {
        moveCells("left");
    } else if (event.key === "ArrowRight") {
        moveCells("right");
    }
});
//! 마우스 이벤트 함수 (시작)
window.addEventListener("mousedown", (event) => {
    startCoord = [event.clientX, event.clientY];
});
//! 마우스 이벤트 함수 (끝)
window.addEventListener("mouseup", (event) => {
    const endCoord = [event.clientX, event.clientY]; // 마우스 이동 기준 좌표 (끝)
    const diffX = endCoord[0] - startCoord[0]; // 마우스  시작 - 끝 X좌표 차이값
    const diffY = endCoord[1] - startCoord[1]; // 마우스  시작 - 끝 Y좌표 차이값
    if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
        moveCells("left");
    } else if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
        moveCells("right");
    } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
        moveCells("up");
    } else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
        moveCells("down");
    }
});
//! 가상버튼 이벤트 함수
$upButton.addEventListener("click", () => moveCells("up"));
$downButton.addEventListener("click", () => moveCells("down"));
$leftButton.addEventListener("click", () => moveCells("left"));
$rightButton.addEventListener("click", () => moveCells("right"));

//@ 시작 함수
startGame();
