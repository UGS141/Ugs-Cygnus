import React, { useState } from "react";
import { ArrowUpRight, FolderGit2, X, CheckCircle, ExternalLink } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  clientPlaceholder: string;
  serviceCategory: string;
  problem: string;
  solution: string;
  outcomePlaceholder: string;
  tags: string[];
}

interface FeaturedProjectsSectionProps {
  onLetsTalk: (projectName?: string) => void;
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  onLetsTalk,
}) => {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Case studies structured with clearly marked placeholders (No invented clients or results)
  const projects: ProjectItem[] = [
    {
      id: "project-01",
      title: "[E-Commerce Storefront & Real-Time Inventory Bridge]",
      clientPlaceholder: "[Retail & Consumer Goods Client Placeholder]",
      serviceCategory: "E-Commerce & Spreadsheet Integrations",
      problem:
        "The client operated multiple sales channels with separate stock counts. Staff manually updated spreadsheets twice daily, resulting in accidental overselling, customer support tickets, and shipping delays.",
      solution:
        "UGS engineered a high-speed custom storefront connected directly to a centralized inventory synchronization bridge. Orders immediately reserve stock in real-time Google Sheets and alert warehouse personnel via automated dispatch hooks.",
      outcomePlaceholder:
        "[Verified Metric Placeholder: e.g. Zero stockout cancellations & automated order routing]",
      tags: ["E-Commerce", "Google Sheets Sync", "Payment Gateways", "Order Automation"],
    },
    {
      id: "project-02",
      title: "[B2B Client Portal & Automated Subscription Billing]",
      clientPlaceholder: "[Corporate Services & Logistics Client Placeholder]",
      serviceCategory: "SaaS Products & Workflow Systems",
      problem:
        "Corporate accounts were invoiced manually through email attachments and PDF generation. Clients lacked visibility into active service utilization, causing delayed receivables and repetitive administrative calls.",
      solution:
        "UGS built a secure, multi-tenant B2B client portal featuring role-based team management, real-time usage metrics, self-service invoice settlement, and automatic payment reminders.",
      outcomePlaceholder:
        "[Verified Metric Placeholder: e.g. 70% reduction in billing inquiries & faster settlement]",
      tags: ["SaaS Web App", "RBAC Authentication", "Automated Billing", "Client Dashboard"],
    },
    {
      id: "project-03",
      title: "[Brand Web Platform & Conversion Funnel Redesign]",
      clientPlaceholder: "[Professional Services & Consulting Client Placeholder]",
      serviceCategory: "Website Design & Digital Marketing",
      problem:
        "An outdated template website loaded in over 4.5 seconds on mobile devices and failed to communicate the company's premium positioning, causing high visitor bounce rates and low lead volume.",
      solution:
        "UGS designed and built a bespoke, responsive web application with sub-second performance, refined typography, interactive service calculators, and direct lead qualification forms.",
      outcomePlaceholder:
        "[Verified Metric Placeholder: e.g. Significant increase in qualified consultation bookings]",
      tags: ["Web Design", "Responsive UI", "Lead Qualification", "CRO Funnel"],
    },
    {
      id: "project-04",
      title: "[Warehouse Mobile Dispatch & Live Spreadsheet Integration]",
      clientPlaceholder: "[Wholesale Distribution & Supply Client Placeholder]",
      serviceCategory: "Workflow & Spreadsheet Integrations",
      problem:
        "Fulfillment teams relied on paper packing slips and shared desktop files, causing bottlenecks during peak shifts and frequent data transcription errors.",
      solution:
        "UGS deployed a lightweight, mobile-first barcode and status logging interface that reads and writes directly to internal spreadsheets without requiring expensive ERP software licenses.",
      outcomePlaceholder:
        "[Verified Metric Placeholder: e.g. Same-day dispatch turnaround & zero transcription errors]",
      tags: ["Spreadsheet Bridge", "Mobile Web App", "Barcode Scanning", "Workflow Automation"],
    },
  ];

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#07080F] border-t border-[#161B2C]">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1A2035] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121626] border border-[#202742] text-xs text-slate-300">
              <FolderGit2 className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Case Study Blueprints
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Architectural Record</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Featured <span className="ugs-gradient-text">Project Architecture</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Explore how we architect real-world solutions across e-commerce, custom SaaS, web development, and spreadsheet workflows. All placeholders are clearly indicated ready for real verified case studies.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onLetsTalk()}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#101426] border border-[#222B48] text-slate-200 hover:text-white hover:border-[#00F5D4] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Discuss Your Project</span>
              <ArrowUpRight className="w-4 h-4 text-[#00F5D4]" />
            </button>
          </div>
        </div>

        {/* 2x2 Grid of Featured Projects */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#0B0E1B] border border-[#1E253E] hover:border-[#38BDF8]/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer ugs-card-glow"
              onClick={() => setActiveProject(project)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[#00F5D4] uppercase tracking-wider">
                    {project.serviceCategory}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-white transition-colors flex items-center gap-1">
                    Details
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00F5D4]" />
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                  {project.title}
                </h3>

                <div className="p-2.5 rounded bg-[#101526] border border-[#202946] text-xs font-mono text-slate-400">
                  <span className="text-slate-500">Client: </span>
                  {project.clientPlaceholder}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {project.solution}
                </p>

                {/* Outcome placeholder badge */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#8B5CF6]/10 via-[#3B82F6]/10 to-[#00F5D4]/10 border border-[#232D4C] text-xs text-slate-200 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span className="truncate">{project.outcomePlaceholder}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6 pt-4 border-t border-[#181E32] flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-[#121629] text-slate-400 px-2.5 py-1 rounded border border-[#202844]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Project Inspector Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0C0F1E] border border-[#222B48] rounded-2xl shadow-2xl p-6 sm:p-8 text-foreground max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono">
                  {activeProject.serviceCategory}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {activeProject.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Partner: {activeProject.clientPlaceholder}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 space-y-1.5">
                <div className="text-xs font-semibold text-red-300 uppercase tracking-wider">
                  The Operational Challenge
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeProject.problem}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#00F5D4]/10 border border-[#00F5D4]/30 space-y-1.5">
                <div className="text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">
                  The Engineered Solution
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeProject.solution}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111628] border border-[#222C4A] space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Verified Outcome (Placeholder for Live Data)
                </div>
                <p className="text-xs text-[#38BDF8] font-mono">
                  {activeProject.outcomePlaceholder}
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Technical Architecture Components
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#141A30] text-slate-300 px-3 py-1 rounded border border-[#252F52]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1C233A] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = activeProject.title;
                    setActiveProject(null);
                    onLetsTalk(title);
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]"
                >
                  Start a Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProjectsSection;
