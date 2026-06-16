const tasks = [];
const taskInput = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progressText = document.getElementById("progressText");
function progressTextInPercent() {
  const completed = tasks.filter(function (task) {
    return task.completed;
  });
  if (tasks.length > 0) {
    let progress = 0;
    progress = Math.round((completed.length / tasks.length) * 100);
    progressText.textContent = `Progress: ${progress}%`;
  }
}
function totalTasksCounter() {
  totalTasks.textContent = `Total Tasks: ${tasks.length}`;
}
function completedTasksCounter() {
  const completed = tasks.filter(function (task) {
    return task.completed;
  });
  completedTasks.textContent = `Tasks completed: ${completed.length}`;
}
function updateCounter() {
  const remaining = tasks.filter(function (task) {
    return !task.completed;
  });
  taskCounter.textContent = `Tasks Remaining: ${remaining.length}`;
}

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
  updateCounter();
  totalTasksCounter();
  progressTextInPercent();
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
  updateCounter();
  totalTasksCounter();
  progressTextInPercent();
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
      updateCounter();
      totalTasksCounter();
      progressTextInPercent();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      li.remove();
      console.log("Task Deleted");
    }
  });
  let editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className =
    "bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded-xl transition duration-300";
  editBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    let newText = prompt("Edit task:", taskObject.text);
    if (newText === null) {
      return;
    }
    if (newText.trim() === "") {
      return;
    }
    taskObject.text = newText.toUpperCase();
    renderTask(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
  li.appendChild(editBtn);
  li.appendChild(delBtn);

  taskList.appendChild(li);
  li.addEventListener("click", function () {
    taskObject.completed = !taskObject.completed;
    updateCounter();
    completedTasksCounter();
    totalTasksCounter();
    progressTextInPercent();
    li.classList.toggle("line-through");
    li.classList.toggle("opacity-50");
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}
loadTask();
updateCounter();
completedTasksCounter();
totalTasksCounter();
progressTextInPercent();
function renderTask(taskArray) {
  taskList.innerHTML = "";
  taskArray.forEach(function (task) {
    createTask(task);
  });
}
allBtn.addEventListener("click", function () {
  renderTask(tasks);
});
activeBtn.addEventListener("click", function () {
  const activeTasks = tasks.filter(function (task) {
    return !task.completed;
  });
  renderTask(activeTasks);
});
completedBtn.addEventListener("click", function () {
  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  });
  renderTask(completedTasks);
});
clearCompletedBtn.addEventListener("click", function () {
  const activeTasks = tasks.filter(function (task) {
    return !task.completed;
  });

  tasks.length = 0;

  activeTasks.forEach(function (task) {
    tasks.push(task);
  });

  renderTasks(tasks);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  updateCounter();
  progressTextInPercent();
});
