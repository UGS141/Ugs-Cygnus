import React, { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import {
  CheckCircle2,
  Workflow,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  RefreshCw,
} from "lucide-react";

interface AboutUGSSectionProps {
  onLetsTalk: () => void;
  onExploreServices: () => void;
}

export const AboutUGSSection: React.FC<AboutUGSSectionProps> = ({
  onLetsTalk,
  onExploreServices,
}) => {
  const [activeTab, setActiveTab] = useState<"problems" | "ecosystem" | "methodology">("ecosystem");

  // The 4 Core Problems UGS Solves
  const businessProblems = [
    {
      title: "Vendor Fragmentation & Finger-Pointing",
      problem:
        "Businesses often hire a web design studio, a separate e-commerce agency, a freelance software developer, and an isolated marketing consultant. When an integration breaks, nobody takes ownership.",
      solution:
        "UGS provides single-team accountability across design, code, data integrations, and marketing funnels so everything runs seamlessly as one engine.",
    },
    {
      title: "Manual Spreadsheets & Data Bottlenecks",
      problem:
        "Vital sales, order, inventory, or lead information is copied by hand between software tools and spreadsheets, causing human errors, stockouts, and administrative fatigue.",
      solution:
        "We engineer automated bi-directional bridges between your websites, CRMs, and spreadsheets (Google Sheets / Excel) to eliminate redundant data entry.",
    },
    {
      title: "Websites That Look Nice But Don't Convert",
      problem:
        "Generic template websites look polished on the surface but suffer from slow load speeds, convoluted checkout flows, and zero connection to business operations.",
      solution:
        "We build bespoke, blazing-fast digital touchpoints engineered around user psychology, clear conversion paths, and live operational feedback.",
    },
    {
      title: "Software Products That Fail to Scale",
      problem:
        "Custom internal portals and SaaS applications are built without scalable architecture, creating technical debt that stalls business expansion.",
      solution:
        "We architect robust, secure, multi-tenant web applications and client portals designed to handle growing transaction volumes effortlessly.",
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#07080F] border-t border-[#151928]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#00F5D4]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121626] border border-[#222B48] text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="font-semibold uppercase tracking-wider text-slate-300">About UGS</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Our Mission & Principles</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Connecting Digital Frontends with{" "}
            <span className="ugs-gradient-text">Real Business Operations</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            UGS (Universal Global Solutions) was built to solve a critical challenge: helping companies unify their customer-facing digital presence with internal software, automated spreadsheets, and growth marketing.
          </p>
        </div>

        {/* Narrative Pillars: 3-Zone Interactive Showcase */}
        <div className="bg-[#0B0D18] border border-[#1E253E] rounded-2xl p-6 sm:p-10 shadow-2xl">
          {/* Tab selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-8 border-b border-[#1A2035]">
            <button
              type="button"
              onClick={() => setActiveTab("ecosystem")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "ecosystem"
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                  : "bg-[#111524] text-slate-400 hover:text-white border border-[#1E243A]"
              }`}
            >
              1. The Unified Ecosystem Model
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("problems")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "problems"
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                  : "bg-[#111524] text-slate-400 hover:text-white border border-[#1E243A]"
              }`}
            >
              2. Problems We Solve
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("methodology")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "methodology"
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                  : "bg-[#111524] text-slate-400 hover:text-white border border-[#1E243A]"
              }`}
            >
              3. How We Work With Clients
            </button>
          </div>

          {/* Tab Content 1: The Unified Ecosystem Model */}
          {activeTab === "ecosystem" && (
            <div className="pt-8 space-y-8 animate-fade-in">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs uppercase tracking-widest text-[#00F5D4] font-semibold">
                    The 5-Pillar Architecture
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    How We Bring All Five Disciplines Together
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Most companies treat marketing, web design, store checkouts, software, and spreadsheets as five completely different worlds. At UGS, we design them as a continuous flywheel where each component reinforces the next.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-300 pt-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00F5D4] shrink-0 mt-0.5" />
                      <span><strong>Marketing</strong> delivers qualified traffic to customized conversion funnels.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span><strong>Websites & E-Commerce</strong> capture orders, inquiries, and customer data cleanly.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span><strong>SaaS Products & Portals</strong> automate fulfillment, customer management, and operations.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00F5D4] shrink-0 mt-0.5" />
                      <span><strong>Spreadsheet Integrations</strong> sync real-time metrics back to your leadership teams.</span>
                    </li>
                  </ul>
                </div>

                {/* Visual Interconnected Ecosystem Diagram */}
                <div className="lg:col-span-7 bg-[#070810] border border-[#1E253E] rounded-xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="text-xs font-mono text-slate-500 mb-6 flex justify-between items-center">
                    <span>SYSTEM ARCHITECTURE DIAGRAM</span>
                    <span className="text-[#00F5D4]">ZERO SILOS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-[#0F1322] border border-[#232B45] hover:border-[#8B5CF6] transition-colors">
                      <div className="text-xs font-semibold text-[#8B5CF6] uppercase mb-1">Layer 01: Inbound</div>
                      <div className="text-sm font-bold text-white">Digital Marketing & Growth</div>
                      <p className="text-xs text-slate-400 mt-1">SEO, PPC, Funnels & Campaign Telemetry</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0F1322] border border-[#232B45] hover:border-[#38BDF8] transition-colors">
                      <div className="text-xs font-semibold text-[#38BDF8] uppercase mb-1">Layer 02: Presentation</div>
                      <div className="text-sm font-bold text-white">Web Design & E-Commerce</div>
                      <p className="text-xs text-slate-400 mt-1">Responsive UI, Ultra-fast Checkout & High Trust</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0F1322] border border-[#232B45] hover:border-[#00F5D4] transition-colors">
                      <div className="text-xs font-semibold text-[#00F5D4] uppercase mb-1">Layer 03: Operations</div>
                      <div className="text-sm font-bold text-white">SaaS & Client Portals</div>
                      <p className="text-xs text-slate-400 mt-1">Custom business logic, user auth, and workflows</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0F1322] border border-[#232B45] hover:border-[#60A5FA] transition-colors">
                      <div className="text-xs font-semibold text-[#60A5FA] uppercase mb-1">Layer 04: Automation</div>
                      <div className="text-sm font-bold text-white">Spreadsheet & API Bridges</div>
                      <p className="text-xs text-slate-400 mt-1">Google Sheets, Excel, Webhooks, Zero Manual Retyping</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#8B5CF6]/15 via-[#3B82F6]/15 to-[#00F5D4]/15 border border-[#252E4C] text-center text-xs text-slate-300">
                    Continuous feedback loop with unified reporting and zero administrative friction.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Business Problems We Solve */}
          {activeTab === "problems" && (
            <div className="pt-8 space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                {businessProblems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-[#0E1222] border border-[#1F2742] space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">
                      <span>Problem {idx + 1}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{item.title}</span>
                    </div>

                    <div className="p-3 rounded bg-red-950/20 border border-red-900/30 text-xs text-red-200/90 leading-relaxed">
                      <strong className="text-red-300">The Friction: </strong>
                      {item.problem}
                    </div>

                    <div className="p-3 rounded bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-xs text-slate-200 leading-relaxed">
                      <strong className="text-[#00F5D4]">How UGS Fixes It: </strong>
                      {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: How We Work With Clients */}
          {activeTab === "methodology" && (
            <div className="pt-8 space-y-6 animate-fade-in">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: "01",
                    title: "Deep Need Audit",
                    desc: "We study your current business operations, software subscriptions, spreadsheet layouts, and customer journeys to locate root bottlenecks.",
                  },
                  {
                    step: "02",
                    title: "Unified Blueprint",
                    desc: "We design clean interfaces and architect integration bridges so data moves automatically without manual copy-pasting.",
                  },
                  {
                    step: "03",
                    title: "Bespoke Engineering",
                    desc: "We develop production-grade code, test checkout conversions, integrate APIs, and configure secure spreadsheets.",
                  },
                  {
                    step: "04",
                    title: "Launch & Refinement",
                    desc: "We deploy smoothly, train your staff, monitor telemetry, and iteratively enhance features as your revenue grows.",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="p-5 rounded-xl bg-[#0E1222] border border-[#1F2742] relative flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#00F5D4] font-mono">
                        {s.step}
                      </span>
                      <h4 className="text-base font-bold text-white mt-2 mb-2">{s.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                      Transparent timelines · Direct engineer access
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Why Contact UGS - Value Proposition Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#090C16] border border-[#1A2137] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero Vendor Overhead</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminate the frustration of coordinating between four distinct agencies. UGS unifies designers, engineers, workflow specialists, and marketers under one roof.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#090C16] border border-[#1A2137] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Customized for Your Workflow</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never force your team to abandon familiar spreadsheets or bend your business into rigid templates. We build custom integrations that adapt to how you work.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#090C16] border border-[#1A2137] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#00F5D4]/15 border border-[#00F5D4]/30 flex items-center justify-center text-[#00F5D4]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Clear, Measurable Outcomes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our priority is your bottom line—faster page loads, higher conversion rates, zero manual data entry errors, and predictable customer acquisition.
            </p>
          </div>
        </div>

        {/* Call To Action Banner */}
        <div className="rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-[#111425] via-[#0E1220] to-[#0D161F] border border-[#212A45] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to streamline your digital operations?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Tell us about your current digital setup, software pain points, or upcoming project. We'll map a concrete architectural proposal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onLetsTalk}
              className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,245,212,0.3)]"
            >
              Let's talk
            </button>
            <button
              type="button"
              onClick={onExploreServices}
              className="px-5 py-3 rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-[#222B48] bg-[#111524] transition-colors cursor-pointer"
            >
              View Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUGSSection;
