import Hero from "@/components/hero/Hero";
import StickToBottom from "@/components/layout/StickToBottom";
import MissionSection from "@/components/mission/MissionSection";
import ProductsSection from "@/components/products/ProductsSection";
import ServicesSection from "@/components/services/ServicesSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductsSection />
      {/* Mission holds still at its end while the green section slides over it.
          DoubtsSection (src/components/doubts) is kept but not shown for now. */}
      <div>
        <StickToBottom>
          <MissionSection />
        </StickToBottom>
        <ServicesSection />
      </div>
    </main>
  );
}
