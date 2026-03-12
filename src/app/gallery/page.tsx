"use client";

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
interface GalleryItem {
  id: number;
  src: string;
  thumb: string;
  title: string;
  caption: string;
  tag: string;
  tagColor: TagColor;
  category: Category;
  index: string; // e.g. "01"
}

type TagColor = "cyan" | "violet" | "sky" | "indigo" | "emerald" | "rose";
type Category = "All" | "Campus" | "Events" | "Academic" | "Students";

// ─── Data ─────────────────────────────────────────────────────────────────────
const GALLERY: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=70",
    title: "Vivekananda College — Main Building",
    caption:
      "The iconic main facade of Vivekananda College on Thakurpukur Road, Kolkata — a landmark of higher education in West Bengal since 1946.",
    tag: "Campus",
    tagColor: "cyan",
    category: "Campus",
    index: "01",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=70",
    title: "Annual Convocation Ceremony",
    caption:
      "Graduates of the 2024 batch receiving their degrees at the annual convocation held in the college auditorium, Kolkata.",
    tag: "Events",
    tagColor: "violet",
    category: "Events",
    index: "02",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70",
    title: "College Library & Reading Hall",
    caption:
      "The well-stocked college library supporting thousands of undergraduate and postgraduate students across all departments.",
    tag: "Academic",
    tagColor: "sky",
    category: "Academic",
    index: "03",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70",
    title: "QINS 2025 Seminar Hall",
    caption:
      "Delegates and faculty gathered in the seminar hall for the opening keynote of QINS 2025, hosted by Vivekananda College.",
    tag: "Events",
    tagColor: "indigo",
    category: "Events",
    index: "04",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=70",
    title: "Student Research Presentations",
    caption:
      "Undergraduate and postgraduate students presenting their research posters during the QINS 2025 inter-college session.",
    tag: "Students",
    tagColor: "emerald",
    category: "Students",
    index: "05",
  },
];

const CATEGORIES: Category[] = ["All", "Campus", "Events", "Academic", "Students"];

// ─── Tag colour map ───────────────────────────────────────────────────────────
const TAG_STYLES: Record<
  TagColor,
  { badge: string; glow: string; border: string; dot: string }
> = {
  cyan:    { badge: "bg-cyan-500/10 border-cyan-400/30 text-cyan-300",       glow: "rgba(99,210,255,0.22)",   border: "border-cyan-400/40",    dot: "bg-cyan-400"    },
  violet:  { badge: "bg-violet-500/10 border-violet-400/30 text-violet-300", glow: "rgba(167,139,250,0.22)",  border: "border-violet-400/40",  dot: "bg-violet-400"  },
  sky:     { badge: "bg-sky-500/10 border-sky-400/30 text-sky-300",          glow: "rgba(56,189,248,0.22)",   border: "border-sky-400/40",     dot: "bg-sky-400"     },
  indigo:  { badge: "bg-indigo-500/10 border-indigo-400/30 text-indigo-300", glow: "rgba(99,102,241,0.22)",   border: "border-indigo-400/40",  dot: "bg-indigo-400"  },
  emerald: { badge: "bg-emerald-500/10 border-emerald-400/30 text-emerald-300", glow: "rgba(52,211,153,0.22)", border: "border-emerald-400/40", dot: "bg-emerald-400" },
  rose:    { badge: "bg-rose-500/10 border-rose-400/30 text-rose-300",       glow: "rgba(251,113,133,0.22)",  border: "border-rose-400/40",    dot: "bg-rose-400"    },
};

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

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; phase: number }
    const nodes: Particle[] = Array.from({ length: 42 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 2 + 0.5, phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, W(), H());

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + nodes[i].phase);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,210,255,${alpha * pulse})`;
            ctx.lineWidth = 0.5;
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
        grd.addColorStop(0, `rgba(99,210,255,${0.85 * pulse})`);
        grd.addColorStop(1, "rgba(99,210,255,0)");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,240,255,${0.8 * pulse})`; ctx.fill();
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
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────
interface CardProps {
  item: GalleryItem;
  featured?: boolean;
  onOpen: (item: GalleryItem) => void;
}

