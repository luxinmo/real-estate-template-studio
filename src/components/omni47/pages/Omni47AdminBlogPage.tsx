import { useState } from "react";
import { Plus, Pencil, Trash2, Save, Bold, Italic, Heading1, Heading2, Heading3, Link, Image } from "lucide-react";
import type { Omni47AdminBlogPageProps, AdminBlogPost, LanguageTab } from "../types";

const Omni47AdminBlogPage = ({
  posts,
  categories,
  languages,
  onSave,
  onPublish,
  onDelete,
}: Omni47AdminBlogPageProps) => {
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [activeLang, setActiveLang] = useState(languages[0]?.code || "en");

  const updateField = <K extends keyof AdminBlogPost>(key: K, value: AdminBlogPost[K]) => {
    if (editing) setEditing({ ...editing, [key]: value });
  };

  const updateLangField = (field: "title" | "body" | "seoTitle" | "seoDescription", value: string) => {
    if (editing) {
      setEditing({ ...editing, [field]: { ...editing[field], [activeLang]: value } });
    }
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
              ← Back to Blog
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => onSave?.(editing)}
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
              onChange={(e) => updateLangField("title", e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
            />
          </div>

          {/* Meta fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Slug</label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Category</label>
              <select
                value={editing.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Status</label>
              <select
                value={editing.status}
                onChange={(e) => updateField("status", e.target.value as "published" | "draft")}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Author</label>
              <input
                type="text"
                value={editing.author}
                onChange={(e) => updateField("author", e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Date</label>
              <input
                type="date"
                value={editing.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              />
            </div>
          </div>

          {/* Featured image */}
          <div>
            <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">Featured Image URL</label>
            <input
              type="text"
              value={editing.featuredImage}
              onChange={(e) => updateField("featuredImage", e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
            />
          </div>

          {/* Rich text editor */}
          <div>
            <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted font-light mb-2 block">
              Body ({activeLang})
            </label>
            <div className="bg-white border border-omni47-cream-dark">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-omni47-cream-dark">
                {[Heading1, Heading2, Heading3, Bold, Italic, Link, Image].map((Icon, i) => (
                  <button key={i} className="p-1.5 text-omni47-text-muted hover:text-omni47-navy transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <textarea
                value={editing.body[activeLang] || ""}
                onChange={(e) => updateLangField("body", e.target.value)}
                rows={12}
                placeholder="Write your article content..."
                className="w-full px-4 py-3 text-[14px] font-light focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="border-t border-omni47-cream-dark pt-6 space-y-4">
            <h3 className="text-[12px] tracking-wider uppercase text-omni47-text-muted font-light">SEO Fields ({activeLang})</h3>
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted/60 font-light">Meta Title</label>
              <input
                type="text"
                value={editing.seoTitle[activeLang] || ""}
                onChange={(e) => updateLangField("seoTitle", e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-wider uppercase text-omni47-text-muted/60 font-light">Meta Description</label>
              <textarea
                value={editing.seoDescription[activeLang] || ""}
                onChange={(e) => updateLangField("seoDescription", e.target.value)}
                rows={3}
                className="w-full mt-1 px-4 py-3 bg-white border border-omni47-cream-dark text-[14px] font-light focus:outline-none focus:border-omni47-gold resize-none"
              />
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
          <h1 className="font-cormorant text-[28px] font-light text-omni47-navy">Blog Posts</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-omni47-navy text-white text-[12px] tracking-wider uppercase hover:bg-omni47-navy-light transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Post
          </button>
        </div>

        <div className="bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-omni47-cream-dark">
                {["Title", "Category", "Status", "Date", "Author", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-omni47-text-muted font-light">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-omni47-cream-dark last:border-0 hover:bg-omni47-cream/50 transition-colors">
                  <td className="px-5 py-4 text-[14px] font-light text-omni47-navy">
                    {post.title[languages[0]?.code || "en"] || "Untitled"}
                  </td>
                  <td className="px-5 py-4 text-[12px] text-omni47-text-muted">{post.category}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${
                      post.status === "published" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-omni47-text-muted">{post.date}</td>
                  <td className="px-5 py-4 text-[12px] text-omni47-text-muted">{post.author}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditing(post)} className="p-1.5 text-omni47-text-muted hover:text-omni47-navy">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete?.(post.id)} className="p-1.5 text-omni47-text-muted hover:text-red-500">
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

export default Omni47AdminBlogPage;
