import React, { useState } from "react";
import { X, Calendar, CheckCircle, Clock, Video } from "lucide-react";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookCallModal: React.FC<BookCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedTime, setSelectedTime] = useState("10:00 AM EST");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Discovery Call Confirmed</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
              A private calendar link with meeting credentials has been dispatched to {email}.
            </p>
            <div className="bg-secondary/40 border border-border rounded p-4 text-xs space-y-1 mb-6 text-left">
              <div className="flex justify-between text-muted-foreground">
                <span>Date:</span>
                <span className="text-foreground font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Time:</span>
                <span className="text-foreground font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Host:</span>
                <span className="text-primary font-medium">Principal Security Architect, Sentinel AI</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded text-sm hover:brightness-110 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Architecture Consultation
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Book a Zero-Trust Discovery Call
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Connect directly with our lead hardware and vision engineers to assess your physical perimeter, access hierarchy, and compliance scope.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Today, 3 PM", "Tomorrow", "Thursday"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`text-xs p-2 rounded border text-center transition-all ${
                        selectedDate === d
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["10:00 AM EST", "02:00 PM EST", "04:30 PM EST"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`text-xs p-2 rounded border text-center transition-all ${
                        selectedTime === t
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full bg-secondary/60 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@enterprise.com"
                  className="w-full bg-secondary/60 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  30 min · Video or Phone call
                </span>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded text-sm hover:brightness-110 active:scale-95 transition-all"
                >
                  Schedule Call
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCallModal;
