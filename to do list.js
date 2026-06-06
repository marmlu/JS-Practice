const taskInput = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

button.addEventListener("click", () => {
  let valueStore = taskInput.value.toUpperCase();
  if (taskInput.value.trim() === "") {
    return;
  }
  let li = document.createElement("li");

  li.className =
    "bg-gray-500 text-white p-5 rounded-xl shadow-md hover:bg-gray-400 transition duration-300 cursor-pointer";
  li.textContent = valueStore;
  taskList.appendChild(li);
  console.log(li);
  taskInput.value = "";
});
