
import { useState, useEffect, useCallback } from "react";
import { NotebookData, UndoRedoState } from "@/types";

const MAX_HISTORY_LENGTH = 50;

const useUndoRedo = (initialState: NotebookData) => {
  const [state, setState] = useState<UndoRedoState>({
    past: [],
    present: initialState,
    future: [],
  });

  // Create a new present state without mutating the previous state
  const updatePresent = useCallback((newPresent: NotebookData) => {
    setState((currentState) => ({
      past: [...currentState.past, currentState.present].slice(-MAX_HISTORY_LENGTH),
      present: newPresent,
      future: [],
    }));
  }, []);

  // Undo action - move backward in history
  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) return currentState;

      const previous = currentState.past[currentState.past.length - 1];
      return {
        past: currentState.past.slice(0, -1),
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  // Redo action - move forward in history
  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) return currentState;

      const next = currentState.future[0];
      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: currentState.future.slice(1),
      };
    });
  }, []);

  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Command+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Y or Command+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state: state.present,
    updateState: updatePresent,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
};

export default useUndoRedo;
