const fs = require('fs').promises;
const path = require('path');

const createFileTool = {
    name: 'create_file',
    description: 'Create a new file with specified content',
    parameters: {
        path: {
            type: 'string',
            description: 'Relative path where the file should be created',
            required: true,
        },
        content: {
            type: 'string',
            description: 'Content to write to the file',
            required: true,
        },
    },
    execute: async (args) => {
        try {
            const { path: filePath, content } = args;

            // Ensure directory exists
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });

            // Write file
            await fs.writeFile(filePath, content, 'utf-8');

            return {
                success: true,
                data: { path: filePath, size: content.length },
                metadata: { operation: 'create_file' },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create file',
            };
        }
    },
};

const readFileTool = {
    name: 'read_file',
    description: 'Read the contents of a file',
    parameters: {
        path: {
            type: 'string',
            description: 'Path to the file to read',
            required: true,
        },
    },
    execute: async (args) => {
        try {
            const { path: filePath } = args;
            const content = await fs.readFile(filePath, 'utf-8');

            return {
                success: true,
                data: { path: filePath, content },
                metadata: { operation: 'read_file', size: content.length },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to read file',
            };
        }
    },
};

const createFolderTool = {
    name: 'create_folder',
    description: 'Create a new folder/directory',
    parameters: {
        path: {
            type: 'string',
            description: 'Path where the folder should be created',
            required: true,
        },
    },
    execute: async (args) => {
        try {
            const { path: folderPath } = args;
            await fs.mkdir(folderPath, { recursive: true });

            return {
                success: true,
                data: { path: folderPath },
                metadata: { operation: 'create_folder' },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create folder',
            };
        }
    },
};

module.exports = {
    createFileTool,
    readFileTool,
    createFolderTool,
};
