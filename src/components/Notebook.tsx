
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CellType, CellData } from "@/types";
import Cell from "./Cell";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface NotebookProps {
  initialCells?: CellData[];
}

const defaultCells: CellData[] = [
  {
    id: uuidv4(),
    type: "text",
    content: "# Welcome to Web Notebook\n\nThis is a Jupyter-like notebook for the web. You can create different types of cells:\n\n- **Text**: Write in Markdown\n- **Code**: Execute JavaScript\n- **Chart**: Create visualizations with Chart.js\n\nTry it out by editing this cell or adding new cells below!",
    output: "",
    error: null
  }
];

const defaultChartTemplate = JSON.stringify({
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  }
}, null, 2);

const Notebook = ({ initialCells = defaultCells }: NotebookProps) => {
  const [cells, setCells] = useState<CellData[]>(initialCells);
  const { toast } = useToast();

  const handleContentChange = (id: string, content: string) => {
    setCells(cells.map(cell => 
      cell.id === id ? { ...cell, content } : cell
    ));
  };

  const handleAddCell = (type: CellType, atIndex: number) => {
    const newCell: CellData = {
      id: uuidv4(),
      type,
      content: type === "chart" ? defaultChartTemplate : "",
      output: "",
      error: null
    };
    
    const newCells = [...cells];
    newCells.splice(atIndex, 0, newCell);
    setCells(newCells);
  };

  const handleMoveCell = (id: string, direction: "up" | "down") => {
    const index = cells.findIndex(cell => cell.id === id);
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      const newCells = [...cells];
      [newCells[index], newCells[index - 1]] = [newCells[index - 1], newCells[index]];
      setCells(newCells);
    } else if (direction === "down" && index < cells.length - 1) {
      const newCells = [...cells];
      [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
      setCells(newCells);
    }
  };

  const handleDeleteCell = (id: string) => {
    if (cells.length <= 1) {
      toast({
        title: "Cannot delete cell",
        description: "Notebook must have at least one cell",
        variant: "destructive"
      });
      return;
    }
    setCells(cells.filter(cell => cell.id !== id));
  };

  const executeCell = (id: string) => {
    const cell = cells.find(c => c.id === id);
    if (!cell) return;

    if (cell.type === "code") {
      try {
        // Create a function from the code to isolate the scope
        const func = new Function(`
          try {
            const console = {
              log: function(...args) {
                if (typeof window.__notebookConsoleLog__ === 'function') {
                  window.__notebookConsoleLog__(...args);
                }
              },
              error: function(...args) {
                if (typeof window.__notebookConsoleError__ === 'function') {
                  window.__notebookConsoleError__(...args);
                }
              }
            };
            ${cell.content}
          } catch(e) {
            throw e;
          }
        `);

        let output = "";
        
        // Store original console methods
        const originalLog = console.log;
        const originalError = console.error;
        
        // Override console methods to capture output
        window.__notebookConsoleLog__ = function(...args: any[]) {
          output += args.map(arg => 
            typeof arg === "object" 
              ? JSON.stringify(arg, null, 2) 
              : String(arg)
          ).join(" ") + "\n";
        };
        window.__notebookConsoleError__ = function(...args: any[]) {
          output += args.map(arg => 
            typeof arg === "object" 
              ? JSON.stringify(arg, null, 2) 
              : String(arg)
          ).join(" ") + "\n";
        };
        
        // Execute the code
        func();
        
        // Restore original console methods
        delete window.__notebookConsoleLog__;
        delete window.__notebookConsoleError__;

        setCells(cells.map(c => 
          c.id === id ? { ...c, output, error: null } : c
        ));
      } catch (err) {
        setCells(cells.map(c => 
          c.id === id ? { ...c, error: err instanceof Error ? err.message : String(err) } : c
        ));
      }
    } else if (cell.type === "chart") {
      try {
        // Validate JSON
        JSON.parse(cell.content);
        setCells(cells.map(c => 
          c.id === id ? { ...c, error: null } : c
        ));
      } catch (err) {
        setCells(cells.map(c => 
          c.id === id ? { ...c, error: "Invalid JSON: " + (err instanceof Error ? err.message : String(err)) } : c
        ));
      }
    }
  };

  return (
    <div className="min-h-full bg-white rounded-md shadow">
      <div className="divide-y">
        {cells.map((cell, index) => (
          <Cell
            key={cell.id}
            id={cell.id}
            type={cell.type}
            content={cell.content}
            index={index}
            totalCells={cells.length}
            onContentChange={handleContentChange}
            onAddCell={handleAddCell}
            onMoveCell={handleMoveCell}
            onDeleteCell={handleDeleteCell}
            executeCell={executeCell}
            output={cell.output}
            error={cell.error}
          />
        ))}
      </div>
      
      <div className="p-4 flex justify-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddCell("text", cells.length)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddCell("code", cells.length)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddCell("chart", cells.length)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Chart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notebook;
