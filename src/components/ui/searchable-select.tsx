import { useState, useRef, useEffect, useCallback } from "react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SearchableSelectOption {
  id: string;
  label: string;
}

export interface CreateFields {
  label: string;
  key: string;
  placeholder?: string;
  type?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  createFields?: CreateFields[];
  createLabel?: string;
  onCreate?: (values: Record<string, string>) => SearchableSelectOption | void;
  className?: string;
  disabled?: boolean;
}

const SearchableSelect = ({
  options,
  value,
  onValueChange,
  placeholder = "Search…",
  createFields,
  createLabel = "Create new",
  onCreate,
  className,
  disabled,
}: SearchableSelectProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createValues, setCreateValues] = useState<Record<string, string>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onValueChange(id);
    setOpen(false);
    setSearch("");
    setShowCreate(false);
  };

  const handleClear = () => {
    onValueChange("");
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCreate = () => {
    if (onCreate) {
      const result = onCreate(createValues);
      if (result) handleSelect(result.id);
    }
    setCreateValues({});
    setShowCreate(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!open) setOpen(true);
    setShowCreate(false);
  };

  const handleFocus = () => {
    if (!value) setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
        setShowCreate(false);
        setCreateValues({});
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const noResults = filtered.length === 0 && search.length > 0;
  const canCreate = !!createFields && !!onCreate;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {/* Selected state: chip with delete */}
      {value && selected ? (
        <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3">
          <span className="flex-1 truncate text-sm">{selected.label}</span>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="ml-2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        /* Empty state: search input */
        <Input
          ref={inputRef}
          value={search}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="h-10"
        />
      )}

      {/* Dropdown */}
      {open && !value && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          {!showCreate ? (
            <div>
              <div className="max-h-[200px] overflow-y-auto p-1">
                {filtered.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span className="truncate">{option.label}</span>
                  </button>
                ))}

                {noResults && (
                  <p className="py-3 text-center text-sm text-muted-foreground">
                    No results for "{search}"
                  </p>
                )}

                {filtered.length === 0 && search.length === 0 && (
                  <p className="py-3 text-center text-sm text-muted-foreground">
                    Start typing to search…
                  </p>
                )}
              </div>

              {canCreate && (
                <div className="border-t p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreate(true);
                      if (search && createFields?.[0]) {
                        setCreateValues({ [createFields[0].key]: search });
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-primary hover:bg-accent transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{createLabel}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 space-y-3">
              <p className="text-sm font-medium text-foreground">{createLabel}</p>
              {createFields?.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  <Input
                    value={createValues[field.key] || ""}
                    onChange={(e) =>
                      setCreateValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    type={field.type || "text"}
                    className="h-9 text-sm"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setCreateValues({});
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" className="flex-1 gap-1.5" type="button" onClick={handleCreate}>
                  <Plus className="h-3.5 w-3.5" /> Create
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
