
import { useState } from "react";
import Header from "@/components/Header";
import Notebook from "@/components/Notebook";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [notebookTitle, setNotebookTitle] = useState("Untitled Notebook");
  const { toast } = useToast();

  const handleNewNotebook = () => {
    // Check if user wants to create a new notebook and potentially discard changes
    if (confirm("Create a new notebook? All unsaved changes will be lost.")) {
      window.location.reload();
    }
  };

  const handleSaveNotebook = () => {
    // In a real app, we would save the notebook to a backend or local storage
    // For now, just show a toast notification
    toast({
      title: "Notebook saved",
      description: "Your notebook has been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        title={notebookTitle} 
        onNewNotebook={handleNewNotebook} 
        onSaveNotebook={handleSaveNotebook} 
      />
      <main className="flex-1 container py-8">
        <Notebook />
      </main>
      <footer className="py-4 border-t text-center text-sm text-gray-500">
        Web Notebook - A Jupyter-like notebook for the web
      </footer>
    </div>
  );
};

export default Index;
