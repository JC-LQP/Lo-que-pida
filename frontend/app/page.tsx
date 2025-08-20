import Home from "@/components/Home";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import IconRain from "@/components/effects/IconRain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lo Que Pida | E-commerce Platform",
  description: "Welcome to Lo Que Pida - Your premier e-commerce marketplace",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <Home />
      
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
