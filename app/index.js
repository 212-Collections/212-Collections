const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("child_process");
let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.setMenu(null);

  win.loadFile("./frontend/loading.html");

  // win.webContents.openDevTools();

  let ready = false;

  // backendProcess = spawn("node", ["./backend/server.js"]);
  backendProcess = spawn("node", ["./resources/app/backend/server.js"]);
  backendProcess.stdout.on("data", (data) => {
    console.log(`Sortie du backend : ${data}`);
    if (!ready) {
      win.loadFile("./frontend/index.html");
      ready = true;
    }
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Erreur du backend : ${data}`);

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
