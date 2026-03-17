"use client";

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TemplateButtonProps {
  label: string;
  variant: "word" | "latex";
  href: string;
}

interface QuickRef {
  label: string;
  value: string;
  color: "blue" | "gold" | "green" | "purple";
}

type QuickRefStyle = { wrap: string; label: string; value: string };
type QuickRefStyleMap = Record<QuickRef["color"], QuickRefStyle>;

// ─── Constants ────────────────────────────────────────────────────────────────
const TEMPLATE_BUTTONS: TemplateButtonProps[] = [
  { label: "Microsoft Word Template", variant: "word", href: "#" },
  { label: "LaTeX Template", variant: "latex", href: "#" },
];

const QUICK_REFS: QuickRef[] = [
  { label: "Format", value: "PDF · DOC/RTF", color: "blue" },
  { label: "Pages", value: "Max 12 Pages", color: "gold" },
  { label: "Style", value: "LNAI / LNNNS", color: "green" },
  { label: "Preferred", value: "LaTeX · PDF", color: "purple" },
];

const QUICK_REF_STYLES: QuickRefStyleMap = {
  blue:   { wrap: "bg-[#2a7090]/[0.07] border border-[#2a7090]/[0.18]", label: "text-[#5a90b0]", value: "text-[#1e3a58]" },
  gold:   { wrap: "bg-[#c8a858]/[0.08] border border-[#c8a858]/[0.22]", label: "text-[#a88040]", value: "text-[#3a2808]" },
  green:  { wrap: "bg-[#2aa064]/[0.07] border border-[#2aa064]/[0.18]", label: "text-[#2a7050]", value: "text-[#1a3828]" },
  purple: { wrap: "bg-[#5a5a8c]/[0.06] border border-[#5a5a8c]/[0.16]", label: "text-[#5a5a98]", value: "text-[#28284a]" },
};

// ─── Bridge Lattice Canvas ────────────────────────────────────────────────────
function BridgeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      r: number; phase: number;
      type: "primary" | "secondary";
    }

    const nodes: Node[] = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.5,
      phase: Math.random() * Math.PI * 2,
      type: i < 10 ? "primary" : "secondary",
    }));

    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.008;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.18;
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + nodes[i].phase);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(60,120,165,${alpha * pulse * 2.2})`;
            ctx.lineWidth = 0.6;
            ctx.setLineDash([4, 8]);
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.8 + n.phase);
        if (n.type === "primary") {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
          grd.addColorStop(0, `rgba(42,130,190,${pulse})`);
          grd.addColorStop(1, "rgba(90,160,200,0)");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle =
          n.type === "primary"
            ? `rgba(60,160,220,${pulse})`
            : `rgba(90,155,195,${0.85 * pulse})`;
        ctx.fill();
      });

      const cx = W / 2;
      const cy = H / 2;
      [140, 220, 310, 420].forEach((rx, i) => {
        const rot = t * (0.1 + i * 0.04) + (i * Math.PI) / 4;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, rx * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(90,148,188,${0.08 + i * 0.025})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="#2a7090" strokeWidth="1.4" fill="none" />
      <line x1="5" y1="5" x2="9" y2="5" stroke="#2a7090" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5" y1="7.5" x2="10" y2="7.5" stroke="#2a7090" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5" y1="10" x2="8" y2="10" stroke="#2a7090" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L9.5 6H14L10.5 8.5L12 12L8 9.5L4 12L5.5 8.5L2 6H6.5L8 2Z"
        stroke="#c8a868"
        strokeWidth="1.3"
        fill="rgba(200,168,88,0.15)"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
      <circle cx="4" cy="4" r="3" stroke="#c8a868" strokeWidth="1" />
      <path d="M4 2.5V4.5L5.2 5.5" stroke="#c8a868" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

// ─── Template Button ──────────────────────────────────────────────────────────
function TemplateButton({ label, variant, href }: TemplateButtonProps) {
  const isLatex = variant === "latex";

  const baseClass =
    "inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-[10px] font-bold tracking-[0.08em] uppercase transition-all duration-200 no-underline hover:-translate-y-px hover:shadow-[0_2px_12px_rgba(42,112,144,0.12)]";

  const variantClass = isLatex
    ? "bg-[#2a8c64]/[0.09] border border-[#2a8c64]/40 text-[#1a5840] hover:bg-[#2a8c64]/[0.17]"
    : "bg-[#2a7090]/10 border border-[#2a7090]/35 text-[#1e5878] hover:bg-[#2a7090]/[0.18]";

  const iconBg = isLatex ? "bg-[#2a7058]" : "bg-[#1e5878]";
  const iconLetter = isLatex ? "L" : "W";

  return (
    <a href={href} className={`${baseClass} ${variantClass}`}>
      <span className={`w-4 h-4 rounded-[3px] flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <text x="1.5" y="8" fontSize="7" fill="white" fontFamily="serif" fontWeight="bold">
            {iconLetter}
          </text>
        </svg>
      </span>
      {label}
    </a>
  );
}

