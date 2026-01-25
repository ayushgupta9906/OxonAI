const EventEmitter = require('events');
const fetch = require('node-fetch');
const { toolRegistry } = require('./tools');

const PLANNING_SYSTEM_PROMPT = `You are an expert software architect and project planner. Your job is to break down user requests into concrete, executable steps.

For each step, output a JSON object with:
- description: What this step does
- tool: Which tool to use (create_file, run_command, generate_code, create_folder)
- args: Arguments for the tool

Available tools:
- create_file: Create a new file (args: path, content)
- create_folder: Create a directory (args: path)
- generate_code: Generate code with AI (args: prompt, language, model, apiKey)
- run_command: Execute shell command (args: command, cwd)

Output ONLY a JSON array of steps, no explanations.`;

class AgentOrchestrator extends EventEmitter {
    constructor(config = {}) {
        super();
        this.model = config.model || 'openai/gpt-oss-120b:free';
        this.apiKey = config.apiKey;
    }

    async executeTask(prompt, projectPath) {
        const task = {
            id: this.generateTaskId(),
            prompt,
            projectPath,
            status: 'planning',
            steps: [],
            executedTools: [],
            errors: [],
            metadata: { startTime: Date.now() },
        };

        try {
            // Phase 1: Planning
            this.emit('event', {
                type: 'thought',
                data: { content: 'Analyzing your request and creating a plan...' },
                timestamp: Date.now(),
            });

            task.steps = await this.planSteps(prompt, projectPath);
            this.emit('event', {
                type: 'progress',
                data: { current: 0, total: task.steps.length, status: 'Planning complete' },
                timestamp: Date.now(),
            });

            // Phase 2: Execution
            task.status = 'executing';
            await this.executeSteps(task);

            // Phase 3: Completion
            task.status = 'complete';
            task.metadata.endTime = Date.now();
            this.emit('event', {
                type: 'complete',
                data: {
                    taskId: task.id,
                    projectPath: task.projectPath,
                    filesCreated: task.executedTools.filter(t => t.tool === 'create_file').length,
                },
                timestamp: Date.now(),
            });

            return task;
        } catch (error) {
            task.status = 'failed';
            const errorMessage = error.message || 'Unknown error';
            task.errors.push(errorMessage);
            this.emit('event', {
                type: 'error',
                data: { message: errorMessage },
                timestamp: Date.now(),
            });
            return task;
        }
    }

    async planSteps(prompt, projectPath) {
        const planningPrompt = `User request: "${prompt}"
Project will be created at: ${projectPath}

Create a detailed step-by-step plan to build this project. Include:
1. Create project folder structure
2. Generate necessary configuration files
3. Create main application files
4. Add styling if needed
5. Generate documentation`;

        const response = await this.callAI(PLANNING_SYSTEM_PROMPT, planningPrompt);

        try {
            const stepsJson = this.extractJSON(response);
            const steps = stepsJson.map(step => ({
                description: step.description,
                tool: step.tool,
                args: step.args,
                status: 'pending',
            }));

            this.emit('event', {
                type: 'thought',
                data: { content: `Created plan with ${steps.length} steps` },
                timestamp: Date.now(),
            });

            return steps;
        } catch (error) {
            throw new Error('Failed to parse planning response');
        }
    }

    async executeSteps(task) {
        for (let i = 0; i < task.steps.length; i++) {
            const step = task.steps[i];
            step.status = 'running';

            this.emit('event', {
                type: 'progress',
                data: { current: i + 1, total: task.steps.length, status: step.description },
                timestamp: Date.now(),
            });

            this.emit('event', {
                type: 'tool_call',
                data: { tool: step.tool, args: step.args },
                timestamp: Date.now(),
            });

            // Resolve paths and add API key for code generation
            const resolvedArgs = this.resolveArgs(step.args, task.projectPath);

            // Execute tool
            const result = await toolRegistry.execute(step.tool, resolvedArgs);

            const toolCall = {
                tool: step.tool,
                args: resolvedArgs,
                result,
                timestamp: Date.now(),
            };

            task.executedTools.push(toolCall);
            this.emit('event', {
                type: 'tool_result',
                data: { tool: step.tool, result },
                timestamp: Date.now(),
            });

            if (!result.success) {
                step.status = 'failed';
                task.errors.push(`Step ${i + 1} failed: ${result.error}`);

                // Try once more
                this.emit('event', {
                    type: 'thought',
                    data: { content: 'Retrying...' },
                    timestamp: Date.now(),
                });

                const retryResult = await toolRegistry.execute(step.tool, resolvedArgs);
                if (!retryResult.success) {
                    throw new Error(`Step failed: ${result.error}`);
                }
            }

            step.status = 'complete';
        }
    }

    async callAI(systemPrompt, userPrompt) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 3000,
            }),
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    resolveArgs(args, projectPath) {
        const resolved = { ...args };

        // Add API key for code generation
        if (!resolved.apiKey && this.apiKey) {
            resolved.apiKey = this.apiKey;
        }

        // Add model if not specified
        if (!resolved.model && this.model) {
            resolved.model = this.model;
        }

        // Resolve relative paths
        if (resolved.path && !resolved.path.startsWith('/')) {
            resolved.path = `${projectPath}/${resolved.path}`;
        }

        // Set cwd for commands
        if (resolved.command && !resolved.cwd) {
            resolved.cwd = projectPath;
        }

        return resolved;
    }

    extractJSON(text) {
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
            return JSON.parse(match[0]);
        }
        throw new Error('No JSON array found in response');
    }

    generateTaskId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

module.exports = { AgentOrchestrator };
