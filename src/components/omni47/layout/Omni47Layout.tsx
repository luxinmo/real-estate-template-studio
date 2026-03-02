import Omni47Navbar from "./Omni47Navbar";
import Omni47Footer from "./Omni47Footer";
import type { Omni47LayoutProps } from "../types";

const Omni47Layout = ({ navbar, footer, children }: Omni47LayoutProps) => (
  <div className="min-h-screen bg-omni47-cream font-sans">
    <Omni47Navbar {...navbar} />
    <main>{children}</main>
    <Omni47Footer {...footer} />
  </div>
);

export default Omni47Layout;
