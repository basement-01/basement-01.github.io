const PICKUP_PROB = 0.7;
const SIX_PROB = 2 - PICKUP_PROB;
const FIVE_PROB = 8;
const FOUR_PROB = 50;
const THREE_PROB = 100 - SIX_PROB - FIVE_PROB - FOUR_PROB;

let pickup_seed = PICKUP_PROB;
let six_seed = pickup_seed + SIX_PROB;
let five_seed = six_seed + FIVE_PROB;
let four_seed = five_seed + FOUR_PROB;
let three_seed = 100;

let countP = 0;
let count6 = 0;
let count5 = 0;
let count4 = 0;
let count3 = 0;

function randomSeed() {
  const seed = Math.floor(Math.random() * 100000) / 1000;
  return gacha(seed);
}

function gacha(seed) {
  if (seed < pickup_seed) {
    countP++;
    return;
  }
  if (seed < six_seed) {
    count6++;
    return;
  }
  if (seed < five_seed) {
    count5++;
    return;
  }
  if (seed < four_seed) {
    count4++;
    return;
  }
  count3++;
  return;
}

let Try = 100;

for (let i = 0; i < Try; i++) {
  randomSeed();
}

console.log(countP, count6);
