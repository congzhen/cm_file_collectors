import { ipcMain, dialog, ipcRenderer, shell, BrowserWindow, app } from 'electron'
import fs from 'fs'
import Datastore from 'nedb'
import path from 'path';
function createIpcMain(win: BrowserWindow) {
    let maxWindowStatus = true;
    ipcMain.on('ipcDialogGetFolderPathSync', (event: Electron.IpcMainEvent) => {
        const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
        event.returnValue = result;
    });
    ipcMain.on('ipcDialogGetFileSync', (event: Electron.IpcMainEvent) => {
        const result = dialog.showOpenDialogSync({ properties: ['openFile'] });
        event.returnValue = result;
    });
    ipcMain.on('ipcDialogGetMultiSelectionsFileSync', (event: Electron.IpcMainEvent) => {
        const result = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
        event.returnValue = result;
    });

    ipcMain.on('ipcNedbFindAll', (event: Electron.IpcMainEvent, dbPath: string) => {
        const db = new Datastore({
            autoload: true,
            filename: dbPath,
        });
        db.find({}).sort({ addTime: 1 }).exec(function (_err: unknown, docs: unknown) {
            event.returnValue = docs;
        });
    });
    ipcMain.on('ipcWindowSize', (event: Electron.IpcMainEvent, type: string) => {
        if (win && type == 'min') {
            win.minimize();
        } else {
            maxWindowStatus ? win.unmaximize() : win.maximize();
            maxWindowStatus = !maxWindowStatus;
        }
        event.returnValue = true;
    });
    ipcMain.on('ipcWindowClose', (event: Electron.IpcMainEvent) => {
        win.destroy();
        app.quit();
        event.returnValue = true;
    });
}

const ipcRendererSend = {
    dialogGetFolderPathSync: function (): string | undefined {
        const rd = ipcRenderer.sendSync('ipcDialogGetFolderPathSync');
        if (Array.isArray(rd) && rd.length > 0) {
            return rd[0] as string;
        }
        return undefined;
    },
    dialogGetFileSync: function () {
        const rd = ipcRenderer.sendSync('ipcDialogGetFileSync');
        console.log(rd);
        if (Array.isArray(rd) && rd.length > 0) {
            return rd[0] as string;
        }
        return undefined;
    },
    dialogGetMultiSelectionsFileSync: function () {
        const arr = ipcRenderer.sendSync('ipcDialogGetMultiSelectionsFileSync') as Array<string>;
        if (arr == undefined) {
            return [];
        }
        return arr;
    },
    nedbFindAll: function (dbPath: string) {
        return ipcRenderer.sendSync('ipcNedbFindAll', dbPath) as Array<unknown>;

    },
    changeWindowSize: function (type = 'min') {
        ipcRenderer.sendSync('ipcWindowSize', type)
    },
    execWindowClose: function () {
        ipcRenderer.sendSync('ipcWindowClose');
    },
    mainStartup: function () {
        ipcRenderer.sendSync('MainStartup');
    },
}

const elShell = {
    openPath: async function (folderPath: string) {
        if (path.extname(folderPath) !== '') {
            folderPath = path.dirname(folderPath)
        }
        return await shell.openPath(folderPath);
    },
    execFile: async function (filePath: string) {
        if (fs.existsSync(filePath)) {
            return await shell.openPath(filePath);
        }
    },
}


export { createIpcMain, ipcRendererSend, elShell };