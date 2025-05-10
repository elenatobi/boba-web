
import { useState } from "react";
import { CellType } from "@/types";
import TextCell from "./TextCell";
import CodeCell from "./CodeCell";
import ChartCell from "./ChartCell";
import CellMenu from "./CellMenu";

interface CellProps {
  id: string;
  type: CellType;
  content: string;
  index: number;
  totalCells: number;
  onContentChange: (id: string, content: string) => void;
  onAddCell: (type: CellType, atIndex: number) => void;
  onMoveCell: (id: string, direction: "up" | "down") => void;
  onDeleteCell: (id: string) => void;
  executeCell: (id: string) => void;
  output: string;
  error: string | null;
}

const Cell = ({
  id,
  type,
  content,
  index,
  totalCells,
  onContentChange,
  onAddCell,
  onMoveCell,
  onDeleteCell,
  executeCell,
  output,
  error,
}: CellProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group py-2 border-b last:border-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <CellMenu 
          onAddCell={(type) => onAddCell(type, index + 1)}
          onMoveUp={() => onMoveCell(id, "up")}
          onMoveDown={() => onMoveCell(id, "down")}
          onDelete={() => onDeleteCell(id)}
          isFirst={index === 0}
          isLast={index === totalCells - 1}
        />
      )}

      <div className="px-10">
        {type === "text" && (
          <TextCell 
            content={content} 
            onChange={(newContent) => onContentChange(id, newContent)} 
          />
        )}
        {type === "code" && (
          <CodeCell 
            content={content}
            onChange={(newContent) => onContentChange(id, newContent)}
            output={output}
            onExecute={() => executeCell(id)}
            error={error}
          />
        )}
        {type === "chart" && (
          <ChartCell 
            content={content}
            onChange={(newContent) => onContentChange(id, newContent)}
            onExecute={() => executeCell(id)}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default Cell;
