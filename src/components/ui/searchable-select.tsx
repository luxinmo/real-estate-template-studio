import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  searchPlaceholder?: string;
  /** Fields shown in the inline create form */
  createFields?: CreateFields[];
  /** Label for the create action, e.g. "Create owner" */
  createLabel?: string;
  /** Called when user submits the create form. Return the new option to add it. */
  onCreate?: (values: Record<string, string>) => SearchableSelectOption | void;
  className?: string;
  disabled?: boolean;
}

const SearchableSelect = ({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  createFields,
  createLabel = "Create new",
  onCreate,
  className,
  disabled,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createValues, setCreateValues] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find((o) => o.id === value);

  const handleSelect = (id: string) => {
    onValueChange(id);
    setOpen(false);
    setSearch("");
    setShowCreate(false);
  };

  const handleCreate = () => {
    if (onCreate) {
      const result = onCreate(createValues);
      if (result) {
        handleSelect(result.id);
      }
    }
    setCreateValues({});
    setShowCreate(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch("");
      setShowCreate(false);
      setCreateValues({});
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const noResults = filtered.length === 0 && search.length > 0;
  const canCreate = !!createFields && !!onCreate;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal h-10",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        {!showCreate ? (
          <div>
            {/* Search input */}
            <div className="flex items-center border-b px-3 py-2">
              <Input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="ml-1 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Options list */}
            <div className="max-h-[200px] overflow-y-auto p-1">
              {filtered.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    option.id === value && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      option.id === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </button>
              ))}

              {noResults && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No results for "{search}"
                </p>
              )}
            </div>

            {/* Create new action */}
            {canCreate && (
              <div className="border-t p-1">
                <button
                  onClick={() => {
                    setShowCreate(true);
                    // Pre-fill name field with search query
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
          /* Inline create form */
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
                onClick={() => {
                  setShowCreate(false);
                  setCreateValues({});
                }}
              >
                Cancel
              </Button>
              <Button size="sm" className="flex-1 gap-1.5" onClick={handleCreate}>
                <Plus className="h-3.5 w-3.5" /> Create
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelect;
