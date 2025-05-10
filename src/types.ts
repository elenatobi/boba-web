
export type CellType = "text" | "code" | "chart";

export interface CellData {
  id: string;
  type: CellType;
  content: string;
  output: string;
  error: string | null;
}

export interface NotebookData {
  title: string;
  cells: CellData[];
}

export interface UndoRedoState {
  past: NotebookData[];
  present: NotebookData;
  future: NotebookData[];
}
