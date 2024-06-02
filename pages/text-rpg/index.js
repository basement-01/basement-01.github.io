//! UI 선택자 축약
const $startScreen = document.querySelector("#start-screen"); //시작 메뉴화면
const $gameMenu = document.querySelector("#game-menu"); //일반 메뉴화면
const $battleMenu = document.querySelector("#battle-menu"); //전투 메뉴화면
const $message = document.querySelector("#message"); //메세지 UI
const $nameInput = document.getElementById("name-input"); //시작인풋 UI
const $menuInput = document.getElementById("menu-input"); //시작인풋 UI
const $battleInput = document.getElementById("battle-input"); //시작인풋 UI

//! 플레이어 관련 선택자 축약
const $heroName = document.querySelector("#hero-name"); //플레이어 이름
const $heroHp = document.querySelector("#hero-hp"); //플레이어 체력
const $heroAtt = document.querySelector("#hero-att"); //플레이어 공격력
const $heroLevel = document.querySelector("#hero-level"); //플레이어 레벨
const $heroXp = document.querySelector("#hero-xp"); //플레이어 경험치

//! 몬스터 관련 선택자 축약
const $monsterName = document.querySelector("#monster-name"); //몬스터 이름
const $monsterHp = document.querySelector("#monster-hp"); //몬스터 체력
const $monsterAtt = document.querySelector("#monster-att"); //몬스터 공격력

