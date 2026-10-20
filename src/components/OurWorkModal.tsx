import React, { useState } from "react";
import { X, ShieldCheck, Check, Server, Eye, Lock, ArrowUpRight } from "lucide-react";

interface OurWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: string) => void;
}

export const OurWorkModal: React.FC<OurWorkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const deployments = [
    {
      title: "Columbus BioTech Center",
      location: "Columbus, OH",
      type: "Bio-containment & High-Security R&D",
      scope: "68,000 sq ft · 42 AI Edge Cameras · 18 Smart Airlocks",
      stats: "0 False Breaches · 100% Zero-Trust Audit Passed",
      overview:
        "Full installation of neural computer vision nodes monitoring cleanrooms, biometric interlock vestibules, and automated perimeter thermal triggers.",
      tags: ["Vision AI", "Smart Airlocks", "Zero-Trust"],
    },
    {
      title: "Midwest HyperScale Facility",
      location: "New Albany, OH",
      type: "Tier-IV Data Center",
      scope: "140,000 sq ft · Sub-millisecond Optical Tripwires",
      stats: "99.999% Telemetry Uptime · Zero Hardware Drift",
      overview:
        "Multi-layered physical authentication grid with LiDAR intrusion corridors, vehicle license plate classification, and redundant biometric server pod cages.",
      tags: ["LiDAR Defense", "Biometric Vault", "Failover Telemetry"],
    },
    {
      title: "Great Lakes Terminal 4",
      location: "Cleveland, OH",
      type: "Autonomous Freight & Logistics Depot",
      scope: "210,000 sq ft · 80 High-Speed ANPR Vision Gantries",
      stats: "3.4s Container Clearance · Zero Unauthorized Incursions",
      overview:
        "Automated gate access control running real-time optical container OCR, thermal perimeter scanning, and encrypted driver biometric verification.",
      tags: ["High-Speed OCR", "Perimeter Radar", "Turnstile Control"],
    },
    {
      title: "Scioto Valley Financial Reserve",
      location: "Columbus, OH",
      type: "Private Banking & High-Value Vaults",
      scope: "34,000 sq ft · Quantum-Resistant Encrypted Access Nodes",
      stats: "SOC 2 Type II Certified · Underwriters Labs Listed",
      overview:
        "Zero-latency intrusion detection equipped with seismic perimeter vibration sensors, facial liveness verification, and autonomous law-enforcement dispatch protocols.",
      tags: ["Seismic Sensors", "Facial Liveness", "Automated Dispatch"],
    },
  ];

  const current = deployments[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#121212] border border-border rounded-lg shadow-2xl p-6 sm:p-8 text-foreground max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Field Implementations · 12 Systems Deployed
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Enterprise Security Architectures in Production
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Every deployment is customized from raw silicon and edge optics to strict zero-trust network isolation.
        </p>

        {/* Project Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {deployments.map((d, index) => (
            <button
              key={d.title}
              onClick={() => setActiveTab(index)}
              className={`text-xs p-2.5 rounded border text-left transition-all ${
                activeTab === index
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="truncate font-medium">{d.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{d.location}</div>
            </button>
          ))}
        </div>

        {/* Active Deployment Details */}
        <div className="bg-secondary/30 border border-border rounded-lg p-5 mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                {current.title}
                <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono font-normal">
                  {current.location}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{current.type}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-primary font-semibold">
                {current.stats}
              </span>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">
            {current.overview}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-background/40 border border-border/50 rounded p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                Hardware & Infrastructure Scope
              </div>
              <div className="text-xs text-foreground font-mono">
                {current.scope}
              </div>
            </div>
            <div className="bg-background/40 border border-border/50 rounded p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                Integrated Capabilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-secondary text-foreground/80 px-2 py-0.5 rounded border border-border/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border pt-4">
          <span>All 12 systems engineered and maintained from Columbus, OH</span>
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded text-xs hover:brightness-110 transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OurWorkModal;
