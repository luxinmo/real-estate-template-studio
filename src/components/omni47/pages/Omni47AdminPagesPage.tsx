import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown, Eye, Save } from "lucide-react";
import type { Omni47AdminPagesPageProps, AdminPage, AdminContentBlock, LanguageTab } from "../types";

const Omni47AdminPagesPage = ({
  pages,
  languages,
  onSave,
  onPublish,
  onDelete,
}: Omni47AdminPagesPageProps) => {
  const [editing, setEditing] = useState<AdminPage | null>(null);
  const [blocks, setBlocks] = useState<AdminContentBlock[]>([]);
  const [activeLang, setActiveLang] = useState(languages[0]?.code || "en");

  const openEditor = (page: AdminPage) => {
    setEditing(page);
    setBlocks([
      { id: "1", type: "hero", content: {} },
      { id: "2", type: "text", content: {} },
    ]);
  };

  const addBlock = (type: AdminContentBlock["type"]) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: {} }]);
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter((b) => b.id !== id));

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setBlocks(next);
  };

  if (editing) {
    return (
      <div className="min-h-screen bg-omni47-cream">
        <div className="border-b border-omni47-cream-dark bg-white">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <button
              onClick={() => setEditing(null)}
              className="text-[13px] font-light text-omni47-text-muted hover:text-omni47-navy"
            >
              ← Back to Pages
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => onSave?.(editing, blocks)}
                className="flex items-center gap-2 px-4 py-2 border border-omni47-cream-dark text-[12px] tracking-wider uppercase text-omni47-text hover:border-omni47-gold transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={() => onPublish?.(editing.id)}
                className="px-4 py-2 bg-omni47-navy text-white text-[12px] tracking-wider uppercase hover:bg-omni47-navy-light transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
          {/* Language tabs */}
          <div className="flex gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setActiveLang(l.code)}
                className={`px-3 py-1.5 text-[12px] uppercase tracking-wider font-light transition-colors ${
                  activeLang === l.code
                    ? "bg-omni47-navy text-white"
                    : "border border-omni47-cream-dark text-omni47-text-muted"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Title ({activeLang})</label>
            <input
              type="text"
              value={editing.title[activeLang] || ""}
              onChange={(e) =>
                setEditing({ ...editing, title: { ...editing.title, [activeLang]: e.target.value } })
              }
              className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
            />
          </div>

          {/* Slug + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Slug</label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Status</label>
              <select
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as "published" | "draft" })}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Content blocks */}
          <div>
            <h3 className="text-[13px] tracking-wider uppercase text-omni47-text-muted font-light mb-4">Content Blocks</h3>
            <div className="space-y-3">
              {blocks.map((block, idx) => (
                <div key={block.id} className="flex items-start gap-3 bg-white border border-omni47-cream-dark p-4">
                  <GripVertical className="w-4 h-4 text-omni47-text-muted/40 mt-1 shrink-0 cursor-grab" />
                  <div className="flex-1">
                    <span className="text-[11px] tracking-[0.15em] uppercase text-omni47-gold font-light">
                      {block.type}
                    </span>
                    <textarea
                      placeholder={`${block.type} content (${activeLang})...`}
                      value={block.content[activeLang] || ""}
                      onChange={(e) => {
                        const updated = [...blocks];
                        updated[idx] = { ...block, content: { ...block.content, [activeLang]: e.target.value } };
                        setBlocks(updated);
                      }}
                      rows={3}
                      className="w-full mt-2 px-3 py-2 border border-omni47-cream-dark text-[13px] font-light focus:outline-none focus:border-omni47-gold resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveBlock(idx, -1)} className="p-1 text-omni47-text-muted hover:text-omni47-navy">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveBlock(idx, 1)} className="p-1 text-omni47-text-muted hover:text-omni47-navy">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeBlock(block.id)} className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add block */}
            <div className="flex flex-wrap gap-2 mt-4">
              {(["hero", "text", "image", "cta", "html"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="flex items-center gap-1 px-3 py-2 border border-dashed border-omni47-cream-dark text-[11px] tracking-wider uppercase text-omni47-text-muted hover:border-omni47-gold hover:text-omni47-gold transition-colors"
                >
                  <Plus className="w-3 h-3" /> {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-omni47-cream">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-cormorant text-[28px] font-light text-omni47-navy">Pages</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-omni47-navy text-white text-[12px] tracking-wider uppercase hover:bg-omni47-navy-light transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Page
          </button>
        </div>

        <div className="bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-omni47-cream-dark">
                {["Title", "Slug", "Status", "Modified", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-omni47-cream-dark last:border-0 hover:bg-omni47-cream/50 transition-colors">
                  <td className="px-5 py-4 text-[14px] font-light text-omni47-navy">
                    {page.title[languages[0]?.code || "en"] || page.title.en || "Untitled"}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-mono text-omni47-text-muted/60">/{page.slug}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${
                      page.status === "published"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-omni47-text-muted">{page.lastModified}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEditor(page)} className="p-1.5 text-omni47-text-muted hover:text-omni47-navy">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete?.(page.id)} className="p-1.5 text-omni47-text-muted hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Omni47AdminPagesPage;
