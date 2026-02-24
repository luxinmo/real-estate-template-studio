import { useState } from "react";
import { Check } from "lucide-react";
import { LANGUAGES } from "../types";
import RichTextEditor from "./RichTextEditor";

interface MultilingualEditorProps {
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  minHeight?: number;
}

const MultilingualEditor = ({ values, onChange, minHeight = 300 }: MultilingualEditorProps) => {
  const [activeLang, setActiveLang] = useState("en");

  return (
    <div className="space-y-3">
      {/* Language tabs */}
      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActiveLang(lang.code)}
            className={`relative flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all ${
              activeLang === lang.code
                ? "ring-2 ring-primary bg-primary/5 text-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="uppercase">{lang.code}</span>
            {values[lang.code] && values[lang.code].replace(/<[^>]*>/g, "").trim() && (
              <Check className="h-2.5 w-2.5 text-emerald-500 absolute -top-0.5 -right-0.5" />
            )}
          </button>
        ))}
      </div>

      {/* Editor for active language */}
      <RichTextEditor
        value={values[activeLang] ?? ""}
        onChange={(html) => onChange({ ...values, [activeLang]: html })}
        minHeight={minHeight}
        placeholder={`Content in ${LANGUAGES.find((l) => l.code === activeLang)?.label ?? activeLang}...`}
      />
    </div>
  );
};

export default MultilingualEditor;
