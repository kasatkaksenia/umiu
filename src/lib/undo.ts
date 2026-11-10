// Page-level "… removed · Undo" bar for 5 seconds after a delete (no confirm dialog).
import { commit, render } from "./store";

export const TOAST_MS = 5000;
export let TOAST: { m: string; undo: () => void; at: number } | null = null;

export function offerUndo(m: string, undo: () => void) {
  const at = Date.now();
  TOAST = { m, undo, at };
  render();
  setTimeout(() => {
    if (TOAST && TOAST.at == at) {
      TOAST = null;
      render();
    }
  }, TOAST_MS);
}

export function doUndo() {
  if (!TOAST) return;
  TOAST.undo();
  TOAST = null;
  commit();
}
