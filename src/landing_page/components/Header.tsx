import { useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMenu: () => void;
}

export function Header({ activeTab, setActiveTab, onOpenMenu }: HeaderProps) {
  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Technology', id: 'technology' },
    { label: 'About', id: 'workflow' },
    { label: 'Architecture', id: 'architecture' },
    { label: 'Launch', id: 'launch' },
  ];

  const handleNavClick = (label: string, id: string) => {
    setActiveTab(label);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveTab(navItems[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full relative z-20 grid grid-cols-2 md:grid-cols-3 items-center py-2">
      {/* Brand Logo - Left Aligned */}
      <div className="flex items-center justify-start">
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('Home', 'home');
          }}
          className="text-xl sm:text-2xl font-extrabold tracking-widest text-white hover:opacity-90 transition-opacity"
          style={{ letterSpacing: '0.08em' }}
        >
          SPECTRAGUARD
        </a>
      </div>

      {/* Center Pill Navigation Bar - Guaranteed Absolute Center */}
      <nav className="hidden md:flex items-center justify-center">
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-full shadow-2xl space-x-1">
          {navItems.map((item) => {
            const isActive = activeTab.toLowerCase() === item.label.toLowerCase();
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label, item.id)}
                className={`px-5 py-2 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-black shadow-md font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Right Side Action Button - Right Aligned */}
      <div className="flex items-center justify-end">
        <button
          onClick={onOpenMenu}
          className="bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer shadow-md shrink-0"
        >
          Open Console
        </button>
      </div>
    </header>
  );
}