// ─── Shared Primitives ────────────────────────────────────────────────────────
function InfoRow({
  dotColor = "teal",
  children,
  className = "",
}: {
  dotColor?: "teal" | "gold";
  children: React.ReactNode;
  className?: string;
}) {
  const dotClass = dotColor === "gold" ? "bg-[#c8a868]" : "bg-[#5a90b0]";
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotClass}`} />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#5a90b0] mb-1">
      {children}
    </p>
  );
}

function CardDivider() {
  return <div className="h-px bg-[#a8c8d8]/25 my-4" />;
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#5a8898]/70 mb-2.5">
      {children}
    </p>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-[0.18em] uppercase border border-[#c8a868]/35 bg-[#c8a868]/10 text-[#6a5018] ${className}`}>
      {children}
    </span>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-sm overflow-hidden bg-white/[0.38] border border-[#a8c8d8]/32 backdrop-blur-[14px] transition-all duration-300 hover:bg-white/[0.56] hover:shadow-[0_8px_40px_rgba(30,88,120,0.10)] hover:-translate-y-0.5 ${className}`}>
      {children}
    </div>
  );
}

// ─── Card Header ─────────────────────────────────────────────────────────────
function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#a8c8d8]/22">
      <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 bg-[#2a7090]/[0.12]">
        {icon}
      </div>
      <span
        className="text-sm font-bold tracking-tight text-[#1e3a58]"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </span>
    </div>
  );
}

