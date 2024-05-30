//! 선택자 축약
const $startScreen = document.querySelector("#start-screen");
const $gameMenu = document.querySelector("#game-menu"); //일반 메뉴화면
const $battleMenu = document.querySelector("#battle-menu"); //전투 메뉴화면
const $message = document.querySelector("#message"); //메세지

//! 플레이어 관련 변수
const $heroName = document.querySelector("#hero-name"); //플레이어 이름
const $heroLevel = document.querySelector("#hero-level"); //플레이어 레벨
const $heroHp = document.querySelector("#hero-hp"); //플레이어 체력
const $heroXp = document.querySelector("#hero-xp"); //플레이어 경험치
const $heroAtt = document.querySelector("#hero-att"); //플레이어 공격력
//! 플레이어 정보
const hero = {
    name: "",
    lev: 1,
    maxHp: 100,
    hp: 100,
    xp: 0,
    att: 10,
    //몬스터 공격 메서드 (플레이어 선공 -> 몬스터 후공)
    attack(monster) {
        monster.hp -= this.att;
        this.hp -= monster.att;
    },
    //체력 회복 메서드 (체력 20회복 -> 몬스터 후공)
    heal(monster) {
        this.hp += 20;
        this.hp -= monster.att;
    },
};

//! 몬스터 관련 변수
const $monsterName = document.querySelector("#monster-name"); //몬스터 이름
const $monsterHp = document.querySelector("#monster-hp"); //몬스터 체력
const $monsterAtt = document.querySelector("#monster-att"); //몬스터 공격력
let monster = null;
//! 몬스터 정보
const monsterList = [
    {
        name: "슬라임",
        hp: 25,
        att: 10,
        xp: 10,
    },
    {
        name: "스켈레톤",
        hp: 50,
        att: 15,
        xp: 20,
    },
    {
        name: "마왕",
        hp: 150,
        att: 35,
        xp: 50,
    },
];

//! 이름입력 -> 초기세팅
$startScreen.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target["name-input"].value;
    $startScreen.style.display = "none"; //초기화면 숨기기
    $gameMenu.style.display = "block"; //일반 메뉴화면 보이기
    $heroName.textContent = "이름: " + name;
    //! 플레이어 정보 표시
    $heroLevel.textContent = `[Lev: ${hero.lev}]`;
    $heroHp.textContent = `[HP: ${hero.hp}/${hero.maxHp}]`;
    $heroXp.textContent = `[XP: ${hero.xp}/${15 * hero.lev}]`;
    $heroAtt.textContent = `[공격력: ${hero.att}]`;
    hero.name = name;
});

//! 일반 메뉴 행동
$gameMenu.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.target["menu-input"].value;
    //! 1.모험 선택 시
    if (input === "1") {
        $gameMenu.style.display = "none"; //일반 메뉴화면 숨기기
        $battleMenu.style.display = "block"; //전투 메뉴화면 보이기
        //! 몬스터 무작위로 가져오기
        monster = JSON.parse(
            JSON.stringify(
                monsterList[Math.floor(Math.random() * monsterList.length)],
            ),
        );
        //! 상대할 몬스터 정보 표시
        monster.maxHp = monster.hp;
        $monsterName.textContent = `이름: ${monster.name}`;
        $monsterHp.textContent = `[HP: ${monster.hp}/${monster.maxHp}]`;
        $monsterAtt.textContent = `[공격력: ${monster.att}]`;
    }
    //! 2.휴식 선택 시
    else if (input === "2") {
    }
    //! 3.종료 선택 시
    else if (input === "3") {
    }
});

//! 전투 메뉴 행동
$battleMenu.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.target["battle-input"].value;
    //! 1.공격 선택 시
    if (input === "1") {
        hero.attack(monster);
        $heroHp.textContent = `HP: ${hero.hp}/${hero.maxHp}`;
        $monsterHp.textContent = `HP: ${monster.hp}/${monster.maxHp}`;
        $message.textContent = `${hero.att}의 피해를 주고, ${monster.att}의 피해를 받았다!`;
    }
    //! 2.회복 선택 시
    else if (input === "2") {
    }
    //! 3.도망 선택 시
    else if (input === "3") {
    }
});