//! 게임 클래스
class Game {
    constructor(name) {
        this.monster = null;
        this.hero = null;
        this.monsterList = [
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
        this.start(name);
    }
    //! 게임 시작 메서드
    start(name) {
        $gameMenu.addEventListener("submit", this.onGameMenuInput);
        $battleMenu.addEventListener("submit", this.onBattleMenuInput);
        this.changeScreen("game");
        this.hero = new Hero(name, this);
        this.updateHeroStat();
    }
    //! 화면 전환 메서드
    changeScreen(screen) {
        if (screen === "start") {
            $nameInput.value = "";
            $startScreen.style.display = "block";
            $gameMenu.style.display = "none";
            $battleMenu.style.display = "none";
        } else if (screen === "game") {
            $menuInput.value = "";
            $startScreen.style.display = "none";
            $gameMenu.style.display = "block";
            $battleMenu.style.display = "none";
        } else if (screen === "battle") {
            $battleInput.value = "";
            $startScreen.style.display = "none";
            $gameMenu.style.display = "none";
            $battleMenu.style.display = "block";
        }
    }
    //! 일반 메뉴 메서드
    onGameMenuInput = (event) => {
        event.preventDefault();

        const input = event.target["menu-input"].value;
        // 1.모험
        if (input === "1") {
            this.changeScreen("battle");
            this.createMonster();
            $battleInput.focus();
        }
        // 2.휴식
        else if (input === "2") {
            const { hero } = this;
            hero.hp = hero.maxHp;
            this.showMessage(`체력이 모두 회복되었습니다.`);
            this.updateHeroStat();
            $menuInput.value = "";
            $menuInput.focus();
        }
        // 3.종료
        else if (input === "3") {
            this.quit();
            this.showMessage(`게임을 종료했습니다.`);
            $nameInput.focus();
        }
    };
    //! 전투 메뉴 메서드
    onBattleMenuInput = (event) => {
        event.preventDefault();
        const input = event.target["battle-input"].value;
        // 1.공격
        if (input === "1") {
            const { hero, monster } = this;
            hero.attack(monster);
            monster.attack(hero);
            if (hero.hp <= 0) {
                this.showMessage(`${hero.lev}레벨에서 사망. 주인공을 새로 생성하세요.`);
                this.quit();
            } else if (monster.hp <= 0) {
                this.showMessage(`몬스터를 잡아 ${monster.xp}를 얻었습니다.`);
                hero.getXp(monster.xp);
                this.monster = null;
                this.updateHeroStat();
                this.updateMonsterStat();
                this.changeScreen("game");
                $menuInput.focus();
            } else {
                this.showMessage(`${hero.att}의 피해를 주고, ${monster.att}의 피해를 받았다!`);
                this.updateHeroStat();
                this.updateMonsterStat();
            }
            $battleInput.value = "";
            $battleInput.focus();
        }
        // 2.회복
        else if (input === "2") {
            const { hero, monster } = this;
            hero.heal(monster);
            if (hero.hp <= 0) {
                this.showMessage(`${hero.lev}레벨에서 사망. 주인공을 새로 생성하세요.`);
                this.quit();
                $nameInput.focus();
            }
            this.updateHeroStat();
            this.updateMonsterStat();
            $battleInput.value = "";
            $battleInput.focus();
        }
        // 3.도망
        else if (input === "3") {
            this.showMessage(`몬스터에게서 도망쳤습니다.`);
            this.monster = null;
            this.updateHeroStat();
            this.updateMonsterStat();
            this.changeScreen("game");
            $menuInput.focus();
        }
    };
    //! 플레이어 정보 업데이트 메서드
    updateHeroStat() {
        const { hero } = this;
        //플레이어 사망 시, 정보 초기화
        if (hero === null) {
            $heroName.textContent = "";
            $heroLevel.textContent = "";
            $heroHp.textContent = "";
            $heroAtt.textContent = "";
            $heroXp.textContent = "";
            return;
        }
        // 플레이어 정보 표시
        $heroName.textContent = "이름: " + hero.name;
        $heroLevel.textContent = `[Level: ${hero.lev}]`;
        $heroHp.textContent = `[HP: ${hero.hp}/${hero.maxHp}]`;
        $heroXp.textContent = `[XP: ${hero.xp}/${15 * hero.lev}]`;
        $heroAtt.textContent = `[공격력: ${hero.att}]`;
    }
    //! 몬스터 생성 메서드
    createMonster() {
        const randomIndex = Math.floor(Math.random() * this.monsterList.length);
        const randomMonster = this.monsterList[randomIndex];
        this.monster = new Monster(randomMonster.name, randomMonster.hp, randomMonster.att, randomMonster.xp);
        this.updateMonsterStat();
        this.showMessage(`몬스터와 마주쳤다. ${this.monster.name}인 것 같다!`);
    }
    //! 몬스터 정보 업데이트 메서드
    updateMonsterStat() {
        const { monster } = this;
        if (monster === null) {
            $monsterName.textContent = "";
            $monsterHp.textContent = "";
            $monsterAtt.textContent = "";
            return;
        }
        $monsterName.textContent = `이름: ${monster.name}`;
        $monsterHp.textContent = `[HP: ${monster.hp}/${monster.maxHp}]`;
        $monsterAtt.textContent = `[공격력: ${monster.att}]`;
    }
    //! 메세지 표시 메서드
    showMessage(text) {
        $message.textContent = text;
    }
    //! 게임 오버 메서드
    quit() {
        this.hero = null;
        this.monster = null;
        this.updateHeroStat();
        this.updateMonsterStat();
        $gameMenu.removeEventListener("submit", this.onGameMenuInput);
        $battleMenu.removeEventListener("submit", this.onBattleMenuInput);
        this.changeScreen("start");
        game = null;
    }
}

//! 유닛 클래스
class Unit {
    constructor(name, hp, att, xp) {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.att = att;
        this.xp = xp;
    }
    //! 공격 메서드 (상대방의 HP에서 내 공격력을 뺌)
    attack(target) {
        target.hp -= this.att;
    }
}

//! 플레이어 클래스 <- 유닛 클래스 상속
class Hero extends Unit {
    constructor(name, game) {
        super(name, 100, 10, 0);
        this.lev = 1;
        this.game = game;
    }
    //! 회복 메서드 (체력 20 회복 후 몬스터 후공)
    heal(monster) {
        this.hp + 20 <= this.maxHp ? (this.hp += 20) : (this.hp = this.maxHp);
        this.hp -= monster.att;
        this.game.showMessage(`체력이 20회복되었습니다. ${monster.att}의 피해를 받았다!`);
    }
    //! 경험치 획득 메서드
    getXp(xp) {
        this.xp += xp;
        if (this.xp >= this.lev * 15) {
            this.xp -= this.lev * 15;
            this.lev += 1;
            this.maxHp += 5;
            this.att += 5;
            this.hp = this.maxHp;
            this.game.showMessage(`레벨 업! ${this.lev}레벨이 되었습니다.`);
        }
    }
}

//! 몬스터 클래스 <- 유닛 클래스 상속
class Monster extends Unit {}

//! 시작 메뉴
let game = null;
$startScreen.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target["name-input"].value;
    game = new Game(name); //게임 객체 생성
    game.showMessage(``);
    $menuInput.focus();
});
$nameInput.focus();
