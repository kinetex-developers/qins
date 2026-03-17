"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";

// ─── Types ──────────
type TrackColor = "teal" | "steel" | "sky" | "slate" | "sage";

interface TrackItem {
  id: number;
  index: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: string;
  color: TrackColor;
  topics: string[];
}

// ─── Color map ───────────────────────────────────────────────────────────────
const TRACK_STYLES: Record<
  TrackColor,
  {
    badge: string;
    glow: string;
    dot: string;
    accent: string;
    line: string;
    pillBg: string;
    pillBorder: string;
    cornerBorder: string;
  }
> = {
  teal: { // now BLUE-ish
    badge: "bg-[#3b82c4]/10 border-[#7fb3e6]/35 text-[#2a5c9a]",
    glow: "rgba(127,179,230,0.22)",
    dot: "bg-[#7fb3e6]",
    accent: "#7fb3e6",
    line: "rgba(127,179,230,0.25)",
    pillBg: "rgba(127,179,230,0.09)",
    pillBorder: "rgba(127,179,230,0.30)",
    cornerBorder: "rgba(127,179,230,0.48)",
  },

  steel: { // now ORANGE-ish
    badge: "bg-[#c47a3b]/10 border-[#e6b17f]/35 text-[#9a5a2a]",
    glow: "rgba(230,177,127,0.22)",
    dot: "bg-[#e6b17f]",
    accent: "#e6b17f",
    line: "rgba(230,177,127,0.25)",
    pillBg: "rgba(230,177,127,0.09)",
    pillBorder: "rgba(230,177,127,0.30)",
    cornerBorder: "rgba(230,177,127,0.48)",
  },

  sky: { // now YELLOW-ish
    badge: "bg-[#c4a63b]/10 border-[#e6d37f]/35 text-[#9a7c2a]",
    glow: "rgba(230,211,127,0.22)",
    dot: "bg-[#e6d37f]",
    accent: "#e6d37f",
    line: "rgba(230,211,127,0.25)",
    pillBg: "rgba(230,211,127,0.09)",
    pillBorder: "rgba(230,211,127,0.30)",
    cornerBorder: "rgba(230,211,127,0.48)",
  },

  slate: { // now GREY-ish
    badge: "bg-[#5c6670]/10 border-[#a3adb7]/35 text-[#3e4852]",
    glow: "rgba(163,173,183,0.22)",
    dot: "bg-[#a3adb7]",
    accent: "#a3adb7",
    line: "rgba(163,173,183,0.25)",
    pillBg: "rgba(163,173,183,0.09)",
    pillBorder: "rgba(163,173,183,0.30)",
    cornerBorder: "rgba(163,173,183,0.48)",
  },

  sage: { // GREEN (kept, slightly refined)
    badge: "bg-[#3f7a5c]/10 border-[#7fcfa4]/35 text-[#2a5a44]",
    glow: "rgba(127,207,164,0.22)",
    dot: "bg-[#7fcfa4]",
    accent: "#7fcfa4",
    line: "rgba(127,207,164,0.25)",
    pillBg: "rgba(127,207,164,0.09)",
    pillBorder: "rgba(127,207,164,0.30)",
    cornerBorder: "rgba(127,207,164,0.48)",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRACKS: TrackItem[] = [
  {
    id: 1, index: "01", number: "Track 1",
    title: "Quantum Computing and Quantum Algorithms",
    shortTitle: "Quantum", icon: "⬡", color: "teal",
    topics: [
      "Variational Quantum Algorithms for Optimization (VQE, QAOA)",
      "Quantum Machine Learning and Quantum Neural Networks",
      "Fault-Tolerant Quantum Computing and Error Correction",
      "Hybrid Quantum\u2013Classical Computing Architectures",
      "Quantum Algorithms for Graph and Combinatorial Problems",
    ],
  },
  {
    id: 2, index: "02", number: "Track 2",
    title: "Advanced Artificial Intelligence and Machine Learning",
    shortTitle: "AI & ML", icon: "◈", color: "steel",
    topics: [
      "Large Language Models and Vision-Language AI Systems",
      "Self-Supervised and Representation Learning",
      "Reinforcement Learning for Autonomous Systems",
      "Autonomous Systems and Drone Networks",
    ],
  },
  {
    id: 3, index: "03", number: "Track 3",
    title: "Graph Theory, Game Theory and Network Science",
    shortTitle: "Graph & Network", icon: "◎", color: "sky",
    topics: [
      "Graph Neural Networks and Graph Representation Learning",
      "Large-Scale Graph Mining and Network Analytics",
      "Algorithmic Game Theory and Strategic Decision Systems",
      "Dynamic and Temporal Graph Analysis",
      "Graph Algorithms for Complex Network Optimization",
    ],
  },
  {
    id: 4, index: "04", number: "Track 4",
    title: "Distributed Systems, Edge Computing and Signal Processing",
    shortTitle: "Distributed & Edge", icon: "⬢", color: "slate",
    topics: [
      "Distributed and Cloud-Native Computing Architectures",
      "Edge AI and Intelligent Edge Computing Systems",
      "Scalable Distributed Data Processing Frameworks",
      "Signal Processing for Intelligent and Multimedia Systems",
      "Signal Processing for IoT and Edge Devices",
    ],
  },
  {
    id: 5, index: "05", number: "Track 5",
    title: "Cryptography, Blockchain and Optimization for Secure Systems",
    shortTitle: "Crypto & Blockchain", icon: "⬟", color: "sage",
    topics: [
      "Post-Quantum Cryptography and Secure Communication",
      "Blockchain Systems and Distributed Ledger Technologies",
      "Smart Contracts and Decentralized Applications",
      "Privacy-Preserving Cryptographic Protocols",
    ],
  },
];

// ─── Track Illustrations (LOW-FREQUENCY, CLEAN) ───────────────────────────────

// ── Quantum ──
function QuantumCircuitSVG({ c }: { c: string }) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qc-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c} stopOpacity="0.9" />
        </linearGradient>

        {/* ↑ Increased size */}
        <pattern id="qc-p" width="260" height="120" patternUnits="userSpaceOnUse">
          <line x1="0" y1="30" x2="260" y2="30" stroke="url(#qc-g)" strokeWidth="0.9" />
          <line x1="0" y1="80" x2="260" y2="80" stroke="url(#qc-g)" strokeWidth="0.9" />

          <rect x="20" y="22" width="18" height="18" rx="2" stroke={c} strokeWidth="1" fill="none" />
          <text x="29" y="35" fill={c} fontSize="9" textAnchor="middle">H</text>

          <circle cx="90" cy="30" r="3" fill={c} />
          <line x1="90" y1="30" x2="90" y2="80" stroke={c} strokeWidth="1" />
          <circle cx="90" cy="80" r="7" stroke={c} strokeWidth="1" fill="none" />

          <rect x="140" y="70" width="18" height="18" rx="2" stroke={c} strokeWidth="1" fill="none" />
          <text x="149" y="83" fill={c} fontSize="9" textAnchor="middle">T</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#qc-p)" />
    </svg>
  );
}

