// Electron API types
export interface ElectronAPI {
    // Platform
    platform: string;
    isElectron: boolean;

    // Window controls
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;

    // Navigation events
    onNavigate: (callback: (page: string) => void) => void;
    onToggleSidebar: (callback: () => void) => void;
    onToggleTerminal: (callback: () => void) => void;
    onShowCommandPalette: (callback: () => void) => void;

    // File events
    onNewFile: (callback: () => void) => void;
    onSaveFile: (callback: () => void) => void;
    onFileOpened: (callback: (path: string) => void) => void;
    onFolderOpened: (callback: (path: string) => void) => void;

    // File system
    readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>;
    writeFile: (path: string, content: string) => Promise<{ success: boolean; error?: string }>;
    readDirectory: (path: string) => Promise<{ success: boolean; items: FileItem[]; error?: string }>;
    createFile: (path: string) => Promise<{ success: boolean; error?: string }>;
    createDirectory: (path: string) => Promise<{ success: boolean; error?: string }>;
    deletePath: (path: string) => Promise<{ success: boolean; error?: string }>;
    renamePath: (oldPath: string, newPath: string) => Promise<{ success: boolean; error?: string }>;

    // Settings
    getSettings: () => Promise<Settings>;
    saveSettings: (settings: Settings) => Promise<{ success: boolean }>;
    getApiKey: () => Promise<string>;

    // Chat
    getChatHistory: () => Promise<ChatMessage[]>;
    saveChatHistory: (history: ChatMessage[]) => Promise<{ success: boolean }>;
    clearChatHistory: () => Promise<{ success: boolean }>;
    getSavedChats: () => Promise<SavedChat[]>;
    saveChat: (chat: { name: string; messages: ChatMessage[] }) => Promise<{ success: boolean }>;

    // Templates
    getTemplates: () => Promise<Template[]>;
    saveTemplate: (template: Omit<Template, 'id'>) => Promise<{ success: boolean }>;
    deleteTemplate: (id: number) => Promise<{ success: boolean }>;

    // Extensions
    getInstalledExtensions: () => Promise<Extension[]>;
    installExtension: (extension: Extension) => Promise<{ success: boolean }>;
    uninstallExtension: (id: string) => Promise<{ success: boolean }>;

    // Git
    gitStatus: (repoPath: string) => Promise<GitStatus>;
    gitStage: (repoPath: string, files: string[]) => Promise<{ success: boolean }>;
    gitUnstage: (repoPath: string, files: string[]) => Promise<{ success: boolean }>;
    gitCommit: (repoPath: string, message: string) => Promise<{ success: boolean }>;
    gitBranches: (repoPath: string) => Promise<{ success: boolean; branches: string[]; current: string }>;
    gitCheckout: (repoPath: string, branch: string) => Promise<{ success: boolean }>;
    gitInit: (repoPath: string) => Promise<{ success: boolean }>;

    // Terminal
    terminalCreate: (options?: { cwd?: string; cols?: number; rows?: number }) => Promise<{ success: boolean; id: number }>;
    terminalInput: (id: number, data: string) => void;
    terminalResize: (id: number, cols: number, rows: number) => void;
    terminalKill: (id: number) => void;
    onTerminalData: (callback: (data: { id: number; data: string }) => void) => void;
    onTerminalExit: (callback: (data: { id: number; exitCode: number }) => void) => void;

    // Recent files
    getRecentFiles: () => Promise<string[]>;
    addRecentFile: (path: string) => Promise<{ success: boolean }>;

    // OAuth Login
    oauthLogin: () => Promise<{ success: boolean }>;
    exchangeAuthCode: (code: string) => Promise<{ success: boolean; user?: any; error?: string }>;
    onAuthCodeReceived: (callback: (code: string) => void) => void;

    // Cleanup
    removeAllListeners: (channel: string) => void;
}

export interface FileItem {
    name: string;
    path: string;
    isDirectory: boolean;
    size?: number;
    modified?: string;
}

export interface Settings {
    apiKey?: string;
    huggingFaceApiKey?: string;
    geminiApiKey?: string;
    aiProvider?: string;
    theme?: 'dark' | 'light' | 'system';
    fontSize?: number;
    fontFamily?: string;
    tabSize?: number;
    wordWrap?: boolean;
    minimap?: boolean;
    lineNumbers?: boolean;
    autoSave?: boolean;
    autoSaveDelay?: number;
}

export interface Action {
    id: string;
    type: 'research' | 'code' | 'test' | 'command';
    title: string;
    description: string;
    status: 'pending' | 'running' | 'success' | 'error';
    timestamp: string;
}

export interface FileChange {
    path: string;
    type: 'modify' | 'new' | 'delete';
    diff?: string;
}

export interface TableData {
    headers: string[];
    rows: any[][];
}

export interface ChatMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    thought?: string;
    task?: {
        name: string;
        summary: string;
        status: string;
        items: { id: string; text: string; status: 'pending' | 'in-progress' | 'completed' }[];
    };
    toolCalls?: {
        id: string;
        toolName: string;
        command: string;
        status: 'running' | 'success' | 'error';
        output?: string;
    }[];
    actions?: Action[];
    fileChanges?: FileChange[];
    table?: TableData;
}

export type Message = ChatMessage;

export interface AgentState {
    currentTask: ChatMessage['task'] | null;
    recentActions: Action[];
    fileChanges: FileChange[];
    isThinking: boolean;
}

export interface SavedChat {
    id: number;
    name: string;
    messages: ChatMessage[];
    savedAt: string;
}

export interface Template {
    id: number;
    name: string;
    content: string;
    tool: string;
    createdAt?: string;
}

export interface Extension {
    id: string;
    name: string;
    publisher: string;
    description: string;
    version: string;
    installed?: boolean;
    installedAt?: string;
}

export interface GitStatus {
    success: boolean;
    isRepo?: boolean;
    branch?: string;
    files?: GitFile[];
    ahead?: number;
    behind?: number;
    error?: string;
}

export interface GitFile {
    path: string;
    index: string;
    working_dir: string;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
