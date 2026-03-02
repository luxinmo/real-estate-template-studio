import { useLocation } from "react-router-dom";
import Omni47Layout from "../layout/Omni47Layout";
import Omni47HomePage from "../pages/Omni47HomePage";
import Omni47PropertyListPage from "../pages/Omni47PropertyListPage";
import Omni47PropertyDetailPage from "../pages/Omni47PropertyDetailPage";
import Omni47StaticPage from "../pages/Omni47StaticPage";
import Omni47ContactPage from "../pages/Omni47ContactPage";
import Omni47BlogListPage from "../pages/Omni47BlogListPage";
import Omni47BlogPostPage from "../pages/Omni47BlogPostPage";
import Omni47AdminPagesPage from "../pages/Omni47AdminPagesPage";
import Omni47AdminBlogPage from "../pages/Omni47AdminBlogPage";

import {
  navbarProps,
  footerProps,
  heroProps,
  statsProps,
  aboutProps,
  featuredProps,
  destinationsProps,
  newDevProps,
  offMarketProps,
  propertyListProps,
  propertyDetailProps,
  staticPageProps,
  contactProps,
  blogListProps,
  blogPostProps,
  adminPagesProps,
  adminBlogProps,
} from "./mock-data";

/**
 * OMNI47 Demo App — renders different pages based on route.
 * In production, replace mock-data imports with real API data.
 */
interface Omni47DemoAppProps {
  page:
    | "home"
    | "properties"
    | "property-detail"
    | "static-page"
    | "contact"
    | "blog"
    | "blog-post"
    | "admin-pages"
    | "admin-blog";
}

const Omni47DemoApp = ({ page }: Omni47DemoAppProps) => {
  // Admin pages don't use the public layout
  if (page === "admin-pages") return <Omni47AdminPagesPage {...adminPagesProps} />;
  if (page === "admin-blog") return <Omni47AdminBlogPage {...adminBlogProps} />;

  const navProps = {
    ...navbarProps,
    transparent: page === "home",
  };

  return (
    <Omni47Layout navbar={navProps} footer={footerProps}>
      {page === "home" && (
        <Omni47HomePage
          hero={heroProps}
          stats={statsProps}
          about={aboutProps}
          featured={featuredProps}
          destinations={destinationsProps}
          newDevelopments={newDevProps}
          offMarket={offMarketProps}
        />
      )}
      {page === "properties" && <Omni47PropertyListPage {...propertyListProps} />}
      {page === "property-detail" && <Omni47PropertyDetailPage {...propertyDetailProps} />}
      {page === "static-page" && <Omni47StaticPage {...staticPageProps} />}
      {page === "contact" && <Omni47ContactPage {...contactProps} />}
      {page === "blog" && <Omni47BlogListPage {...blogListProps} />}
      {page === "blog-post" && <Omni47BlogPostPage {...blogPostProps} />}
    </Omni47Layout>
  );
};

export default Omni47DemoApp;
