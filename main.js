const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // It's important to set nodeIntegration to false
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();

  ipcMain.on("open-add-task-window", () => {
    let addTaskWindow = new BrowserWindow({
      width: 400,
      height: 300,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    addTaskWindow.loadFile("addTasks.html");

    addTaskWindow.on("closed", function () {
      addTaskWindow = null;
    });

    addTaskWindow.removeMenu();
  });
});
