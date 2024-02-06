const {
  app,
  BrowserWindow,
  ipcMain,
  autoUpdater,
  protocol,
} = require("electron");
const path = require("path");
const Store = require("electron-store");

if (process.env.GITHUB_TOKEN) {
  console.log("GitHub token is set:", process.env.GITHUB_TOKEN);
} else {
  console.log(
    "GitHub token is not set. Please set the GITHUB_TOKEN environment variable."
  );
}

const store = new Store();
let mainWindow;

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
