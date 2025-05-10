
import { FileText, Code, BarChart, Plus, ArrowUp, ArrowDown, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { CellType } from "@/types";

interface CellMenuProps {
  onAddCell: (type: CellType) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const CellMenu = ({ 
  onAddCell, 
  onMoveUp, 
  onMoveDown, 
  onDelete,
  isFirst,
  isLast
}: CellMenuProps) => {
  return (
    <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 px-2">
      <div className="flex flex-col items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 opacity-60 hover:opacity-100"
                onClick={() => onAddCell("text")}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add Text Cell</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 opacity-60 hover:opacity-100"
                onClick={() => onAddCell("code")}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add Code Cell</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 opacity-60 hover:opacity-100"
                onClick={() => onAddCell("chart")}
              >
                <BarChart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add Chart Cell</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-px w-5 bg-gray-200 my-1"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 opacity-60 hover:opacity-100 disabled:opacity-30"
                onClick={onMoveUp}
                disabled={isFirst}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Move Up</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 opacity-60 hover:opacity-100 disabled:opacity-30"
                onClick={onMoveDown}
                disabled={isLast}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Move Down</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 text-destructive opacity-60 hover:opacity-100"
                onClick={onDelete}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Delete Cell</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CellMenu;
