const { app, protocol, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createMainWindow();
  protocol.registerFileProtocol("electron", (request, callback) => {
    const url = request.url.substr(11); // Strip off 'electron://'
    callback({ path: path.normalize(`${__dirname}/src/${url}`) });
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createMainWindow();
});
