import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Omni47BlogListPageProps } from "../types";

const Omni47BlogListPage = ({
  heroTitle,
  heroSubtitle,
  featuredPost,
  posts,
  categories,
  currentCategory,
  onCategoryChange,
  currentPage,
  totalPages,
  onPageChange,
}: Omni47BlogListPageProps) => (
  <div className="min-h-screen bg-omni47-cream pt-16 lg:pt-20">
    {/* Hero */}
    <div className="bg-omni47-navy py-20 lg:py-28 text-center">
      <h1 className="font-cormorant text-[36px] lg:text-[56px] font-extralight text-white">{heroTitle}</h1>
      <p className="mt-3 text-[14px] font-light text-white/60 max-w-xl mx-auto">{heroSubtitle}</p>
    </div>

    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 lg:py-20">
      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-3 mb-12">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange?.(c.value)}
            className={`px-4 py-2 text-[12px] tracking-[0.1em] uppercase font-light transition-all ${
              currentCategory === c.value
                ? "bg-omni47-navy text-white"
                : "border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Featured post */}
      <a href={featuredPost.href} className="block group mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white overflow-hidden">
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-[11px] tracking-[0.2em] uppercase text-omni47-gold font-light">
              {featuredPost.category}
            </span>
            <h2 className="font-cormorant text-[26px] lg:text-[32px] font-light text-omni47-navy mt-3 group-hover:text-omni47-gold transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-[14px] font-light text-omni47-text-muted leading-relaxed mt-4 line-clamp-3">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-4 mt-6 text-[12px] text-omni47-text-muted/60">
              <span>{featuredPost.date}</span>
              <span>·</span>
              <span>{featuredPost.author}</span>
            </div>
            <span className="mt-6 text-[12px] tracking-[0.15em] uppercase text-omni47-gold font-light">
              Read More →
            </span>
          </div>
        </div>
      </a>

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <a key={post.slug} href={post.href} className="group bg-white overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-omni47-gold font-light">
                {post.category}
              </span>
              <h3 className="font-cormorant text-[20px] font-light text-omni47-navy mt-2 group-hover:text-omni47-gold transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-[13px] font-light text-omni47-text-muted mt-2 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 text-[11px] text-omni47-text-muted/60">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.author}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-9 h-9 flex items-center justify-center border border-omni47-cream-dark text-omni47-text-muted disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={`w-9 h-9 flex items-center justify-center text-[13px] font-light ${
                p === currentPage ? "bg-omni47-navy text-white" : "border border-omni47-cream-dark text-omni47-text-muted"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-9 h-9 flex items-center justify-center border border-omni47-cream-dark text-omni47-text-muted disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default Omni47BlogListPage;
