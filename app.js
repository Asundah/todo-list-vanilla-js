// DOM ELEMENTS
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const status = document.querySelector("#status");
const filterButtons = document.querySelectorAll(".filter-btn");

// STATE
let tasks = [];
let currentFilter = "all";

// STORAGE
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// RENDER
function render() {
  let visible = tasks;
  if (currentFilter === "active") {
    visible = tasks.filter(function (t) {
      return !t.completed;
    });
  } else if (currentFilter === "completed") {
    visible = tasks.filter(function (t) {
      return t.completed;
    });
  }

  list.innerHTML = "";

  visible.forEach(function (task) {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "X";
    delBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  const remaining = tasks.filter(function (t) {
    return !t.completed;
  }).length;
  if (tasks.length === 0) {
    status.textContent = "No tasks yet.";
  } else {
    status.textContent = remaining + " of " + tasks.length + " remaining";
  }

  filterButtons.forEach(function (btn) {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// ACTIONS
function addTask(text) {
  if (text.trim() === "") return;
  const newTask = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (task) {
    task.completed = !task.completed;
    savetasks();
    render();
  }
}

function deleteTask(id){
    tasks = tasks.filter(function(t){
        return t.id != id
    });
    saveTasks();
    render();
}

// EVENTS
form.addEventListener('submit', function (event){
    event.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
});

filterButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
        currentFilter = btn.dataset.filter;
        render();
    });
});

// BOOT
loadTasks();
render();