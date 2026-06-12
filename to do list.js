const tasks = [];
const taskInput = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
function addTask() {
  let taskText = taskInput.value.toUpperCase();
  if (taskInput.value.trim() === "") {
    return;
  }
  const taskObject = {
    text: taskText,
    completed: false,
  };
  tasks.push(taskObject);

  createTask(taskObject);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  console.log("Added:", taskText);
}
function loadTask() {
  let savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (!savedTasks) {
    return;
  }
  savedTasks.forEach(function (task) {
    tasks.push(task);
    createTask(task);
  });
}

button.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
  let key = event.key;
  if (key === "Enter") {
    addTask();
  }
});

function createTask(taskObject) {
  let li = document.createElement("li");

  li.className =
    "flex justify-between items-center bg-gray-500 text-white p-5 rounded-xl shadow-md hover:bg-gray-400 transition duration-300 cursor-pointer";

  li.textContent = taskObject.text;
  if (taskObject.completed) {
    li.classList.add("line-through");
    li.classList.add("opacity-50");
  }
  let delBtn = document.createElement("button");

  delBtn.textContent = "❌";

  delBtn.className =
    "bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-xl transition duration-300";

  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    let shouldDelete = confirm("Delete this task?");

    if (shouldDelete) {
      let index = tasks.indexOf(taskObject);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      li.remove();
      console.log("Task Deleted");
    }
  });

  li.appendChild(delBtn);

  taskList.appendChild(li);
  li.addEventListener("click", function () {
    taskObject.completed = !taskObject.completed;

    li.classList.toggle("line-through");
    li.classList.toggle("opacity-50");

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}
loadTask();
