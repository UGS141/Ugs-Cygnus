import React from "react";
import { ArrowUpRight, ChevronRight, Layers, Workflow, ShoppingBag, Globe, BarChart3 } from "lucide-react";
import AntigravityCanvas from "./AntigravityCanvas";

interface HeroSectionProps {
  onLetsTalk: () => void;
  onExploreServices: () => void;
  onSelectService?: (serviceName: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLetsTalk,
  onExploreServices,
  onSelectService,
}) => {
  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      {/* Ambient background glows using UGS logo hues */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#8B5CF6]/15 via-[#3B82F6]/15 to-[#00F5D4]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Messaging & Calls to Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Category kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111424] border border-[#202742] text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
              <span className="font-medium tracking-wide">
                Universal Global Solutions
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Integrated Digital Services</span>
            </div>

            {/* Concise, confident headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              We build digital systems that{" "}
              <span className="ugs-gradient-text">work together</span>.
            </h1>

            {/* Supporting message */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl">
              UGS helps businesses replace fragmented tools with unified digital engines. From high-converting websites and e-commerce to custom SaaS platforms, spreadsheet integrations, and targeted marketing—all engineered to drive real operational results.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onLetsTalk}
                className="px-7 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_-5px_rgba(0,245,212,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <span>Let's talk</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={onExploreServices}
                className="px-6 py-3.5 rounded-lg text-sm font-medium text-slate-200 bg-[#0F1220] border border-[#242C48] hover:border-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Services</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* 5 Integrated Disciplines Quick Badges */}
            <div className="pt-6 border-t border-[#181D30] grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00F5D4]" />
                <span>Websites & Web Apps</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#38BDF8]" />
                <span>E-Commerce Stores</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                <span>SaaS Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#06B6D4]" />
                <span>Workflow & Sheets</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#60A5FA]" />
                <span>Digital Marketing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Antigravity Kinetic Canvas */}
          <div className="lg:col-span-6 w-full">
            <AntigravityCanvas onSelectService={onSelectService} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
