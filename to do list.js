const taskInput = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
function addTask() {
  let taskText = taskInput.value.toUpperCase();
  if (taskInput.value.trim() === "") {
    return;
  }
  let li = document.createElement("li");

  li.className =
    "flex justify-between items-center bg-gray-500 text-white p-5 rounded-xl shadow-md hover:bg-gray-400 transition duration-300 cursor-pointer";

  li.textContent = taskText;
  let delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className =
    "bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-xl transition duration-300";
  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    let shouldDelete = confirm("Delete this task?");
    if (shouldDelete) {
      li.remove();
      console.log("Task Deleted");
    }
  });
  li.appendChild(delBtn);
  taskList.appendChild(li);
  li.addEventListener("click", function () {
    li.classList.toggle("line-through");
    li.classList.toggle("opacity-50");
    console.log("Task completed");
  });
  taskInput.value = "";
  console.log("Added:", taskText);
}
button.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
  let key = event.key;
  if (key === "Enter") {
    addTask();
  }
});
