const taskInput = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

button.addEventListener("click", () => {
  let valueStore = taskInput.value;
  const li = document.createElement("li");
  li.className =
    "bg-gray-500 text-white p-5 rounded-xl shadow-md hover:bg-gray-400 transition duration-300 cursor-pointer";
  li.textContent = valueStore;
  taskList.appendChild(li);
  taskInput.value = "";
  if (taskInput.value === "") {
    let currentLength = li[li.length - 1];
    taskList.remove(li[currentLength]);
  }
});
