//---document.quertSelector를 짧게 축약---//
const $main = document.querySelector("#main");
const $draw = document.querySelector("#draw");
const $clear = document.querySelector("#clear");
const $first = document.querySelector("#first");
const $input = document.querySelector("#input");
const $try = document.querySelector("#try");
const $replaceColor = document.getElementById("#main");

//---초기 변수---//
let numbers = [];
let lottoResult = [];
let lottoFirst = [];
let lottoBonus = [];
let tryNum = 0;
let fiveGrade = 0;
let fourGrade = 0;
let threeGrade = 0;
let twoGrade = 0;
let oneGrade = 0;
let money = 0;
//---인풋반환하는 함수---//
let currentTry = 1;

const handleInput = (event) => {
    currentTry = event.target.value;
};
const compareArr = (arr1, arr2) => {
    let count = 0;
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                count++;
            }
        }
    }
    return count;
};
const bonusArr = (arr1, arr2) => {
    let bonus = 0;
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                bonus++;
            }
        }
    }
    return bonus;
};

//---리셋---//
const resetArr = () => {
    numbers = [];
    lottoFirst = [];
    lottoBonus = [];

    $main.textContent = "";
    $first.textContent = "";
    for (let i = 1; i <= 45; i++) {
        numbers.push(i);
    }

    for (let i = 1; i <= 6; i++) {
        const lottoIndex = Math.floor(Math.random() * numbers.length);
        const lottoNumber = numbers.splice(lottoIndex, 1);
        lottoFirst.push(lottoNumber);
    }
    lottoFirst.sort((a, b) => a - b);
    lottoFirst = lottoFirst.flat();
    const lottoIndex = Math.floor(Math.random() * numbers.length);
    const lottoNumber = numbers.splice(lottoIndex, 1);
    lottoBonus.push(lottoNumber);
    lottoBonus = lottoBonus.flat();
    //어떤 숫자가 뽑혔는지 화면에 표시 ex.'[ 1, 2, 3, 4, 5, 6 ]'
    $first.append(`[ ${lottoFirst.join(", ")} ] 보너스번호 : ${lottoBonus}`, document.createElement("br"));
    tryNum = 0;
    fiveGrade = 0;
    fourGrade = 0;
    threeGrade = 0;
    twoGrade = 0;
    oneGrade = 0;
    money = 0;
    $try.textContent = "";
    $try.append(
        `시도횟수 : ${tryNum}`,
        document.createElement("br"),
        `[5등: ${fiveGrade}번] [4등: ${fourGrade}번] [3등: ${threeGrade}번] [2등: ${twoGrade}번] [1등: ${oneGrade}번]`,
        document.createElement("br"),
    );
    $try.append(` 현재 금액 : ${money.toLocaleString()}원`);
    $input.value = "1";
    currentTry = 1;
};

//---뽑기 버튼 클릭 시 1~전체숫자 중에 랜덤하게 7개 뽑아서 나타내는 기능---//
$draw.addEventListener("click", () => {
    for (let ii = 0; ii < Number(currentTry); ii++) {
        money -= 1000;
        lottoResult = [];
        //뽑기 버튼 클릭시 6개의 숫자를 랜덤하게 뽑음
        for (let i = 1; i <= 6; i++) {
            //숫자를 뽑을 범위는 numbers의 배열길이 만큼
            const lottoIndex = Math.floor(Math.random() * numbers.length);
            //뽑은 값은 배열에서 삭제함 (중복으로 안뽑히게)
            const lottoNumber = numbers.splice(lottoIndex, 1);
            //뽑은 값을 결과의 배열에 넣어줌
            lottoResult.push(lottoNumber);
        }
        //6개 숫자 다 뽑았으면 오름차순으로 정렬함
        lottoResult.sort((a, b) => a - b);
        //어떤 숫자가 뽑혔는지 화면에 표시 ex.'[ 1, 2, 3, 4, 5, 6 ]'
        lottoResult = lottoResult.flat();
        compareArr(lottoFirst, lottoResult);
        let num = compareArr(lottoFirst, lottoResult);
        if (num < 3) {
            // $main.prepend(`[ ${lottoResult.join(', ')} ] 꽝...`, document.createElement('br'));
        }
        if (num === 3) {
            // $main.prepend(`[ ${lottoResult.join(', ')} ] 5등 당첨! 당첨금 5,000원`, document.createElement('br'));
            fiveGrade += 1;
            money += 5000;
        }
        if (num === 4) {
            // $main.prepend(`[ ${lottoResult.join(", ")} ] 4등 당첨! 당첨금 50,000원!`, document.createElement("br"));
            fourGrade += 1;
            money += 50000;
        }
        if (num === 5) {
            if (bonusArr(lottoBonus, lottoResult) === 1) {
                $main.prepend(
                    `[ ${lottoResult.join(", ")} ] 2등 당첨! 당첨금 55,500,000원!!!`,
                    document.createElement("br"),
                );
                twoGrade += 1;
                money += 55500000;
            }
            $main.prepend(`[ ${lottoResult.join(", ")} ] 3등 당첨! 당첨금 1,500,000원!!`, document.createElement("br"));
            threeGrade += 1;
            money += 1500000;
        }
        if (num === 6) {
            $main.prepend(
                `[ ${lottoResult.join(", ")} ] 1등 당첨! 당첨금 2,000,000,000원!!!!`,
                document.createElement("br"),
            );
            oneGrade += 1;
            money += 2000000000;
        }
        //변수 초기화
        numbers = [];
        //다시 1~45까지 숫자를 배열에 넣음
        for (let i = 1; i <= 45; i++) {
            numbers.push(i);
        }
        tryNum += 1;
        $try.textContent = "";
        $try.append(
            `시도횟수 : ${tryNum}`,
            document.createElement("br"),
            `[5등: ${fiveGrade}번] [4등: ${fourGrade}번] [3등: ${threeGrade}번] [2등: ${twoGrade}번] [1등: ${oneGrade}번]`,
            document.createElement("br"),
        );
        $try.append(` 현재 금액 : ${money.toLocaleString()}원`);
    }
});

//---리셋 버튼 클릭 시 내용 삭제해주는 기능---//
$clear.addEventListener("click", () => {
    resetArr();
});
//---
function findCommonElements(arr1, arr2) {
    // 배열을 Set으로 변환하여 중복을 제거하고 검색 속도를 향상시킵니다.
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    // 결과를 저장할 Set을 생성합니다.
    const commonElements = new Set();

    // 첫 번째 Set을 순회하면서 두 번째 Set에 있는 요소를 찾습니다.
    for (const element of set1) {
        if (set2.has(element)) {
            commonElements.add(element);
        }
    }

    // 결과를 배열로 변환하여 반환합니다.
    return Array.from(commonElements);
}
//---실행---//
resetArr();
$input.addEventListener("input", handleInput);
