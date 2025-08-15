import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lo Que Pida | E-commerce Platform",
  description: "Welcome to Lo Que Pida - Your premier e-commerce marketplace",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
