import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Languages } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const languages = [
  { code: "EN", flag: "🇬🇧" },
  { code: "ES", flag: "🇪🇸" },
  { code: "FR", flag: "🇫🇷" },
  { code: "DE", flag: "🇩🇪" },
  { code: "RU", flag: "🇷🇺" },
  { code: "NL", flag: "🇳🇱" },
  { code: "PL", flag: "🇵🇱" },
];

type LangData = { title: string; description: string };

interface DescriptionSectionProps {
  data: Record<string, LangData>;
  onChange: (data: Record<string, LangData>) => void;
}

const DescriptionSection = ({ data, onChange }: DescriptionSectionProps) => {
  const [activeLang, setActiveLang] = useState("EN");
  const [translateOpen, setTranslateOpen] = useState(false);
  const [sourceLang, setSourceLang] = useState("EN");
  const [targetLangs, setTargetLangs] = useState<string[]>([]);
  const [overwrite, setOverwrite] = useState(false);

  const current = data[activeLang] || { title: "", description: "" };

  const updateLang = (field: string, value: string) => {
    onChange({
      ...data,
      [activeLang]: { ...current, [field]: value },
    });
  };

  const toggleTarget = (code: string) => {
    setTargetLangs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-foreground">Property Description</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> Generate with AI
          </Button>
          <Dialog open={translateOpen} onOpenChange={setTranslateOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
                <Languages className="h-3.5 w-3.5" /> Translate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Translate Description</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Source Language</Label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => (
                        <SelectItem key={l.code} value={l.code}>{l.flag} {l.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Target Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.filter((l) => l.code !== sourceLang).map((l) => (
                      <label key={l.code} className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          checked={targetLangs.includes(l.code)}
                          onCheckedChange={() => toggleTarget(l.code)}
                        />
                        <span className="text-sm">{l.flag} {l.code}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Switch checked={overwrite} onCheckedChange={setOverwrite} />
                  <span className="text-sm text-foreground">Overwrite existing translations</span>
                </label>
                <Button
                  onClick={() => setTranslateOpen(false)}
                  className="w-full"
                  disabled={targetLangs.length === 0}
                >
                  Translate to {targetLangs.length} language{targetLangs.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 mb-4">
        {languages.map((l) => {
          const hasContent = data[l.code]?.title || data[l.code]?.description;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`relative px-3 py-2 rounded-lg text-lg transition-colors ${
                activeLang === l.code
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
              title={l.code}
            >
              {l.flag}
              {hasContent && activeLang !== l.code && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Title ({activeLang})</Label>
          <Input
            value={current.title}
            onChange={(e) => updateLang("title", e.target.value)}
            placeholder="Stunning sea view apartment in Altea"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Description ({activeLang})</Label>
          <Textarea
            value={current.description}
            onChange={(e) => updateLang("description", e.target.value)}
            placeholder="Write a detailed description of the property..."
            className="min-h-[160px]"
          />
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;
