import React, { useState } from "react";
import { Search, Compass, Terminal, Rocket, CheckCircle2, ArrowRight } from "lucide-react";

interface ProcessSectionProps {
  onLetsTalk: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onLetsTalk }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "01",
      name: "Discovery & Needs",
      tagline: "We listen first, understand your operations, and locate real bottlenecks.",
      icon: <Search className="w-5 h-5 text-[#8B5CF6]" />,
      accent: "#8B5CF6",
      activities: [
        "Audit existing software tools, spreadsheets, and manual administrative tasks",
        "Map customer purchase and lead qualification journeys",
        "Clarify business goals, key performance indicators, and timelines",
        "Define technical constraints and data privacy requirements",
      ],
      deliverable: "Operational Assessment & Project Scope Blueprint",
    },
    {
      step: "02",
      name: "Architecture & Design",
      tagline: "We design intuitive user experiences and plan robust data integrations.",
      icon: <Compass className="w-5 h-5 text-[#38BDF8]" />,
      accent: "#38BDF8",
      activities: [
        "Craft bespoke responsive wireframes and interactive UI mockups",
        "Architect database schemas, API connections, and spreadsheet sync logic",
        "Establish design systems aligned with your brand guidelines",
        "Review interface prototypes with your team before writing production code",
      ],
      deliverable: "Interactive Design Prototypes & Technical Architecture Specification",
    },
    {
      step: "03",
      name: "Build & Integrate",
      tagline: "We develop production-grade code, wire spreadsheets, and test rigorously.",
      icon: <Terminal className="w-5 h-5 text-[#00F5D4]" />,
      accent: "#00F5D4",
      activities: [
        "Implement modern frontend code with fast sub-second load times",
        "Configure custom backend logic, secure checkouts, and user auth",
        "Build bi-directional bridges to Google Sheets, Excel, and CRMs",
        "Perform comprehensive cross-device, security, and edge-case testing",
      ],
      deliverable: "Fully Functioning Staging Environment & Integration Verifications",
    },
    {
      step: "04",
      name: "Launch & Improve",
      tagline: "We deploy smoothly, train your staff, and continuously refine performance.",
      icon: <Rocket className="w-5 h-5 text-[#60A5FA]" />,
      accent: "#60A5FA",
      activities: [
        "Execute zero-downtime production deployment with telemetry monitoring",
        "Conduct hands-on training sessions for your operational team",
        "Monitor real-time user behavior, funnel drop-offs, and performance logs",
        "Iterate on features and conversion optimizations as your business expands",
      ],
      deliverable: "Live Production System, Team Documentation & Ongoing Support SLA",
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="process" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#06070B] border-t border-[#161B2C]">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-[#00F5D4]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121626] border border-[#202742] text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Methodology
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">How We Work</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            A Clear, Disciplined{" "}
            <span className="ugs-gradient-text">Delivery Process</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            No jargon. No black-box development. We partner closely with your team through four transparent stages to guarantee that what we build directly serves your business goals.
          </p>
        </div>

        {/* 4-Step Progress Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-[#0F1426] border-[#00F5D4] shadow-[0_0_20px_rgba(0,245,212,0.2)]"
                    : "bg-[#090C16] border-[#1A2138] hover:border-slate-500 hover:bg-[#0D1120]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#00F5D4]">
                    {s.step}
                  </span>
                  <div>{s.icon}</div>
                </div>

                <div className="text-sm font-bold text-white mb-1">{s.name}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{s.tagline}</p>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0B0E1B] border border-[#202742] shadow-2xl relative">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#13182C] text-xs font-mono text-[#00F5D4] border border-[#222A48]">
                <span>STAGE {current.step}</span>
                <span>·</span>
                <span>{current.name.toUpperCase()}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {current.name}
              </h3>

              <p className="text-base text-slate-300 font-light leading-relaxed">
                {current.tagline}
              </p>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Activities Conducted During This Phase:
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {current.activities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-[#0E1222] border border-[#1E253E] text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00F5D4] shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deliverable Box */}
            <div className="md:col-span-5 bg-[#080A14] border border-[#1E253E] rounded-xl p-6 space-y-5">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                Guaranteed Phase Deliverable
              </div>

              <div className="p-4 rounded-lg bg-[#111628] border border-[#242D4C] space-y-2">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
                  <span>{current.deliverable}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every stage concludes with tangible artifacts and clear sign-off before advancing to the next milestone.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-[#1A2035]">
                <div className="flex justify-between">
                  <span>Client Inquiries Response:</span>
                  <span className="text-slate-200">Same Business Day</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Updates:</span>
                  <span className="text-slate-200">Weekly Live Demo & Telemetry</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLetsTalk}
                className="w-full py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)] flex items-center justify-center gap-2"
              >
                <span>Initiate Stage 01 Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