// ─── Submission Guidelines Card ───────────────────────────────────────────────
function SubmissionCard() {
  const linkClass =
    "text-[#2a7090] underline decoration-[#2a7090]/35 underline-offset-2 hover:text-[#1e5878] transition-colors";

  return (
    <GlassCard>
      <CardHeader icon={<DocIcon />} title="Submission Guidelines" />
      <div className="p-5">

        <InfoRow dotColor="gold">
          <RowLabel>Paper Length</RowLabel>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[22px] font-black text-[#1e4a68] leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              12
            </span>
            <span className="font-mono text-[11px] text-[#5a8898] tracking-[0.1em] uppercase">
              Pages
            </span>
            <Badge>Springer LNAI/LNNNS</Badge>
          </div>
        </InfoRow>

        <CardDivider />

        <InfoRow dotColor="teal">
          <RowLabel>Template</RowLabel>
          <div className="text-[13px] text-[#1e3a58] leading-relaxed">
            Authors <strong>must</strong> use Springer LNAI/LNNNS manuscript submission
            guidelines{" "}
            <a href="#" className={linkClass}>
              (available here)
            </a>
            {" "}for initial submissions of Full/Short papers. All papers must be submitted
            electronically in <strong>PDF</strong> and <strong>DOC/RTF</strong> format.
          </div>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#5a8898]/70 mt-3 mb-2">
            Style files available here
          </p>
          <div className="flex flex-wrap gap-2.5">
            {TEMPLATE_BUTTONS.map((btn) => (
              <TemplateButton key={btn.variant} {...btn} />
            ))}
          </div>
        </InfoRow>

        <CardDivider />

        <InfoRow dotColor="teal" className="mb-0">
          <RowLabel>Format Preference</RowLabel>
          <div className="text-[13px] text-[#1e3a58] leading-relaxed">
            We accept submissions in PDF, PS, and DOC/RTF — however, it is{" "}
            <strong>strongly recommended</strong> to use LaTeX and submit PDF files.
          </div>
        </InfoRow>

        <div className="flex gap-2.5 mt-4 p-3 rounded-sm bg-[#b89858]/[0.08] border border-[#c8a868]/22">
          <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
          <p className="text-[11.5px] text-[#5a4010] leading-relaxed">
            <strong className="text-[#3a2808]">Publications:</strong> Accepted and presented
            conference papers will be submitted for possible publication in the Springer-Nature
            Lecture Notes in Networks (LNNS) series <em>(Scopus Indexed)</em>.
          </p>
        </div>

      </div>
    </GlassCard>
  );
}

// ─── Publication Partner Card ─────────────────────────────────────────────────
function PublicationCard() {
  return (
    <GlassCard>
      <CardHeader icon={<StarIcon />} title="Publication Partner: Springer" />
      <div className="p-5">

        <InfoRow dotColor="teal">
          <div className="text-[13px] text-[#1e3a58] leading-relaxed">
            The proceedings of the conference will be published by{" "}
            <strong>Springer</strong>, a leading academic publisher.
          </div>
        </InfoRow>

        <InfoRow dotColor="gold" className="mb-0">
          <div className="text-[13px] text-[#1e3a58] leading-relaxed">
            Papers will be indexed in <strong>Scopus</strong>, an internationally recognised
            database of academic research — providing credibility and visibility to participants.
          </div>
        </InfoRow>

        <div className="flex flex-wrap items-center gap-3 mt-4 mb-1">
          <div className="flex items-center gap-2 px-4 py-2 rounded-sm border border-[#a8c8d8]/32 bg-white/[0.48] hover:shadow-[0_2px_12px_rgba(30,88,120,0.08)] transition-shadow">
            <div className="w-5 h-5 rounded-[4px] bg-[#d83a00] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7C3 4.8 4.8 3 7 3C9.2 3 11 4.8 11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="7" r="1.5" fill="white" />
              </svg>
            </div>
            <span
              className="text-sm font-bold text-[#1e3a58] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Springer
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-sm border border-[#a8c8d8]/32 bg-white/[0.48] hover:shadow-[0_2px_12px_rgba(30,88,120,0.08)] transition-shadow">
            <div className="w-2 h-2 rounded-full bg-[#e07000] flex-shrink-0" />
            <span
              className="text-sm font-bold text-[#e07000] tracking-tight italic"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Scopus
            </span>
          </div>
        </div>

        <CardDivider />

        <SubLabel>Publications</SubLabel>
        <InfoRow dotColor="gold" className="mb-0">
          <div className="text-[13px] text-[#1e3a58] leading-relaxed">
            Accepted and presented conference papers will be submitted for possible publication
            in the{" "}
            <strong>Springer-Nature Lecture Notes in Networks (LNNS) series</strong>{" "}
            (Scopus Indexed).
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <Badge>
              <ClockIcon />
              Scopus Indexed
            </Badge>
            <Badge>LNNS Series</Badge>
          </div>
        </InfoRow>

        <CardDivider />

        <SubLabel>Quick Reference</SubLabel>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_REFS.map(({ label, value, color }) => {
            const s = QUICK_REF_STYLES[color];
            return (
              <div key={label} className={`p-2.5 rounded-sm ${s.wrap}`}>
                <p className={`font-mono text-[9px] tracking-[0.15em] uppercase mb-1 ${s.label}`}>
                  {label}
                </p>
                <p
                  className={`text-[12px] font-bold ${s.value}`}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {value}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </GlassCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubmissionPage() {
  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 40%, #dce8f0 68%, #e4ddd2 100%)",
        fontFamily: "'Syne', 'Georgia', sans-serif",
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-8%] left-[5%] w-[55vw] h-[40vw] rounded-full bg-[#9fc9ec]/45 blur-[95px]" />
        <div className="absolute top-[15%] right-[-8%] w-[38vw] h-[32vw] rounded-full bg-[#8ab8d0]/35 blur-[80px]" />
        <div className="absolute bottom-[-8%] left-[8%] right-[8%] h-[38vh] rounded-full bg-[#e0c898]/40 blur-[75px]" />
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
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.2rem, 7vw, 5rem)",
                fontWeight: 900,
                color: "#3a78a0",
                lineHeight: 1,
              }}
            >
              Submission
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.2rem, 7vw, 5rem)",
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
            Guidelines
          </h1>
        </div>

        <p className="text-[10px] text-[#4a8098]/65 tracking-[0.5em] uppercase font-mono mt-3 mb-5">
          Quantum · Networks · Intelligence · Systems
        </p>

        <div className="flex items-center gap-3 justify-center">
          <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
          <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest">|ψ⟩</span>
          <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.35))" }} />
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-5 pb-28">
        <div className="h-px bg-[#a8c8d8]/28 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubmissionCard />
          <PublicationCard />
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.25))" }} />
          <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest uppercase">
            Springer LNNS · Scopus Indexed · 2026
          </span>
          <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.25))" }} />
        </div>
      </main>

      <div
        className="fixed bottom-0 inset-x-0 z-20 border-t border-[#5a90b0]/14 backdrop-blur-sm"
        style={{ background: "rgba(210,228,240,0.55)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#6898b0]/65 uppercase tracking-widest">
          <span>System State: <span className="text-[#1e5878]">|Ψ⟩ = α|0⟩ + β|1⟩</span></span>
          <span>Submission: <span className="text-[#1e5878]">12 Pages · Springer LNAI</span></span>
          <span>Indexed: <span className="text-[#2a4878]">SCOPUS</span></span>
          <span>Conference.exe — <span className="text-[#1e5878]">READY</span></span>
        </div>
      </div>
    </div>
  );
}