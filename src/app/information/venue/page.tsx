"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin, Plane, Train, Car, Phone, Mail,
  Navigation, Compass, ExternalLink, Wifi, ArrowRight,
} from "lucide-react";

// ─── Particle Canvas ──────────────────────────────────────────────────────────
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
    interface Node { x:number;y:number;vx:number;vy:number;r:number;phase:number;type:"primary"|"secondary" }
    const nodes: Node[] = Array.from({ length: 40 }, (_, i) => ({
      x: Math.random()*W(), y: Math.random()*H(),
      vx: (Math.random()-0.5)*0.22, vy: (Math.random()-0.5)*0.22,
      r: Math.random()*1.8+0.5, phase: Math.random()*Math.PI*2,
      type: i < 10 ? "primary" : "secondary",
    }));
    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W(), H());
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const dx = nodes[i].x-nodes[j].x, dy = nodes[i].y-nodes[j].y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 160) {
            const alpha = (1-dist/160)*0.22;
            const pulse = 0.5+0.5*Math.sin(t*1.2+nodes[i].phase);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(90,148,188,${alpha*pulse})`;
            ctx.lineWidth = 0.7;
            ctx.setLineDash([4,8]);
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
        const pulse = 0.6+0.4*Math.sin(t*1.8+n.phase);
        if (n.type === "primary") {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r*5);
          grd.addColorStop(0, `rgba(90,160,200,${0.7*pulse})`);
          grd.addColorStop(1, "rgba(90,160,200,0)");
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r*5, 0, Math.PI*2);
          ctx.fillStyle = grd; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = n.type === "primary"
          ? `rgba(90,150,195,${0.7*pulse})`
          : `rgba(120,170,200,${0.55*pulse})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Image-BG Transport Card (Air / Train / Road) ─────────────────────────────
function HeroTransportCard({
  icon: Icon,
  num,
  mode,
  tag,
  distance,
  body,
  pills,
  imgUrl,
  overlayColor,
}: {
  icon: React.ElementType;
  num: string;
  mode: string;
  tag: string;
  distance: string;
  body: React.ReactNode;
  pills: string[];
  imgUrl: string;
  overlayColor: string;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-end h-full"
      style={{
        boxShadow: hov
          ? "0 16px 48px rgba(10,40,70,0.22)"
          : "0 4px 20px rgba(10,40,70,0.10)",
        transform: hov ? "translateY(-2px)" : "none",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-transform duration-700"
        style={{
          backgroundImage: `url('${imgUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: hov ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: overlayColor }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Top badge */}
      <div className="absolute top-5 left-5 flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span
          className="text-[9px] tracking-[.38em] uppercase font-mono text-white/55 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.12)" }}
        >{tag}</span>
      </div>

      {/* Number watermark */}
      <div
        className="absolute top-4 right-5 font-mono text-white/10 select-none"
        style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: 1 }}
      >{num}</div>

      {/* Content */}
      <div className="relative z-10 p-6 pt-12">
        <h3
          className="text-white mb-2"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.1 }}
        >{mode}</h3>
        <p className="text-white/70 text-[12.5px] leading-relaxed mb-4">{body}</p>
        <div className="flex flex-wrap gap-2">
          <span
            className="text-[10px] font-mono tracking-wide px-3 py-1.5 rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
          >{distance}</span>
          {pills.map(p => (
            <span
              key={p}
              className="text-[10px] font-mono tracking-wide px-3 py-1.5 rounded-full text-white/75"
              style={{ background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(4px)" }}
            >{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Local Transport Mini Card ────────────────────────────────────────────────
function LocalCard() {
  const [hov, setHov] = useState(false);
  const services = ["Uber / Ola", "Auto-rickshaws", "Local Buses", "Private Taxis"];
  return (
    <div
      className="rounded-2xl p-6 flex flex-col justify-between h-full transition-all duration-300"
      style={{
        background: hov
          ? "linear-gradient(145deg,#1a4a5e,#1a3a4e)"
          : "linear-gradient(145deg,#152d3e,#1a3248)",
        border: "1px solid rgba(90,148,188,0.2)",
        boxShadow: hov ? "0 8px 32px rgba(10,40,70,0.22)" : "0 2px 12px rgba(10,40,70,0.12)",
        transform: hov ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div>
        <p className="text-[9px] tracking-[.4em] uppercase font-mono text-[#5aaace]/50 mb-2">04 — Local</p>
        <h3 className="text-white mb-3" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", fontWeight: 800 }}>Local Transport</h3>
        <p className="text-white/55 text-[12px] leading-relaxed mb-4">Frequent services run through the Barrackpore–Barasat region from all directions.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {services.map(t => (
          <span
            key={t}
            className="text-[10px] font-mono tracking-wide px-3 py-1.5 rounded-full text-white/70"
            style={{ background: "rgba(90,148,200,0.12)", border: "1px solid rgba(90,148,200,0.2)" }}
          >{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Landmarks Card ───────────────────────────────────────────────────────────
function LandmarksCard() {
  const [hov, setHov] = useState(false);
  const landmarks = [
    "Barrackpore–Barasat Road",
    "Khardah / Barrackpore Area",
    "Bara Kanthalia Locality",
    "Telinipara Junction",
  ];
  return (
    <div
      className="rounded-2xl flex flex-col h-full transition-all duration-300 overflow-hidden"
      style={{
        background: "#fff",
        border: hov ? "1px solid rgba(30,88,120,0.22)" : "1px solid rgba(30,88,120,0.11)",
        boxShadow: hov ? "0 8px 32px rgba(10,40,70,0.10)" : "0 2px 10px rgba(10,40,70,0.05)",
        transform: hov ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Header — fixed */}
      <div className="px-5 pt-5 pb-3 shrink-0">
        <p className="text-[9px] tracking-[.4em] uppercase font-mono text-[#5a90b0] mb-1.5">05 — Navigate</p>
        <h3 className="text-[#0d1b2a]" style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", fontWeight: 800, lineHeight: 1.2 }}>Nearby Landmarks</h3>
      </div>
      {/* List — fills remaining height, no overflow */}
      <ul className="flex flex-col flex-1 px-5 pb-4 overflow-hidden" style={{ gap: 0 }}>
        {landmarks.map((lm, i) => (
          <li
            key={lm}
            className="flex items-center gap-2.5 text-[11.5px] text-[#4a6880] flex-1"
            style={{ borderBottom: i < landmarks.length - 1 ? "1px solid rgba(30,88,120,0.08)" : "none", minHeight: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#4a88a8" }} />
            <span className="leading-tight">{lm}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VenueTravelPage() {
  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 40%, #dce8f0 68%, #e4ddd2 100%)",
        fontFamily: "'DM Sans', 'Georgia', sans-serif",
      }}
    >
      {/* ── HERO ── */}
      <header className="relative overflow-hidden" style={{ minHeight: "420px" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/howrah-bridge.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            opacity: 0.12,
            filter: "saturate(0.5) contrast(0.9) sepia(0.15)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-8%] left-[5%] w-[55vw] h-[40vw] rounded-full bg-[#c0d8ee]/28 blur-[110px]" />
          <div className="absolute top-[10%] right-[-5%] w-[35vw] h-[30vw] rounded-full bg-[#b0cce0]/18 blur-[90px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(80,130,170,0.3) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(80,130,170,0.3) 40px)" }} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(237,243,248,0.72) 0%, rgba(237,243,248,0.05) 30%, rgba(237,243,248,0.05) 70%, rgba(237,243,248,0.55) 100%)" }}
        />
        <BridgeCanvas />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-12 pt-20 sm:pt-28 pb-10 sm:pb-16">
          <p className="text-[9px] sm:text-[10px] tracking-[.38em] sm:tracking-[.45em] uppercase font-mono text-[#4a7890]/60 mb-2 sm:mb-3">
            Kolkata, West Bengal · India · QINS 2026
          </p>
          <h1
            className="leading-none mb-4 sm:mb-5"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2rem, 8vw, 4.8rem)",
              fontWeight: 900,
              letterSpacing: "-.03em",
              background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Venue<br />
            <span style={{ background: "linear-gradient(135deg,#1a5878,#2a7868)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              &amp; Travel
            </span>
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#4a7890]/70 max-w-md leading-relaxed mb-6 sm:mb-8">
            Everything you need to reach us — directions, transport options, and on-campus details for your arrival.
          </p>
        </div>
      </header>

      {/* ── MAP ── */}
      <div className="relative mx-10" style={{ borderTop: "1px solid rgba(30,88,120,0.1)", borderBottom: "1px solid rgba(30,88,120,0.1)" }}>
        <div
          className="flex items-center justify-between px-4 sm:px-8 py-2.5 sm:py-3"
          style={{
            background: "rgba(237,243,248,0.85)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(30,88,120,0.1)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4a88a8] shrink-0" />
            <span className="text-[8px] sm:text-[10px] tracking-[.3em] sm:tracking-[.4em] uppercase font-mono text-[#3a6880] truncate">
              Campus Location · SVU
            </span>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {["#e09090","#e0c870","#88c870"].map(c => (
              <div key={c} className="w-2 h-2 rounded-full opacity-60" style={{ background: c }} />
            ))}
          </div>
        </div>
        <iframe
          title="Swami Vivekananda University Location"
          src="https://maps.google.com/maps?q=Swami+Vivekananda+University,+Barrackpore-Barasat+Rd,+Telinipara,+Bara+Kanthalia,+West+Bengal+700121&output=embed"
          width="100%"
          height="280"
          className="sm:!h-[400px]"
          style={{ border: 0, display: "block", filter: "saturate(0.82) contrast(0.96)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(226,236,245,0.6), transparent)" }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="py-10 sm:py-16">

{/* ── SECTION HEADER with plane path PNG ── */}
<div className="relative max-w-7xl mx-auto px-5 sm:px-12 mb-7 sm:mb-10">
  {/* Plane path PNG — decorative background watermark */}
  <img
    src="/airpng.png"
    alt=""
    aria-hidden="true"
    className="absolute pointer-events-none select-none"
    style={{
      right: "40px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "clamp(240px, 35vw, 420px)",
      opacity: 0.35,
      filter: "invert(1) sepia(1) saturate(3) hue-rotate(170deg) brightness(0.6)",
      zIndex: 0,
    }}
  />
  <p className="relative z-10 text-[9px] sm:text-[10px] tracking-[.45em] sm:tracking-[.5em] uppercase font-mono text-[#4a7890]/65 mb-1">
    How to Reach
  </p>
  <h2
    className="relative z-10 text-[#0d1b2a]"
    style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(1.3rem,5vw,2rem)",
      fontWeight: 800,
      letterSpacing: "-.02em",
    }}
  >
    Getting Here
  </h2>
</div>

        {/* ── BENTO GRID ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-12">
          {/* Desktop: 3-col explicit grid */}
          <div
            className="hidden lg:grid gap-4"
            style={{
              gridTemplateColumns: "5fr 4fr 3fr",
              gridTemplateRows: "340px 220px",
            }}
          >
            <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
              <HeroTransportCard
                icon={Plane} num="01" mode="By Air" tag="Air Travel"
                distance="~25 km from campus"
                body={<>Nearest airport: <strong className="text-white/90">Netaji Subhas Chandra Bose International (CCU)</strong>, ~25 km from campus. Taxis, app-cabs, and airport shuttles connect directly to the venue.</>}
                pills={["Cab / Taxi", "Airport Shuttle"]}
                imgUrl="/airport.jpg"
                overlayColor="linear-gradient(160deg, rgba(10,32,55,0.72) 0%, rgba(12,45,38,0.82) 60%, rgba(8,28,48,0.88) 100%)"
              />
            </div>
            <div style={{ gridColumn: "2", gridRow: "1" }}>
              <HeroTransportCard
                icon={Train} num="02" mode="By Train" tag="Rail Travel"
                distance="~20 km from campus"
                body={<>Nearest major station: <strong className="text-white/90">Howrah Junction</strong>, ~20 km away. Reach via taxi, local bus, or ride-sharing.</>}
                pills={["Taxi", "Local Bus", "Ride-sharing"]}
                imgUrl="/station.jpg"
                overlayColor="linear-gradient(160deg, rgba(10,22,48,0.70) 0%, rgba(20,35,65,0.85) 100%)"
              />
            </div>
            <div style={{ gridColumn: "3", gridRow: "1" }}>
              <HeroTransportCard
                icon={Car} num="03" mode="By Road" tag="Road Travel"
                distance="Barrackpore–Barasat Rd"
                body={<>Via <strong className="text-white/90">Barrackpore–Barasat Road</strong>. Accessible from Kolkata, Durgapur &amp; Asansol via state highways.</>}
                pills={["Private Car", "State Bus"]}
                imgUrl="/road.jpg"
                overlayColor="linear-gradient(160deg, rgba(22,28,22,0.72) 0%, rgba(18,38,28,0.88) 100%)"
              />
            </div>
            <div style={{ gridColumn: "2", gridRow: "2" }}>
              <LocalCard />
            </div>
            <div style={{ gridColumn: "3", gridRow: "2" }}>
              <LandmarksCard />
            </div>
          </div>

          {/* Mobile / tablet layout */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2" style={{ minHeight: "220px" }}>
                <HeroTransportCard
                  icon={Plane} num="01" mode="By Air" tag="Air Travel"
                  distance="~25 km from campus"
                  body={<>Nearest airport: <strong className="text-white/90">Netaji Subhas Chandra Bose International (CCU)</strong>, ~25 km from campus. Taxis, app-cabs and airport shuttles connect to the venue.</>}
                  pills={["Cab / Taxi", "Airport Shuttle"]}
                  imgUrl="/airport.jpg"
                  overlayColor="linear-gradient(160deg, rgba(10,32,55,0.72) 0%, rgba(12,45,38,0.82) 60%, rgba(8,28,48,0.88) 100%)"
                />
              </div>
              <div style={{ minHeight: "200px" }}>
                <HeroTransportCard
                  icon={Train} num="02" mode="By Train" tag="Rail Travel"
                  distance="~20 km from campus"
                  body={<>Nearest station: <strong className="text-white/90">Howrah Junction</strong>, ~20 km away.</>}
                  pills={["Taxi", "Local Bus", "Ride-sharing"]}
                  imgUrl="/station.jpg"
                  overlayColor="linear-gradient(160deg, rgba(10,22,48,0.70) 0%, rgba(20,35,65,0.85) 100%)"
                />
              </div>
              <div style={{ minHeight: "200px" }}>
                <HeroTransportCard
                  icon={Car} num="03" mode="By Road" tag="Road Travel"
                  distance="Barrackpore–Barasat Rd"
                  body={<>Via <strong className="text-white/90">Barrackpore–Barasat Road</strong>. Accessible from Kolkata, Durgapur &amp; Asansol.</>}
                  pills={["Private Car", "State Bus"]}
                  imgUrl="/road.jpg"
                  overlayColor="linear-gradient(160deg, rgba(22,28,22,0.72) 0%, rgba(18,38,28,0.88) 100%)"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div style={{ minHeight: "180px" }}><LocalCard /></div>
              <div style={{ minHeight: "180px" }}><LandmarksCard /></div>
            </div>
          </div>
        </div>
      </main>

      {/* ── STATUS BAR ── */}
      <div
        className="border-t"
        style={{
          background: "rgba(8,20,32,0.92)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(90,148,188,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-white/25">
          <span className="text-white/40">Swami Vivekananda University</span>
          <span>Airport: <span className="text-[#5aaace]/70">~25 km</span></span>
          <span>Railway: <span className="text-[#5aaace]/70">~20 km</span></span>
          <span className="hidden sm:inline">QINS 2026 — <span className="text-[#3ad898]/70">READY</span></span>
        </div>
      </div>

    </div>
  );
}