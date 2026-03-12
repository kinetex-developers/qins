"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Download,
  Share2,
  ZoomIn,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AttractionItem {
  id: number;
  src: string;
  thumb: string;
  title: string;
  caption: string;
  tag: string;
  tagColor: TagColor;
  category: Category;
  index: string;
}

type TagColor = "teal" | "steel" | "sky" | "slate" | "sand" | "mist";
type Category = "All" | "Monuments" | "Religious" | "Culture" | "Bridges";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ATTRACTIONS: AttractionItem[] = [
  {
    id: 1,
    src: "/victoria-memorial.jpg",
    thumb: "/victoria-memorial.jpg",
    title: "Victoria Memorial",
    caption: "A grand white-marble monument and museum built in memory of Queen Victoria, surrounded by beautiful gardens. One of Kolkata's most iconic landmarks from the British era.",
    tag: "Monument", tagColor: "teal", category: "Monuments", index: "01",
  },
  {
    id: 2,
    src: "/howrah-bridge2.jpg",
    thumb: "/howrah-bridge2.jpg",
    title: "Howrah Bridge",
    caption: "An iconic steel cantilever bridge over the Hooghly River and one of the busiest and most recognizable landmarks of the city, connecting Howrah and Kolkata.",
    tag: "Bridge", tagColor: "steel", category: "Bridges", index: "02",
  },
  {
    id: 3,
    src: "/dakshineswar-kali-temple.jpg",
    thumb: "/dakshineswar-kali-temple.jpg",
    title: "Dakshineswar Kali Temple",
    caption: "A famous riverside temple dedicated to Goddess Kali and closely associated with saint Ramakrishna Paramahamsa, drawing pilgrims and visitors from across India.",
    tag: "Temple", tagColor: "sky", category: "Religious", index: "03",
  },
  {
    id: 4,
    src: "/indian-museum.jpg",
    thumb: "/indian-museum.jpg",
    title: "Indian Museum",
    caption: "The oldest museum in India, showcasing rare fossils, artifacts, sculptures, and even an Egyptian mummy — a treasure trove of natural and human history.",
    tag: "Museum", tagColor: "slate", category: "Culture", index: "04",
  },
  {
    id: 5,
    src: "/kalighat-temple.jpg",
    thumb: "/kalighat-temple.jpg",
    title: "Kalighat Temple",
    caption: "One of the 51 sacred Shakti Peethas and a major pilgrimage site dedicated to Goddess Kali, steeped in centuries of devotion and spiritual significance.",
    tag: "Temple", tagColor: "sand", category: "Religious", index: "05",
  },
  {
    id: 6,
    src: "/st-pauls-cathedral.jpg",
    thumb: "/st-pauls-cathedral.jpg",
    title: "St. Paul's Cathedral",
    caption: "A magnificent Gothic-style Anglican cathedral known for its peaceful atmosphere and impressive colonial architecture, a cornerstone of Kolkata's heritage.",
    tag: "Heritage", tagColor: "mist", category: "Religious", index: "06",
  },
];

const CATEGORIES: Category[] = ["All", "Monuments", "Religious", "Culture", "Bridges"];

// ─── Tag colour map ────────────────────────────────────────────────────────────
const TAG_STYLES: Record<TagColor, { badge: string; glow: string; dot: string }> = {
  teal:  { badge: "bg-[#1e5878]/10 border-[#5a90b0]/35 text-[#1e5878]",  glow: "rgba(90,144,176,0.18)",  dot: "bg-[#5a90b0]"  },
  steel: { badge: "bg-[#2a6888]/10 border-[#6aa8c8]/35 text-[#2a5878]",  glow: "rgba(106,168,200,0.18)", dot: "bg-[#6aa8c8]"  },
  sky:   { badge: "bg-[#3a7090]/10 border-[#8ab8d0]/35 text-[#2a5070]",  glow: "rgba(138,184,208,0.18)", dot: "bg-[#8ab8d0]"  },
  slate: { badge: "bg-[#1a4860]/10 border-[#4a88a8]/35 text-[#1a4860]",  glow: "rgba(74,136,168,0.18)",  dot: "bg-[#4a88a8]"  },
  sand:  { badge: "bg-[#b89858]/10 border-[#c8a868]/35 text-[#6a5018]",  glow: "rgba(184,152,88,0.15)",  dot: "bg-[#c8a868]"  },
  mist:  { badge: "bg-[#5a8898]/10 border-[#7aa8b8]/35 text-[#2a5868]",  glow: "rgba(90,136,152,0.18)",  dot: "bg-[#7aa8b8]"  },
};

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
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Attraction Card ───────────────────────────────────────────────────────────
interface CardProps {
  item: AttractionItem;
  featured?: boolean;
  onOpen: (item: AttractionItem) => void;
}

