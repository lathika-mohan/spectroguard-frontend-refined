import type { LivePredictionSession } from '../types';

/**
 * liveAnalysisStore
 * -----------------
 * Tiny in-memory pub/sub store that carries the most recent LIVE analysis
 * session (result + real tamper screenshot) from the analysis GUI to the
 * Predict page, surviving react-router navigation without URL-encoding blobs.
 */
type Listener = (session: LivePredictionSession | null) => void;

let current: LivePredictionSession | null = null;
const listeners = new Set<Listener>();

export const liveAnalysisStore = {
  get(): LivePredictionSession | null {
    return current;
  },

  set(session: LivePredictionSession | null): void {
    current = session;
    listeners.forEach((listener) => listener(session));
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  clear(): void {
    this.set(null);
  },
};
