import { createContext, useContext, useState, ReactNode } from 'react';
import { AgentState, ChatMessage, Action, FileChange } from '../types';

interface AgentContextType extends AgentState {
    setCurrentTask: (task: ChatMessage['task'] | null) => void;
    addAction: (action: Action) => void;
    updateAction: (id: string, status: Action['status'], output?: string) => void;
    addFileChange: (change: FileChange) => void;
    clearFileChanges: () => void;
    setIsThinking: (isThinking: boolean) => void;
    resetAgent: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AgentState>({
        currentTask: null,
        recentActions: [],
        fileChanges: [],
        isThinking: false,
    });

    const setCurrentTask = (task: ChatMessage['task'] | null) => {
        setState(prev => ({ ...prev, currentTask: task }));
    };

    const addAction = (action: Action) => {
        setState(prev => ({
            ...prev,
            recentActions: [action, ...prev.recentActions].slice(0, 20)
        }));
    };

    const updateAction = (id: string, status: Action['status'], output?: string) => {
        setState(prev => ({
            ...prev,
            recentActions: prev.recentActions.map(a =>
                a.id === id ? { ...a, status } : a
            )
        }));
    };

    const addFileChange = (change: FileChange) => {
        setState(prev => ({
            ...prev,
            fileChanges: [...prev.fileChanges.filter(f => f.path !== change.path), change]
        }));
    };

    const clearFileChanges = () => {
        setState(prev => ({ ...prev, fileChanges: [] }));
    };

    const setIsThinking = (isThinking: boolean) => {
        setState(prev => ({ ...prev, isThinking }));
    };

    const resetAgent = () => {
        setState({
            currentTask: null,
            recentActions: [],
            fileChanges: [],
            isThinking: false,
        });
    };

    return (
        <AgentContext.Provider value={{
            ...state,
            setCurrentTask,
            addAction,
            updateAction,
            addFileChange,
            clearFileChanges,
            setIsThinking,
            resetAgent
        }}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgent() {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
}
