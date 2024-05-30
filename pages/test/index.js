class Game {
    constructor() {
        this.monster = null;
        this.add();
    }
    start() {
        this.add();
    }
    add = () => {
        this.createMonster();
    };
    createMonster() {
        this.monster = new Monster("슬라임", 20, 5);
        this.updateMonster();
    }
    updateMonster() {
        const { monster } = this;
        console.log(monster);
    }
}

class Monster {
    constructor(name, hp, att) {
        this.name = name;
        this.hp = hp;
        this.att = att;
    }
}

const create = () => {
    game = new Game();
};

let game = null;
create();
