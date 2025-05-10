
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Play, AlertCircle } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface CodeCellProps {
  content: string;
  onChange: (content: string) => void;
  output: string;
  onExecute: () => void;
  error: string | null;
}

const CodeCell = ({ content, onChange, output, onExecute, error }: CodeCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleEditorChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-slate-800 text-white p-2 text-xs font-mono flex justify-between items-center">
        <span>JavaScript</span>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={onExecute} 
          className="h-7 gap-1"
        >
          <Play className="h-3 w-3" /> Run
        </Button>
      </div>
      <div className="max-h-[400px] overflow-auto">
        <CodeMirror
          value={content}
          height="auto"
          extensions={[javascript({ jsx: true })]}
          onChange={handleEditorChange}
          theme={vscodeDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            bracketMatching: true,
          }}
        />
      </div>
      
      {(output || error) && (
        <div className="border-t">
          <div className="bg-gray-100 text-xs p-1 pl-2 font-mono">Output</div>
          <div className={`p-3 font-mono text-sm ${error ? 'bg-red-50 text-red-800' : 'bg-white'}`}>
            {error ? (
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <pre className="whitespace-pre-wrap">{error}</pre>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap overflow-auto max-h-[200px]">{output}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeCell;
