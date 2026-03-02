import { useState } from "react";
import { ArrowLeft, Share2, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyGallery from "@/components/property-detail/PropertyGallery";
import PropertyTabs from "@/components/property-detail/PropertyTabs";
import PropertyDescription from "@/components/property-detail/PropertyDescription";
import PropertyFeatures from "@/components/property-detail/PropertyFeatures";
import PropertyMap from "@/components/property-detail/PropertyMap";
import PropertyVideo from "@/components/property-detail/PropertyVideo";
import PropertyContactForm from "@/components/property-detail/PropertyContactForm";
import MortgageCalculator from "@/components/property-detail/MortgageCalculator";
import NearbyPlaces from "@/components/property-detail/NearbyPlaces";
import PropertySidebar from "@/components/property-detail/PropertySidebar";

import img1 from "@/assets/property-detail-1.jpg";
import img2 from "@/assets/property-detail-2.jpg";
import img3 from "@/assets/property-detail-3.jpg";
import img4 from "@/assets/property-detail-4.jpg";
import img5 from "@/assets/property-detail-5.jpg";

const images = [img1, img2, img3, img4, img5, img1, img2]; // simulate 7 photos

interface PropertyDetailPageProps {
  onBack: () => void;
}

const PropertyDetailPage = ({ onBack }: PropertyDetailPageProps) => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="flex-1 overflow-auto">
      {/* Top bar */}
      <div className="px-4 sm:px-8 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-8 w-8 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Apartamento en Altea</h1>
            <p className="text-xs text-muted-foreground">Calle del Mar 24, 4ºB · Altea, Alicante</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><Heart className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="px-4 sm:px-8">
        <PropertyGallery images={images} />
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-8 mt-0">
        <PropertyTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content: 2-column layout */}
      <div className="px-4 sm:px-8 py-6 flex gap-6 max-w-[1400px]">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-5">
          <PropertyDescription />
          <PropertyVideo />
          <PropertyFeatures />
          <MortgageCalculator />
          <PropertyMap />
          <NearbyPlaces />
          <PropertyContactForm />
        </div>

        {/* Right column - sidebar */}
        <div className="w-80 shrink-0 hidden lg:block">
          <PropertySidebar />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
