import { Eye, Star, ArrowRight } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import featuredBanner from "@/assets/featured-banner.jpg";

const properties = [
  { image: property1, price: "$2,450,000", location: "Palm Beach, FL", beds: 4, baths: 3, sqft: "3,200" },
  { image: property2, price: "$1,890,000", location: "Manhattan, NY", beds: 3, baths: 2, sqft: "2,100" },
  { image: property3, price: "$5,750,000", location: "Malibu, CA", beds: 6, baths: 5, sqft: "5,800" },
];

const TemplatesPage = () => {
  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-accent uppercase tracking-widest">Active</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Design components for Real Estate interfaces</p>
      </div>

      {/* Template Card */}
      <div className="px-8 pb-8">
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Template Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Template 1 – Real Estate</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Premium listing components · 6 blocks</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <Star className="h-3 w-3" /> Featured
              </span>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>
          </div>

          {/* Template Preview Content */}
          <div className="p-6 space-y-6 bg-secondary/30">

            {/* Featured Property Banner */}
            <div className="rounded-xl overflow-hidden relative h-48 group">
              <img src={featuredBanner} alt="Featured" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex items-center">
                <div className="px-8">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent">Featured Collection</span>
                  <h3 className="text-xl font-semibold text-card mt-1">Exclusive Waterfront Properties</h3>
                  <p className="text-sm text-card/70 mt-1">Curated luxury listings in prime coastal locations</p>
                  <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-card border border-card/30 rounded-lg px-4 py-2 hover:bg-card/10 transition-colors">
                    Explore <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Location</label>
                  <div className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">All Locations</div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Price Range</label>
                  <div className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">$500K – $10M+</div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Property Type</label>
                  <div className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">Residential</div>
                </div>
                <button className="mt-auto rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                  Search
                </button>
              </div>
            </div>

            {/* Property Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-foreground">Property Catalog</h4>
                <span className="text-xs text-muted-foreground">3 listings</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {properties.map((p, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden shadow-card group">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.location}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 rounded-md bg-card/90 backdrop-blur-sm px-2 py-1">
                        <span className="text-xs font-semibold text-foreground">{p.price}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-foreground">{p.location}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{p.beds} beds</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{p.baths} baths</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{p.sqft} sqft</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Listing Section Preview */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Clean Listing Layout</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Minimal row-based property listings</p>
                </div>
              </div>
              <div className="space-y-3">
                {properties.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors">
                    <img src={p.image} alt={p.location} className="h-12 w-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{p.location}</p>
                      <p className="text-xs text-muted-foreground">{p.beds} beds · {p.baths} baths · {p.sqft} sqft</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
