
import { NotebookData } from "@/types";

// Function to save notebook to file
export const saveNotebook = (notebook: NotebookData) => {
  try {
    // Convert notebook data to JSON string
    const notebookJson = JSON.stringify(notebook);
    
    // Create a blob with the JSON data
    const blob = new Blob([notebookJson], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${notebook.title || 'untitled-notebook'}.json`;
    
    // Simulate a click on the anchor
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error saving notebook:", error);
    return false;
  }
};

// Function to load notebook from file
export const loadNotebook = (): Promise<NotebookData | null> => {
  return new Promise((resolve) => {
    try {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      
      // Handle file selection
      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        
        // Read the file as text
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const notebookData = JSON.parse(content) as NotebookData;
            resolve(notebookData);
          } catch (parseError) {
            console.error("Error parsing notebook file:", parseError);
            resolve(null);
          }
        };
        
        reader.onerror = () => {
          console.error("Error reading file");
          resolve(null);
        };
        
        reader.readAsText(file);
      };
      
      // Trigger file selection dialog
      fileInput.click();
    } catch (error) {
      console.error("Error loading notebook:", error);
      resolve(null);
    }
  });
};
