import { useSyncExternalStore, useState } from 'react';
import { subscribe, clearLogs, type ErrorLog } from '../main';

const typeConfig = {
  caught: {
    label: 'onCaughtError',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: 'bg-emerald-400',
    bar: 'bg-emerald-500',
  },
  recoverable: {
    label: 'onRecoverableError',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: 'bg-amber-400',
    bar: 'bg-amber-500',
  },
  uncaught: {
    label: 'onUncaughtError',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: 'bg-rose-400',
    bar: 'bg-rose-500',
  },
} as const;

function getSnapshot(): ErrorLog[] {
  return currentLogs;
}

let currentLogs: ErrorLog[] = [];

function subscribeWrapper(callback: () => void) {
  return subscribe((logs) => {
    currentLogs = logs;
    callback();
  });
}

export function ErrorLogger() {
  const logs = useSyncExternalStore(subscribeWrapper, getSnapshot, getSnapshot);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Error Log
          </h2>
          {logs.length > 0 && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60">
              {logs.length}
            </span>
          )}
        </div>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <span className="text-2xl">⌐</span>
          </div>
          <p className="text-sm text-white/40">No errors yet. Trigger an error to see it logged here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const cfg = typeConfig[log.type];
            const isExpanded = expanded === log.id;
            return (
              <div
                key={log.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-black/40"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : log.id)}
                  className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/[0.02]"
                >
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.icon}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-mono font-medium ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-white/30">
                        #{log.id} · {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm text-white/70">{log.message}</p>
                  </div>
                  <span className={`mt-1 shrink-0 text-xs text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▸
                  </span>
                </button>
                {isExpanded && log.componentStack && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                      Component Stack
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-black/60 p-3 text-xs leading-relaxed text-white/50">
                      {log.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
