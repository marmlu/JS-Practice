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
const clearFavoriteColors = document.getElementById("clearColors");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportFile");
const importFile = document.getElementById("importFile");

function updateColor() {
  let color = colorInput.value;
  colorPreview.style.backgroundColor = color;
  hexValue.textContent = `HEX: ${color}`;
  rgbValue.textContent = `RGB: ${hexToRGB(color)}`;
  hslValue.textContent = `HSL: ${hexToHSL(color)}`;
}
function hexToRGB(hex) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `(${r}, ${g}, ${b})`;
}
function hexToHSL(hex) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
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
  colorInput.value = randomValue;
  updateColor();
});
function showEmptyState() {
  favorites.innerHTML = `
    <p class="text-gray-500 p-4 text-center w-full">
      No favorite colors yet 🎨
    </p>
  `;
}
function createFavoriteColorBtn(color) {
  let li = document.createElement("li");
  li.className =
    "relative flex flex-col justify-center items-center w-32 h-24 border border-gray-400 rounded-xl m-4 shadow-xl cursor-pointer hover:scale-105 transition duration-300";
  li.style.backgroundColor = color;
  let text = document.createElement("p");
  text.textContent = color;
  text.className =
    "text-white font-bold bg-black/40 px-2 py-1 rounded-md text-sm";
  let delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className = "m-2";
  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    let shouldDel = confirm("Delete this color?");
    if (shouldDel) {
      let index = favoriteColors.indexOf(color);
      favoriteColors.splice(index, 1);
      localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
      renderColors(favoriteColors);
    }
  });
  let copyBtn = document.createElement("button");
  copyBtn.textContent = "📋";
  copyBtn.className = "absolute bottom-1 right-1 text-sm";
  copyBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    navigator.clipboard.writeText(color);
    alert("Color Copied");
  });
  li.appendChild(text);
  li.appendChild(delBtn);
  li.appendChild(copyBtn);
  li.addEventListener("click", function () {
    colorInput.value = color;
    updateColor();
  });
  favorites.appendChild(li);
}
saveBtn.addEventListener("click", function () {
  let color = colorInput.value;
  if (favoriteColors.includes(color)) {
    return;
  }
  favoriteColors.push(color);
  renderColors(favoriteColors);
  localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
});
function loadFavorites() {
  let savedColors = JSON.parse(localStorage.getItem("favoriteColors")) || [];
  if (savedColors.length === 0) {
    showEmptyState();
    return;
  }
  savedColors.forEach(function (color) {
    favoriteColors.push(color);
  });
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    themeBtn.innerHTML = "☀️ Light Mode";
  } else {
    themeBtn.innerHTML = "🌙 Dark Mode";
  }
  renderColors(favoriteColors);
}
clearFavoriteColors.addEventListener("click", function () {
  favoriteColors.length = 0;
  localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
  renderColors(favoriteColors);
});
searchInput.addEventListener("input", function () {
  let searchInputValue = searchInput.value.toLowerCase();
  const filteredColors = favoriteColors.filter(function (color) {
    return color.toLowerCase().includes(searchInputValue);
  });
  renderColors(filteredColors);
});
function renderColors(colorArray) {
  favorites.innerHTML = "";
  if (colorArray.length === 0) {
    showEmptyState();
    return;
  }
  colorArray.forEach(function (color) {
    createFavoriteColorBtn(color);
  });
}
exportBtn.addEventListener("click", function () {
  const blob = new Blob([JSON.stringify(favoriteColors)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "favoriteColors.json";
  a.click();
  URL.revokeObjectURL(url);
});
importFile.addEventListener("change", function () {
  const file = importFile.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    let importedColors;
    try {
      importedColors = JSON.parse(reader.result);
    } catch {
      alert("Invalid JSON file");
      return;
    }
    if (!Array.isArray(importedColors)) {
      alert("Invalid file");
      return;
    }
    importedColors.forEach(function (color) {
      if (typeof color === "string" && !favoriteColors.includes(color)) {
        favoriteColors.push(color);
      }
    });

    localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
    renderColors(favoriteColors);
  };
});
themeBtn.addEventListener("click", function () {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    themeBtn.innerHTML = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.innerHTML = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});
loadFavorites();
updateColor();
