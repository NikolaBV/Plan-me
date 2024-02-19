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

  const currentDay = new Date();
  const today = currentDay.getDate();
  const month = currentDay.getMonth() + 1;

  const taskDate = new Date(whenTask);
  const taskDay = taskDate.getDate();
  const taskMonth = taskDate.getMonth() + 1;

  const isTomorrow =
    (taskMonth === month && taskDay - today === 1) || // Tomorrow in the same month
    (taskMonth - month === 1 &&
      today === getLastDayOfMonth(month) &&
      taskDay === 1);
  // Append the new <li> element to the <ul> element

  if (isTomorrow) {
    tomorrowTasksList.appendChild(newTaskItem);
  } else {
    tasksList.appendChild(newTaskItem);
  }

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
  tasksList.innerHTML = "";
  // Get existing tasks from localStorage
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const currentDay = new Date();
  const today = currentDay.getDate();
  const month = currentDay.getMonth() + 1;

  // This will be done on loading
  existingTasks.forEach((task) => {
    const taskDate = new Date(task.whenTask);
    const taskDay = taskDate.getDate();
    const taskMonth = taskDate.getMonth() + 1;

    const isTomorrow =
      (taskMonth === month && taskDay - today === 1) || // Tomorrow in the same month
      (taskMonth - month === 1 &&
        today === getLastDayOfMonth(month) &&
        taskDay === 1); // Tomorrow when today is the last day of the month

    if (isTomorrow) {
      // Create a new task item for tomorrow
      appendTaskToTomorrowList(task);
      console.log(task);
      showTaskNotification(task.title, task.whenTask);
    } else {
      // Create a new task item for today
      const newTaskItemToday = createTaskItem(task);
      console.log(task);
      showTaskNotification(task.title, task.whenTask);
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
      const clickedDate = new Date(info.dateStr);
      const clickedDay = clickedDate.getDate();
      const clickedMonth = clickedDate.getMonth() + 1;

      const tomorrowDay = clickedDate.getDate();
      const tommorowMonthmonth = clickedDate.getMonth();
      const tommorowYear = clickedDate.getFullYear();
      const tomorrowDate = new Date(
        tommorowYear,
        tommorowMonthmonth,
        tomorrowDay + 1
      );
      loadCurrentDayTasks(clickedDay, clickedMonth);
      loadTomorrowTasks(clickedDate, tomorrowDate);
    },
  });
  calendar.render();
});
function loadCurrentDayTasks(clickedDay, clickedMonth) {
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Clears the tasklist
  tasksList.innerHTML = "";

  existingTasks.forEach((task) => {
    const taskDate = new Date(task.whenTask);
    const taskDay = taskDate.getDate();
    const taskMonth = taskDate.getMonth() + 1;

    if (taskMonth != clickedMonth || taskDay != clickedDay) {
      return;
    } else {
      const newTaskItem = createTaskItem(task);
      tasksList.appendChild(newTaskItem);
    }
  });
}

//TODO implement it similar to the loadTasks foreach loop but on clicking the calendar
function loadTomorrowTasks(clickedDate, tomorrowDate) {
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  console.log(clickedDate);
  console.log(tomorrowDate.getDate());
  // Clears the tasklist
  tomorrowTasksList.innerHTML = "";

  existingTasks.forEach((task) => {
    const taskDate = new Date(task.whenTask);
    const taskDay = taskDate.getDate();
    const taskMonth = taskDate.getMonth() + 1;

    const isTomorrow =
      taskDay == tomorrowDate.getDate() &&
      taskMonth == tomorrowDate.getMonth() + 1;
    if (isTomorrow) {
      const newTaskItem = createTaskItem(task);
      tomorrowTasksList.appendChild(newTaskItem);
    }
  });
}

function appendTaskToTomorrowList(task) {
  const newTaskItemTomorrow = createTaskItem(task);
  tomorrowTasksList.appendChild(newTaskItemTomorrow);
}
function getLastDayOfMonth(month) {
  const nextMonthFirstDay = new Date(new Date().getFullYear(), month, 1);
  const lastDay = new Date(nextMonthFirstDay - 1);
  return lastDay.getDate();
}

function showTaskNotification(taskName, taskTime) {
  const NOTIFICATION_TITLE = taskName;
  const NOTIFICATION_BODY = taskTime;

  new window.Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
  });
}
