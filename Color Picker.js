const colorInput = document.getElementById("colorInput");
const colorPreview = document.getElementById("colorPreview");

const hexValue = document.getElementById("hexValue");
const rgbValue = document.getElementById("rgbValue");
const hslValue = document.getElementById("hslValue");

const copyBtn = document.getElementById("copyBtn");
const randomBtn = document.getElementById("randomBtn");
const saveBtn = document.getElementById("saveBtn");
const themeBtn = document.getElementById("themeBtn");

const favorites = document.getElementById("favorites");

function updateColor() {
  let color = colorInput.value;
  colorPreview.style.backgroundColor = color;
  hexValue.textContent = `HEX: ${color}`;
  rgbValue.textContent = `RGB: ${hexToRGB(color)}`;
  hslValue.textContent = `HSL: ${hexToHSL(color)}`;
}
function hexToRGB(hex) {
  let color = colorInput.value;
  color = color.replace("#", "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  return `(${r}, ${g}, ${b})`;
}
function hexToHSL(hex) {
  let color = colorInput.value;
  color = color.replace("#", "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let h,
    s,
    l = (max + min) / 2;
  let d = max - min;

  if (d === 0) {
    h = s = 0;
  } else {
    s = d / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `(${h}, ${s}%, ${l}%)`;
}

colorInput.addEventListener("change", updateColor);
copyBtn.addEventListener("click", function () {
  navigator.clipboard.writeText(colorInput.value);
  alert("successfuly copied");
});
randomBtn.addEventListener("click", function () {
  let randomValue = "#";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * 16);
    if (random < 10) {
      randomValue += random;
    } else {
      randomValue += String.fromCharCode(55 + random);
    }
  }
  console.log(randomValue);
  colorInput.value = randomValue;
  updateColor();
});
updateColor();