// ── Neural ──
function NeuralNetworkSVG({ c }: { c: string }) {
  const layers: [number, number[]][] = [
    [30, [25, 85]],
    [120, [15, 55, 95]],
    [210, [25, 85]],
  ];

  const conns: [number, number, number, number][] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const [x1, ys1] = layers[li];
    const [x2, ys2] = layers[li + 1];
    for (const y1 of ys1) for (const y2 of ys2) conns.push([x1, y1, x2, y2]);
  }

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="nn-p" width="240" height="140" patternUnits="userSpaceOnUse">
          {conns.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={c} strokeWidth="0.8" strokeOpacity="0.4" />
          ))}

          {layers.map(([x, ys], li) =>
            ys.map((y, ni) => (
              <circle key={`${li}-${ni}`} cx={x} cy={y} r="5"
                fill={li === 2 ? c : "none"}
                fillOpacity={li === 2 ? 0.15 : 0}
                stroke={c}
                strokeWidth="1.1" />
            ))
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#nn-p)" />
    </svg>
  );
}

// ── Graph ──
function GraphNetworkSVG({ c }: { c: string }) {
  const nodes: [number, number, number][] = [
    [40, 30, 4], [140, 20, 4], [200, 60, 4],
    [180, 120, 4], [100, 140, 4], [30, 100, 4], [110, 75, 6],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]];

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gn-p" width="240" height="180" patternUnits="userSpaceOnUse">
          {edges.map(([a, b], i) => (
            <line key={i}
              x1={nodes[a][0]} y1={nodes[a][1]}
              x2={nodes[b][0]} y2={nodes[b][1]}
              stroke={c}
              strokeWidth="1.3"              // ↑ stronger
              strokeOpacity="0.7"           // ↑ stronger
            />
          ))}
          {nodes.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r}
              fill={i === 6 ? c : "none"}
              fillOpacity={i === 6 ? 0.35 : 0}  // ↑ stronger center glow
              stroke={c}
              strokeWidth="1.4"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gn-p)" />
    </svg>
  );
}

