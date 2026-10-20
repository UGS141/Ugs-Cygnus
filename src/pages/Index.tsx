import React, { useState, useEffect } from "react";
import ScrollProgress from "@/src/components/ScrollProgress";
import Navbar from "@/src/components/Navbar";
import HeroSection from "@/src/components/HeroSection";
import AboutUGSSection from "@/src/components/AboutUGSSection";
import ServicesSection from "@/src/components/ServicesSection";
import FeaturedProjectsSection from "@/src/components/FeaturedProjectsSection";
import ProcessSection from "@/src/components/ProcessSection";
import ContactSection from "@/src/components/ContactSection";
import Footer from "@/src/components/Footer";

export const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"full" | "about-only">("full");

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ["hero", "about", "services", "projects", "process", "contact"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (viewMode === "about-only" && id !== "about") {
      setViewMode("full");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleLetsTalk = (serviceName?: string) => {
    if (serviceName) {
      setPreselectedService(serviceName);
    }
    if (viewMode === "about-only") {
      setViewMode("full");
    }
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div className="bg-[#06070B] min-h-screen text-[#F8FAFC] selection:bg-[#00F5D4] selection:text-[#06070B] relative">
      {/* 1. Subtle horizontal progress bar at the very top of the viewport */}
      <ScrollProgress />

      {/* 2. Brand Navbar */}
      <Navbar
        onLetsTalk={() => handleLetsTalk()}
        onNavigateSection={(id) => {
          if (id === "about" && viewMode === "about-only") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          scrollTo(id);
        }}
        activeSection={activeSection}
      />

      {/* View Switcher Floating Pill: Allows switching between Full Website & Dedicated About UGS Page */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 bg-[#0C0F1E]/90 border border-[#212A45] rounded-full p-1.5 backdrop-blur-md shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setViewMode("full");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            viewMode === "full"
              ? "bg-[#00F5D4] text-[#06070B] font-semibold shadow-[0_0_12px_rgba(0,245,212,0.3)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Full Website
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode("about-only");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            viewMode === "about-only"
              ? "bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] font-semibold shadow-[0_0_15px_rgba(0,245,212,0.3)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Dedicated About UGS View
        </button>
      </div>

      {/* Main Content Area */}
      <main id="top">
        {viewMode === "full" ? (
          <>
            {/* 1. Memorable Hero Section with concise headline & Antigravity kinetic canvas */}
            <div id="hero">
              <HeroSection
                onLetsTalk={() => handleLetsTalk()}
                onExploreServices={() => scrollTo("services")}
                onSelectService={(svc) => handleLetsTalk(svc)}
              />
            </div>

            {/* 2. Redesigned About UGS Section */}
            <AboutUGSSection
              onLetsTalk={() => handleLetsTalk()}
              onExploreServices={() => scrollTo("services")}
            />

            {/* 3. Services Section explaining how all 5 services work together */}
            <ServicesSection onLetsTalk={(svc) => handleLetsTalk(svc)} />

            {/* 4. Featured Projects Section with space for real case studies & placeholders */}
            <FeaturedProjectsSection onLetsTalk={(project) => handleLetsTalk(project)} />

            {/* 5. Process Section explaining our 4-stage client delivery methodology */}
            <ProcessSection onLetsTalk={() => handleLetsTalk()} />

            {/* 6. Strong Contact Section with direct message inquiry form */}
            <ContactSection initialService={preselectedService} />
          </>
        ) : (
          /* Dedicated About UGS Page View */
          <div className="pt-24 min-h-screen">
            <AboutUGSSection
              onLetsTalk={() => handleLetsTalk()}
              onExploreServices={() => {
                setViewMode("full");
                setTimeout(() => scrollTo("services"), 50);
              }}
            />
            <ContactSection initialService={preselectedService} />
          </div>
        )}
      </main>

      {/* Clean Footer with contact and social placeholders */}
      <Footer
        onNavigateSection={(id) => scrollTo(id)}
        onLetsTalk={() => handleLetsTalk()}
      />
    </div>
  );
};

export default Index;
