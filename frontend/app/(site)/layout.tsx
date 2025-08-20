import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";

// Efectos de IconRain
import IconRain from "@/components/effects/IconRain";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      
      <QuickViewModal />
      <CartSidebarModal />
      <PreviewSliderModal />
      
      {/* Efectos de fondo */}
      <IconRain />
      
      <ScrollToTop />
      <Footer />
    </>
  );
}
