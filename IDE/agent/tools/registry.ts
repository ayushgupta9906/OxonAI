const fs = require('fs').promises;
const path = require('path');

class ToolRegistry {
    constructor() {
        this.tools = new Map();
    }

    register(tool) {
        if (this.tools.has(tool.name)) {
            throw new Error(`Tool ${tool.name} is already registered`);
        }
        this.tools.set(tool.name, tool);
    }

    get(name) {
        return this.tools.get(name);
    }

    listTools() {
        return Array.from(this.tools.values());
    }

    async execute(name, args) {
        const tool = this.tools.get(name);
        if (!tool) {
            return {
                success: false,
                error: `Tool ${name} not found`,
            };
        }

        // Validate parameters
        const validation = this.validateParameters(tool, args);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
            };
        }

        try {
            return await tool.execute(args);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Unknown error',
            };
        }
    }

    validateParameters(tool, args) {
        for (const [paramName, param] of Object.entries(tool.parameters)) {
            if (param.required && !(paramName in args)) {
                return {
                    valid: false,
                    error: `Missing required parameter: ${paramName}`,
                };
            }

            if (paramName in args && typeof args[paramName] !== param.type) {
                return {
                    valid: false,
                    error: `Invalid type for ${paramName}: expected ${param.type}, got ${typeof args[paramName]}`,
                };
            }
        }
        return { valid: true };
    }
}

const toolRegistry = new ToolRegistry();
module.exports = { toolRegistry, ToolRegistry };
