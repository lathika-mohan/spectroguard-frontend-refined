import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroCenter } from './components/HeroCenter';
import { BottomCards } from './components/BottomCards';
import { TrustedBrandsSection } from './components/TrustedBrandsSection';
import { AboutSpectraSection } from './components/AboutSpectraSection';
import { CaseStudySection } from './components/CaseStudySection';
import { FeaturesGridSection } from './components/FeaturesGridSection';
import { MenuDrawer } from './components/MenuDrawer';
import { ContactModal } from './components/ContactModal';
import { ScrollCanvas } from './components/ScrollCanvas';

export default function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="landing-page-root bg-black text-white min-h-screen flex flex-col relative selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Fixed background scroll-driven canvas */}
      <ScrollCanvas />

      {/* First Fold Banner Section - Full viewport height with section ID home */}
      <div id="home" className="w-full max-w-7xl mx-auto min-h-screen flex flex-col justify-between py-6 px-4 sm:px-8 relative z-10">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        {/* Center Hero */}
        <main className="my-auto py-8 flex flex-col items-center justify-center">
          <HeroCenter onCtaClick={() => navigate("/login")} />
        </main>

        {/* Bottom Feature Cards */}
        <BottomCards />
      </div>

      {/* Second Section: Proudly Trusted by Leading Brands */}
      <TrustedBrandsSection />

      {/* Third Section: About Studio / SpectraGuard with 4 cards */}
      <AboutSpectraSection />

      {/* Fourth Section: Case Study / Impact with Blue Gradient Card */}
      <CaseStudySection />

      {/* Fifth Section: 4 Feature Cards with Central Space & Launch CTA */}
      <FeaturesGridSection onLaunchClick={() => navigate("/login")} />

      {/* Drawers and Modals */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCtaClick={() => navigate("/login")}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}



