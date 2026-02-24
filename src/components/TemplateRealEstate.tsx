import { MapPin, Bed, Bath, Maximize, ArrowRight, SlidersHorizontal, Star, ChevronRight } from "lucide-react";
import ComponentBlock from "@/components/ComponentBlock";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import featuredBanner from "@/assets/featured-banner.jpg";

const properties = [
  { image: property1, price: "$2,450,000", location: "Palm Beach, FL", beds: 4, baths: 3, sqft: "3,200", badge: "New" },
  { image: property2, price: "$1,890,000", location: "Manhattan, NY", beds: 3, baths: 2, sqft: "2,100", badge: "Featured" },
  { image: property3, price: "$5,750,000", location: "Malibu, CA", beds: 6, baths: 5, sqft: "5,800", badge: "Luxury" },
];

const TemplateRealEstate = () => {
  return (
    <div className="space-y-8">
      {/* Section Header Component */}
      <ComponentBlock label="Component: Section Header">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Premium Listings</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Explore curated luxury properties in top locations</p>
          </div>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:opacity-70 transition-opacity">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </ComponentBlock>

      {/* Featured Banner */}
      <ComponentBlock label="Component: Featured Property Banner">
        <div className="relative h-52 overflow-hidden">
          <img src={featuredBanner} alt="Featured" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/80">Featured Collection</span>
              </div>
              <h3 className="text-2xl font-semibold text-primary-foreground">Exclusive Waterfront Properties</h3>
              <p className="text-sm text-primary-foreground/70 mt-1.5 max-w-md">
                Curated luxury listings in prime coastal locations across the United States
              </p>
              <button className="mt-4 flex items-center gap-2 rounded-lg bg-card/15 backdrop-blur-sm border border-primary-foreground/20 px-5 py-2.5 text-[13px] font-medium text-primary-foreground hover:bg-card/25 transition-colors">
                Explore Collection <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </ComponentBlock>

      {/* Filter Bar */}
      <ComponentBlock label="Component: Filter Bar">
        <div className="px-5 py-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Location</label>
              <div className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                All Locations
              </div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Price Range</label>
              <div className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground">$500K – $10M+</div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Property Type</label>
              <div className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground">Residential</div>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
              Apply Filters
            </button>
          </div>
        </div>
      </ComponentBlock>

      {/* Property Card */}
      <ComponentBlock label="Component: Property Card">
        <div className="p-5">
          <div className="max-w-xs">
            <div className="rounded-xl border border-border overflow-hidden shadow-card">
              <div className="relative h-44 overflow-hidden">
                <img src={property1} alt="Property" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 rounded-md bg-card/90 backdrop-blur-sm px-2.5 py-1">
                  <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">New</span>
                </div>
                <div className="absolute bottom-3 left-3 rounded-md bg-primary/90 backdrop-blur-sm px-2.5 py-1">
                  <span className="text-[13px] font-semibold text-primary-foreground">$2,450,000</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} />
                  <span className="text-[12px]">Palm Beach, FL</span>
                </div>
                <p className="text-[14px] font-medium text-foreground">Mediterranean Villa with Pool</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Bed className="h-3.5 w-3.5" strokeWidth={1.5} /> 4</span>
                  <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Bath className="h-3.5 w-3.5" strokeWidth={1.5} /> 3</span>
                  <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Maximize className="h-3.5 w-3.5" strokeWidth={1.5} /> 3,200 sqft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentBlock>

      {/* Property Catalog Grid */}
      <ComponentBlock label="Component: Property Catalog Grid">
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties.map((p, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden group hover:shadow-elevated transition-shadow">
                <div className="relative h-36 overflow-hidden">
                  <img src={p.image} alt={p.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2.5 left-2.5 rounded-md bg-card/90 backdrop-blur-sm px-2 py-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-foreground">{p.badge}</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-foreground">{p.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" strokeWidth={1.5} />
                    <span className="text-[12px]">{p.location}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
                    <span>{p.beds} beds</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30" />
                    <span>{p.baths} baths</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30" />
                    <span>{p.sqft} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ComponentBlock>

      {/* Property Detail Preview */}
      <ComponentBlock label="Component: Property Detail Preview Section">
        <div className="p-5">
          <div className="flex gap-5 flex-col md:flex-row">
            <div className="md:w-1/2 rounded-xl overflow-hidden">
              <img src={property3} alt="Detail" className="w-full h-56 object-cover rounded-xl" />
            </div>
            <div className="md:w-1/2 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Luxury Listing</span>
                <h3 className="text-lg font-semibold text-foreground mt-1">Beachfront Estate – Malibu</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} />
                  <span className="text-[12px]">Malibu, CA 90265</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">$5,750,000</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-background p-3 text-center">
                  <span className="text-lg font-semibold text-foreground">6</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Bedrooms</p>
                </div>
                <div className="rounded-lg bg-background p-3 text-center">
                  <span className="text-lg font-semibold text-foreground">5</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Bathrooms</p>
                </div>
                <div className="rounded-lg bg-background p-3 text-center">
                  <span className="text-lg font-semibold text-foreground">5,800</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Sq Ft</p>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                An extraordinary beachfront property with panoramic ocean views, contemporary architecture, and resort-style amenities.
              </p>
            </div>
          </div>
        </div>
      </ComponentBlock>
    </div>
  );
};

export default TemplateRealEstate;
