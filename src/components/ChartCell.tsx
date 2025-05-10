
import { useState, useEffect, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Play, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import Chart from 'chart.js/auto';

interface ChartCellProps {
  content: string;
  onChange: (content: string) => void;
  onExecute: () => void;
  error: string | null;
}

const ChartCell = ({ content, onChange, onExecute, error }: ChartCellProps) => {
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Clean up chart instance when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const renderChart = () => {
    if (!chartRef.current) return;

    try {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Try to parse the chart config
      const chartConfig = JSON.parse(content);
      
      chartInstance.current = new Chart(
        chartRef.current,
        chartConfig
      );
    } catch (err) {
      console.error("Failed to render chart:", err);
    }
  };

  useEffect(() => {
    // When error is cleared, try to render the chart
    if (!error) {
      renderChart();
    }
  }, [error]);

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-slate-800 text-white p-2 text-xs font-mono flex justify-between items-center">
        <span>Chart</span>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => {
            onExecute();
            if (!error) renderChart();
          }} 
          className="h-7 gap-1"
        >
          <Play className="h-3 w-3" /> Render Chart
        </Button>
      </div>

      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex justify-between items-center py-1"
          onClick={() => setIsEditingConfig(!isEditingConfig)}
        >
          <span>Chart Configuration</span>
          {isEditingConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {isEditingConfig && (
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="h-[200px] font-mono text-sm mt-2"
            placeholder="Enter chart configuration in JSON format..."
          />
        )}

        {error ? (
          <div className="p-3 font-mono text-sm bg-red-50 text-red-800 mt-2 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 flex justify-center">
            <canvas ref={chartRef} className="w-full max-h-[400px]"></canvas>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCell;
