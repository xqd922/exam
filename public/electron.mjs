import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';
import { initDatabase } from '../src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';

async function createWindow() {
    try {
        // 初始化数据库
        await initDatabase();

        // 创建浏览器窗口
        const mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });

        // 加载应用
        if (isDev) {
            mainWindow.loadURL('http://localhost:3000');
            mainWindow.webContents.openDevTools();
        } else {
            mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
        }
    } catch (error) {
        console.error('应用启动失败:', error);
        app.quit();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
}); 