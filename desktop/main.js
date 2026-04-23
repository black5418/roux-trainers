const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

const APP_TITLE = "Roux 训练器";
const isDev = Boolean(process.env.ELECTRON_START_URL);
const buildIndexPath = path.join(__dirname, "..", "build", "index.html");

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 840,
    minWidth: 900,
    minHeight: 640,
    title: APP_TITLE,
    backgroundColor: "#202124",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL(process.env.ELECTRON_START_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(buildIndexPath);
  }

  win.once("ready-to-show", () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  app.setName(APP_TITLE);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
