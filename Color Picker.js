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
const favoriteColors = [];
const clearColors = document.getElementById("clearColors");

function updateColor() {
  let color = colorInput.value;
  colorPreview.style.backgroundColor = color;
  hexValue.textContent = `HEX: ${color}`;
  rgbValue.textContent = `RGB: ${hexToRGB(color)}`;
  hslValue.textContent = `HSL: ${hexToHSL(color)}`;
}
function hexToRGB(hex) {
  hex = hex.replace("#", "");
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  return `(${r}, ${g}, ${b})`;
}
function hexToHSL(hex) {
  hex = hex.replace("#", "");
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

colorInput.addEventListener("input", updateColor);
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
      randomValue += String.fromCharCode(87 + random);
    }
  }
  console.log(randomValue);
  colorInput.value = randomValue;
  updateColor();
});
function createFavoriteColor(color) {
  let li = document.createElement("li");
  li.className =
    "flex justify-end items-center w-32 h-16 border border-gray-400 rounded-xl m-4";
  li.style.backgroundColor = color;
  let delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.classList = "m-2";
  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    let shouldDel = confirm("Delete this color?");
    if (shouldDel) {
      let index = favoriteColors.indexOf(favoriteColors);
      favoriteColors.splice(index, 1);
      localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
      li.remove();
    }
  });
  li.appendChild(delBtn);
  li.addEventListener("click", function () {
    colorInput.value = color;
    updateColor();
  });
  favorites.appendChild(li);
}
saveBtn.addEventListener("click", function () {
  let color = colorInput.value;
  favoriteColors.push(color);
  createFavoriteColor(color);
  localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
});
function loadFavorites() {
  let savedColors = JSON.parse(localStorage.getItem("favoriteColors"));
  if (!savedColors) {
    return;
  }
  savedColors.forEach(function (color) {
    favoriteColors.push(color);
    createFavoriteColor(color);
  });
}
clearColors.addEventListener("click", function () {
  favoriteColors.length = 0;
  localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
  favorites.innerHTML = "";
});
loadFavorites();
updateColor();
