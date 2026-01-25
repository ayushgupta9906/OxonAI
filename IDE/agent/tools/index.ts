const { toolRegistry } = require('./registry');
const {
    createFileTool,
    readFileTool,
    createFolderTool,
} = require('./file-tools');
const { runCommandTool } = require('./command-tool');
const { generateCodeTool } = require('./code-gen-tool');

// Register all tools
function registerAllTools() {
    // File operations
    toolRegistry.register(createFileTool);
    toolRegistry.register(readFileTool);
    toolRegistry.register(createFolderTool);

    // Command execution
    toolRegistry.register(runCommandTool);

    // Code generation
    toolRegistry.register(generateCodeTool);
}

// Auto-register on import
registerAllTools();

module.exports = { toolRegistry, registerAllTools };
