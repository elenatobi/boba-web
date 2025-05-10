
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { PlusCircle, Save, Upload } from "lucide-react";
import { Input } from "./ui/input";

interface HeaderProps {
  title: string;
  onTitleChange?: (title: string) => void;
  onNewNotebook: () => void;
  onSaveNotebook: () => void;
  onLoadNotebook: () => void;
}

const Header = ({ 
  title, 
  onTitleChange, 
  onNewNotebook, 
  onSaveNotebook,
  onLoadNotebook 
}: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditableTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (onTitleChange && editableTitle.trim()) {
      onTitleChange(editableTitle);
    } else {
      setEditableTitle(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={handleTitleClick}
          >
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editableTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                className="font-bold text-xl px-2 py-1 h-auto min-w-[200px]"
                autoFocus
              />
            ) : (
              title
            )}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onNewNotebook}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New
          </Button>
          <Button 
            variant="outline" 
            onClick={onLoadNotebook}
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            Load
          </Button>
          <Button 
            onClick={onSaveNotebook}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
