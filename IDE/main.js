const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const Store = require('electron-store');
const { simpleGit } = require('simple-git');

// Try to load node-pty (may fail if not compiled)
let pty;
try {
    pty = require('node-pty');
} catch (e) {
    console.warn('node-pty not available, terminal will be simulated');
}

const store = new Store();
let mainWindow;
let terminals = new Map();
const isDev = !app.isPackaged;
const WEBSITE_URL = isDev ? 'http://localhost:3000' : 'https://oxonai-web.vercel.app';
let pendingAuthCode = null; // Store auth code from deep link

// Register custom protocol
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('oxonai', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('oxonai');
}

// Handle deep links on Windows/Linux
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Handle the deep link from second instance
        const url = commandLine.find(arg => arg.startsWith('oxonai://'));
        if (url) {
            handleDeepLink(url);
        }

        // Focus the main window
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// Handle deep links on macOS
app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
});

function handleDeepLink(url) {
    console.log('Deep link received:', url);
    const urlObj = new URL(url);

    if (urlObj.host === 'auth') {
        const code = urlObj.searchParams.get('code');
        if (code) {
            pendingAuthCode = code;
            if (mainWindow) {
                mainWindow.webContents.send('auth-code-received', code);
            }
        }
    }
}

function createWindow() {
    const windowState = store.get('windowState', { width: 1400, height: 900 });

    mainWindow = new BrowserWindow({
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        minWidth: 1000,
        minHeight: 700,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#09090b',
        icon: path.join(__dirname, 'assets', 'icon.png'),
        show: false,
    });

    const isDev = !app.isPackaged;
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173').catch(() => {
            mainWindow.loadURL('http://localhost:5174').catch(() => {
                mainWindow.loadURL('http://localhost:5175');
            });
        });
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (windowState.isMaximized) {
            mainWindow.maximize();
        }
    });

    mainWindow.on('close', () => {
        const bounds = mainWindow.getBounds();
        store.set('windowState', {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y,
            isMaximized: mainWindow.isMaximized(),
        });
        // Kill all terminals
        terminals.forEach((term) => term.kill());
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    createMenu();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createMenu() {
    const template = [
        {
            label: 'OxonAI',
            submenu: [
                { label: 'About OxonAI IDE', role: 'about' },
                { type: 'separator' },
                { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: () => mainWindow.webContents.send('navigate', 'settings') },
                { type: 'separator' },
                { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
            ],
        },
        {
            label: 'File',
            submenu: [
                { label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('new-file') },
                { label: 'Open File', accelerator: 'CmdOrCtrl+O', click: openFile },
                { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow.webContents.send('save-file') },
                { type: 'separator' },
                { label: 'Open Folder', accelerator: 'CmdOrCtrl+Shift+O', click: openFolder },
            ],
        },
        {
            label: 'AI Tools',
            submenu: [
                { label: '💬 Chat', accelerator: 'CmdOrCtrl+1', click: () => mainWindow.webContents.send('navigate', 'chat') },
                { label: '✍️ Content', accelerator: 'CmdOrCtrl+2', click: () => mainWindow.webContents.send('navigate', 'content') },
                { label: '💻 Code', accelerator: 'CmdOrCtrl+3', click: () => mainWindow.webContents.send('navigate', 'code') },
                { label: '💡 Ideas', accelerator: 'CmdOrCtrl+4', click: () => mainWindow.webContents.send('navigate', 'ideas') },
                { label: '📋 Summarize', accelerator: 'CmdOrCtrl+5', click: () => mainWindow.webContents.send('navigate', 'summarize') },
                { label: '🔄 Rewrite', accelerator: 'CmdOrCtrl+6', click: () => mainWindow.webContents.send('navigate', 'rewrite') },
            ],
        },
        {
            label: 'View',
            submenu: [
                { label: 'Toggle Sidebar', accelerator: 'CmdOrCtrl+B', click: () => mainWindow.webContents.send('toggle-sidebar') },
                { label: 'Toggle Terminal', accelerator: 'CmdOrCtrl+`', click: () => mainWindow.webContents.send('toggle-terminal') },
                { type: 'separator' },
                { label: 'Command Palette', accelerator: 'CmdOrCtrl+Shift+P', click: () => mainWindow.webContents.send('show-command-palette') },
                { type: 'separator' },
                { role: 'reload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Help',
            submenu: [
                { label: 'Documentation', click: () => shell.openExternal('https://oxonai.com/docs') },
                { label: 'Report Issue', click: () => shell.openExternal('https://github.com/oxonai/ide/issues') },
            ],
        },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function openFile() {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'All Files', extensions: ['*'] },
            { name: 'Code Files', extensions: ['js', 'ts', 'tsx', 'jsx', 'py', 'html', 'css', 'json', 'md'] },
        ],
    });
    if (!result.canceled && result.filePaths.length > 0) {
        mainWindow.webContents.send('file-opened', result.filePaths[0]);
    }
}

async function openFolder() {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });
    if (!result.canceled && result.filePaths.length > 0) {
        mainWindow.webContents.send('folder-opened', result.filePaths[0]);
    }
}

// ============ IPC HANDLERS ============

// Window controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow?.maximize();
    }
});
ipcMain.on('window-close', () => mainWindow?.close());
ipcMain.handle('is-maximized', () => mainWindow?.isMaximized());

