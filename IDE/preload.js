const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Platform info
    platform: process.platform,
    isElectron: true,

    // Window controls
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('is-maximized'),

    // Navigation events
    onNavigate: (callback) => ipcRenderer.on('navigate', (_, page) => callback(page)),
    onToggleSidebar: (callback) => ipcRenderer.on('toggle-sidebar', () => callback()),
    onToggleTerminal: (callback) => ipcRenderer.on('toggle-terminal', () => callback()),
    onShowCommandPalette: (callback) => ipcRenderer.on('show-command-palette', () => callback()),

    // File events
    onNewFile: (callback) => ipcRenderer.on('new-file', () => callback()),
    onSaveFile: (callback) => ipcRenderer.on('save-file', () => callback()),
    onFileOpened: (callback) => ipcRenderer.on('file-opened', (_, path) => callback(path)),
    onFolderOpened: (callback) => ipcRenderer.on('folder-opened', (_, path) => callback(path)),

    // File system operations
    readFile: (path) => ipcRenderer.invoke('read-file', path),
    writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
    readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
    createFile: (path) => ipcRenderer.invoke('create-file', path),
    createDirectory: (path) => ipcRenderer.invoke('create-directory', path),
    deletePath: (path) => ipcRenderer.invoke('delete-path', path),
    renamePath: (oldPath, newPath) => ipcRenderer.invoke('rename-path', oldPath, newPath),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    getApiKey: () => ipcRenderer.invoke('get-api-key'),

    // Chat history
    getChatHistory: () => ipcRenderer.invoke('get-chat-history'),
    saveChatHistory: (history) => ipcRenderer.invoke('save-chat-history', history),
    clearChatHistory: () => ipcRenderer.invoke('clear-chat-history'),

    // Saved chats
    getSavedChats: () => ipcRenderer.invoke('get-saved-chats'),
    saveChat: (chat) => ipcRenderer.invoke('save-chat', chat),

    // Templates
    getTemplates: () => ipcRenderer.invoke('get-templates'),
    saveTemplate: (template) => ipcRenderer.invoke('save-template', template),
    deleteTemplate: (id) => ipcRenderer.invoke('delete-template', id),

    // Extensions
    getInstalledExtensions: () => ipcRenderer.invoke('get-installed-extensions'),
    installExtension: (extension) => ipcRenderer.invoke('install-extension', extension),
    uninstallExtension: (id) => ipcRenderer.invoke('uninstall-extension', id),

    // Git operations
    gitStatus: (repoPath) => ipcRenderer.invoke('git-status', repoPath),
    gitStage: (repoPath, files) => ipcRenderer.invoke('git-stage', repoPath, files),
    gitUnstage: (repoPath, files) => ipcRenderer.invoke('git-unstage', repoPath, files),
    gitCommit: (repoPath, message) => ipcRenderer.invoke('git-commit', repoPath, message),
    gitBranches: (repoPath) => ipcRenderer.invoke('git-branches', repoPath),
    gitCheckout: (repoPath, branch) => ipcRenderer.invoke('git-checkout', repoPath, branch),
    gitInit: (repoPath) => ipcRenderer.invoke('git-init', repoPath),

    // Terminal
    terminalCreate: (options) => ipcRenderer.invoke('terminal-create', options),
    terminalInput: (id, data) => ipcRenderer.send('terminal-input', { id, data }),
    terminalResize: (id, cols, rows) => ipcRenderer.send('terminal-resize', { id, cols, rows }),
    terminalKill: (id) => ipcRenderer.send('terminal-kill', id),
    onTerminalData: (callback) => ipcRenderer.on('terminal-data', (_, data) => callback(data)),
    onTerminalExit: (callback) => ipcRenderer.on('terminal-exit', (_, data) => callback(data)),

    // Recent files
    getRecentFiles: () => ipcRenderer.invoke('get-recent-files'),
    addRecentFile: (path) => ipcRenderer.invoke('add-recent-file', path),

    // Agent - Project Generation
    agentGenerateProject: (options) => ipcRenderer.invoke('agent:generate-project', options),
    agentGetProjects: () => ipcRenderer.invoke('agent:get-projects'),
    onAgentEvent: (callback) => ipcRenderer.on('agent:event', (_, data) => callback(data)),

    // OAuth Login
    oauthLogin: () => ipcRenderer.invoke('oauth-login'),
    exchangeAuthCode: (code) => ipcRenderer.invoke('exchange-auth-code', code),
    onAuthCodeReceived: (callback) => ipcRenderer.on('auth-code-received', (_, code) => callback(code)),

    // Cleanup
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

console.log('OxonAI IDE: Preload script loaded');
