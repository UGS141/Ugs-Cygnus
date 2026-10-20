import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Compass, RefreshCw } from "lucide-react";

interface NodeItem {
  id: string;
  label: string;
  category: string;
  color: string;
  glow: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  va: number;
  isDragging?: boolean;
}

interface AntigravityCanvasProps {
  onSelectService?: (serviceName: string) => void;
  className?: string;
}

export const AntigravityCanvas: React.FC<AntigravityCanvasProps> = ({
  onSelectService,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zeroGMode, setZeroGMode] = useState<boolean>(true);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Mutable animation state
  const stateRef = useRef<{
    nodes: NodeItem[];
    particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      hue: number;
    }>;
    mouse: { x: number; y: number; isDown: boolean; dragNodeIndex: number | null };
    gravity: number;
    damping: number;
    animFrame: number | null;
  }>({
    nodes: [],
    particles: [],
    mouse: { x: -1000, y: -1000, isDown: false, dragNodeIndex: null },
    gravity: 0,
    damping: 0.985,
    animFrame: null,
  });

  useEffect(() => {
    stateRef.current.gravity = zeroGMode ? 0 : 0.28;
    stateRef.current.damping = zeroGMode ? 0.992 : 0.96;
  }, [zeroGMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initial 5 primary services as interactive physical floating nodes
    const initialServices = [
      {
        id: "web",
        label: "Website Design & Dev",
        category: "Digital Presence",
        color: "#00F5D4",
        glow: "rgba(0, 245, 212, 0.4)",
      },
      {
        id: "ecom",
        label: "E-Commerce Stores",
        category: "Conversion Engines",
        color: "#38BDF8",
        glow: "rgba(56, 189, 248, 0.4)",
      },
      {
        id: "saas",
        label: "SaaS Products",
        category: "Custom Cloud Software",
        color: "#8B5CF6",
        glow: "rgba(139, 92, 246, 0.4)",
      },
      {
        id: "workflow",
        label: "Spreadsheet Integrations",
        category: "Business Automation",
        color: "#06B6D4",
        glow: "rgba(6, 182, 212, 0.4)",
      },
      {
        id: "marketing",
        label: "Digital Marketing",
        category: "Growth & Telemetry",
        color: "#60A5FA",
        glow: "rgba(96, 165, 250, 0.4)",
      },
    ];

    stateRef.current.nodes = initialServices.map((svc, i) => {
      const spread = width / (initialServices.length + 1);
      return {
        ...svc,
        x: spread * (i + 1) + (Math.random() - 0.5) * 40,
        y: height * 0.45 + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        width: 170,
        height: 64,
        angle: (Math.random() - 0.5) * 0.1,
        va: (Math.random() - 0.5) * 0.005,
      };
    });

    // Ambient floating stardust particles
    stateRef.current.particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      hue: [172, 217, 262][Math.floor(Math.random() * 3)],
    }));

    // Mouse tracking & dragging handlers
    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handlePointerDown = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      stateRef.current.mouse.x = x;
      stateRef.current.mouse.y = y;
      stateRef.current.mouse.isDown = true;

      // Check node hit
      const nodes = stateRef.current.nodes;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (
          x >= n.x - n.width / 2 &&
          x <= n.x + n.width / 2 &&
          y >= n.y - n.height / 2 &&
          y <= n.y + n.height / 2
        ) {
          stateRef.current.mouse.dragNodeIndex = i;
          setActiveNode(n.id);
          if (onSelectService) onSelectService(n.label);
          break;
        }
      }
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      stateRef.current.mouse.x = x;
      stateRef.current.mouse.y = y;

      const dragIdx = stateRef.current.mouse.dragNodeIndex;
      if (dragIdx !== null && stateRef.current.mouse.isDown) {
        const n = stateRef.current.nodes[dragIdx];
        if (n) {
          n.vx = (x - n.x) * 0.25;
          n.vy = (y - n.y) * 0.25;
          n.x = x;
          n.y = y;
        }
      }
    };

    const handlePointerUp = () => {
      stateRef.current.mouse.isDown = false;
      stateRef.current.mouse.dragNodeIndex = null;
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handlePointerUp();

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Physics Animation Loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting laser filaments between nearby services
      const nodes = stateRef.current.nodes;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 320) {
            const alpha = (1 - dist / 320) * 0.25;
            const grad = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y
            );
            grad.addColorStop(0, nodes[i].glow);
            grad.addColorStop(1, nodes[j].glow);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // 2. Render stardust particles
      const particles = stateRef.current.particles;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Update & render physical nodes
      const { gravity, damping } = stateRef.current;
      const dragIdx = stateRef.current.mouse.dragNodeIndex;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (i !== dragIdx) {
          // Apply gravity (if enabled) or gentle zero-g orbital float
          n.vy += gravity;

          // Zero-G gentle buoyancy
          if (gravity === 0) {
            n.vx += (Math.random() - 0.5) * 0.04;
            n.vy += (Math.random() - 0.5) * 0.04;
          }

          // Gentle mouse cursor repulsion / field influence
          const mdx = n.x - stateRef.current.mouse.x;
          const mdy = n.y - stateRef.current.mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 160 && mDist > 0) {
            const force = (1 - mDist / 160) * 1.5;
            n.vx += (mdx / mDist) * force;
            n.vy += (mdy / mDist) * force;
          }

          // Damping
          n.vx *= damping;
          n.vy *= damping;

          // Position integration
          n.x += n.vx;
          n.y += n.vy;

          // Gentle rotation
          n.angle += n.va;
          n.va *= 0.98;

          // Screen boundaries with elastic bounce
          const padX = n.width / 2 + 10;
          const padY = n.height / 2 + 10;

          if (n.x < padX) {
            n.x = padX;
            n.vx = Math.abs(n.vx) * 0.7;
          } else if (n.x > width - padX) {
            n.x = width - padX;
            n.vx = -Math.abs(n.vx) * 0.7;
          }

          if (n.y < padY) {
            n.y = padY;
            n.vy = Math.abs(n.vy) * 0.7;
          } else if (n.y > height - padY) {
            n.y = height - padY;
            n.vy = -Math.abs(n.vy) * 0.65;
            n.vx *= 0.92; // floor friction
          }
        }

        // Render sleek Antigravity card for node
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.angle);

        const hw = n.width / 2;
        const hh = n.height / 2;
        const radius = 12;

        // Background shadow / glow
        ctx.shadowColor = n.glow;
        ctx.shadowBlur = 18;
        ctx.fillStyle = "rgba(13, 16, 28, 0.92)";
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.2;

        // Rounded card path
        ctx.beginPath();
        ctx.roundRect(-hw, -hh, n.width, n.height, radius);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0; // reset shadow for text

        // Category micro-header
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.font = "600 9px 'Sora', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(n.category.toUpperCase(), -hw + 14, -hh + 22);

        // Service label
        ctx.fillStyle = "#F8FAFC";
        ctx.font = "bold 12px 'Sora', sans-serif";
        ctx.fillText(n.label, -hw + 14, -hh + 42);

        // Leading indicator dot with UGS accent
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(hw - 16, -hh + 22, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      stateRef.current.animFrame = requestAnimationFrame(loop);
    };

    stateRef.current.animFrame = requestAnimationFrame(loop);

    return () => {
      if (stateRef.current.animFrame) cancelAnimationFrame(stateRef.current.animFrame);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const resetPositions = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const nodes = stateRef.current.nodes;
    const spread = width / (nodes.length + 1);

    nodes.forEach((n, i) => {
      n.x = spread * (i + 1);
      n.y = height * 0.45 + (Math.random() - 0.5) * 80;
      n.vx = (Math.random() - 0.5) * 1.5;
      n.vy = (Math.random() - 0.5) * 1.5;
      n.angle = 0;
      n.va = 0;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden border border-[#1E2438] bg-[#07080F]/90 backdrop-blur-md ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Futuristic Antigravity HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0C0E1A]/85 border border-[#1F263E] rounded-full px-3.5 py-1.5 text-xs backdrop-blur-md pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
          <span className="text-slate-300 font-medium">Kinetic Antigravity System</span>
          <span className="text-slate-500 hidden sm:inline">· Drag & toss nodes</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setZeroGMode(!zeroGMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 backdrop-blur-md ${
              zeroGMode
                ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{zeroGMode ? "Zero-G: Float" : "Normal Gravity"}</span>
          </button>

          <button
            type="button"
            onClick={resetPositions}
            title="Reset Node Constellation"
            className="p-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all backdrop-blur-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom instructional ticker */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 pointer-events-none">
        <span>Interconnected UGS Service Constellation</span>
        <span className="hidden sm:inline">Click any node to inspect capabilities</span>
      </div>
    </div>
  );
};

export default AntigravityCanvas;