// ── Distributed ──
function DistributedSystemSVG({ c }: { c: string }) {
  const cx = 120, cy = 90;
  const ring: [number, number][] = [
    [120, 20], [200, 60], [200, 140], [120, 180], [40, 140], [40, 60],
  ];

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ds-p" width="240" height="200" patternUnits="userSpaceOnUse">
          {ring.map(([px, py], i) => (
            <line key={i}
              x1={cx} y1={cy} x2={px} y2={py}
              stroke={c} strokeWidth="1"
              strokeDasharray="4,4"
              strokeOpacity="0.5" />
          ))}

          <rect x={cx - 20} y={cy - 14} width="40" height="28" rx="6"
            stroke={c} strokeWidth="1.2" fill="none" />

          {ring.map(([px, py], i) => (
            <rect key={i}
              x={px - 7} y={py - 6}
              width="14" height="12"
              rx="3"
              stroke={c} strokeWidth="1"
              fill="none" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ds-p)" />
    </svg>
  );
}

// ── Blockchain ──
function BlockchainSVG({ c }: { c: string }) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="bc-p" width="240" height="140" patternUnits="userSpaceOnUse">
          <rect x="20" y="20" width="60" height="80"
            rx="6"
            stroke={c}
            strokeWidth="1"
            strokeOpacity="0.5"   // ↓ softer
            fill="none"
          />
          <rect x="120" y="20" width="60" height="80"
            rx="6"
            stroke={c}
            strokeWidth="1"
            strokeOpacity="0.5"
            fill="none"
          />

          <line x1="80" y1="60" x2="120" y2="60"
            stroke={c}
            strokeWidth="1"
            strokeOpacity="0.45"  // ↓ softer
          />

          <polygon points="120,55 130,60 120,65"
            fill={c}
            fillOpacity="0.45"    // ↓ softer
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bc-p)" />
    </svg>
  );
}

const TRACK_ILLUS: Record<TrackColor, (c: string) => ReactNode> = {
  teal:  (c) => <QuantumCircuitSVG c={c} />,
  steel: (c) => <NeuralNetworkSVG c={c} />,
  sky:   (c) => <GraphNetworkSVG c={c} />,
  slate: (c) => <DistributedSystemSVG c={c} />,
  sage:  (c) => <BlockchainSVG c={c} />,
};

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

    const resize = () => {
      canvas.width  = W() * window.devicePixelRatio;
      canvas.height = H() * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node { x: number; y: number; vx: number; vy: number; r: number; phase: number; type: "primary" | "secondary" }
    const nodes: Node[] = Array.from({ length: 62 }, (_, i) => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.5, phase: Math.random() * Math.PI * 2,
      type: i < 16 ? "primary" : "secondary",
    }));

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W(), H());

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.25;
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + nodes[i].phase);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(60,120,165,${alpha * pulse * 2.2})`;
            ctx.lineWidth = 1.0;
            ctx.setLineDash([4, 8]);
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.8 + n.phase);

        if (n.type === "primary") {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
          grd.addColorStop(0, `rgba(42,130,190,${1.0 * pulse})`);
          grd.addColorStop(1, "rgba(90,160,200,0)");
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "primary"
          ? `rgba(60,160,220,${1.0 * pulse})`
          : `rgba(90,155,195,${0.85 * pulse})`;
        ctx.fill();
      });

      const cx = W() / 2, cy = H() / 2;
      [140, 220, 310, 420].forEach((rx, i) => {
        const rot = t * (0.10 + i * 0.04) + (i * Math.PI) / 4;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(90,148,188,${0.08 + i * 0.025})`;
        ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Overview Card ────────────────────────────────────────────────────────────