function AttractionCard({ item, featured = false, onOpen }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ts = TAG_STYLES[item.tagColor];

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
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
      onClick={() => onOpen(item)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1/1", position: "relative" }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(220,232,240,0.6)" }}>
            <div className="w-7 h-7 rounded-full border-2 border-[#5a90b0]/30 border-t-[#5a90b0] animate-spin" />
          </div>
        )}

        <Image
          src={item.thumb}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s, transform 0.7s",
            filter: "saturate(0.88) contrast(0.96)" }}
          onLoad={() => setLoaded(true)}
        />

        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(237,243,248,0.85) 0%, rgba(237,243,248,0.05) 45%, transparent 100%)" }} />

        <div
          className="absolute inset-x-0 h-[1px] pointer-events-none transition-all duration-700"
          style={{
            background: "linear-gradient(to right, transparent, rgba(90,144,176,0.55), transparent)",
            top: hovered ? "45%" : "-5%",
            opacity: hovered ? 1 : 0,
          }}
        />

        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <div
            key={corner}
            className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

        <div className="absolute top-3 left-3 text-[10px] font-mono text-[#5a90b0]/60 tracking-widest">
          {item.index}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(90,144,176,0.45)", background: "rgba(237,243,248,0.85)" }}>
            <Expand className="w-4 h-4 text-[#1e5878]" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-bold text-[#1e3a58] tracking-tight leading-snug">
            {item.title}
          </h3>
          <Badge
            className={`shrink-0 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${ts.badge}`}
          >
            {item.tag}
          </Badge>
        </div>

        <p className="text-[11px] text-[#6a8898] leading-relaxed line-clamp-2">
          {item.caption}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${ts.dot}`} />
          <div className="h-px flex-1"
            style={{ background: "linear-gradient(to right, rgba(90,144,176,0.25), transparent)" }} />
          <span className="text-[9px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
        </div>
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  item: AttractionItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  allItems: AttractionItem[];
  onJump: (item: AttractionItem) => void;
}

function Lightbox({ item, onClose, onPrev, onNext, allItems, onJump }: LightboxProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { setImgLoaded(false); }, [item?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPrev, onNext, onClose]);

  if (!item) return null;
  const ts = TAG_STYLES[item.tagColor];

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-5xl w-full p-0 rounded-2xl overflow-hidden gap-0"
        style={{
          background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 60%, #dce8f0 100%)",
          border: "1px solid rgba(168,200,216,0.45)",
          boxShadow: `0 0 80px 0 ${ts.glow}, 0 24px 64px rgba(30,72,104,0.18)`,
        }}
      >
        <DialogTitle className="sr-only">{item.title}</DialogTitle>
        <DialogDescription className="sr-only">{item.caption}</DialogDescription>

        <div className="relative" style={{ maxHeight: "62vh", background: "rgba(220,232,240,0.5)" }}>
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(225,235,243,0.8)" }}>
              <div className="w-8 h-8 rounded-full border-2 border-[#5a90b0]/30 border-t-[#5a90b0] animate-spin" />
            </div>
          )}
          <img
            src={item.src}
            alt={item.title}
            className="w-full object-contain"
            style={{
              maxHeight: "62vh",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s",
              filter: "saturate(0.88) contrast(0.96)",
            }}
            onLoad={() => setImgLoaded(true)}
          />

          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3"
            style={{ background: "linear-gradient(to bottom, rgba(237,243,248,0.85), transparent)" }}>
            <span className="text-[10px] font-mono text-[#5a90b0]/70 tracking-widest">
              {item.index} / {String(allItems.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost"
                    className="w-7 h-7 rounded-full text-[#5a8898] hover:text-[#1e5878] hover:bg-[#5a90b0]/10">
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs font-mono"
                  style={{ background: "#1a3a50", border: "1px solid rgba(90,144,176,0.3)", color: "#a8ccd8" }}>
                  Share image
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost"
                    className="w-7 h-7 rounded-full text-[#5a8898] hover:text-[#1e5878] hover:bg-[#5a90b0]/10">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs font-mono"
                  style={{ background: "#1a3a50", border: "1px solid rgba(90,144,176,0.3)", color: "#a8ccd8" }}>
                  Download
                </TooltipContent>
              </Tooltip>
              <Button size="icon" variant="ghost"
                className="w-7 h-7 rounded-full text-[#5a8898] hover:text-[#1e3a58] hover:bg-[#5a90b0]/10"
                onClick={onClose}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <Button size="icon" variant="ghost"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-[#5a8898] hover:text-[#1e5878]"
            style={{ border: "1px solid rgba(168,200,216,0.45)", background: "rgba(237,243,248,0.82)" }}
            onClick={onPrev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-[#5a8898] hover:text-[#1e5878]"
            style={{ border: "1px solid rgba(168,200,216,0.45)", background: "rgba(237,243,248,0.82)" }}
            onClick={onNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${ts.badge}`}>
                  {item.tag}
                </Badge>
                <Separator orientation="vertical" className="h-3 bg-[#a8c8d8]/40" />
                <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest">QINS 2026</span>
              </div>
              <h2 className="text-lg font-bold text-[#1e3a58] tracking-tight">{item.title}</h2>
              <p className="text-xs text-[#6a8898] leading-relaxed max-w-xl">{item.caption}</p>
            </div>
          </div>

          <div>
            <Separator className="mb-3" style={{ background: "rgba(168,200,216,0.28)" }} />
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allItems.map((g) => (
                <button
                  key={g.id}
                  onClick={() => onJump(g)}
                  className="shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                  style={{
                    width: 56, height: 40,
                    border: g.id === item.id
                      ? "1.5px solid rgba(90,144,176,0.75)"
                      : "1px solid rgba(168,200,216,0.30)",
                    opacity:   g.id === item.id ? 1 : 0.5,
                    transform: g.id === item.id ? "scale(1.06)" : "scale(1)",
                    boxShadow: g.id === item.id ? `0 0 10px ${TAG_STYLES[g.tagColor].glow}` : "none",
                  }}
                >
                  <img src={g.thumb} alt={g.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Attractions Page ─────────────────────────────────────────────────────
export default function AttractionsPage() {
  const [active, setActive]     = useState<AttractionItem | null>(null);
  const [category, setCategory] = useState<Category>("All");

  const filtered = category === "All"
    ? ATTRACTIONS
    : ATTRACTIONS.filter((g) => g.category === category);

  const open  = useCallback((item: AttractionItem) => setActive(item), []);
  const close = useCallback(() => setActive(null), []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (!active) return;
      const idx = filtered.findIndex((g) => g.id === active.id);
      setActive(filtered[(idx + dir + filtered.length) % filtered.length]);
    },
    [active, filtered]
  );

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
          <div className="absolute inset-0 opacity-[0.032]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(80,130,170,0.28) 40px)" }} />
        </div>

        <BridgeCanvas />

        {/* ── Header ── */}
        <header className="relative z-10 pt-20 pb-10 text-center px-6">

          <div className="mb-5">
            <span className="text-[#4a7890]/65 text-sm"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", letterSpacing: "0.05em" }}>
              Kolkata, West Bengal · India
            </span>
          </div>

          <div className="relative mb-2">
            <div aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ filter: "blur(38px)", opacity: 0.18 }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.2rem, 7vw, 4.8rem)",
                fontWeight: 900, color: "#3a78a0", lineHeight: 1,
              }}>Attractions</span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.2rem, 7vw, 4.8rem)",
              fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em",
              background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", position: "relative", zIndex: 1,
            }}>Famous Tourist Spots</h1>
          </div>

          <p className="text-[10px] text-[#4a8098]/65 tracking-[0.5em] uppercase font-mono mt-3 mb-5">
            Heritage · Culture · Spirituality · Architecture
          </p>

          {/* Separator */}
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
            <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest">✦</span>
            <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.35))" }} />
          </div>

          {/* Category tabs */}
          <Tabs value={category} onValueChange={(v) => setCategory(v as Category)} className="inline-flex">
            <TabsList className="rounded-full p-1 gap-0.5"
              style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(168,200,216,0.35)", backdropFilter: "blur(8px)" }}>
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full text-[11px] font-mono tracking-widest uppercase px-4 py-1.5 transition-all duration-200"
                  style={{
                    color: category === cat ? "#1e5878" : "#6a98b0",
                  }}
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </header>

        {/* ── Grid ── */}
        <main className="relative z-10 max-w-6xl mx-auto px-5 pb-28">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 font-mono text-sm tracking-widest text-[#8aa8b8]">
              <ZoomIn className="w-8 h-8 mb-3 text-[#a8c8d8]" />
              No items in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => (
                <AttractionCard
                  key={item.id}
                  item={item}
                  onOpen={open}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.25))" }} />
            <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest uppercase">
              {filtered.length} of {ATTRACTIONS.length} attractions
            </span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.25))" }} />
          </div>
        </main>

        {/* ── Lightbox ── */}
        <Lightbox
          item={active}
          onClose={close}
          onPrev={() => navigate(-1)}
          onNext={() => navigate(1)}
          allItems={filtered}
          onJump={setActive}
        />

        {/* ── Status bar ── */}
        <div
          className="fixed bottom-0 inset-x-0 z-20 border-t border-[#5a90b0]/14 backdrop-blur-sm"
          style={{ background: "rgba(210,228,240,0.55)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#6898b0]/65 uppercase tracking-widest">
            <span>City of Joy: <span className="text-[#1e5878]">Kolkata, India</span></span>
            <span>Attractions: <span className="text-[#1e5878]">{filtered.length} Spots · {category}</span></span>
            <span>Heritage: <span className="text-[#2a4878]">ACTIVE</span></span>
            <span>QINS 2026 — <span className="text-[#1e5878]">READY</span></span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}