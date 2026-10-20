import React, { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { Menu, X, ArrowUpRight, MessageSquare } from "lucide-react";

interface NavbarProps {
  onLetsTalk: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLetsTalk,
  onNavigateSection,
  activeSection = "hero",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About UGS", id: "about" },
    { label: "Services", id: "services" },
    { label: "Projects", id: "projects" },
    { label: "Process", id: "process" },
    { label: "Contact", id: "contact" },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#06070B]/85 backdrop-blur-md border-b border-[#1A1F33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Left: UGS Brand Logo (Exact asset, zero distortion) */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("hero");
          }}
          className="flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none"
          aria-label="UGS Home"
        >
          <BrandLogo size="md" />
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-[#00F5D4] font-semibold drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: "Let's talk" CTA button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLetsTalk}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_-3px_rgba(0,245,212,0.3)] cursor-pointer"
          >
            <span>Let's talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0C16] border-b border-[#1E2438] px-6 py-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className="text-left text-base font-medium text-slate-300 hover:text-[#00F5D4] transition-colors py-2 border-b border-slate-800/40"
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLetsTalk();
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Let's talk</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