function OverviewCard() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-8"
      style={{
        border: "1px solid rgba(168,200,216,0.30)",
        background: "rgba(255,255,255,0.42)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 20px rgba(30,72,104,0.08)",
      }}
    >
      <div className="p-6 md:p-8">
        {/* Slide-style header */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.025em",
                background: "linear-gradient(138deg, #1e5878 0%, #2a7090 35%, #1a4860 65%, #3a7868 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Overview
            </h2>
            <p className="text-[10px] font-mono text-[#6a98b0]/70 tracking-[0.4em] uppercase mt-1.5">
              Conference Research Tracks · QINS 2026
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] font-mono text-[#8aa8b8] tracking-widest">5 TRACKS</div>
            <div className="text-[10px] font-mono text-[#8aa8b8] tracking-widest mt-0.5">23 TOPICS</div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px my-5"
          style={{ background: "linear-gradient(to right, rgba(90,144,176,0.40), rgba(90,152,128,0.22), transparent)" }}
        />

        {/* Track pills — like the solid green buttons in the Overview slide of the image */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {TRACKS.map((track) => {
            const ts = TRACK_STYLES[track.color];
            return (
              <div
                key={track.id}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: ts.pillBg,
                  border: `1px solid ${ts.pillBorder}`,
                }}
              >
                <span
                  className="text-[10px] font-mono font-bold tracking-[0.2em] shrink-0"
                  style={{ color: ts.accent }}
                >
                  {track.index}
                </span>
                <div className="w-px self-stretch shrink-0" style={{ background: ts.pillBorder }} />
                <span className="text-[11px] font-semibold text-[#1e3a58] leading-snug">
                  {track.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(90,144,176,0.28), transparent)" }} />
          <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">|ψ⟩</span>
          <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(90,152,128,0.28), transparent)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Track Card ───────────────────────────────────────────────────────────────
function TrackCard({
  track,
  fullWidth = false,
}: {
  track: TrackItem;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ts = TRACK_STYLES[track.color];

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        border: "1px solid rgba(168,200,216,0.30)",
        background: "rgba(255,255,255,0.42)",
        backdropFilter: "blur(12px)",
        boxShadow: hovered
          ? `0 0 40px 0 ${ts.glow}, 0 8px 32px rgba(30,72,104,0.12)`
          : "0 2px 16px rgba(30,72,104,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Slide header — mirrors bold section headings from the image ── */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ borderBottom: `1px solid ${ts.line}` }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="text-[10px] font-mono tracking-[0.22em] uppercase"
            style={{ color: ts.accent }}
          >
            {track.number}
          </span>
          <Badge
            className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${ts.badge}`}
          >
            {track.shortTitle}
          </Badge>
        </div>
        <h2 className="text-[15px] font-bold text-[#1e3a58] leading-snug tracking-tight">
          {track.title}
        </h2>
      </div>

      {/* ── Topics — solid pill buttons matching the image's green pills ── */}
      <div
        className={`p-5 ${
          fullWidth ? "grid grid-cols-1 sm:grid-cols-2 gap-2" : "space-y-2"
        }`}
      >
        {track.topics.map((topic, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors duration-200"
            style={{
              background: ts.pillBg,
              border: `1px solid ${ts.pillBorder}`,
            }}
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ts.dot}`} />
            <span className="text-[11px] font-medium text-[#1e3a58] leading-snug">
              {topic}
            </span>
          </div>
        ))}
      </div>

      {/* ── Card footer ── */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${ts.dot}`} />
          <div
            className="h-px flex-1"
            style={{ background: `linear-gradient(to right, ${ts.line}, transparent)` }}
          />
          <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
        </div>
      </div>

      {/* ── Track illustration overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ opacity: 0.25 }}
      >
        {TRACK_ILLUS[track.color](ts.accent)}
      </div>

      {/* ── Corner brackets on hover ── */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <div
          key={corner}
          className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            top:    corner.startsWith("t") ? 12 : undefined,
            bottom: corner.startsWith("b") ? 12 : undefined,
            left:   corner.endsWith("l")   ? 12 : undefined,
            right:  corner.endsWith("r")   ? 12 : undefined,
            borderTop:    corner.startsWith("t") ? `1px solid ${ts.cornerBorder}` : undefined,
            borderBottom: corner.startsWith("b") ? `1px solid ${ts.cornerBorder}` : undefined,
            borderLeft:   corner.endsWith("l")   ? `1px solid ${ts.cornerBorder}` : undefined,
            borderRight:  corner.endsWith("r")   ? `1px solid ${ts.cornerBorder}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Tracks Page ────────────────────────────────────────────────────────
export default function TracksPage() {
  return (
    <TooltipProvider>
      <div
        className="relative min-h-screen w-full overflow-x-hidden"
        style={{
          background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 40%, #dce8f0 68%, #e4ddd2 100%)",
          fontFamily: "'Syne', 'Georgia', sans-serif",
        }}
      >
        {/* ── Atmosphere ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-8%] left-[5%] w-[55vw] h-[40vw] rounded-full bg-[#c0d8ee]/28 blur-[110px]" />
          <div className="absolute top-[15%] right-[-8%] w-[38vw] h-[32vw] rounded-full bg-[#b0cce0]/18 blur-[90px]" />
          <div className="absolute bottom-[-8%] left-[8%] right-[8%] h-[38vh] rounded-full bg-[#e0c898]/22 blur-[85px]" />
          <div
            className="absolute inset-0 opacity-[0.032]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px)" }}
          />
        </div>

        <BridgeCanvas />

        {/* ── Header + Victoria Memorial — image scoped to header only ── */}
        <div className="relative">
          {/* Desktop: transparent PNG positioned just below the fixed navbar */}
          <img
            src="/victoria-memorial.png"
            alt=""
            aria-hidden
            className="absolute hidden sm:block pointer-events-none select-none"
            style={{
              top: "62px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(620px, 70%)",
              height: "auto",
              opacity: 0.18,
              filter: "saturate(0.3) contrast(0.95) sepia(0.25)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0) 100%)",
              zIndex: 0,
            }}
          />
          {/* Mobile fade */}
          <div
            className="absolute inset-0 pointer-events-none sm:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(237,243,248,0.55) 0%, rgba(237,243,248,0.05) 40%, rgba(237,243,248,0.05) 65%, rgba(237,243,248,0.50) 100%)",
            }}
          />

          {/* ── Header ── */}
          <header className="relative z-10 pt-20 pb-10 text-center px-6">
            <div className="mb-5">
              <span
                className="text-[#4a7890]/65 text-sm"
                style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", letterSpacing: "0.05em" }}
              >
                Kolkata, West Bengal · 2026
              </span>
            </div>

            <div className="relative mb-2">
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ filter: "blur(38px)", opacity: 0.18 }}
              >
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(2.2rem, 7vw, 4.8rem)",
                  fontWeight: 900, color: "#3a78a0", lineHeight: 1,
                }}>Research Tracks</span>
              </div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.2rem, 7vw, 4.8rem)",
                fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em",
                background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", position: "relative", zIndex: 1,
              }}>Research Tracks</h1>
            </div>

            <p className="text-[10px] text-[#4a8098]/65 tracking-[0.5em] uppercase font-mono mt-3 mb-5">
              Quantum · Intelligence · Networks · Systems · Cryptography
            </p>

            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
              <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest">|ψ⟩</span>
              <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.35))" }} />
            </div>

            {/* ── Victoria Memorial — mobile only, fades into content below ── */}
            <div
              className="sm:hidden pointer-events-none select-none"
              style={{
                position: "relative",
                zIndex: 0,
                marginTop: "16px",
                marginBottom: "-10%",
                marginLeft: "calc(-1.5rem - 1px)",
                marginRight: "calc(-1.5rem - 1px)",
                width: "calc(100% + 3rem + 2px)",
              }}
            >
              <img
                src="/victoria-memorial.png"
                alt=""
                aria-hidden
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  opacity: 0.22,
                  filter: "saturate(0.4) contrast(0.9) sepia(0.18) blur(0.3px)",
                  mixBlendMode: "multiply",
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.8) 18%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.0) 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.8) 18%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.0) 100%)",
                }}
              />
            </div>
          </header>
        </div>

        {/* ── Content ── */}
        <main className="relative z-10 max-w-6xl mx-auto px-5 pb-28">
          {/* Overview slide card */}
          <OverviewCard />

          {/* 2-column track card grid; track 5 spans both columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TRACKS.slice(0, 4).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
            <div className="md:col-span-2">
              <TrackCard track={TRACKS[4]} fullWidth />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.25))" }} />
            <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest uppercase">
              5 Tracks · 23 Research Topics
            </span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.25))" }} />
          </div>
        </main>

        {/* ── Status bar ── */}
        <div
          className="fixed bottom-0 inset-x-0 z-20 border-t border-[#5a90b0]/14 backdrop-blur-sm"
          style={{ background: "rgba(210,228,240,0.55)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#6898b0]/65 uppercase tracking-widest">
            <span>Conference: <span className="text-[#1e5878]">QINS 2026</span></span>
            <span>Tracks: <span className="text-[#1e5878]">5 Active · 23 Topics</span></span>
            <span>Venue: <span className="text-[#2a4878]">Swami Vivekananda University</span></span>
            <span>Submissions: <span className="text-[#1e5878]">OPEN</span></span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
