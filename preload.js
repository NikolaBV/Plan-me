const { contextBridge, ipcRenderer } = require("electron");

// Expose ipcRenderer to the window object
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
