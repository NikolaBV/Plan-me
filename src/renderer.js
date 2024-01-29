const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
const whenTaskInput = document.getElementById("whenTask");
const tasksList = document.querySelector(".tasksList");
const tomorrowTasksList = document.querySelector(".tomorrowTasksList");

// Load existing tasks from localStorage when the app starts
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

setButton.addEventListener("click", () => {
  const title = titleInput.value;
  const whenTask = whenTaskInput.value;

  // Create a new <li> element
  const newTaskItem = document.createElement("li");
  newTaskItem.classList.add("task");

  // Create <p> elements for time and description
  const taskTime = document.createElement("p");
  taskTime.id = "taskTime";
  taskTime.textContent = whenTask; // Set the time from the input field

  const taskDescription = document.createElement("p");
  taskDescription.id = "taskDescription";
  taskDescription.textContent = title; // Set the description from the input field

  // Create a clickable "remove" text
  const removeText = document.createElement("p");
  removeText.textContent = "remove";
  removeText.style.color = "blue";
  removeText.style.cursor = "pointer";
  removeText.addEventListener("click", () => {
    // Remove the task from the page and localStorage
    removeTask(newTaskItem);
  });

  // Append <p> elements to the <li> element
  newTaskItem.appendChild(taskTime);
  newTaskItem.appendChild(taskDescription);
  newTaskItem.appendChild(removeText);

  // Append the new <li> element to the <ul> element
  tasksList.appendChild(newTaskItem);
  tomorrowTasksList.appendChild(newTaskItem);

  // Save the new task to localStorage
  saveTask({ title, whenTask });

  // Clear input fields after creating a new task
  titleInput.value = "";
  whenTaskInput.value = "";
});

function saveTask(task) {
  // Get existing tasks from localStorage
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Add the new task to the existing tasks array
  existingTasks.push(task);

  // Save the updated tasks array back to localStorage
  localStorage.setItem("tasks", JSON.stringify(existingTasks));
}

function loadTasks() {
  // Get existing tasks from localStorage
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const currentDay = new Date();
  const today = currentDay.getDate();
  const month = currentDay.getMonth() + 1;

  // This will be done on loading
  existingTasks.forEach((task) => {
    const taskDay = parseInt(task.whenTask.substring(8, 10), 10);
    console.log("taskday: " + taskDay + " today + 1: " + (today + 1));
    console.log("task.whenTask[6]: " + task.whenTask[6] + " month: " + month);

    if (task.whenTask[6] === month && taskDay === today + 1) {
      // Create a new task item for tomorrow
      appendTaskToTomorrowList(task);
    } else {
      // Create a new task item for today
      const newTaskItemToday = createTaskItem(task);
      tasksList.appendChild(newTaskItemToday);
    }
  });
}

function removeTask(taskItem) {
  // Remove the task from the page
  taskItem.remove();

  // Remove the task from localStorage
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskId = taskItem.dataset.id;

  // Filter out the task with the specified ID
  const updatedTasks = existingTasks.filter((task) => task.id !== taskId);

  // Save the updated tasks array back to localStorage
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function createTaskItem(task) {
  const newTaskItem = document.createElement("li");
  newTaskItem.classList.add("task");

  const taskTime = document.createElement("p");
  taskTime.id = "taskTime";
  taskTime.textContent = task.whenTask;

  const taskDescription = document.createElement("p");
  taskDescription.id = "taskDescription";
  taskDescription.textContent = task.title;

  const removeText = document.createElement("p");
  removeText.textContent = "remove";
  removeText.style.color = "blue";
  removeText.style.cursor = "pointer";
  removeText.addEventListener("click", () => {
    removeTask(newTaskItem);
  });

  newTaskItem.appendChild(taskTime);
  newTaskItem.appendChild(taskDescription);
  newTaskItem.appendChild(removeText);

  return newTaskItem;
}
//Calendar functionallity
document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    dateClick: function (info) {
      // Use the load dates for the current and day after the current day here
      monthNumber = info.dateStr[5] + info.dateStr[6];
      dayNumber = info.dateStr[8] + info.dateStr[9];
      loadCurrentDayTasks(dayNumber, monthNumber);
    },
  });
  calendar.render();
});
function loadCurrentDayTasks(dayNumber, monthNumber) {
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Clears the tasklist
  tasksList.innerHTML = "";

  existingTasks.forEach((task) => {
    if (
      task.whenTask.substring(5, 7) !== monthNumber ||
      task.whenTask.substring(8, 10) !== dayNumber
    ) {
      return;
    } else {
      const newTaskItem = createTaskItem(task);
      tasksList.appendChild(newTaskItem);
    }
  });
}

//TODO implement it similar to the loadTasks foreach loop but on clicking the calendar
function loadTomorrowTasks() {}

function appendTaskToTomorrowList(task) {
  const newTaskItemTomorrow = createTaskItem(task);
  tomorrowTasksList.appendChild(newTaskItemTomorrow.cloneNode(true));
}
