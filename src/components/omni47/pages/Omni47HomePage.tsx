import Omni47Hero from "../home/Omni47Hero";
import Omni47StatsBar from "../home/Omni47StatsBar";
import Omni47AboutSection from "../home/Omni47AboutSection";
import Omni47FeaturedProperties from "../home/Omni47FeaturedProperties";
import Omni47BrowseByDestination from "../home/Omni47BrowseByDestination";
import Omni47NewDevelopments from "../home/Omni47NewDevelopments";
import Omni47OffMarketSection from "../home/Omni47OffMarketSection";
import type {
  Omni47HeroProps,
  Omni47StatsBarProps,
  Omni47AboutSectionProps,
  Omni47FeaturedPropertiesProps,
  Omni47BrowseByDestinationProps,
  Omni47NewDevelopmentsProps,
  Omni47OffMarketSectionProps,
} from "../types";

interface Omni47HomePageProps {
  hero: Omni47HeroProps;
  stats: Omni47StatsBarProps;
  about: Omni47AboutSectionProps;
  featured: Omni47FeaturedPropertiesProps;
  destinations: Omni47BrowseByDestinationProps;
  newDevelopments: Omni47NewDevelopmentsProps;
  offMarket: Omni47OffMarketSectionProps;
}

const Omni47HomePage = ({
  hero,
  stats,
  about,
  featured,
  destinations,
  newDevelopments,
  offMarket,
}: Omni47HomePageProps) => (
  <>
    <Omni47Hero {...hero} />
    <Omni47StatsBar {...stats} />
    <Omni47AboutSection {...about} />
    <Omni47FeaturedProperties {...featured} />
    <Omni47BrowseByDestination {...destinations} />
    <Omni47NewDevelopments {...newDevelopments} />
    <Omni47OffMarketSection {...offMarket} />
  </>
);

export default Omni47HomePage;
