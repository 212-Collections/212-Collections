const { app, BrowserWindow, dialog, shell } = require("electron");
const { spawn } = require("child_process");
let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.setMenu(null);

  let backPath;

  if (app.isPackaged) {
    backPath = "./resources/app/backend/server.js";
  } else {
    backPath = "./backend/server.js";
  }

  win.loadFile("./frontend/loading.html");

  // win.webContents.openDevTools();

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  let ready = false;

  backendProcess = spawn("node", [backPath]);
  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend output : ${data}`);
    if (!ready) {
      win.loadFile("./frontend/index.html");
      ready = true;
    }
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend error : ${data}`);
    dialog.showMessageBox({
      type: "info",
      message: "!!!!!!!!! " + data.toString(),
      buttons: ["OK"],
    });
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    backendProcess.kill();
    backendProcess = null;
  }
});
