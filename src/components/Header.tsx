
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  title: string;
  onNewNotebook: () => void;
  onSaveNotebook: () => void;
}

const Header = ({ title, onNewNotebook, onSaveNotebook }: HeaderProps) => {
  return (
    <header className="border-b border-border py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="text-notebook-purple h-6 w-6" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onNewNotebook}>New</Button>
        <Button onClick={onSaveNotebook}>Save</Button>
      </div>
    </header>
  );
};

export default Header;
