import React from "react";
import { BrandLogo } from "./BrandLogo";
import { ArrowUp, Mail, Phone, MapPin, Globe } from "lucide-react";

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onLetsTalk: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onLetsTalk,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#05060A] border-t border-[#151928] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Universal Global Solutions (UGS) engineers integrated digital systems for growing businesses—connecting high-performance websites, e-commerce storefronts, custom SaaS software, automated spreadsheets, and digital marketing into one unified engine.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onLetsTalk}
                className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                Let's talk
              </button>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Services
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("services")}
                  className="hover:text-white transition-colors text-left"
                >
                  Website Design & Dev
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("services")}
                  className="hover:text-white transition-colors text-left"
                >
                  E-Commerce Stores
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("services")}
                  className="hover:text-white transition-colors text-left"
                >
                  Custom SaaS Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("services")}
                  className="hover:text-white transition-colors text-left"
                >
                  Spreadsheet Integrations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("services")}
                  className="hover:text-white transition-colors text-left"
                >
                  Digital Marketing
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("about")}
                  className="hover:text-white transition-colors text-left"
                >
                  About UGS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("projects")}
                  className="hover:text-white transition-colors text-left"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("process")}
                  className="hover:text-white transition-colors text-left"
                >
                  Our Process
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("contact")}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social Placeholders */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Contact & Socials
            </div>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <a
                  href="mailto:ugssolutions1@gmail.com"
                  className="hover:text-[#00F5D4] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#00F5D4]" />
                  <span>ugssolutions1@gmail.com</span>
                </a>
              </li>
              <li className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>[Phone Placeholder]</span>
              </li>
              <li className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>[Location Placeholder]</span>
              </li>
              <li className="pt-2 text-slate-500 flex flex-wrap gap-2 text-[11px]">
                <span className="p-1.5 rounded bg-[#101424] border border-[#1F2740]">
                  [LinkedIn Placeholder]
                </span>
                <span className="p-1.5 rounded bg-[#101424] border border-[#1F2740]">
                  [Twitter / X Placeholder]
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with copyright and back-to-top */}
        <div className="pt-8 border-t border-[#151928] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} UGS (Universal Global Solutions). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono">
              Designed with precision · Zero data silos
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#0F1322] border border-[#202740] hover:text-white hover:border-[#00F5D4] transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