// File operations
ipcMain.handle('read-file', async (_, filePath) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return { success: true, content };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('write-file', async (_, filePath, content) => {
    try {
        await fs.writeFile(filePath, content, 'utf-8');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('read-directory', async (_, dirPath) => {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const items = await Promise.all(entries.map(async (entry) => {
            const fullPath = path.join(dirPath, entry.name);
            let stats = null;
            try {
                stats = await fs.stat(fullPath);
            } catch { }
            return {
                name: entry.name,
                path: fullPath,
                isDirectory: entry.isDirectory(),
                size: stats?.size || 0,
                modified: stats?.mtime?.toISOString() || null,
            };
        }));
        return { success: true, items };
    } catch (error) {
        return { success: false, error: error.message, items: [] };
    }
});

ipcMain.handle('create-file', async (_, filePath) => {
    try {
        await fs.writeFile(filePath, '', 'utf-8');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('create-directory', async (_, dirPath) => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('delete-path', async (_, targetPath) => {
    try {
        const stats = await fs.stat(targetPath);
        if (stats.isDirectory()) {
            await fs.rm(targetPath, { recursive: true });
        } else {
            await fs.unlink(targetPath);
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('rename-path', async (_, oldPath, newPath) => {
    try {
        await fs.rename(oldPath, newPath);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Settings
ipcMain.handle('get-settings', () => store.get('settings', {}));
ipcMain.handle('save-settings', (_, settings) => {
    store.set('settings', settings);
    return { success: true };
});
ipcMain.handle('get-api-key', () => store.get('settings.apiKey', ''));

// OAuth Login
ipcMain.handle('oauth-login', async () => {
    const authUrl = `${WEBSITE_URL}/api/auth/ide-callback`;
    shell.openExternal(authUrl);
    return { success: true };
});

// Exchange auth code for user data
ipcMain.handle('exchange-auth-code', async (_, code) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        console.log('IDE: Exchanging auth code:', code);
        const response = await fetch(`${WEBSITE_URL}/api/auth/ide-callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('IDE: Auth exchange failed with status:', response.status, errorText);
            return { success: false, error: `Server error: ${response.status}` };
        }

        const data = await response.json();
        console.log('IDE: Auth exchange response:', data);

        if (data.valid && data.user) {
            // Store user data in settings
            const settings = store.get('settings', {});
            settings.oxonUser = data.user;
            store.set('settings', settings);
            console.log('IDE: Sync successful for user:', data.user.email);
            return { success: true, user: data.user };
        }

        return { success: false, error: data.error || 'Authentication failed' };
    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
            console.error('IDE: Auth exchange timed out');
            return { success: false, error: 'Connection timed out. Is the server running?' };
        }
        console.error('IDE: Auth exchange error:', error);
        return { success: false, error: error.message };
    }
});

// Chat history
ipcMain.handle('get-chat-history', () => store.get('chatHistory', []));
ipcMain.handle('save-chat-history', (_, history) => {
    store.set('chatHistory', history);
    return { success: true };
});
ipcMain.handle('clear-chat-history', () => {
    store.delete('chatHistory');
    return { success: true };
});

// Saved chats
ipcMain.handle('get-saved-chats', () => store.get('savedChats', []));
ipcMain.handle('save-chat', (_, chat) => {
    const chats = store.get('savedChats', []);
    chats.push({ ...chat, id: Date.now(), savedAt: new Date().toISOString() });
    store.set('savedChats', chats);
    return { success: true };
});

// Templates
ipcMain.handle('get-templates', () => store.get('templates', []));
ipcMain.handle('save-template', (_, template) => {
    const templates = store.get('templates', []);
    templates.push({ ...template, id: Date.now() });
    store.set('templates', templates);
    return { success: true };
});
ipcMain.handle('delete-template', (_, id) => {
    const templates = store.get('templates', []).filter(t => t.id !== id);
    store.set('templates', templates);
    return { success: true };
});

// Extensions
ipcMain.handle('get-installed-extensions', () => store.get('extensions', []));
ipcMain.handle('install-extension', (_, extension) => {
    const extensions = store.get('extensions', []);
    if (!extensions.find(e => e.id === extension.id)) {
        extensions.push({ ...extension, installedAt: new Date().toISOString() });
        store.set('extensions', extensions);
    }
    return { success: true };
});
ipcMain.handle('uninstall-extension', (_, extensionId) => {
    const extensions = store.get('extensions', []).filter(e => e.id !== extensionId);
    store.set('extensions', extensions);
    return { success: true };
});

// Git operations
ipcMain.handle('git-status', async (_, repoPath) => {
    try {
        const git = simpleGit(repoPath);
        const isRepo = await git.checkIsRepo();
        if (!isRepo) return { success: false, isRepo: false };

        const status = await git.status();
        const branch = await git.branch();
        return {
            success: true,
            isRepo: true,
            branch: branch.current,
            files: status.files,
            ahead: status.ahead,
            behind: status.behind,
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('git-stage', async (_, repoPath, files) => {
    try {
        const git = simpleGit(repoPath);
        await git.add(files);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('git-unstage', async (_, repoPath, files) => {
    try {
        const git = simpleGit(repoPath);
        await git.reset(['HEAD', ...files]);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('git-commit', async (_, repoPath, message) => {
    try {
        const git = simpleGit(repoPath);
        await git.commit(message);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('git-branches', async (_, repoPath) => {
    try {
        const git = simpleGit(repoPath);
        const branches = await git.branch();
        return { success: true, branches: branches.all, current: branches.current };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('git-checkout', async (_, repoPath, branch) => {
    try {
        const git = simpleGit(repoPath);
        await git.checkout(branch);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('git-init', async (_, repoPath) => {
    try {
        const git = simpleGit(repoPath);
        await git.init();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Terminal operations
ipcMain.handle('terminal-create', (_, options = {}) => {
    const id = ++terminalId;
    const shellPath = process.platform === 'win32'
        ? 'powershell.exe'
        : process.env.SHELL || '/bin/bash';

    if (pty) {
        const term = pty.spawn(shellPath, [], {
            name: 'xterm-256color',
            cols: options.cols || 80,
            rows: options.rows || 24,
            cwd: options.cwd || process.env.HOME || process.env.USERPROFILE,
            env: process.env,
        });

        term.onData((data) => {
            mainWindow?.webContents.send('terminal-data', { id, data });
        });

        term.onExit(({ exitCode }) => {
            terminals.delete(id);
            mainWindow?.webContents.send('terminal-exit', { id, exitCode });
        });

        terminals.set(id, term);
    }

    return { success: true, id };
});

ipcMain.on('terminal-input', (_, { id, data }) => {
    const term = terminals.get(id);
    if (term) {
        term.write(data);
    }
});

ipcMain.on('terminal-resize', (_, { id, cols, rows }) => {
    const term = terminals.get(id);
    if (term) {
        term.resize(cols, rows);
    }
});

ipcMain.on('terminal-kill', (_, id) => {
    const term = terminals.get(id);
    if (term) {
        term.kill();
        terminals.delete(id);
    }
});

// Recent files
ipcMain.handle('get-recent-files', () => store.get('recentFiles', []));
ipcMain.handle('add-recent-file', (_, filePath) => {
    let recent = store.get('recentFiles', []);
    recent = recent.filter(f => f !== filePath);
    recent.unshift(filePath);
    recent = recent.slice(0, 20);
    store.set('recentFiles', recent);
    return { success: true };
});

// App lifecycle
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

console.log('OxonAI IDE: Main process started');
