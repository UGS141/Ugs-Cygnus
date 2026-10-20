import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialService ? [initialService] : ["Website Design & Development"]
  );
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");

  const allServices = [
    "Website Design & Development",
    "E-Commerce Stores",
    "SaaS Products",
    "Spreadsheet Integrations",
    "Digital Marketing",
  ];

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `UGS-${Math.floor(100000 + Math.random() * 900000)}`;
    setInquiryId(generatedId);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#07080F] border-t border-[#161B2C]">
      {/* Background illumination */}
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[350px] bg-gradient-to-t from-[#00F5D4]/10 via-[#3B82F6]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121626] border border-[#202742] text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Get in Touch
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Direct Engineering Line</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Let's Talk About <span className="ugs-gradient-text">Your Project</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Whether you are launching a new e-commerce storefront, building a custom SaaS platform, or automating manual spreadsheets, our team is ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0E1B] border border-[#1E253E] space-y-6">
              <h3 className="text-xl font-bold text-white">Direct Communication</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                You will speak directly with the engineers and designers who will plan and build your system. No multi-layered account reps or communication delays.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0E1222] border border-[#1E253E]">
                  <Mail className="w-4 h-4 text-[#00F5D4] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Direct Email</div>
                    <a
                      href="mailto:ugssolutions1@gmail.com"
                      className="text-white hover:text-[#00F5D4] transition-colors font-mono"
                    >
                      ugssolutions1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0E1222] border border-[#1E253E]">
                  <Phone className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Phone Hotline</div>
                    <span className="text-slate-300 font-mono">
                      [Phone Placeholder: +1 (XXX) XXX-XXXX]
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0E1222] border border-[#1E253E]">
                  <MapPin className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Headquarters / Office</div>
                    <span className="text-slate-300">
                      [Office / City Location Placeholder]
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#181E32] space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00F5D4]" />
                  <span>Prompt response within 1 business day</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  <span>NDAs respected for all proprietary workflows</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl bg-[#0B0E1B] border border-[#202742] shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center mx-auto text-[#00F5D4]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">Inquiry Received</h3>

                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, {name}. Our engineering team has received your project details for {company || "your organization"}. We will review your requirements and respond promptly.
                  </p>

                  <div className="p-3 bg-[#111628] rounded border border-[#222C4A] text-xs font-mono text-slate-400 inline-block">
                    Inquiry Reference: <span className="text-[#00F5D4]">{inquiryId}</span>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setMessage("");
                      }}
                      className="px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 hover:text-white transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full bg-[#111526] border border-[#232B45] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full bg-[#111526] border border-[#232B45] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Global Logistics"
                      className="w-full bg-[#111526] border border-[#232B45] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                    />
                  </div>

                  {/* Services Multi-Select Checkbox Pills */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wider">
                      Services of Interest (Select All That Apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allServices.map((svc) => {
                        const active = selectedServices.includes(svc);
                        return (
                          <button
                            key={svc}
                            type="button"
                            onClick={() => toggleService(svc)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              active
                                ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                                : "bg-[#101424] border-[#222942] text-slate-400 hover:text-white"
                            }`}
                          >
                            <span>{svc}</span>
                            <span className="ml-1.5 opacity-70">
                              {active ? "✓" : "+"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                      Project Details & Current Bottlenecks *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly describe what you are looking to build, current software or spreadsheet challenges, or desired timeline..."
                      className="w-full bg-[#111526] border border-[#232B45] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Direct engineering review · No sales spam
                    </span>
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2"
                    >
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
