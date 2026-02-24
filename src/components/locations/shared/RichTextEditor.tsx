import { useRef, useCallback } from "react";
import {
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
  placeholder?: string;
}

const ToolBtn = ({
  icon: Icon, label, onClick, active,
}: { icon: any; label: string; onClick: () => void; active?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

const RichTextEditor = ({ value, onChange, minHeight = 300, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleHeading = useCallback((tag: string) => {
    document.execCommand("formatBlock", false, tag);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 flex-wrap">
        <ToolBtn icon={Bold} label="Bold" onClick={() => exec("bold")} />
        <ToolBtn icon={Italic} label="Italic" onClick={() => exec("italic")} />
        <ToolBtn icon={Underline} label="Underline" onClick={() => exec("underline")} />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolBtn icon={Heading1} label="H1" onClick={() => handleHeading("H1")} />
        <ToolBtn icon={Heading2} label="H2" onClick={() => handleHeading("H2")} />
        <ToolBtn icon={Heading3} label="H3" onClick={() => handleHeading("H3")} />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolBtn icon={List} label="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <ToolBtn icon={ListOrdered} label="Numbered list" onClick={() => exec("insertOrderedList")} />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolBtn icon={LinkIcon} label="Link" onClick={handleLink} />
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="px-4 py-3 text-[13px] text-foreground outline-none prose prose-sm max-w-none overflow-auto"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
