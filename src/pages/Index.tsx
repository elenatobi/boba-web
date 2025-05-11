
import { useState } from "react";
import Header from "@/components/Header";
import Notebook from "@/components/Notebook";
import { useToast } from "@/components/ui/use-toast";
import { saveNotebook, loadNotebook } from "@/utils/fileOperations";
import { NotebookData, CellData } from "@/types";
import { v4 as uuidv4 } from "uuid";

const defaultNotebook: NotebookData = {
  title: "Untitled Notebook",
  cells: [
    {
      id: uuidv4(),
      type: "text",
      content: "# Welcome to Web Notebook\n\nThis is a Jupyter-like notebook for the web. You can create different types of cells:\n\n- **Text**: Write in Markdown\n- **Code**: Execute JavaScript\n- **Chart**: Create visualizations with Chart.js\n\nTry it out by editing this cell or adding new cells below!",
      output: "",
      error: null
    }
  ]
};

const Index = () => {
  const [notebook, setNotebook] = useState<NotebookData>(defaultNotebook);
  const { toast } = useToast();

  const handleNewNotebook = () => {
    if (confirm("Create a new notebook? All unsaved changes will be lost.")) {
      setNotebook({
        ...defaultNotebook,
        title: "Untitled Notebook",
      });
    }
  };

  const handleTitleChange = (title: string) => {
    setNotebook(prev => ({
      ...prev,
      title
    }));
  };

  const handleSaveNotebook = () => {
    const success = saveNotebook(notebook);
    
    if (success) {
      toast({
        title: "Notebook saved",
        description: `${notebook.title} has been saved successfully.`,
      });
    } else {
      toast({
        title: "Save failed",
        description: "There was an error saving your notebook.",
        variant: "destructive",
      });
    }
  };

  const handleLoadNotebook = async () => {
    const loadedNotebook = await loadNotebook();
    
    if (loadedNotebook) {
      setNotebook(loadedNotebook);
      toast({
        title: "Notebook loaded",
        description: `${loadedNotebook.title} has been loaded successfully.`,
      });
    }
  };

  const handleCellsChange = (cells: CellData[]) => {
    // This is to prevent excessive re-renders and infinite loops
    // Only update if cells actually changed
    if (JSON.stringify(cells) !== JSON.stringify(notebook.cells)) {
      setNotebook(prev => ({
        ...prev,
        cells
      }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        title={notebook.title}
        onTitleChange={handleTitleChange}
        onNewNotebook={handleNewNotebook} 
        onSaveNotebook={handleSaveNotebook}
        onLoadNotebook={handleLoadNotebook}
      />
      <main className="flex-1 container py-8">
        <Notebook 
          initialCells={notebook.cells}
          onCellsChange={handleCellsChange}
        />
      </main>
      <footer className="py-4 border-t text-center text-sm text-gray-500">
        Web Notebook - A Jupyter-like notebook for the web
      </footer>
    </div>
  );
};

export default Index;
