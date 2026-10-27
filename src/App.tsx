import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { ToolWorkspace } from './components/ToolWorkspace';
import { MegaMenu } from './components/MegaMenu';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { PDF_TOOLS } from './data/tools';

export default function App() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync with URL Hash for direct tool links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && PDF_TOOLS.some((t) => t.id === hash)) {
        setSelectedToolId(hash);
      } else if (!hash) {
        setSelectedToolId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    window.location.hash = toolId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedToolId(null);
    history.pushState('', document.title, window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTool = PDF_TOOLS.find((t) => t.id === selectedToolId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Strict Top Bar Contract Navigation */}
      <Navbar
        onSelectTool={handleSelectTool}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentToolId={selectedToolId}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTool ? (
          <ToolWorkspace
            tool={currentTool}
            onBack={handleGoHome}
            onSelectOtherTool={handleSelectTool}
          />
        ) : (
          <>
            <Hero onSelectTool={handleSelectTool} />
            <ToolGrid onSelectTool={handleSelectTool} />
          </>
        )}
      </main>

      {/* Modals & Overlays */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onSelectTool={handleSelectTool}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Footer */}
      <Footer onSelectTool={handleSelectTool} />
    </div>
  );
}
