function calc1(num) {
  return num + 1;
}

function calc2(num) {
  return num + 10;
}

function calc3(num) {
  return num + 100;
}

function calc4(num) {
  return num + 1000;
}

function sequentialCalc(num) {
  let result = 0;
  result = calc4(calc3(calc2(calc1(num))));
  return console.log(result);
}

sequentialCalc(1);
