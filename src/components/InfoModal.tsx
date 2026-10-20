import React from "react";
import { X, Shield, Users, Phone, Cpu, FileCheck } from "lucide-react";

interface InfoModalProps {
  sectionId: string | null;
  onClose: () => void;
  onOpenQuote?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  sectionId,
  onClose,
  onOpenQuote,
}) => {
  if (!sectionId) return null;

  const contentMap: Record<
    string,
    { title: string; subtitle: string; icon: React.ReactNode; body: React.ReactNode }
  > = {
    services: {
      title: "Security Engineering Services",
      subtitle: "Full-lifecycle enterprise surveillance and physical access",
      icon: <Cpu className="w-5 h-5 text-primary" />,
      body: (
        <div className="space-y-4 text-sm text-foreground/90">
          <p>
            Sentinel AI builds custom, defense-grade physical security networks. We replace legacy DVRs, slow badge readers, and unmonitored gates with intelligent, edge-accelerated nodes.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="border border-border rounded p-3 bg-secondary/30">
              <div className="font-semibold text-foreground text-sm mb-1">
                AI Vision Surveillance
              </div>
              <p className="text-xs text-muted-foreground">
                High-frame-rate multi-spectral cameras running on-premise neural nets for anomaly classification and perimeter intrusion detection.
              </p>
            </div>
            <div className="border border-border rounded p-3 bg-secondary/30">
              <div className="font-semibold text-foreground text-sm mb-1">
                Zero-Trust Access Control
              </div>
              <p className="text-xs text-muted-foreground">
                Decoupled micro-segmentation, biometric turnstiles, optical speed gates, and smart airlocks with cryptographic revocation.
              </p>
            </div>
            <div className="border border-border rounded p-3 bg-secondary/30">
              <div className="font-semibold text-foreground text-sm mb-1">
                Rapid Deployment (Under 7 Days)
              </div>
              <p className="text-xs text-muted-foreground">
                Pre-configured hardware racks and modular edge gateways arrive on site fully validated, slashing deployment time from months to days.
              </p>
            </div>
            <div className="border border-border rounded p-3 bg-secondary/30">
              <div className="font-semibold text-foreground text-sm mb-1">
                Autonomous Failover & Telemetry
              </div>
              <p className="text-xs text-muted-foreground">
                Offline-first survivability. Local storage buffering, dual satellite/cellular failover, and zero external cloud exposure.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    "about-us": {
      title: "About Sentinel AI",
      subtitle: "Engineered in Columbus, Ohio. Built for maximum reliability.",
      icon: <Shield className="w-5 h-5 text-primary" />,
      body: (
        <div className="space-y-4 text-sm text-foreground/90">
          <p>
            Sentinel AI was founded on a singular conviction: enterprise physical security has been held hostage by slow legacy vendors, proprietary closed protocols, and brittle installations.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            We assemble systems right the first time. Our team blends aerospace-grade hardware testing with modern software development principles: automated testing, continuous telemetry, and zero-trust perimeter enforcement.
          </p>
          <div className="border-t border-border pt-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-secondary/30 rounded">
              <div className="text-lg font-bold text-primary font-mono">12</div>
              <div className="text-[10px] text-muted-foreground uppercase">Live Deployments</div>
            </div>
            <div className="p-2 bg-secondary/30 rounded">
              <div className="text-lg font-bold text-foreground font-mono">0ms</div>
              <div className="text-[10px] text-muted-foreground uppercase">Cloud Lag (Edge AI)</div>
            </div>
            <div className="p-2 bg-secondary/30 rounded">
              <div className="text-lg font-bold text-primary font-mono">100%</div>
              <div className="text-[10px] text-muted-foreground uppercase">Zero-Trust Audited</div>
            </div>
          </div>
        </div>
      ),
    },
    projects: {
      title: "Deployment Record",
      subtitle: "12 active enterprise systems across critical sectors",
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      body: (
        <div className="space-y-3 text-sm text-foreground/90">
          <p className="text-xs text-muted-foreground">
            From tier-IV data centers and pharmaceutical cleanrooms to intermodal logistics hubs, our hardware stands guard with zero unplanned downtime.
          </p>
          <ul className="space-y-2 text-xs">
            <li className="p-2 bg-secondary/30 rounded border border-border flex justify-between">
              <span><strong>BioTech Cleanroom:</strong> 42 AI vision nodes, 18 smart airlocks</span>
              <span className="text-primary font-mono">Active</span>
            </li>
            <li className="p-2 bg-secondary/30 rounded border border-border flex justify-between">
              <span><strong>Midwest Data Center:</strong> Sub-millisecond LiDAR tripwires</span>
              <span className="text-primary font-mono">Active</span>
            </li>
            <li className="p-2 bg-secondary/30 rounded border border-border flex justify-between">
              <span><strong>Logistics Terminal:</strong> 80 high-speed ANPR optical gantries</span>
              <span className="text-primary font-mono">Active</span>
            </li>
          </ul>
        </div>
      ),
    },
    team: {
      title: "Engineering Team",
      subtitle: "Specialists in vision systems, cryptography, and electrical integration",
      icon: <Users className="w-5 h-5 text-primary" />,
      body: (
        <div className="space-y-3 text-sm text-foreground/90">
          <p className="text-xs text-muted-foreground">
            Our multidisciplinary team unites veteran embedded hardware engineers, AI researchers, and certified enterprise physical security technicians.
          </p>
          <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-3 bg-secondary/30 rounded border border-border">
              <div className="font-semibold text-foreground">Marcus Sterling</div>
              <div className="text-[11px] text-primary">Head of Systems Architecture</div>
              <div className="text-[11px] text-muted-foreground mt-1">Ex-defense avionics & perimeter telemetry</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded border border-border">
              <div className="font-semibold text-foreground">Elena Rostova, PhD</div>
              <div className="text-[11px] text-primary">Principal Vision AI Engineer</div>
              <div className="text-[11px] text-muted-foreground mt-1">Low-latency embedded neural computer vision</div>
            </div>
          </div>
        </div>
      ),
    },
    contacts: {
      title: "Contact Sentinel AI",
      subtitle: "Headquartered in Columbus, Ohio · Direct Engineering Line",
      icon: <Phone className="w-5 h-5 text-primary" />,
      body: (
        <div className="space-y-4 text-sm text-foreground/90">
          <p className="text-xs text-muted-foreground">
            Get in touch directly with our deployment engineers for architectural reviews, on-site audits, and rapid quote estimations.
          </p>
          <div className="p-4 bg-secondary/40 border border-border rounded space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Headquarters:</span>
              <span className="text-foreground font-mono">Columbus, Ohio 43215</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Direct Desk:</span>
              <span className="text-foreground font-mono">+1 (614) 555-0198</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engineering Inquiries:</span>
              <span className="text-primary font-mono">systems@sentinelai.security</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Response SLA:</span>
              <span className="text-foreground">Under 4 hours</span>
            </div>
          </div>
        </div>
      ),
    },
  };

  const item = contentMap[sectionId] || contentMap.services;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121212] border border-border rounded-lg shadow-2xl p-6 sm:p-8 text-foreground">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          {item.icon}
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            {sectionId.replace("-", " ")}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          {item.title}
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          {item.subtitle}
        </p>

        <div className="mb-6">{item.body}</div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
          {onOpenQuote && (
            <button
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded text-xs hover:brightness-110 transition-all"
            >
              Get Custom Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
