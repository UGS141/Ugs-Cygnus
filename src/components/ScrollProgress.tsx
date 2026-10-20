import React, { useEffect, useState } from "react";

/**
 * Subtle horizontal progress bar at the very top of the viewport
 * that fills dynamically as the user scrolls down the landing page.
 * Styled with the UGS signature violet-to-cyan gradient and glowing tip.
 */
export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-black/40 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] transition-[width] duration-75 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Subtle luminous glow at the leading edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-3 bg-[#00F5D4] rounded-full blur-[3px] opacity-80" />
      </div>
    </div>
  );
};

export default ScrollProgress;
