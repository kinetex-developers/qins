"use client";

import { useEffect, useRef, useState } from "react";
import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import QNISNavbar from "./Navbar";

// ─── Quantum Particle Canvas ──────────────────────────────────────────────────
function QuantumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const resize = () => {
      canvas.width  = W() * window.devicePixelRatio;
      canvas.height = H() * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle { x:number; y:number; vx:number; vy:number; r:number; phase:number }
    const nodes: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.6, phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, W(), H());

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.18;
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + nodes[i].phase);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,210,255,${alpha * pulse})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
        const pulse = 0.6 + 0.4 * Math.sin(t * 2 + n.phase);
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grd.addColorStop(0, `rgba(99,210,255,${0.9 * pulse})`);
        grd.addColorStop(1, "rgba(99,210,255,0)");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,240,255,${0.85 * pulse})`; ctx.fill();
      });

      const cx = W() / 2, cy = H() / 2;
      [180, 280, 380].forEach((rx, i) => {
        const rot = t * (0.18 + i * 0.06) + (i * Math.PI) / 3;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,210,255,${0.07 + i * 0.03})`;
        ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Qubit Ring ───────────────────────────────────────────────────────────────
function QubitRing({ delay = 0, size = 40 }: { delay?: number; size?: number }) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin"
        style={{ animationDuration: "6s", animationDelay: `${delay}s` }} />
      <div className="absolute inset-[5px] rounded-full border border-violet-400/20 animate-spin"
        style={{ animationDuration: "4s", animationDelay: `${delay + 0.5}s`, animationDirection: "reverse" }} />
      <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(99,210,255,0.6)]" />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="group relative px-5 py-5 rounded-xl border border-cyan-500/10 bg-slate-950/60 backdrop-blur-md hover:border-cyan-400/30 transition-all duration-300 cursor-default overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative text-2xl font-bold text-white font-mono tracking-tight">{value}</div>
      <div className="relative text-[10px] text-cyan-400/80 uppercase tracking-widest mt-1 font-mono">{label}</div>
      {sub && <div className="relative text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#020712] flex flex-col">

        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/20 blur-[100px]" />
          <div className="absolute top-[30%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-indigo-900/15 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)" }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </div>

        {/* Particle canvas */}
        <QuantumCanvas />

        {/* Navbar */}
        <QNISNavbar />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 max-w-6xl mx-auto w-full">

          {/* Badges */}
          <div className="mb-8 flex items-center gap-3 flex-wrap justify-center">
            <Badge className="bg-violet-500/10 border border-violet-400/30 text-violet-300 font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
              5th Edition
            </Badge>
            <Badge className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
              Hybrid Mode
            </Badge>
            <Badge className="bg-slate-800/60 border border-slate-600/40 text-slate-300 font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
              7–8 Nov 2025 · Tashkent, UZ
            </Badge>
          </div>

          {/* ── QNIS Heading — always-visible gradient text ── */}
          <div className="relative mb-1">
            {/* Glow backdrop */}
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ filter: "blur(40px)", opacity: 0.35 }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(4rem, 12vw, 8rem)",
                  fontWeight: 900,
                  color: "#67e8f9",
                  lineHeight: 1,
                }}
              >
                QINS
              </span>
            </div>
            {/* Actual heading */}
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(4rem, 12vw, 8rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #67e8f9 0%, #e0f2fe 40%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                zIndex: 1,
              }}
            >
              QINS
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[11px] text-slate-400/80 tracking-[0.5em] uppercase font-mono mb-6">
            Quantum · Networks · Intelligence · Systems
          </p>

          {/* Subtitle */}
          <p className="max-w-2xl text-slate-300 text-base md:text-lg leading-relaxed mb-2">
            The International Conference on{" "}
            <span className="text-cyan-300 font-medium">Quantum Computing</span>,{" "}
            <span className="text-violet-300 font-medium">Entangled Networks</span> &{" "}
            <span className="text-sky-300 font-medium">Post-Classical Intelligence</span>
          </p>
          <p className="text-slate-500 text-sm max-w-xl mb-10 leading-relaxed">
            Organized by SamSU · In association with IIOIR, Shimla &amp; ACCBI, Amity University Rajasthan
          </p>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-10 w-full max-w-sm">
            <Separator className="bg-cyan-500/20 flex-1" />
            <span className="text-cyan-400/50 text-[11px] font-mono tracking-widest shrink-0">|ψ⟩</span>
            <Separator className="bg-violet-500/20 flex-1" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="relative group overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold tracking-widest text-sm px-8 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(99,210,255,0.3)] hover:shadow-[0_0_50px_rgba(99,210,255,0.5)]"
            >
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button size="lg" variant="outline"
              className="border border-violet-400/40 text-violet-200 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400/60 font-semibold tracking-widest text-sm px-8 rounded-full transition-all duration-300">
              Conference Program
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="ghost"
                  onClick={() => { navigator.clipboard.writeText("qins2025.quantum/register"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-slate-400 hover:text-cyan-300 font-mono text-xs tracking-widest rounded-full border border-slate-700/50 hover:border-cyan-500/30 transition-all">
                  {copied ? "✓ Copied!" : "Submit Paper →"}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 border-slate-700 text-slate-300 text-xs font-mono">
                Copy submission link
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
            <StatCard label="Qubits Discussed" value="512+" sub="logical & physical" />
            <StatCard label="Track Areas"       value="08"   sub="core quantum tracks" />
            <StatCard label="Countries"         value="40+"  sub="registered delegates" />
            <StatCard label="Keynote Speakers"  value="12"   sub="world-class faculty" />
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="relative z-10 border-t border-cyan-500/10 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <span>System State: <span className="text-cyan-400">|Ψ⟩ = α|0⟩ + β|1⟩</span></span>
            <span>Coherence: <span className="text-green-400">STABLE</span></span>
            <span>Entanglement: <span className="text-violet-400">ACTIVE</span></span>
            <span>Conference.exe — <span className="text-cyan-400">READY</span></span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}