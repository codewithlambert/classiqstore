import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Catalog from "@/components/site/Catalog";
import Customise from "@/components/site/Customise";
import EcoPacking from "@/components/site/EcoPacking";
import Journal from "@/components/site/Journal";
import Footer from "@/components/site/Footer";
import ScrollToTop from "@/components/site/ScrollToTop";
import SiteAssistant from "@/components/site/SiteAssistant";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Customise />
        <EcoPacking />
        <Journal />
      </main>
      <Footer />
      <ScrollToTop />
      <SiteAssistant />
    </div>
  );
}
