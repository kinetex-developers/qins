"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  BookOpen,
  FlaskConical,
  Users,
  Trophy,
  Building2,
  GraduationCap,
  Globe,
  Lightbulb,
  Heart,
} from "lucide-react";

// ─── Bridge Lattice Canvas ─────────────────────────────────────────────────────
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

// ─── Frosted prose card ────────────────────────────────────────────────────────
function ProseCard({
  icon: Icon,
  tag,
  tagColor,
  title,
  index,
  children,
}: {
  icon: React.ElementType;
  tag: string;
  tagColor: "teal" | "steel" | "sky" | "slate" | "sand" | "mist";
  title: string;
  index: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const colorMap = {
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
      className="relative rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        border: "1px solid rgba(168,200,216,0.30)",
        background: "rgba(255,255,255,0.42)",
        backdropFilter: "blur(12px)",
        boxShadow: hovered
          ? `0 0 40px 0 ${ts.glow}, 0 8px 32px rgba(30,72,104,0.12)`
          : "0 2px 16px rgba(30,72,104,0.07)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <div
          key={corner}
          className="absolute w-5 h-5 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
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

      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ border: "1px solid rgba(168,200,216,0.40)", background: "rgba(237,243,248,0.7)" }}
            >
              <Icon className={`w-4 h-4 ${ts.icon}`} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#1e3a58] tracking-tight leading-snug">{title}</h3>
              <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">{index}</span>
            </div>
          </div>
          <Badge className={`shrink-0 text-[9px] font-mono tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-full border ${ts.badge}`}>
            {tag}
          </Badge>
        </div>

        <div className="text-[11px] sm:text-[11.5px] text-[#6a8898] leading-relaxed space-y-2">{children}</div>

        <div className="mt-4 flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${ts.dot}`} />
          <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(90,144,176,0.25), transparent)" }} />
          <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
        </div>
      </div>
    </div>
  );
}

