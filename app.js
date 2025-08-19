let display = document.getElementById("display");

function press(val) {
  display.value += val;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    let expr = display.value.replace(/\^/g, "**"); // power
    display.value = eval(expr);
  } catch {
    display.value = "Error";
  }
}
