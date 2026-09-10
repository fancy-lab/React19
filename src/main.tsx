import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { ErrorInfo } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

export type ErrorLog = {
  id: number;
  type: 'caught' | 'recoverable' | 'uncaught';
  message: string;
  componentStack?: string;
  error?: unknown;
  timestamp: number;
};

let nextId = 1;
const errorLogs: ErrorLog[] = [];
const listeners = new Set<(logs: ErrorLog[]) => void>();

function notify() {
  const snapshot = [...errorLogs];
  listeners.forEach((fn) => fn(snapshot));
}

export function subscribe(fn: (logs: ErrorLog[]) => void) {
  listeners.add(fn);
  fn([...errorLogs]);
  return () => {
    listeners.delete(fn);
  };
}

export function clearLogs() {
  errorLogs.length = 0;
  notify();
}

function extractMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

const container = document.getElementById('root')!;

let crashed = false;

function renderApp() {
  root.render(
    <StrictMode>
      <App crashed={crashed} onReset={handleReset} />
    </StrictMode>
  );
}

function handleReset() {
  crashed = false;
  renderApp();
}

const root = createRoot(container, {
  onCaughtError(error: unknown, errorInfo: { componentStack?: string }) {
    errorLogs.push({
      id: nextId++,
      type: 'caught',
      message: extractMessage(error),
      componentStack: errorInfo.componentStack,
      error,
      timestamp: Date.now(),
    });
    notify();
  },
  onRecoverableError(error: unknown, errorInfo: ErrorInfo) {
    errorLogs.push({
      id: nextId++,
      type: 'recoverable',
      message: extractMessage(error),
      componentStack: errorInfo?.componentStack,
      error,
      timestamp: Date.now(),
    });
    notify();
  },
  onUncaughtError(error: unknown, errorInfo: { componentStack?: string }) {
    errorLogs.push({
      id: nextId++,
      type: 'uncaught',
      message: extractMessage(error),
      componentStack: errorInfo?.componentStack,
      error,
      timestamp: Date.now(),
    });
    notify();
    // After an uncaught error, React unmounts the entire tree.
    // Re-render with crashed=true so the user sees a crash screen
    // and can reset the demo.
    crashed = true;
    renderApp();
  },
});

renderApp();
