import { X, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Omni47PropertyCard from "../shared/Omni47PropertyCard";
import type { Omni47PropertyListPageProps } from "../types";

const Omni47PropertyListPage = ({
  operationOptions,
  locationPlaceholder,
  typeOptions,
  priceRangeOptions,
  bedsOptions,
  amenityOptions,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  resultsCount,
  sortOptions,
  currentSort,
  onSortChange,
  properties,
  currentPage,
  totalPages,
  onPageChange,
  onContactProperty,
}: Omni47PropertyListPageProps) => (
  <div className="min-h-screen bg-omni47-cream pt-20 lg:pt-24">
    {/* Sticky Filter Bar */}
    <div className="sticky top-16 lg:top-20 z-40 bg-white border-b border-omni47-cream-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Operation toggle */}
          <div className="flex border border-omni47-cream-dark overflow-hidden">
            {operationOptions.map((op) => (
              <button
                key={op.value}
                className="px-4 py-2 text-[12px] tracking-[0.1em] uppercase font-light text-omni47-text hover:bg-omni47-cream transition-colors first:border-r border-omni47-cream-dark"
              >
                {op.label}
              </button>
            ))}
          </div>

          {/* Location search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-omni47-text-muted" />
            <input
              type="text"
              placeholder={locationPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-omni47-cream border border-omni47-cream-dark text-[13px] font-light text-omni47-text placeholder:text-omni47-text-muted/60 focus:outline-none focus:border-omni47-gold"
            />
          </div>

          {/* Dropdowns */}
          {[
            { label: "Type", options: typeOptions },
            { label: "Price", options: priceRangeOptions },
            { label: "Beds", options: bedsOptions },
          ].map((filter) => (
            <div key={filter.label} className="relative">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-omni47-cream-dark text-[12px] tracking-wider uppercase font-light text-omni47-text hover:border-omni47-gold transition-colors">
                {filter.label} <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Amenities */}
          <button className="flex items-center gap-1.5 px-4 py-2 border border-omni47-cream-dark text-[12px] tracking-wider uppercase font-light text-omni47-text hover:border-omni47-gold transition-colors">
            Amenities <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-omni47-cream-dark text-[11px] tracking-wider uppercase text-omni47-text"
            >
              {f.label}
              <button onClick={() => onRemoveFilter?.(f.key)}>
                <X className="w-3 h-3 text-omni47-text-muted hover:text-omni47-navy" />
              </button>
            </span>
          ))}
          <button
            onClick={onClearFilters}
            className="text-[11px] tracking-wider uppercase text-omni47-gold hover:text-omni47-navy transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-omni47-cream-dark">
        <p className="text-[13px] font-light text-omni47-text-muted">
          <span className="text-omni47-navy font-normal">{resultsCount}</span> properties found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-wider uppercase text-omni47-text-muted">Sort:</span>
          <select
            value={currentSort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="text-[12px] font-light text-omni47-text bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property list */}
      <div className="space-y-6">
        {properties.map((p) => (
          <Omni47PropertyCard
            key={p.id}
            property={p}
            variant="horizontal"
            onContact={onContactProperty}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-9 h-9 flex items-center justify-center border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={`w-9 h-9 flex items-center justify-center text-[13px] font-light transition-colors ${
                page === currentPage
                  ? "bg-omni47-navy text-white"
                  : "border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-9 h-9 flex items-center justify-center border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default Omni47PropertyListPage;
