import React, { useState } from "react";
import { X, CheckCircle, Shield, Building, Clock, ArrowRight } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const [facilityType, setFacilityType] = useState("Data Center");
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "AI Vision Surveillance",
    "Zero-Trust Access Control",
  ]);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleModule = (mod: string) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#121212] border border-border rounded-lg shadow-2xl p-6 sm:p-8 text-foreground">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Quote Request Received</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Our engineering team in Columbus, OH will review your architectural specifications for {company || "your facility"} and transmit a detailed proposal within 4 business hours.
            </p>
            <div className="bg-muted/40 p-4 rounded text-xs font-mono text-muted-foreground mb-6">
              Reference: STNL-{Math.floor(100000 + Math.random() * 900000)} · Tier-1 Security Review
            </div>
            <button
              onClick={handleReset}
              className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded text-sm hover:brightness-110 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Enterprise Quote Calculator
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Architect Your Security Matrix
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Select facility infrastructure to estimate deployment scope and receive an engineer-verified proposal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Facility Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Data Center",
                    "Industrial / Hub",
                    "HQ / Commercial",
                    "R&D Laboratory",
                    "Critical Logistics",
                    "Financial Vault",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFacilityType(type)}
                      className={`text-xs p-2 rounded border text-left transition-all ${
                        facilityType === type
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Required Subsystems
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "AI Vision Surveillance",
                    "Zero-Trust Access Control",
                    "Thermal Perimeter Defense",
                    "Autonomous Threat Escalation",
                  ].map((mod) => {
                    const active = selectedModules.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleModule(mod)}
                        className={`text-xs p-2 rounded border text-left transition-all flex items-center justify-between ${
                          active
                            ? "border-primary/80 bg-primary/10 text-primary font-medium"
                            : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{mod}</span>
                        <span className="text-[10px] opacity-70">
                          {active ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Aerospace"
                    className="w-full bg-secondary/60 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ciso@domain.com"
                    className="w-full bg-secondary/60 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Deployment turnaround: ~72-96 hrs</span>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  Generate Quote
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
