
import React, { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Pencil, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface TextCellProps {
  content: string;
  onChange: (content: string) => void;
}

const TextCell = ({ content, onChange }: TextCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    // If content changes externally, update the editing state
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    onChange(editedContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[100px] p-4 font-mono resize-y"
          placeholder="Write in markdown..."
          autoFocus
        />
        <Button 
          className="absolute right-2 bottom-2"
          size="sm"
          onClick={handleSave}
        >
          <Check className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="relative p-4 prose prose-sm max-w-none"
      onClick={() => setIsEditing(true)}
    >
      {!content ? (
        <div className="text-gray-400 italic">Click to add text content...</div>
      ) : (
        <ReactMarkdown>{content}</ReactMarkdown>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TextCell;
