import { useState, useEffect } from 'react';

type DemoType = 'caught' | 'recoverable' | 'uncaught' | null;

type ErrorSimulatorProps = {
  demo: DemoType;
  triggerId: number;
};

export function ErrorSimulator({ demo, triggerId }: ErrorSimulatorProps) {
  if (demo === 'caught') {
    throw new Error(
      `Caught error triggered — Error Boundary will handle this. (id: ${triggerId})`
    );
  }

  if (demo === 'uncaught') {
    throw new Error(
      `Uncaught error triggered — no boundary here, bubbles to root. (id: ${triggerId})`
    );
  }

  if (demo === 'recoverable') {
    return <RecoverableErrorThrower key={triggerId} triggerId={triggerId} />;
  }

  return (
    <div className="flex items-center gap-3 text-sm text-white/70">
      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
      <span>Component is rendering normally. Click a card above to trigger an error.</span>
    </div>
  );
}

/**
 * Throws on first render, then recovers on the next attempt.
 * This triggers onRecoverableError: React detects the render error,
 * remounts the tree, and the second render succeeds.
 */
function RecoverableErrorThrower({ triggerId }: { triggerId: number }) {
  const [shouldThrow, setShouldThrow] = useState(true);

  useEffect(() => {
    if (shouldThrow) {
      const timer = setTimeout(() => setShouldThrow(false), 0);
      return () => clearTimeout(timer);
    }
  }, [shouldThrow]);

  if (shouldThrow) {
    throw new Error(
      `Recoverable error triggered — React will remount and retry. (id: ${triggerId})`
    );
  }

  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 text-amber-400">↻</span>
      <div>
        <p className="font-semibold text-amber-300">Component recovered after error</p>
        <p className="mt-1 text-white/50">
          The <code className="text-amber-300">onRecoverableError</code> handler was called,
          then React remounted and the render succeeded.
        </p>
      </div>
    </div>
  );
}
