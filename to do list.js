const themeBtn = document.getElementById("themeBtn");
const importInput = document.getElementById("importInput");
const exportBtn = document.getElementById("exportBtn");
const highActiveBtn = document.getElementById("highActiveBtn");
const mediumActiveBtn = document.getElementById("mediumActiveBtn");
const lowActiveBtn = document.getElementById("lowActiveBtn");
const highBtn = document.getElementById("highBtn");
const mediumBtn = document.getElementById("mediumBtn");
const lowBtn = document.getElementById("lowBtn");
const priorityInput = document.getElementById("priorityInput");
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
const searchInput = document.getElementById("searchInput");
const sortAZBtn = document.getElementById("sortAZBtn");
const sortZABtn = document.getElementById("sortZABtn");
const dateInput = document.getElementById("dateInput");
sortAZBtn.addEventListener("click", function () {
  tasks.sort(function (a, b) {
    return a.text.localeCompare(b.text);
  });
  renderTask(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
});

searchInput.addEventListener("input", function () {
  let searchText = searchInput.value.toUpperCase();
  const filteredTasks = tasks.filter(function (task) {
    return task.text.includes(searchText);
  });
  renderTask(filteredTasks);
});
sortZABtn.addEventListener("click", function () {
  tasks.sort(function (a, b) {
    return b.text.localeCompare(a.text);
  });

  renderTask(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
});
function updateCounter() {
  const completed = tasks.filter(function (task) {
    return task.completed;
  });
  const remaining = tasks.filter(function (task) {
    return !task.completed;
  });
  taskCounter.textContent = `Tasks Remaining: ${remaining.length}`;
  totalTasks.textContent = `Total Tasks: ${tasks.length}`;
  completedTasks.textContent = `Tasks completed: ${completed.length}`;
  let progress = 0;

  if (tasks.length > 0) {
    progress = Math.round((completed.length / tasks.length) * 100);
  }

  progressText.textContent = `Progress: ${progress}%`;
}

function addTask() {
  let taskText = taskInput.value.toUpperCase();
  if (taskInput.value.trim() === "") {
    return;
  }
  if (priorityInput.value === "") {
    alert("Please select a priority");
    return;
  }
  const taskObject = {
    text: taskText,
    completed: false,
    dueDate: dateInput.value,
    priority: priorityInput.value,
  };
  tasks.push(taskObject);
  updateCounter();

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
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    themeBtn.innerHTML = "☀️ Light Mode";
  } else {
    themeBtn.innerHTML = "🌙 Dark Mode";
  }
}

button.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (event) {
  let key = event.key;
  if (key === "Enter") {
    addTask();
  }
  updateCounter();
});

function createTask(taskObject) {
  let li = document.createElement("li");
  li.className =
    "flex justify-between items-center bg-slate-800 text-white p-5 rounded-2xl shadow-lg hover:scale-105 transition duration-300 cursor-pointer";
  if (taskObject.priority === "HIGH") {
    li.classList.add("border-l-8", "border-red-500");
  }

  if (taskObject.priority === "MEDIUM") {
    li.classList.add("border-l-8", "border-yellow-500");
  }

  if (taskObject.priority === "LOW") {
    li.classList.add("border-l-8", "border-green-500");
  }

  const today = new Date();
  const dueDate = new Date(taskObject.dueDate);

  if (taskObject.dueDate && today > dueDate && !taskObject.completed) {
    li.classList.add("border-4", "border-red-500");
  }

  li.textContent = `${taskObject.text} (${taskObject.dueDate}) [${taskObject.priority}];`;
  if (taskObject.completed) {
    li.classList.add("line-through");
    li.classList.add("opacity-50");
  }
  let delBtn = document.createElement("button");

  delBtn.textContent = "❌";

  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    let shouldDelete = confirm("Delete this task?");

    if (shouldDelete) {
      let index = tasks.indexOf(taskObject);
      tasks.splice(index, 1);
      updateCounter();

      localStorage.setItem("tasks", JSON.stringify(tasks));
      li.remove();
      console.log("Task Deleted");
    }
  });
  let editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
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

    li.classList.toggle("line-through");
    li.classList.toggle("opacity-50");
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}
loadTask();
updateCounter();

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

  renderTask(tasks);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  updateCounter();
});
highBtn.addEventListener("click", function () {
  const highTasks = tasks.filter(function (task) {
    return task.priority === "HIGH";
  });

  renderTask(highTasks);
});
mediumBtn.addEventListener("click", function () {
  const mediumTasks = tasks.filter(function (task) {
    return task.priority === "MEDIUM";
  });
  renderTask(mediumTasks);
});
lowBtn.addEventListener("click", function () {
  const lowTasks = tasks.filter(function (task) {
    return task.priority === "LOW";
  });
  renderTask(lowTasks);
});
highActiveBtn.addEventListener("click", function () {
  const highActiveTasks = tasks.filter(function (task) {
    return task.priority === "HIGH" && !task.completed;
  });
  renderTask(highActiveTasks);
});
mediumActiveBtn.addEventListener("click", function () {
  const mediumActiveTasks = tasks.filter(function (task) {
    return task.priority === "MEDIUM" && !task.completed;
  });
  renderTask(mediumActiveTasks);
});
lowActiveBtn.addEventListener("click", function () {
  const lowActiveTasks = tasks.filter(function (task) {
    return task.priority === "LOW" && !task.completed;
  });
  renderTask(lowActiveTasks);
});
exportBtn.addEventListener("click", function () {
  const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tasks.json";
  a.click();
});
importInput.addEventListener("change", function () {
  const file = importInput.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function () {
    const importedTasks = JSON.parse(reader.result);
    importedTasks.forEach(function (task) {
      tasks.push(task);
    });
    renderTask(tasks);
    updateCounter();
    localStorage.setItem("tasks", JSON.stringify(tasks));
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
