import { app, BrowserWindow, screen, globalShortcut } from 'electron';
import * as path from 'path';

const WINDOW_URL = "http://localhost:5173";
const REACT_PACKAGE_DESTINATION = "../src-ui/dist/index.html";
// const API_ENDPOINT = "http://localhost:5000";

app.commandLine.appendSwitch('enable-transparent-visuals');
let win: BrowserWindow;

async function createWindow() {
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("bootin")

    const { width, height } = screen.getPrimaryDisplay().bounds;

    win = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        hasShadow: true,
        backgroundColor: '#00000000',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.once("ready-to-show", () => {
        win.maximize();
        win.hide();
    })

    if (!app.isPackaged && process.env.ASKERISK_PRODUCTION != "1") {
        win.loadURL(WINDOW_URL);
        win.webContents.on('did-fail-load', (event, error, description, valid_url) => {
            console.log(`Failed1: ${valid_url} -------------`)
            console.log(`Failed1: ${WINDOW_URL} --------------`)

            // if it failed, React just probably hasn't loaded yet.
            if (valid_url.includes(WINDOW_URL)) {

                console.log(`Failed2: ${valid_url} ------------`)
                setTimeout(() => {
                    win.loadURL(WINDOW_URL);
                }, 500)
            }
        })
        // win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(import.meta.dirname, REACT_PACKAGE_DESTINATION));
    }
}

app.whenReady().then(() => {
    createWindow();

    const shortcut = globalShortcut.register("CommandOrControl+Shift+Space", () => {
        if (!win) return;

        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
            win.focus();

            // tell the backend to boot
            // fetch(`${API_ENDPOINT}/api/boot?n=${Math.random()}`);
        }
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length == 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
})
