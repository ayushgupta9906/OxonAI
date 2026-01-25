const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const runCommandTool = {
    name: 'run_command',
    description: 'Execute a shell command',
    parameters: {
        command: {
            type: 'string',
            description: 'The command to execute',
            required: true,
        },
        cwd: {
            type: 'string',
            description: 'Working directory for the command',
            required: false,
        },
    },
    execute: async (args) => {
        try {
            const { command, cwd } = args;

            const { stdout, stderr } = await execAsync(command, {
                cwd: cwd || process.cwd(),
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer
            });

            return {
                success: true,
                data: {
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    command,
                },
                metadata: { operation: 'run_command', cwd },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Command execution failed',
                data: {
                    stdout: error.stdout?.trim() || '',
                    stderr: error.stderr?.trim() || '',
                    exitCode: error.code,
                },
            };
        }
    },
};

module.exports = { runCommandTool };
