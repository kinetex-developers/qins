"use client";

import { useEffect, useRef, useState } from "react";
import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Bridge Lattice Canvas ────────────────────────────────────────────────────
function BridgeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const isMobile = () => W() < 640;

    const resize = () => {
      canvas.width  = W() * window.devicePixelRatio;
      canvas.height = H() * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node { x:number; y:number; vx:number; vy:number; r:number; phase:number; type: "primary"|"secondary" }
    // Fewer nodes on mobile for performance
    const nodeCount = () => isMobile() ? 28 : 48;
    const nodes: Node[] = Array.from({ length: 48 }, (_, i) => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.5, phase: Math.random() * Math.PI * 2,
      type: i < 12 ? "primary" : "secondary",
    }));

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W(), H());

      const mobile = isMobile();
      const count = mobile ? 28 : 48;
      const connDist = mobile ? 120 : 160;

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < connDist) {
            const alpha = (1 - dist / connDist) * 0.3;
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + nodes[i].phase);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(90,138,168,${alpha * pulse})`;
            ctx.lineWidth = 0.7;
            ctx.setLineDash([4, 8]);
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      nodes.slice(0, count).forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.8 + n.phase);

        if (n.type === "primary") {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
          grd.addColorStop(0, `rgba(90,160,200,${0.9 * pulse})`);
          grd.addColorStop(1, "rgba(90,160,200,0)");
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "primary"
          ? `rgba(120,185,218,${0.85 * pulse})`
          : `rgba(148,178,198,${0.70 * pulse})`;
        ctx.fill();
      });

      const cx = W() / 2, cy = H() / 2;
      // Smaller ellipses on mobile
      const rings = mobile
        ? [120, 190, 260]
        : [200, 310, 420];
      rings.forEach((rx, i) => {
        const rot = t * (0.10 + i * 0.04) + (i * Math.PI) / 4;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(90,148,188,${0.30 + i * 0.018})`;
        ctx.lineWidth = 0.7; ctx.stroke(); ctx.restore();
      });

      // Water shimmer
      const waveY = H() * 0.80;
      for (let i = 0; i < 5; i++) {
        const wt = t * 0.5 + i * 0.45;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(160,200,215,${0.30 + i * 0.008})`;
        ctx.lineWidth = 1;
        ctx.moveTo(0, waveY + i * 14);
        for (let x = 0; x <= W(); x += 8) {
          ctx.lineTo(x, waveY + i * 14 + Math.sin(x * 0.016 + wt) * 4.5);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="group relative px-3 py-4 sm:px-5 sm:py-5 rounded-2xl border border-[#a8c8d8]/35 bg-white/38 backdrop-blur-md hover:border-[#6aa8c8]/55 hover:bg-white/55 transition-all duration-300 cursor-default overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-[#c8e0f0]/25 to-[#e8d8b8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative text-xl sm:text-2xl font-bold text-[#1e4a68] font-mono tracking-tight">{value}</div>
      <div className="relative text-[9px] sm:text-[10px] text-[#4a88a8] uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 font-mono leading-tight">{label}</div>
      {sub && <div className="relative text-[9px] sm:text-[10px] text-[#80a8b8] mt-0.5 hidden sm:block">{sub}</div>}
    </div>
  );
}

// ─── SVG Howrah Bridge silhouette ─────────────────────────────────────────────
function BridgeSilhouette() {
  return (
    <svg
      viewBox="0 0 900 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-4xl pointer-events-none select-none"
      style={{ opacity: 0.11 }}
      aria-hidden
    >
      <line x1="20" y1="138" x2="880" y2="138" stroke="#5a8aa8" strokeWidth="2"/>
      <line x1="200" y1="88" x2="700" y2="88" stroke="#5a8aa8" strokeWidth="1.5"/>
      <line x1="218" y1="28" x2="218" y2="142" stroke="#5a8aa8" strokeWidth="2.8"/>
      <line x1="236" y1="28" x2="236" y2="142" stroke="#5a8aa8" strokeWidth="2.8"/>
      <line x1="205" y1="28" x2="250" y2="28" stroke="#5a8aa8" strokeWidth="2"/>
      <line x1="664" y1="14" x2="664" y2="142" stroke="#5a8aa8" strokeWidth="2.8"/>
      <line x1="682" y1="14" x2="682" y2="142" stroke="#5a8aa8" strokeWidth="2.8"/>
      <line x1="650" y1="14" x2="698" y2="14" stroke="#5a8aa8" strokeWidth="2"/>
      <path d="M 60 142 Q 228 32 450 78 Q 672 32 840 142" stroke="#6a9ab8" strokeWidth="1.4" fill="none"/>
      {[80,115,155,195].map(x => <line key={x} x1={x} y1={100+(200-x)*0.12} x2={x} y2="138" stroke="#7aaac0" strokeWidth="0.8"/>)}
      {[705,745,785,820].map(x => <line key={x} x1={x} y1={100+(x-700)*0.12} x2={x} y2="138" stroke="#7aaac0" strokeWidth="0.8"/>)}
      {[252,290,328,366,404,442,480,518,556,594,632].map((x, i) =>
        <line key={x} x1={x} y1={i%2===0?88:138} x2={x+38} y2={i%2===0?138:88} stroke="#6a9ab8" strokeWidth="0.75"/>
      )}
      {[252,290,328,366,404,442,480,518,556,594].map(x =>
        <line key={`h${x}`} x1={x} y1="88" x2={x+38} y2="88" stroke="#6a9ab8" strokeWidth="0.5"/>
      )}
      <rect x="205" y="138" width="44" height="22" rx="2" stroke="#5a8aa8" strokeWidth="1.2" fill="none"/>
      <rect x="650" y="138" width="44" height="22" rx="2" stroke="#5a8aa8" strokeWidth="1.2" fill="none"/>
      <path d="M 0 165 Q 225 178 450 168 Q 675 178 900 165" stroke="#8ab8cc" strokeWidth="1" fill="none" opacity="0.6"/>
      <path d="M 0 175 Q 225 185 450 177 Q 675 185 900 175" stroke="#8ab8cc" strokeWidth="0.6" fill="none" opacity="0.35"/>
    </svg>
  );
}

// ─── Cloud sketch ─────────────────────────────────────────────────────────────
function CloudSketch({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 90 45" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="absolute pointer-events-none select-none w-20" style={style} aria-hidden>
      <path d="M15 32 Q8 32 8 24 Q8 16 16 16 Q17 8 26 8 Q34 8 36 16 Q44 14 46 22 Q52 22 52 28 Q52 32 46 32Z"
        stroke="#8ab0c0" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  return (
    <TooltipProvider>
      <div
        className="relative min-h-screen w-full overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 40%, #dce8f0 68%, #e4ddd2 100%)",
        }}
      >

        {/* ── Howrah Bridge photo — desktop only background ── */}

        {/* ── Howrah Bridge photo — desktop: cover fill ── */}
        <div
          className="absolute inset-0 pointer-events-none select-none hidden sm:block"
          style={{
            backgroundImage: "url('/howrah-bridge.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            backgroundRepeat: "no-repeat",
            opacity: 0.22,
            filter: "saturate(0.5) contrast(0.9) sepia(0.15)",
          }}
        />

        {/* ── Soft fade — lighter on mobile so bridge shows through ── */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(237,243,248,0.60) 0%, rgba(237,243,248,0.10) 35%, rgba(237,243,248,0.10) 60%, rgba(237,243,248,0.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(237,243,248,0.50) 0%, rgba(237,243,248,0.05) 40%, rgba(237,243,248,0.05) 65%, rgba(237,243,248,0.45) 100%)",
          }}
        />

        {/* ── Atmosphere overlays ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-8%] left-[5%] w-[55vw] h-[40vw] rounded-full bg-[#c0d8ee]/28 blur-[110px]" />
          <div className="absolute top-[15%] right-[-8%] w-[38vw] h-[32vw] rounded-full bg-[#b0cce0]/18 blur-[90px]" />
          <div className="absolute bottom-[-8%] left-[8%] right-[8%] h-[38vh] rounded-full bg-[#e0c898]/22 blur-[85px]" />
          <div className="absolute inset-0 opacity-[0.032]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          <div className="absolute inset-0 opacity-[0.038]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px)" }} />
        </div>

        {/* Clouds — hidden on smallest screens */}
        <CloudSketch style={{ top: "52px", left: "8%", opacity: 0.42 }} />
        <CloudSketch style={{ top: "36px", right: "11%", opacity: 0.30, width: "64px" }} />
        <CloudSketch style={{ top: "68px", left: "38%", opacity: 0.18, width: "50px" }} />

        {/* Particle canvas */}
        <BridgeCanvas />

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-20 max-w-5xl mx-auto w-full">

          {/* Location */}
          <div className="mb-4 sm:mb-6">
            <span
              className="text-[#4a7890]/65 text-xs sm:text-sm"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic", letterSpacing: "0.05em" }}
            >
              Kolkata, West Bengal · 2025
            </span>
          </div>

          {/* Badges */}
          <div className="mb-6 sm:mb-8 flex items-center gap-2 flex-wrap justify-center">
            <Badge className="bg-[#5a90b0]/10 border border-[#5a90b0]/28 text-[#1e5878] font-mono text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-none hover:bg-[#5a90b0]/15 transition-colors">
              1st Edition
            </Badge>
            <Badge className="bg-[#5aa898]/10 border border-[#5aa898]/28 text-[#1e5848] font-mono text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-none hover:bg-[#5aa898]/15 transition-colors">
              Hybrid Mode
            </Badge>
            <Badge className="bg-[#b89858]/10 border border-[#b89858]/28 text-[#6a5018] font-mono text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-none">
              20–21 Dec 2026
            </Badge>
          </div>

          {/* QINS heading */}
          <div className="relative mb-2">
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ filter: "blur(28px)", opacity: 0.16 }}
            >
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(3rem, 16vw, 8rem)",
                fontWeight: 900,
                color: "#3a78a0",
                lineHeight: 1,
              }}>QINS</span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(3rem, 16vw, 8rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              position: "relative",
              zIndex: 1,
            }}>
              QINS
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[9px] sm:text-[10px] text-[#4a8098]/65 tracking-[0.3em] sm:tracking-[0.5em] uppercase font-mono mb-5 sm:mb-7 px-2">
            Quantum · Networks · Intelligence · Systems
          </p>

          {/* Subtitle */}
          <p className="max-w-2xl text-[#2a4458] text-sm sm:text-base md:text-lg leading-relaxed mb-2 px-2">
            The International Conference on{" "}
            <span className="text-[#1a5878] font-semibold">Quantum Computing</span>,{" "}
            <span className="text-[#1e6848] font-semibold">Entangled Networks</span> &{" "}
            <span className="text-[#2a4e78] font-semibold">Post-Classical Intelligence</span>
          </p>
          <p className="text-[#7aA0b0] text-xs sm:text-sm max-w-xl mb-8 sm:mb-10 leading-relaxed px-2">
            Organized by SamSU · In association with IIOIR, Shimla &amp; ACCBI, Amity University Rajasthan
          </p>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10 w-full max-w-xs">
            <Separator className="bg-[#5a90b0]/22 flex-1" />
            <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest shrink-0">|ψ⟩</span>
            <Separator className="bg-[#5a9880]/22 flex-1" />
          </div>

          {/* Bridge illustration — mobile only, overlaps bottom into Register Now */}
          <div
            className="sm:hidden pointer-events-none select-none"
            style={{
              position: "relative",
              zIndex: 0,
              marginBottom: "-12%",
              marginTop: "8px",
              marginLeft: "calc(-1rem - 1px)",
              marginRight: "calc(-1rem - 1px)",
              width: "calc(100% + 2rem + 2px)",
            }}
          >
            <img
              src="/howrah-bridge.jpg"
              alt=""
              aria-hidden
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                opacity: 0.25,
                filter: "saturate(0.5) contrast(0.9) sepia(0.15) blur(0.3px)",
                mixBlendMode: "multiply",
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.8) 18%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.0) 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.8) 18%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.0) 100%)",
              }}
            />
          </div>

          {/* CTA Buttons — stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 w-full max-w-xs sm:max-w-none" style={{ position: "relative", zIndex: 2 }}>
            <Button
              size="lg"
              className="relative group overflow-hidden font-bold tracking-widest text-sm px-8 rounded-full transition-all duration-300 w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #1e5878, #2a7868)",
                color: "#eef6f8",
                boxShadow: "0 4px 20px rgba(30,88,120,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <span className="relative z-10">Register Now</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: "linear-gradient(135deg, #2a6888, #38887a)" }}
              />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="font-semibold tracking-widest text-sm px-8 rounded-full transition-all duration-300 w-full sm:w-auto"
              style={{
                border: "1px solid rgba(80,140,168,0.32)",
                color: "#1e4868",
                background: "rgba(255,255,255,0.38)",
                backdropFilter: "blur(8px)",
              }}
            >
              Conference Program
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => { navigator.clipboard.writeText("qins2025.quantum/submit"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="font-mono text-xs tracking-widest rounded-full transition-all w-full sm:w-auto"
                  style={{
                    border: "1px solid rgba(80,140,168,0.22)",
                    color: "#3a7090",
                    background: "rgba(255,255,255,0.22)",
                  }}
                >
                  {copied ? "✓ Copied!" : "Submit Paper →"}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="text-xs font-mono"
                style={{ background: "#1a3a50", border: "1px solid rgba(80,140,168,0.28)", color: "#a8ccd8" }}
              >
                Copy submission link
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stats — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full max-w-3xl">
            <StatCard label="Qubits Discussed" value="512+" sub="logical & physical" />
            <StatCard label="Track Areas"       value="08"   sub="core quantum tracks" />
            <StatCard label="Countries"         value="40+"  sub="registered delegates" />
            <StatCard label="Keynote Speakers"  value="12"   sub="world-class faculty" />
          </div>
        </div>

        {/* ── Status bar ── */}
        <div
          className="relative z-10 border-t border-[#5a90b0]/14 backdrop-blur-sm"
          style={{ background: "rgba(210,228,240,0.55)" }}
        >
          {/* Full status on sm+, compact on mobile */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono text-[#6898b0]/65 uppercase tracking-widest">
            <span className="hidden xs:inline">System State: <span className="text-[#1e5878]">|Ψ⟩ = α|0⟩ + β|1⟩</span></span>
            <span>Coherence: <span className="text-[#1e6840]">STABLE</span></span>
            <span>Entanglement: <span className="text-[#2a4878]">ACTIVE</span></span>
            <span className="hidden sm:inline">Conference.exe — <span className="text-[#1e5878]">READY</span></span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}