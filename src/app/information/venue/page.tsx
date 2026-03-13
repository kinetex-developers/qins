"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Plane,
  Train,
  Car,
  Bus,
  Phone,
  PhoneCall,
  UserRound,
  Mail,
  Navigation,
  Building2,
  Compass,
  ExternalLink,
} from "lucide-react";

// ─── Bridge Lattice Canvas (identical to attractions page) ─────────────────────
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
      canvas.width = W() * window.devicePixelRatio;
      canvas.height = H() * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node {
      x: number; y: number; vx: number; vy: number;
      r: number; phase: number; type: "primary" | "secondary";
    }
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
            const alpha = (1 - dist / 180) * 0.38;
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
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Frosted info card ─────────────────────────────────────────────────────────
function InfoCard({
  icon: Icon,
  tag,
  tagColor,
  title,
  index,
  children,
}: {
  icon: React.ElementType;
  tag: string;
  tagColor: string;
  title: string;
  index: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const colorMap: Record<string, { badge: string; glow: string; dot: string; icon: string }> = {
    teal:  { badge: "bg-[#1e5878]/10 border-[#5a90b0]/35 text-[#1e5878]",  glow: "rgba(90,144,176,0.18)",  dot: "bg-[#5a90b0]",  icon: "text-[#1e5878]" },
    steel: { badge: "bg-[#2a6888]/10 border-[#6aa8c8]/35 text-[#2a5878]",  glow: "rgba(106,168,200,0.18)", dot: "bg-[#6aa8c8]",  icon: "text-[#2a5878]" },
    sky:   { badge: "bg-[#3a7090]/10 border-[#8ab8d0]/35 text-[#2a5070]",  glow: "rgba(138,184,208,0.18)", dot: "bg-[#8ab8d0]",  icon: "text-[#2a5070]" },
    slate: { badge: "bg-[#1a4860]/10 border-[#4a88a8]/35 text-[#1a4860]",  glow: "rgba(74,136,168,0.18)",  dot: "bg-[#4a88a8]",  icon: "text-[#1a4860]" },
    sand:  { badge: "bg-[#b89858]/10 border-[#c8a868]/35 text-[#6a5018]",  glow: "rgba(184,152,88,0.15)",  dot: "bg-[#c8a868]",  icon: "text-[#6a5018]" },
    mist:  { badge: "bg-[#5a8898]/10 border-[#7aa8b8]/35 text-[#2a5868]",  glow: "rgba(90,136,152,0.18)",  dot: "bg-[#7aa8b8]",  icon: "text-[#2a5868]" },
  };

  const ts = colorMap[tagColor];

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
      {/* corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <div
          key={corner}
          className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            top:    corner.startsWith("t") ? 12 : undefined,
            bottom: corner.startsWith("b") ? 12 : undefined,
            left:   corner.endsWith("l")   ? 12 : undefined,
            right:  corner.endsWith("r")   ? 12 : undefined,
            borderTop:    corner.startsWith("t") ? "1px solid rgba(90,144,176,0.5)" : undefined,
            borderBottom: corner.startsWith("b") ? "1px solid rgba(90,144,176,0.4)" : undefined,
            borderLeft:   corner.endsWith("l")   ? "1px solid rgba(90,144,176,0.5)" : undefined,
            borderRight:  corner.endsWith("r")   ? "1px solid rgba(90,144,176,0.4)" : undefined,
          }}
        />
      ))}

      <div className="p-5">
        {/* header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                border: "1px solid rgba(168,200,216,0.40)",
                background: "rgba(237,243,248,0.7)",
              }}
            >
              <Icon className={`w-4 h-4 ${ts.icon}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e3a58] tracking-tight leading-snug">{title}</h3>
              <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">{index}</span>
            </div>
          </div>
          <Badge className={`shrink-0 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${ts.badge}`}>
            {tag}
          </Badge>
        </div>

        {/* body */}
        <div className="text-[11px] text-[#6a8898] leading-relaxed space-y-2">{children}</div>

        {/* footer line */}
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${ts.dot}`} />
          <div className="h-px flex-1"
            style={{ background: "linear-gradient(to right, rgba(90,144,176,0.25), transparent)" }} />
          <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
        </div>
      </div>
    </div>
  );
}

// ─── Transport pill ────────────────────────────────────────────────────────────
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full"
      style={{
        border: "1px solid rgba(168,200,216,0.40)",
        background: "rgba(237,243,248,0.65)",
        color: "#4a7890",
      }}
    >
      {children}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function VenueTravelPage() {
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
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px)",
            }}
          />
        </div>

        <BridgeCanvas />

        {/* ── Header ── */}
        <header className="relative z-10 pt-20 pb-10 text-center px-6">
          <div className="mb-5">
            <span
              className="text-[#4a7890]/65 text-sm"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", letterSpacing: "0.05em" }}
            >
              Kolkata, West Bengal · India
            </span>
          </div>

          <div className="relative mb-2">
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ filter: "blur(38px)", opacity: 0.18 }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(2.2rem, 7vw, 4.8rem)",
                  fontWeight: 900,
                  color: "#3a78a0",
                  lineHeight: 1,
                }}
              >
                Venue &amp; Travel
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.2rem, 7vw, 4.8rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                zIndex: 1,
              }}
            >
              Venue &amp; Travel
            </h1>
          </div>

          <p className="text-[10px] text-[#4a8098]/65 tracking-[0.5em] uppercase font-mono mt-3 mb-5">
            Campus · Directions · Transport · Accommodation
          </p>

          <div className="flex items-center gap-3 justify-center">
            <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
            <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest">✦</span>
            <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.35))" }} />
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="relative z-10 max-w-6xl mx-auto px-5 pb-28 space-y-8">

          {/* ── Venue highlight card ── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(168,200,216,0.38)",
              background: "rgba(255,255,255,0.48)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 0 48px 0 rgba(90,144,176,0.14), 0 8px 32px rgba(30,72,104,0.10)",
            }}
          >
            {/* scan-line accent */}
            <div
              className="absolute inset-x-0 h-[1px] top-0"
              style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.55), transparent)" }}
            />

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* icon block */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    border: "1px solid rgba(90,144,176,0.35)",
                    background: "rgba(237,243,248,0.80)",
                    boxShadow: "0 0 24px rgba(90,144,176,0.18)",
                  }}
                >
                  <Building2 className="w-6 h-6 text-[#1e5878]" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2
                      className="text-xl font-bold text-[#1e3a58] tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Swami Vivekananda University
                    </h2>
                    <Badge className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-[#1e5878]/10 border-[#5a90b0]/35 text-[#1e5878]">
                      Venue
                    </Badge>
                  </div>

                  <p className="text-xs text-[#6a8898] leading-relaxed max-w-2xl">
                    Our event is hosted at Swami Vivekananda University — a modern campus providing
                    auditoriums, laboratories, sports facilities, library, and cafeteria for all
                    visitors and participants.
                  </p>

                  {/* address row */}
                  <div
                    className="inline-flex items-start gap-2.5 rounded-xl px-4 py-2.5 mt-1"
                    style={{
                      border: "1px solid rgba(168,200,216,0.35)",
                      background: "rgba(237,243,248,0.60)",
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#5a90b0] mt-0.5 shrink-0" />
                    <span className="text-[11px] font-mono text-[#3a6880] tracking-wide leading-relaxed">
                      Barrackpore–Barasat Rd, Telinipara, Bara Kanthalia,<br />
                      West Bengal – 700121, India
                    </span>
                  </div>

                  {/* open maps CTA */}
                  <div>
                    <a
                      href="https://maps.app.goo.gl/7FSegJQmTCd1ng7z6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-200 hover:opacity-80"
                      style={{ color: "#1e5878" }}
                    >
                      <Navigation className="w-3 h-3" />
                      Open in Google Maps
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Google Maps iframe ── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(168,200,216,0.38)",
              boxShadow: "0 0 40px 0 rgba(90,144,176,0.12), 0 8px 24px rgba(30,72,104,0.09)",
            }}
          >
            {/* top label bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: "rgba(237,243,248,0.82)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(168,200,216,0.28)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-3.5 h-3.5 text-[#5a90b0]" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#3a6880]">
                  Campus Location
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {["bg-[#e08888]", "bg-[#e0c878]", "bg-[#88c878]"].map((c, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${c} opacity-70`} />
                ))}
              </div>
            </div>

            <iframe
              title="Swami Vivekananda University Location"
              src="https://maps.google.com/maps?q=Swami+Vivekananda+University,+Barrackpore-Barasat+Rd,+Telinipara,+Bara+Kanthalia,+West+Bengal+700121&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: "block", filter: "saturate(0.88) contrast(0.96)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* bottom shimmer */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(237,243,248,0.45), transparent)" }}
            />
          </div>

          {/* ── Travel cards grid ── */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
              <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-[#6a98b0]">How to Reach</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(90,144,176,0.2), transparent)" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* By Air */}
              <InfoCard icon={Plane} tag="Air" tagColor="teal" title="By Air" index="01">
                <p>
                  The nearest airport is <span className="text-[#1e5878] font-semibold">Netaji Subhas Chandra Bose
                  International Airport (CCU)</span>, approximately 25 km from the campus.
                </p>
                <p className="mt-1 text-[#8aa8b8]">
                  Taxis, app-based cabs, and airport shuttle services connect directly to the venue.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill><Car className="w-2.5 h-2.5" /> Cab</Pill>
                  <Pill><Bus className="w-2.5 h-2.5" /> Shuttle</Pill>
                </div>
              </InfoCard>

              {/* By Train */}
              <InfoCard icon={Train} tag="Rail" tagColor="steel" title="By Train" index="02">
                <p>
                  The nearest major railway station is <span className="text-[#2a5878] font-semibold">Howrah Junction</span>,
                  roughly 20 km from the university.
                </p>
                <p className="mt-1 text-[#8aa8b8]">
                  Reach the campus via taxi, local bus, or ride-sharing services from the station.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill><Car className="w-2.5 h-2.5" /> Taxi</Pill>
                  <Pill><Bus className="w-2.5 h-2.5" /> Local Bus</Pill>
                </div>
              </InfoCard>

              {/* By Road */}
              <InfoCard icon={Car} tag="Road" tagColor="sky" title="By Road" index="03">
                <p>
                  The university is well connected via the <span className="text-[#2a5070] font-semibold">Barrackpore–Barasat Road</span>.
                </p>
                <p className="mt-1 text-[#8aa8b8]">
                  Visitors from Durgapur, Asansol, and Kolkata city center can reach via state highways
                  and city roads with ease.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill><Car className="w-2.5 h-2.5" /> Private Car</Pill>
                  <Pill><Bus className="w-2.5 h-2.5" /> State Bus</Pill>
                </div>
              </InfoCard>
            </div>
          </div>

          {/* ── Local Transport + Landmarks row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Local Transport */}
            <InfoCard icon={Bus} tag="Local" tagColor="slate" title="Local Transport" index="04">
              <p>Frequent services operate throughout the Barrackpore–Barasat region:</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Uber / Ola", "Auto-rickshaws", "Local Buses", "Private Taxis"].map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
              <p className="mt-3 text-[#8aa8b8]">All options operate frequently, making the campus highly accessible.</p>
            </InfoCard>

            {/* Nearby Landmarks */}
            <InfoCard icon={MapPin} tag="Navigate" tagColor="mist" title="Nearby Landmarks" index="05">
              <p>Use these landmarks when navigating to the venue:</p>
              <ul className="mt-2 space-y-1.5">
                {[
                  "Barrackpore–Barasat Road",
                  "Khardah / Barrackpore Area",
                  "Bara Kanthalia Locality",
                  "Telinipara Junction",
                ].map((lm) => (
                  <li key={lm} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#7aa8b8]" />
                    <span>{lm}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </div>

          {/* ── Contact card ── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(168,200,216,0.38)",
              background: "rgba(255,255,255,0.42)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 2px 16px rgba(30,72,104,0.07)",
            }}
          >
            <div
              className="absolute inset-x-0 h-[1px] top-0"
              style={{ background: "linear-gradient(to right, transparent, rgba(90,152,128,0.4), transparent)" }}
            />

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ border: "1px solid rgba(168,200,216,0.40)", background: "rgba(237,243,248,0.7)" }}
                >
                  <UserRound className="w-4 h-4 text-[#1a4860]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1e3a58] tracking-tight">Contact Details</h3>
                  <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">06</span>
                </div>
                <Badge className="ml-auto text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border bg-[#1a4860]/10 border-[#4a88a8]/35 text-[#1a4860]">
                  Contact
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Phone, label: "Phone", values: ["+91 7044086270", "+91 7980333922"] },
                  { icon: Mail,  label: "Email",  values: ["info@swamivivekanandauniversity.ac.in"] },
                ].map(({ icon: Ic, label, values }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-xl p-3"
                    style={{ border: "1px solid rgba(168,200,216,0.28)", background: "rgba(237,243,248,0.50)" }}
                  >
                    <Ic className="w-3.5 h-3.5 text-[#5a90b0] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono tracking-widest uppercase text-[#8aa8b8]">{label}</span>
                      {values.map((v) => (
                        <p key={v} className="text-[11px] text-[#3a6880] font-mono mt-0.5">{v}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Count bar ── */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.25))" }} />
            <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest uppercase">
              5 Travel Options · 2 Contact Channels
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
            <span>Venue: <span className="text-[#1e5878]">Swami Vivekananda University</span></span>
            <span>Distance from Airport: <span className="text-[#1e5878]">~25 km</span></span>
            <span>Transport: <span className="text-[#2a4878]">ACTIVE</span></span>
            <span>QINS 2026 — <span className="text-[#1e5878]">READY</span></span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}