function GalleryCard({ item, featured = false, onOpen }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ts = TAG_STYLES[item.tagColor];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-cyan-500/10 bg-slate-950/70 backdrop-blur-md cursor-pointer transition-all duration-500 ${
        featured ? "col-span-2 row-span-1" : ""
      }`}
      style={{
        boxShadow: hovered
          ? `0 0 48px 0 ${ts.glow}, 0 12px 48px rgba(0,0,0,0.7)`
          : "0 4px 24px rgba(0,0,0,0.5)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(item)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: featured ? "21/8" : "4/3" }}
      >
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          </div>
        )}

        <img
          src={item.thumb}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s, transform 0.7s" }}
          onLoad={() => setLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

        {/* Scan line on hover */}
        <div
          className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none transition-all duration-700"
          style={{ top: hovered ? "45%" : "-5%", opacity: hovered ? 1 : 0 }}
        />

        {/* Corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <div
            key={corner}
            className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              top:    corner.startsWith("t") ? 12 : undefined,
              bottom: corner.startsWith("b") ? 12 : undefined,
              left:   corner.endsWith("l")   ? 12 : undefined,
              right:  corner.endsWith("r")   ? 12 : undefined,
              borderTop:    corner.startsWith("t") ? "1px solid rgba(99,210,255,0.5)"    : undefined,
              borderBottom: corner.startsWith("b") ? "1px solid rgba(167,139,250,0.5)"   : undefined,
              borderLeft:   corner.endsWith("l")   ? "1px solid rgba(99,210,255,0.5)"    : undefined,
              borderRight:  corner.endsWith("r")   ? "1px solid rgba(167,139,250,0.5)"   : undefined,
            }}
          />
        ))}

        {/* Index label */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/60 tracking-widest">
          {item.index}
        </div>

        {/* Expand button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-10 h-10 rounded-full border border-cyan-400/50 bg-slate-950/80 flex items-center justify-center">
            <Expand className="w-4 h-4 text-cyan-300" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
            {item.title}
          </h3>
          <Badge
            className={`shrink-0 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${ts.badge}`}
          >
            {item.tag}
          </Badge>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
          {item.caption}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${ts.dot}`} />
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
          <span className="text-[9px] font-mono text-slate-600 tracking-widest">QINS 2025</span>
        </div>
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  allItems: GalleryItem[];
  onJump: (item: GalleryItem) => void;
}

