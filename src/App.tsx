import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorSimulator } from './components/ErrorSimulator';
import { ErrorLogger } from './components/ErrorLogger';

type DemoType = 'caught' | 'recoverable' | 'uncaught' | null;

type AppState = {
  demo: DemoType;
  triggerId: number;
};

type AppProps = {
  crashed: boolean;
  onReset: () => void;
};

function App({ crashed, onReset }: AppProps) {
  const [state, setState] = useState<AppState>({ demo: null, triggerId: 0 });

  const trigger = (demo: 'caught' | 'recoverable' | 'uncaught') => {
    setState({ demo, triggerId: state.triggerId + 1 });
  };

  const reset = () => {
    setState({ demo: null, triggerId: state.triggerId + 1 });
  };

  const showReset = state.demo !== null || state.triggerId > 0;

  if (crashed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <header className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
              React 19.3 · createRoot Error Handlers
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-400 bg-clip-text text-transparent">
                App Crashed
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/60">
              An uncaught error escaped all error boundaries. React unmounted the tree.
              The <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-rose-300">onUncaughtError</code> handler was called.
            </p>
          </header>

          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
            <p className="text-sm text-white/70">
              In a real app, this is where your production error reporting (Sentry, etc.) would fire.
              Without an Error Boundary at the root, the entire UI is gone.
            </p>
          </div>

          <button
            onClick={onReset}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Reset App
          </button>

          <div className="mt-8">
            <ErrorLogger />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            React 19.3 · createRoot Error Handlers
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Error Handling
            </span>{' '}
            in React
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            An interactive demo of the three error handlers you can pass to{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-emerald-300">
              createRoot()
            </code>
            . Trigger each error type below and watch the log panel respond in real time.
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <DemoCard
            title="onCaughtError"
            description="Fires when an error is caught by an Error Boundary. The boundary renders its fallback UI."
            accent="emerald"
            onTrigger={() => trigger('caught')}
            active={state.demo === 'caught'}
          />
          <DemoCard
            title="onRecoverableError"
            description="Fires when an error is thrown during render but React recovers by remounting the tree. The error is not fatal."
            accent="amber"
            onTrigger={() => trigger('recoverable')}
            active={state.demo === 'recoverable'}
          />
          <DemoCard
            title="onUncaughtError"
            description="Fires when an error escapes all error boundaries. React shows the closest boundary fallback or crashes."
            accent="rose"
            onTrigger={() => trigger('uncaught')}
            active={state.demo === 'uncaught'}
          />
        </section>

        {showReset && (
          <div className="mb-6">
            <button
              onClick={reset}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Reset Demo
            </button>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
            Rendered Output
          </h2>
          <div className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 p-4">
            {state.demo === 'caught' ? (
              <ErrorBoundary key={`boundary-${state.triggerId}`}>
                <ErrorSimulator demo={state.demo} triggerId={state.triggerId} />
              </ErrorBoundary>
            ) : (
              <ErrorSimulator demo={state.demo} triggerId={state.triggerId} />
            )}
          </div>
        </section>

        <ErrorLogger />

        {/* Code Reference */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
            How It Works
          </h2>
          <pre className="overflow-x-auto rounded-xl bg-black/60 p-5 text-sm leading-relaxed text-white/70">
{`const root = createRoot(container, {
  // Error caught by an Error Boundary (class component
  // with getDerivedStateFromError / componentDidCatch)
  onCaughtError(error, errorInfo) {
    console.error('Caught:', error, errorInfo.componentStack);
  },

  // Error during render that React recovers from by
  // remounting the tree — not fatal
  onRecoverableError(error, errorInfo) {
    console.error('Recoverable:', error, errorInfo.componentStack);
  },

  // Error that escapes ALL error boundaries — no fallback
  // available, tree cannot render
  onUncaughtError(error, errorInfo) {
    console.error('Uncaught:', error, errorInfo.componentStack);
  },
});

root.render(<App />);`}
          </pre>
          <div className="mt-4 grid gap-3 text-sm text-white/50 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <code className="text-emerald-300">onCaughtError</code>
              <p className="mt-1 text-xs">Error Boundary present → fallback UI shown</p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <code className="text-amber-300">onRecoverableError</code>
              <p className="mt-1 text-xs">React retries render → tree recovers</p>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
              <code className="text-rose-300">onUncaughtError</code>
              <p className="mt-1 text-xs">No boundary → error bubbles to root</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const accentMap = {
  emerald: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    hoverBg: 'hover:bg-emerald-500/20',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/50',
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    hoverBg: 'hover:bg-amber-500/20',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    ring: 'ring-amber-500/50',
  },
  rose: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    hoverBg: 'hover:bg-rose-500/20',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
    ring: 'ring-rose-500/50',
  },
} as const;

type AccentKey = keyof typeof accentMap;

function DemoCard({
  title,
  description,
  accent,
  onTrigger,
  active,
}: {
  title: string;
  description: string;
  accent: AccentKey;
  onTrigger: () => void;
  active: boolean;
}) {
  const a = accentMap[accent];
  return (
    <button
      onClick={onTrigger}
      className={`group relative overflow-hidden rounded-2xl border ${a.border} ${a.bg} p-5 text-left transition-all duration-200 hover:scale-[1.02] ${a.hoverBg} ${
        active ? `ring-2 ${a.ring}` : ''
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${a.dot}`} />
        <code className={`text-sm font-semibold ${a.text}`}>{title}</code>
      </div>
      <p className="text-sm leading-relaxed text-white/60">{description}</p>
      <div className={`mt-4 text-xs font-medium ${a.text} opacity-0 transition-opacity group-hover:opacity-100`}>
        Click to trigger →
      </div>
    </button>
  );
}

export default App;