// ─── Achievement bullet ────────────────────────────────────────────────────────
function AchievementItem({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ border: "1px solid rgba(168,200,216,0.38)", background: "rgba(237,243,248,0.65)" }}
      >
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <p className="text-[11px] sm:text-[11.5px] text-[#6a8898] leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UniversityPage() {
  return (
    <TooltipProvider>
      {/*
        LAYOUT — position:fixed image, scroll-offset content
        -----------------------------------------------------
        The <style> block below defines two utility classes:
          .svu-img-panel   — position:fixed, covers full viewport
                            Mobile : full width, 44vw tall (top strip)
                            Desktop: 42% wide, 100vh tall (left column)
          .svu-content     — normal flow div, padded to clear the fixed panel
                            Mobile : padding-top: 44vw
                            Desktop: padding-left: 42%, padding-top: 0
        Because position:fixed removes the element from the document flow
        entirely, scrolling NEVER affects the image on any device.
      */}
      <style>{`
        /*
          --navbar-h: height of your site navbar.
          Change this one value if your navbar height differs.
        */
        /*
          Single source of truth for navbar height — matches navbar's h-14 class (56px).
          Update this one variable if the navbar height ever changes.
        */
        :root { --navbar-h: 56px; }

        /* Both mobile and desktop: panel always starts below the navbar */
        .svu-img-panel {
          position: fixed;
          top: var(--navbar-h);
          left: 0;
          z-index: 20;
          width: 100%;
          height: 44vw;
        }
        .svu-content {
          /* mobile: clear navbar + image strip */
          padding-top: calc(var(--navbar-h) + 44vw);
          padding-left: 0;
        }
        @media (min-width: 1024px) {
          .svu-img-panel {
            top: var(--navbar-h);                      /* offset below navbar on desktop too */
            width: 42%;
            height: calc(100vh - var(--navbar-h));     /* fill remaining viewport height */
          }
          .svu-content {
            padding-top: 0;
            padding-left: 42%;
          }
        }
      `}</style>

      <div
        className="relative min-h-screen w-full"
        style={{
          background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 40%, #dce8f0 68%, #e4ddd2 100%)",
          fontFamily: "'Syne', 'Georgia', sans-serif",
        }}
      >
        {/* Atmosphere */}
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

        {/* ══ FIXED IMAGE PANEL — position:fixed, immune to scroll ══ */}
        <div className="svu-img-panel">
          {/*
            Mobile  : single relative box, video fills it as object-cover (same as before)
            Desktop : flex column — video on top (aspect-ratio preserved via padding trick),
                      caption tag fills the remaining height below naturally
          */}

          {/* ── MOBILE layout: simple cover fill ── */}
          <div className="relative w-full h-full overflow-hidden lg:hidden">
            <video
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(0.82) contrast(0.94) brightness(0.96)" }}
            >
              <source src="https://svuwebsite.s3.ap-south-1.amazonaws.com/swamibannervideonew.mp4" type="video/mp4" />
            </video>

            {/* gradient */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to bottom, rgba(237,243,248,0.12) 0%, rgba(237,243,248,0.68) 100%)",
            }} />

            {/* scan line */}
            <div className="absolute inset-x-0 top-0 h-[1px]"
              style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.5), transparent)" }} />

            {/* index */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-[#5a90b0]/60 tracking-widest">00</div>

            {/* tl bracket */}
            <div className="absolute w-6 h-6" style={{
              top: 16, left: 16,
              borderTop: "1px solid rgba(90,144,176,0.55)",
              borderLeft: "1px solid rgba(90,144,176,0.55)",
            }} />

            {/* Caption pill — overlaid on video, mobile only */}
            <div className="absolute bottom-4 left-4 right-4">
              <div
                className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2"
                style={{
                  border: "1px solid rgba(168,200,216,0.40)",
                  background: "rgba(237,243,248,0.78)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Building2 className="w-3.5 h-3.5 text-[#5a90b0] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[#3a6880]">
                    Swami Vivekananda University
                  </p>
                  <p className="text-[9px] font-mono text-[#8aa8b8] tracking-wider">
                    Est. 2019 · West Bengal, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── DESKTOP layout: video top + caption bottom ── */}
          <div
            className="hidden lg:flex flex-col w-full h-full"
            style={{
              background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 60%, #dce8f0 100%)",
            }}
          >
            {/* Video — aspect ratio 16/9, sits at top */}
            <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9" }}>
              <video
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "saturate(0.82) contrast(0.94) brightness(0.96)" }}
              >
                <source src="https://svuwebsite.s3.ap-south-1.amazonaws.com/swamibannervideonew.mp4" type="video/mp4" />
              </video>

              {/* right-edge fade into page bg */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, transparent 55%, rgba(226,236,245,0.90) 100%)",
              }} />

              {/* scan line */}
              <div className="absolute inset-x-0 top-0 h-[1px]"
                style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.5), transparent)" }} />

              {/* index + tl bracket */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-[#5a90b0]/60 tracking-widest">00</div>
              <div className="absolute w-6 h-6" style={{
                top: 16, left: 16,
                borderTop: "1px solid rgba(90,144,176,0.55)",
                borderLeft: "1px solid rgba(90,144,176,0.55)",
              }} />
              <div className="absolute w-6 h-6" style={{
                top: 16, right: 16,
                borderTop: "1px solid rgba(90,144,176,0.45)",
                borderRight: "1px solid rgba(90,144,176,0.45)",
              }} />
            </div>

            {/* Remaining space below video — caption lives here */}
            <div className="flex-1 flex flex-col items-start justify-center px-6 py-6 gap-4">

              {/* Separator line */}
              <div className="w-full h-[1px]"
                style={{ background: "linear-gradient(to right, rgba(90,144,176,0.3), transparent)" }} />

              {/* Caption card */}
              <div
                className="inline-flex items-center gap-3 rounded-xl px-4 py-3 w-full"
                style={{
                  border: "1px solid rgba(168,200,216,0.40)",
                  background: "rgba(255,255,255,0.50)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 16px rgba(30,72,104,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ border: "1px solid rgba(168,200,216,0.40)", background: "rgba(237,243,248,0.80)" }}
                >
                  <Building2 className="w-4 h-4 text-[#5a90b0]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold font-mono tracking-widest uppercase text-[#1e3a58]">
                    Swami Vivekananda University
                  </p>
                  <p className="text-[9px] font-mono text-[#8aa8b8] tracking-wider mt-0.5">
                    Est. 2019 · West Bengal, India
                  </p>
                </div>
              </div>

              {/* QINS tag */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#5a90b0]" />
                <div className="h-px w-12" style={{ background: "linear-gradient(to right, rgba(90,144,176,0.3), transparent)" }} />
                <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
              </div>

              {/* br bracket at bottom-right of entire column */}
              <div className="mt-auto self-end w-6 h-6" style={{
                borderBottom: "1px solid rgba(90,144,176,0.45)",
                borderRight: "1px solid rgba(90,144,176,0.45)",
              }} />
            </div>
          </div>
        </div>

        {/* ══ SCROLLABLE CONTENT — offset clears the fixed image panel ══ */}
        <div className="svu-content relative z-10">

          <header className="pt-8 sm:pt-14 pb-6 sm:pb-10 px-4 sm:px-6 md:px-10 text-left">
            <div className="mb-4">
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
                className="absolute inset-0 pointer-events-none"
                style={{ filter: "blur(32px)", opacity: 0.16 }}
              >
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(1.5rem, 6vw, 3.8rem)",
                  fontWeight: 900, color: "#3a78a0", lineHeight: 1,
                }}>
                  About the University
                </span>
              </div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.5rem, 6vw, 3.8rem)",
                fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em",
                background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", position: "relative", zIndex: 1,
              }}>
                About the University
              </h1>
            </div>

            <p className="text-[9px] sm:text-[10px] text-[#4a8098]/65 tracking-[0.25em] sm:tracking-[0.45em] uppercase font-mono mt-2 sm:mt-3 mb-4 sm:mb-5">
              History · Academics · Achievements · Vision
            </p>

            <div className="flex items-center gap-3">
              <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
              <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest">✦</span>
              <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.35))" }} />
            </div>
          </header>

          <main className="px-4 sm:px-6 md:px-10 pb-32 sm:pb-28 space-y-4 sm:space-y-6">

            <ProseCard icon={Building2} tag="Overview" tagColor="teal" title="Swami Vivekananda University" index="01">
              <p>
                Swami Vivekananda University is a{" "}
                <span className="text-[#1e5878] font-semibold">multidisciplinary private university</span>{" "}
                located near Kolkata, India, established under the{" "}
                <span className="text-[#1e5878] font-semibold">West Bengal Act XIII of 2019</span>.
              </p>
              <p>
                With a vision of promoting quality higher education, research, and innovation across diverse
                academic fields, the university stands as a modern institution rooted in value-based learning.
              </p>
            </ProseCard>

            <ProseCard icon={BookOpen} tag="History" tagColor="steel" title="Our History" index="02">
              <p>
                Founded by the{" "}
                <span className="text-[#2a5878] font-semibold">Ramakrishna Vivekananda Mission</span> — an
                organization dedicated to expanding educational opportunities and fostering value-based
                learning inspired by the teachings of Swami Vivekananda.
              </p>
              <p>
                Since its establishment, the university has steadily expanded its academic programs,
                infrastructure, and research activities to meet the growing demand for modern and
                industry-relevant education.
              </p>
            </ProseCard>

            <ProseCard icon={GraduationCap} tag="Academics" tagColor="sky" title="Academic Excellence" index="03">
              <p>
                The university offers a wide range of{" "}
                <span className="text-[#2a5070] font-semibold">
                  undergraduate, postgraduate, and doctoral programs
                </span>{" "}
                across disciplines including:
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                {["Engineering", "Management", "Science", "Humanities", "Agriculture", "Allied Fields"].map((d) => (
                  <span
                    key={d}
                    className="text-[9px] sm:text-[10px] font-mono tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                    style={{
                      border: "1px solid rgba(138,184,208,0.40)",
                      background: "rgba(237,243,248,0.65)",
                      color: "#3a6880",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <p className="mt-2">
                The institution emphasizes a balanced approach integrating theoretical knowledge with
                practical training, research, and industry exposure.
              </p>
            </ProseCard>

            {/* Achievements card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(168,200,216,0.30)",
                background: "rgba(255,255,255,0.42)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 2px 16px rgba(30,72,104,0.07)",
              }}
            >
              <div
                className="absolute inset-x-0 h-[1px] top-0"
                style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.55), transparent)" }}
              />
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ border: "1px solid rgba(168,200,216,0.40)", background: "rgba(237,243,248,0.7)" }}
                    >
                      <Trophy className="w-4 h-4 text-[#6a5018]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a58] tracking-tight">Achievements &amp; Growth</h3>
                      <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">04</span>
                    </div>
                  </div>
                  <Badge className="shrink-0 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border bg-[#b89858]/10 border-[#c8a868]/35 text-[#6a5018]">
                    Milestones
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  <AchievementItem icon={Building2} color="text-[#1e5878]"
                    text="Development of a modern campus with advanced laboratories, smart classrooms, and digital learning facilities." />
                  <Separator style={{ background: "rgba(168,200,216,0.22)" }} />
                  <AchievementItem icon={FlaskConical} color="text-[#2a5070]"
                    text="Expansion of academic departments and research initiatives across multiple disciplines." />
                  <Separator style={{ background: "rgba(168,200,216,0.22)" }} />
                  <AchievementItem icon={Globe} color="text-[#2a5878]"
                    text="Active participation of students in national and international conferences, technical competitions, and innovation programs." />
                  <Separator style={{ background: "rgba(168,200,216,0.22)" }} />
                  <AchievementItem icon={Users} color="text-[#1a4860]"
                    text="Industry collaborations and training programs aimed at improving employability and practical skills." />
                  <Separator style={{ background: "rgba(168,200,216,0.22)" }} />
                  <AchievementItem icon={Heart} color="text-[#6a5018]"
                    text="A vibrant campus environment that encourages cultural, technical, and social initiatives." />
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#c8a868]" />
                  <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(184,152,88,0.3), transparent)" }} />
                  <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
                </div>
              </div>
            </div>

            <ProseCard icon={Lightbulb} tag="Vision" tagColor="mist" title="Guided by Ideals" index="05">
              <p>
                Guided by the ideals of{" "}
                <span className="text-[#2a5868] font-semibold">Swami Vivekananda</span>, the university aims
                to nurture knowledge, character, and service — preparing students to contribute meaningfully
                to society.
              </p>
              <p>
                The institution addresses global challenges through innovation and responsible leadership,
                upholding its founding mission of value-based, transformative education.
              </p>
            </ProseCard>

            <div className="flex items-center justify-center gap-3 mt-4 mb-2">
              <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.25))" }} />
              <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest uppercase">
                5 Sections · Est. 2019
              </span>
              <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.25))" }} />
            </div>
          </main>
        </div>

        {/* Status bar */}
        <div
          className="fixed bottom-0 inset-x-0 z-30 border-t border-[#5a90b0]/14 backdrop-blur-sm"
          style={{ background: "rgba(210,228,240,0.55)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono text-[#6898b0]/65 uppercase tracking-widest overflow-hidden">
            <span className="truncate">Institution: <span className="text-[#1e5878]">SVU</span><span className="hidden sm:inline text-[#1e5878]"> · Swami Vivekananda University</span></span>
            <span className="hidden md:inline shrink-0">Est: <span className="text-[#1e5878]">West Bengal Act XIII of 2019</span></span>
            <span className="hidden sm:inline shrink-0">Status: <span className="text-[#2a4878]">ACTIVE</span></span>
            <span className="shrink-0">QINS <span className="text-[#1e5878]">2026</span></span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}