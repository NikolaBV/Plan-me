const { app, BrowserWindow, ipcMain, autoUpdater } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();
let mainWindow;
let addTaskWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

function createAddTaskWindow() {
  addTaskWindow = new BrowserWindow({
    title: "Add a task",
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  addTaskWindow.loadFile("addTasks.html");

  addTaskWindow.on("closed", function () {
    addTaskWindow = null;
  });
}

app.on("ready", () => {
  createMainWindow();

  ipcMain.on("open-add-task-window", () => {
    createAddTaskWindow();
  });

  ipcMain.on("add-task", (event, task) => {
    const tasks = store.get("tasks", []);
    tasks.push(task);
    store.set("tasks", tasks);

    // Send the updated tasks to the mainWindow
    mainWindow.webContents.send("update-tasks", tasks);

    // Send the task data to the index.html renderer process
    mainWindow.webContents.send("log-task", task);

    // Send the task data to the addTasks.html renderer process
    if (addTaskWindow) {
      addTaskWindow.webContents.send("log-task", task);
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createMainWindow();
});