function Lightbox({ item, onClose, onPrev, onNext, allItems, onJump }: LightboxProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
  }, [item?.id]);

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
        className="max-w-5xl w-full p-0 bg-slate-950/95 border border-cyan-500/20 rounded-2xl overflow-hidden gap-0"
        style={{ boxShadow: `0 0 100px 0 ${ts.glow}, 0 24px 80px rgba(0,0,0,0.8)` }}
      >
        {/* Visually hidden accessible title */}
        <DialogTitle className="sr-only">{item.title}</DialogTitle>
        <DialogDescription className="sr-only">{item.caption}</DialogDescription>

        {/* Image area */}
        <div className="relative bg-black" style={{ maxHeight: "62vh" }}>
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
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
            }}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Top bar overlay */}
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-slate-950/80 to-transparent">
            <span className="text-[10px] font-mono text-cyan-400/70 tracking-widest">
              {item.index} / {String(allItems.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-slate-300 text-xs font-mono">
                  Share image
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-slate-300 text-xs font-mono">
                  Download
                </TooltipContent>
              </Tooltip>
              <Button
                size="icon"
                variant="ghost"
                className="w-7 h-7 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
                onClick={onClose}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Prev / Next */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-slate-600/40 bg-slate-900/80 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-slate-900/90"
            onClick={onPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-slate-600/40 bg-slate-900/80 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-slate-900/90"
            onClick={onNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Info + Thumbnails */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${ts.badge}`}
                >
                  {item.tag}
                </Badge>
                <Separator orientation="vertical" className="h-3 bg-slate-700" />
                <span className="text-[10px] font-mono text-slate-500 tracking-widest">QINS 2025</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{item.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{item.caption}</p>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div>
            <Separator className="bg-cyan-500/10 mb-3" />
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allItems.map((g) => (
                <button
                  key={g.id}
                  onClick={() => onJump(g)}
                  className="shrink-0 rounded-lg overflow-hidden border transition-all duration-200"
                  style={{
                    width: 56, height: 40,
                    borderColor: g.id === item.id ? "rgba(99,210,255,0.7)" : "rgba(99,210,255,0.1)",
                    opacity:     g.id === item.id ? 1 : 0.45,
                    transform:   g.id === item.id ? "scale(1.06)" : "scale(1)",
                    boxShadow:   g.id === item.id ? `0 0 12px ${TAG_STYLES[g.tagColor].glow}` : "none",
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

// ─── Main Gallery Page ─────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [active, setActive]     = useState<GalleryItem | null>(null);
  const [category, setCategory] = useState<Category>("All");

  const filtered = category === "All"
    ? GALLERY
    : GALLERY.filter((g) => g.category === category);

  const open  = useCallback((item: GalleryItem) => setActive(item), []);
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
        className="relative min-h-screen w-full overflow-x-hidden bg-[#020712] text-white"
        style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
      >
        {/* ── Atmosphere ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%]  w-[50vw] h-[50vw] rounded-full bg-cyan-900/20   blur-[100px]" />
          <div className="absolute top-[35%]  left-[30%]      w-[30vw] h-[30vw] rounded-full bg-indigo-900/15 blur-[80px]"  />
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.04) 2px,rgba(255,255,255,0.04) 4px)",
            }}
          />
        </div>

        <QuantumCanvas />

        {/* ── Header ── */}
        <header className="relative z-10 pt-20 pb-10 text-center px-6">

          {/* Title */}
          <div className="relative mb-1">
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ filter: "blur(50px)", opacity: 0.3 }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                  fontWeight: 900,
                  color: "#67e8f9",
                  lineHeight: 1,
                }}
              >
                Gallery
              </span>

            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #67e8f9 0%, #e0f2fe 45%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                zIndex: 1,
              }}
            >
              Gallery
            </h1>
          </div>

          <p className="text-[11px] text-slate-400/70 tracking-[0.5em] uppercase font-mono mt-3 mb-5">
            Quantum · Networks · Intelligence · Systems
          </p>

          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500/40" />
            <span className="text-cyan-400/50 text-[11px] font-mono tracking-widest">|ψ⟩</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-violet-500/40" />
          </div>

          {/* Category tabs */}
          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as Category)}
            className="inline-flex"
          >
            <TabsList className="bg-slate-900/80 border border-cyan-500/10 backdrop-blur-md rounded-full p-1 gap-0.5">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full text-[11px] font-mono tracking-widest uppercase px-4 py-1.5 text-slate-400 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-300 data-[state=active]:border-cyan-400/30 transition-all duration-200"
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
            <div className="flex flex-col items-center justify-center py-32 text-slate-600 font-mono text-sm tracking-widest">
              <ZoomIn className="w-8 h-8 mb-3 text-slate-700" />
              No items in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  featured={i === 0 && category === "All"}
                  onOpen={open}
                />
              ))}
            </div>
          )}

          {/* Count */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/20" />
            <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
              {filtered.length} of {GALLERY.length} items
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/20" />
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

        {/* ── Bottom status bar ── */}
        <div className="fixed bottom-0 inset-x-0 z-20 border-t border-cyan-500/10 bg-slate-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <span>
              System State: <span className="text-cyan-400">|Ψ⟩ = α|0⟩ + β|1⟩</span>
            </span>
            <span>
              Gallery:{" "}
              <span className="text-cyan-400">
                {filtered.length} Items · {category}
              </span>
            </span>
            <span>
              Entanglement: <span className="text-violet-400">ACTIVE</span>
            </span>
            <span>
              Conference.exe — <span className="text-cyan-400">READY</span>
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}