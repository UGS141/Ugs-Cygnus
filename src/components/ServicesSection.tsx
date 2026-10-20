import React, { useState } from "react";
import {
  Globe,
  ShoppingBag,
  Layers,
  Workflow,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Plus,
  Sparkles,
} from "lucide-react";

interface ServicesSectionProps {
  onLetsTalk: (serviceName?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onLetsTalk }) => {
  const [selectedService, setSelectedService] = useState<number>(0);
  const [synergyPair, setSynergyPair] = useState<[number, number]>([1, 3]); // e-commerce + spreadsheet integrations

  const services = [
    {
      id: "web-dev",
      title: "Website Design & Development",
      category: "Digital Flagships",
      icon: <Globe className="w-6 h-6 text-[#00F5D4]" />,
      accent: "#00F5D4",
      summary:
        "Bespoke, high-performance web applications built for speed, brand distinction, and measurable conversion.",
      details: [
        "Modern responsive layouts crafted for all screen sizes",
        "Sub-second load times engineered with clean, modern code",
        "Search engine optimization (SEO) and structured metadata",
        "Scalable component architecture ready for future feature expansion",
      ],
      idealFor: "Companies requiring a high-credibility digital presence that outperforms generic competitor templates.",
    },
    {
      id: "ecommerce",
      title: "E-Commerce Stores",
      category: "Revenue Engines",
      icon: <ShoppingBag className="w-6 h-6 text-[#38BDF8]" />,
      accent: "#38BDF8",
      summary:
        "Frictionless online storefronts engineered to maximize average order value, streamline checkouts, and sync inventory.",
      details: [
        "Friction-free, single-page and mobile-optimized checkouts",
        "Real-time multi-channel inventory and order synchronization",
        "Secure global payment gateway integrations (credit cards, Apple Pay, local methods)",
        "Customer account portals, re-ordering flows, and subscription billing",
      ],
      idealFor: "Brands looking to sell direct-to-consumer or B2B with zero checkout friction and automated order routing.",
    },
    {
      id: "saas",
      title: "SaaS Products",
      category: "Cloud Applications",
      icon: <Layers className="w-6 h-6 text-[#8B5CF6]" />,
      accent: "#8B5CF6",
      summary:
        "Custom web applications, multi-tenant software, and client portals engineered from concept to scalable production.",
      details: [
        "Multi-role user authentication and role-based access control (RBAC)",
        "Responsive administrative consoles and telemetry dashboards",
        "Automated recurring subscription billing and license management",
        "Resilient, modular API design with high data security",
      ],
      idealFor: "Businesses launching digital services or replacing off-the-shelf software with proprietary operational tools.",
    },
    {
      id: "integrations",
      title: "Workflow & Spreadsheet Integrations",
      category: "Operational Automation",
      icon: <Workflow className="w-6 h-6 text-[#06B6D4]" />,
      accent: "#06B6D4",
      summary:
        "Automated bridges connecting your websites, CRMs, inventory, and spreadsheets (Google Sheets / Excel) to eliminate manual entry.",
      details: [
        "Bi-directional sync between web forms, store checkouts, and Google Sheets",
        "Automated notification triggers, webhooks, and invoice generation",
        "Custom spreadsheet dashboards with real-time operational metrics",
        "Error-trapping algorithms preventing duplicate or lost customer records",
      ],
      idealFor: "Organizations tired of employees manually copying numbers between databases, tools, and spreadsheets.",
    },
    {
      id: "marketing",
      title: "Digital Marketing",
      category: "Customer Acquisition",
      icon: <BarChart3 className="w-6 h-6 text-[#60A5FA]" />,
      accent: "#60A5FA",
      summary:
        "Data-driven marketing systems and conversion funnel optimization designed to deliver qualified, high-intent prospects.",
      details: [
        "Conversion rate optimization (CRO) grounded in real user session telemetry",
        "Targeted customer acquisition campaigns with accurate attribution tracking",
        "Automated customer retention sequences, onboarding emails, and re-engagement",
        "Transparent analytics dashboards showing true cost per acquired customer",
      ],
      idealFor: "Growth-focused companies needing a reliable pipeline of qualified leads without wasted ad spend.",
    },
  ];

  // Synergistic Multiplier Matrix
  const getSynergyExplanation = (a: number, b: number) => {
    const pairKey = [a, b].sort().join("-");
    const descriptions: Record<string, string> = {
      "0-1":
        "When Website Design pairs with E-Commerce, your storefront gains enterprise-grade speed and bespoke brand storytelling, directly lowering cart abandonment.",
      "0-2":
        "Combining Web Design with SaaS Products delivers a seamless marketing landing experience that converts visitors straight into active application trials.",
      "0-3":
        "Connecting your Website directly with Spreadsheet Integrations means customer inquiries immediately populate internal spreadsheets and notify your team in seconds.",
      "0-4":
        "Pairing Web Design with Digital Marketing ensures your ad campaigns land on hyper-focused, lightning-fast landing pages with tight message match.",
      "1-2":
        "E-Commerce combined with SaaS creates powerful hybrid models: subscription box management, recurring wholesale portals, and automated digital licensing.",
      "1-3":
        "E-Commerce directly tied to Spreadsheet Automation ensures orders instantly update inventory logs, shipping manifests, and financial sheets with zero human error.",
      "1-4":
        "E-Commerce fueled by Digital Marketing creates a closed-loop attribution funnel where customer acquisition cost (CAC) and customer lifetime value (LTV) are tracked down to the cent.",
      "2-3":
        "SaaS software synced with Business Spreadsheets gives management live, real-time KPI visibility in familiar formats without expensive legacy BI tools.",
      "2-4":
        "SaaS platforms paired with Digital Marketing allow targeted acquisition campaigns aimed at exact buyer personas with automated in-app onboarding.",
      "3-4":
        "Spreadsheet Automation paired with Digital Marketing automatically logs ad performance, lead quality ratings, and sales pipeline velocities into centralized executive sheets.",
    };

    return (
      descriptions[pairKey] ||
      "Integrating these two disciplines eliminates disconnected software silos, saving hours of manual administration and accelerating customer response times."
    );
  };

  const current = services[selectedService];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#06070B] border-t border-[#161B2C]">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#3B82F6]/10 via-[#00F5D4]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121626] border border-[#202742] text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Core Capabilities
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Integrated Services</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Everything Required to{" "}
            <span className="ugs-gradient-text">Build, Operate & Grow</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            We provide five core digital services. Each discipline is robust on its own, but their true strength emerges when they are connected into one unified system.
          </p>
        </div>

        {/* 5-Column Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {services.map((svc, idx) => {
            const isSelected = selectedService === idx;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setSelectedService(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#101426] border-[#00F5D4] shadow-[0_0_25px_-5px_rgba(0,245,212,0.25)] translate-y-[-2px]"
                    : "bg-[#090C17] border-[#1B2238] hover:border-slate-500 hover:bg-[#0D1120]"
                }`}
              >
                <div>
                  <div className="mb-3">{svc.icon}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {svc.category}
                  </div>
                  <div className="text-sm font-bold text-white mt-1 leading-snug">
                    {svc.title}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold">
                  <span className={isSelected ? "text-[#00F5D4]" : "text-slate-500"}>
                    {isSelected ? "Active View" : "Explore"}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ml-1 transition-transform ${
                      isSelected ? "translate-x-1 text-[#00F5D4]" : "text-slate-500"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Service Detailed Blueprint */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0B0E1B] border border-[#202742] shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#13182B] text-xs font-mono text-[#00F5D4] border border-[#232B48]">
                <span>DISCIPLINE {selectedService + 1} OF 5</span>
                <span>·</span>
                <span>{current.category.toUpperCase()}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {current.title}
              </h3>

              <p className="text-base text-slate-300 leading-relaxed font-light">
                {current.summary}
              </p>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Key Capabilities Delivered
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {current.details.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 rounded-lg bg-[#0E1222] border border-[#1E253E] text-xs text-slate-300"
                    >
                      <CheckCircle className="w-4 h-4 text-[#00F5D4] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111628] border border-[#232D4C] text-xs text-slate-300">
                <strong className="text-white">Ideal Application: </strong>
                {current.idealFor}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onLetsTalk(current.title)}
                  className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2"
                >
                  <span>Inquire about {current.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Interactive Synergy Multiplier Box */}
            <div className="lg:col-span-5 bg-[#080A14] border border-[#1F2742] rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A2035] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Service Synergy Calculator
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">1 + 1 = 3</span>
              </div>

              <p className="text-xs text-slate-400">
                Select any two services below to see how UGS connects them to create compounding business value:
              </p>

              {/* Selector row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    Primary Service
                  </label>
                  <select
                    value={synergyPair[0]}
                    onChange={(e) =>
                      setSynergyPair([Number(e.target.value), synergyPair[1]])
                    }
                    className="w-full bg-[#121628] border border-[#232C4A] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00F5D4]"
                  >
                    {services.map((s, i) => (
                      <option key={s.id} value={i}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    Paired Service
                  </label>
                  <select
                    value={synergyPair[1]}
                    onChange={(e) =>
                      setSynergyPair([synergyPair[0], Number(e.target.value)])
                    }
                    className="w-full bg-[#121628] border border-[#232C4A] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00F5D4]"
                  >
                    {services.map((s, i) => (
                      <option key={s.id} value={i} disabled={i === synergyPair[0]}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result banner */}
              <div className="p-4 rounded-lg bg-[#0F1426] border border-[#263152] space-y-2">
                <div className="text-[11px] font-semibold text-[#00F5D4] uppercase tracking-wider flex items-center gap-1.5">
                  <span>{services[synergyPair[0]].title}</span>
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span>{services[synergyPair[1]].title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {getSynergyExplanation(synergyPair[0], synergyPair[1])}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 text-center font-mono">
                Engineered with single-team accountability · Zero data loss
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
