
export type CellType = "text" | "code" | "chart";

export interface CellData {
  id: string;
  type: CellType;
  content: string;
  output: string;
  error: string | null;
}
