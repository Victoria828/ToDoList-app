"use strict";

// Variables
const STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const removeTaskFromLocalStorage = (index) => {
  const tasks = getTasksFromLocalStorage();
  tasks.splice(index, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateTaskInLocalStorage = (previousTask, updatedTask) => {
  const tasks = getTasksFromLocalStorage();

  const taskIndex = tasks.findIndex((task) => task === previousTask);
  tasks[taskIndex] = updatedTask;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// "tasks" functions
const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task;

    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(taskText);

    const taskIcon = document.createElement("span");
    taskIcon.className = "change-item";
    taskIcon.innerHTML = '<i class="fa fa-edit"></i>';
    li.append(taskIcon);

    // Append li to ul
    taskList.append(li);
  });
};

const addTask = (event) => {
  event.preventDefault();

  // Пусте значення або пробіли
  if (taskInput.value.trim() === "") {
    return;
  }

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value; // значення яке ввів користувач

  const taskText = document.createElement("span");
  taskText.className = "delete-item";
  taskText.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(taskText);

  const taskIcon = document.createElement("span");
  taskIcon.className = "change-item";
  taskIcon.innerHTML = '<i class="fa fa-edit"></i>';
  li.append(taskIcon);

  taskList.append(li);

  // Save to storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input value
  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      // remove from DOM

      const deletedLi = event.target.closest("li");
      const index = Array.from(taskList.children).indexOf(deletedLi);
      deletedLi.remove();

      removeTaskFromLocalStorage(index);
    }
  }
};

const editTask = (event) => {
  const isEditIcon = event.target.classList.contains("fa-edit");

  if (isEditIcon) {
    const newText = prompt("Введіть нове значення:");

    if (newText) {
      const changedLi = event.target.closest("li");
      const previousText = changedLi.textContent;

      changedLi.textContent = newText;

      const taskText = document.createElement("span");
      taskText.className = "delete-item";
      taskText.innerHTML = '<i class="fa fa-remove"></i>';
      changedLi.append(taskText);

      const taskIcon = document.createElement("span");
      taskIcon.className = "change-item";
      taskIcon.innerHTML = '<i class="fa fa-edit"></i>';
      changedLi.append(taskIcon);

      updateTaskInLocalStorage(previousText, newText);
    }
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

// init
getTasks();

// Event listeners

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

taskList.addEventListener("click", editTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);
