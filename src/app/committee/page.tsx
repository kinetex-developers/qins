"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────
type RoleColor = "teal" | "steel" | "sky" | "slate" | "sand" | "mist";

interface CommitteeMember {
  name: string;
  affiliation: string;
  country: string;
  email?: string;
}

interface CommitteeSection {
  id: string;
  title: string;
  color: RoleColor;
  tab: TabCategory;
  members: CommitteeMember[];
}

type TabCategory = "All" | "Leadership" | "Programme" | "Technical" | "Organising";

// ─── Color map — same as gallery ─────────────────────────────────────────────
const ROLE_STYLES: Record<RoleColor, { badge: string; dot: string; bar: string; glow: string }> = {
  teal:  { badge: "bg-[#1e5878]/10 border-[#5a90b0]/35 text-[#1e5878]",  dot: "bg-[#5a90b0]",  bar: "#5a90b0", glow: "rgba(90,144,176,0.15)"  },
  steel: { badge: "bg-[#2a6888]/10 border-[#6aa8c8]/35 text-[#2a5878]",  dot: "bg-[#6aa8c8]",  bar: "#6aa8c8", glow: "rgba(106,168,200,0.15)" },
  sky:   { badge: "bg-[#3a7090]/10 border-[#8ab8d0]/35 text-[#2a5070]",  dot: "bg-[#8ab8d0]",  bar: "#8ab8d0", glow: "rgba(138,184,208,0.15)" },
  slate: { badge: "bg-[#1a4860]/10 border-[#4a88a8]/35 text-[#1a4860]",  dot: "bg-[#4a88a8]",  bar: "#4a88a8", glow: "rgba(74,136,168,0.15)"  },
  sand:  { badge: "bg-[#b89858]/10 border-[#c8a868]/35 text-[#6a5018]",  dot: "bg-[#c8a868]",  bar: "#c8a868", glow: "rgba(184,152,88,0.12)"  },
  mist:  { badge: "bg-[#5a8898]/10 border-[#7aa8b8]/35 text-[#2a5868]",  dot: "bg-[#7aa8b8]",  bar: "#7aa8b8", glow: "rgba(90,136,152,0.15)"  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SECTIONS: CommitteeSection[] = [
  {
    id: "patrons",
    title: "Patrons",
    color: "teal",
    tab: "Leadership",
    members: [
      { name: "Prof. Rustam Kholmurodov", affiliation: "Rector, Samarkand State University", country: "Uzbekistan" },
      { name: "Prof. Akmal Rustamovich", affiliation: "Vice-Rector, Samarkand State University", country: "Uzbekistan" },
    ],
  },
  {
    id: "general-chairs",
    title: "General Chair(s)",
    color: "steel",
    tab: "Leadership",
    members: [
      { name: "Prof. Anirban Bandyopadhyay", affiliation: "NIMS", country: "Japan", email: "anirban.bandyo@gmail.com" },
      { name: "Prof. Kanad Ray", affiliation: "Amity University Jaipur", country: "India", email: "raykanad00@gmail.com" },
    ],
  },
  {
    id: "steering",
    title: "Steering Committee",
    color: "sky",
    tab: "Leadership",
    members: [
      { name: "J E Lugo", affiliation: "University of Montreal", country: "Canada" },
      { name: "Subrata Ghosh", affiliation: "CSIR Northeast Institute of Sc. & Tech., Jorhat", country: "India", email: "subrata@neist.res.in" },
      { name: "Chi-Sang Poon", affiliation: "MIT", country: "USA", email: "cpoon@mit.edu" },
      { name: "Jocelyn Faubert", affiliation: "University of Montreal", country: "Canada", email: "jocelyn.faubert@umontreal.ca" },
      { name: "Mufti Mahmud", affiliation: "King Fahd University of Petroleum and Minerals", country: "Saudi Arabia", email: "muftimahmud@gmail.com" },
      { name: "Shamim Al Mamun", affiliation: "IIT, Jahangirnagar University", country: "Bangladesh", email: "shamim@juniv.edu" },
      { name: "M Shamim Kaiser", affiliation: "IIT, Jahangirnagar University", country: "Bangladesh", email: "mskaiser@juniv.edu" },
    ],
  },
  {
    id: "advisory",
    title: "International Advisory Committee",
    color: "slate",
    tab: "Leadership",
    members: [
      { name: "M. Mahmud Khan", affiliation: "John A. Drew Professor, University of Georgia", country: "USA" },
      { name: "Karl Andersson", affiliation: "Dean, Luleå University of Technology", country: "Sweden" },
      { name: "Byung-Gon Chun", affiliation: "Professor, Seoul National University", country: "South Korea" },
      { name: "Jordi Alberich Pascual", affiliation: "Professor, University of Granada", country: "Spain" },
      { name: "Sevinc Gulsecen", affiliation: "Professor, Istanbul University", country: "Turkey" },
    ],
  },
  {
    id: "programme-chairs",
    title: "Programme Chairs",
    color: "teal",
    tab: "Programme",
    members: [
      { name: "Anirban Bandyopadhyay", affiliation: "NIMS", country: "Japan" },
      { name: "Md Sazzad Hossain", affiliation: "Samarkand State University", country: "Uzbekistan" },
    ],
  },
  {
    id: "conference-secretary",
    title: "Conference Secretary",
    color: "steel",
    tab: "Programme",
    members: [
      { name: "M Shamim Kaiser", affiliation: "Jahangirnagar University", country: "Bangladesh" },
      { name: "Hamidov Munis", affiliation: "Samarkand State University", country: "Uzbekistan" },
    ],
  },
  {
    id: "workshop-chairs",
    title: "Workshop / Special Session Chairs",
    color: "sky",
    tab: "Programme",
    members: [
      { name: "Cosimo Ieracitano", affiliation: "University of Reggio Calabria", country: "Italy" },
      { name: "V.N. Manjunath Aradhya", affiliation: "JSS University", country: "India" },
      { name: "Rashidov Akbar", affiliation: "Samarkand State University", country: "Uzbekistan" },
    ],
  },
  {
    id: "tutorial-chairs",
    title: "Tutorial Chairs",
    color: "slate",
    tab: "Programme",
    members: [
      { name: "M. Arifur Rahman", affiliation: "Nottingham Trent University", country: "UK" },
      { name: "Tanu Wadhera", affiliation: "Indian Institute of Information Technology Una", country: "India" },
      { name: "Hamidov Munis", affiliation: "Samarkand State University", country: "Uzbekistan" },
    ],
  },
  {
    id: "publicity-chairs",
    title: "Publicity Chairs",
    color: "mist",
    tab: "Programme",
    members: [
      { name: "Noushath Shaffi", affiliation: "Sultan Qaboos University", country: "Oman" },
      { name: "M Mostafizur Rahman", affiliation: "American International University Bangladesh", country: "Bangladesh" },
      { name: "Tursinkhanov Nurlan", affiliation: "Samarkand State University", country: "Uzbekistan" },
      { name: "Touhid Bhuiyan", affiliation: "Washington University of Science and Technology", country: "USA" },
    ],
  },
  {
    id: "finance-chairs",
    title: "Finance Chairs",
    color: "sand",
    tab: "Programme",
    members: [
      { name: "Yarmatov Sherzojon", affiliation: "Samarkand State University", country: "Uzbekistan" },
      { name: "Khuramov Latif", affiliation: "Samarkand State University", country: "Uzbekistan" },
    ],
  },
  {
    id: "tpc",
    title: "Technical Programme Committee",
    color: "sky",
    tab: "Technical",
    members: [
      { name: "Anirban Bandyopadhyay", affiliation: "NIMS", country: "Japan" },
      { name: "Anita Garhwal", affiliation: "Luleå University", country: "Sweden" },
      { name: "Aron Laszka", affiliation: "University of Houston", country: "USA" },
      { name: "Chee-Ming Ting", affiliation: "UTM", country: "Malaysia" },
      { name: "Cosimo Ieracitano", affiliation: "University of Reggio Calabria", country: "Italy" },
      { name: "Farhana Sarker", affiliation: "University of Liberal Arts", country: "Bangladesh" },
      { name: "Fida Hasan", affiliation: "RMIT University", country: "Australia" },
      { name: "Hadri Hussain", affiliation: "UTM", country: "Malaysia" },
      { name: "J. Eduardo Lugo", affiliation: "University of Montreal", country: "Canada" },
      { name: "Jocelyn Faubert", affiliation: "University of Montreal", country: "Canada" },
      { name: "Kanad Ray", affiliation: "Amity University Rajasthan", country: "India" },
      { name: "Kashayar Misaghian", affiliation: "Okinawa Institute of Science and Technology", country: "Japan" },
      { name: "M. Murugappan", affiliation: "Kuwait College of Science and Technology", country: "Kuwait" },
      { name: "M. Shamim Kaiser", affiliation: "Jahangirnagar University", country: "Bangladesh" },
      { name: "Manjunath Aradhya", affiliation: "JSS University", country: "India" },
      { name: "Mohammad Ali Moni", affiliation: "University of Queensland", country: "Australia" },
      { name: "Mufti Mahmud", affiliation: "King Fahd University of Petroleum and Minerals", country: "Saudi Arabia" },
      { name: "Muhammad Arif Jalil", affiliation: "UTM", country: "Malaysia" },
      { name: "Nabeel Mohammed", affiliation: "North South University", country: "Bangladesh" },
      { name: "Noushath Shaffi", affiliation: "College of Applied Sciences", country: "Oman" },
      { name: "Omprakash Kaiwartya", affiliation: "Nottingham Trent University", country: "UK" },
      { name: "Pushpendra Singh", affiliation: "NIMS", country: "Japan" },
      { name: "Ramani Kannan", affiliation: "Universiti Teknologi PETRONAS", country: "Malaysia" },
      { name: "S. M. Riazul Islam", affiliation: "Sejong University", country: "South Korea" },
      { name: "Shamim Al Mamun", affiliation: "Jahangirnagar University", country: "Bangladesh" },
      { name: "Shariful Islam", affiliation: "Deakin University", country: "Australia" },
      { name: "Subrata Ghosh", affiliation: "CSIR Northeast Institute of Sc. & Tech.", country: "India" },
      { name: "Tawfik Al-Hadhrami", affiliation: "Nottingham Trent University", country: "UK" },
      { name: "Tianhua Chen", affiliation: "University of Huddersfield", country: "UK" },
    ],
  },
  {
    id: "local-organising",
    title: "Local Organising Committee",
    color: "teal",
    tab: "Organising",
    members: [
      { name: "Nurmamatov Mekhriddin", affiliation: "Samarkand State University", country: "Uzbekistan" },
      { name: "Rabbimov Nodir", affiliation: "Samarkand State University", country: "Uzbekistan" },
      { name: "Bobokhonov Ahmadkhan", affiliation: "Samarkand State University", country: "Uzbekistan" },
      { name: "Asliddin Sayidkulov (Webmaster)", affiliation: "Samarkand State University", country: "Uzbekistan" },
      { name: "Ashwini Renavekar", affiliation: "Professor, Doctor of Engineering Sciences", country: "India" },
      { name: "Jumanov Israil", affiliation: "Professor, Doctor of Technical Sciences", country: "Uzbekistan" },
      { name: "Aripov Mirsaid", affiliation: "Professor, Doctor of Physics and Mathematics", country: "Uzbekistan" },
      { name: "Kazuya Takeda", affiliation: "Professor, Nagoya University", country: "Japan" },
      { name: "Khujayorov Bakhtiyor", affiliation: "Professor, Doctor of Physics and Mathematics", country: "Uzbekistan" },
      { name: "Urunbayev Erkin", affiliation: "Professor, Doctor of Physics and Mathematics", country: "Uzbekistan" },
      { name: "Fozilov Shavkat", affiliation: "Professor, Doctor of Technical Sciences", country: "Uzbekistan" },
      { name: "Hamdamov Rustam", affiliation: "Professor, Doctor of Technical Sciences", country: "Uzbekistan" },
      { name: "Lutfullayev Makhmud", affiliation: "Professor, Doctor of Pedagogical Sciences", country: "Uzbekistan" },
      { name: "Primova Kholida", affiliation: "Professor, Doctor of Technical Sciences", country: "Uzbekistan" },
      { name: "Nazarov Fayzullo", affiliation: "Associate Professor, Doctor of Philosophy", country: "Uzbekistan" },
      { name: "Yusupov Ozod", affiliation: "Associate Professor, Doctor of Philosophy", country: "Uzbekistan" },
      { name: "Yarmatov Sherzodjon", affiliation: "Assistant Researcher", country: "Uzbekistan" },
    ],
  },
];

const TABS: TabCategory[] = ["All", "Leadership", "Programme", "Technical", "Organising"];

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
    interface Node { x: number; y: number; vx: number; vy: number; r: number; phase: number; type: "primary" | "secondary" }
    const nodes: Node[] = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.5, phase: Math.random() * Math.PI * 2,
      type: i < 10 ? "primary" : "secondary",
    }));
    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W(), H());
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
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

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({ member, color }: { member: CommitteeMember; color: RoleColor }) {
  const [hovered, setHovered] = useState(false);
  const rs = ROLE_STYLES[color];
  return (
    <div
      className="relative rounded-xl px-4 py-3.5 transition-all duration-300 cursor-default"
      style={{
        border: "1px solid rgba(168,200,216,0.28)",
        background: hovered ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.32)",
        backdropFilter: "blur(10px)",
        boxShadow: hovered ? `0 4px 24px ${rs.glow}` : "0 1px 8px rgba(30,72,104,0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-opacity duration-300"
        style={{ background: rs.bar, opacity: hovered ? 0.7 : 0.3 }}
      />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-[#1e3a58] leading-snug tracking-tight">
            {member.name}
          </p>
          <span
            className="shrink-0 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border mt-0.5"
            style={{
              background: "rgba(168,200,216,0.15)",
              border: "1px solid rgba(168,200,216,0.35)",
              color: "#5a8898",
            }}
          >
            {member.country}
          </span>
        </div>
        <p className="text-[11px] text-[#6a8898] mt-0.5 leading-relaxed">{member.affiliation}</p>
        {member.email && (
          <p className="text-[10px] font-mono text-[#5a90b0]/60 mt-1">{member.email}</p>
        )}
      </div>
    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────
function SectionBlock({ section }: { section: CommitteeSection }) {
  const rs = ROLE_STYLES[section.color];
  const isTPC = section.members.length > 10;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full ${rs.dot}`} />
        <h2
          className="text-base font-bold tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#1e3a58",
          }}
        >
          {section.title}
        </h2>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${rs.bar}44, transparent)` }} />
        <span
          className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${rs.badge}`}
        >
          {section.members.length} member{section.members.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Members grid */}
      <div className={`grid gap-2.5 ${isTPC ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
        {section.members.map((m, i) => (
          <MemberCard key={i} member={m} color={section.color} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommitteePage() {
  const [tab, setTab] = useState<TabCategory>("All");

  const filtered = tab === "All"
    ? SECTIONS
    : SECTIONS.filter((s) => s.tab === tab);

  const totalMembers = filtered.reduce((acc, s) => acc + s.members.length, 0);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(168deg, #edf3f8 0%, #e2ecf5 40%, #dce8f0 68%, #e4ddd2 100%)",
        fontFamily: "'Syne', 'Georgia', sans-serif",
      }}
    >
      {/* ── Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-8%] left-[5%] w-[55vw] h-[40vw] rounded-full bg-[#9fc9ec]/45 blur-[95px]" />
        <div className="absolute top-[15%] right-[-8%] w-[38vw] h-[32vw] rounded-full bg-[#8ab8d0]/35 blur-[80px]" />
        <div className="absolute bottom-[-8%] left-[8%] right-[8%] h-[38vh] rounded-full bg-[#e0c898]/40 blur-[75px]" />
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
            Tashkent, Uzbekistan · 2025
          </span>
        </div>

        <div className="relative mb-2">
          <div aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ filter: "blur(38px)", opacity: 0.18 }}>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.2rem, 7vw, 5rem)",
              fontWeight: 900, color: "#3a78a0", lineHeight: 1,
            }}>Committee</span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.2rem, 7vw, 5rem)",
            fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em",
            background: "linear-gradient(138deg, #1e5878 0%, #2a7090 32%, #1a4860 60%, #3a7868 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", position: "relative", zIndex: 1,
          }}>Committee</h1>
        </div>

        <p className="text-[10px] text-[#4a8098]/65 tracking-[0.5em] uppercase font-mono mt-3 mb-5">
          Quantum · Networks · Intelligence · Systems
        </p>

        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.35))" }} />
          <span className="text-[#5a90b0]/55 text-[11px] font-mono tracking-widest">|ψ⟩</span>
          <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(90,152,128,0.35))" }} />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabCategory)} className="inline-flex">
          <TabsList
            className="rounded-full p-1 gap-0.5 flex-wrap h-auto"
            style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(168,200,216,0.35)", backdropFilter: "blur(8px)" }}
          >
            {TABS.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-full text-[11px] font-mono tracking-widest uppercase px-4 py-1.5 transition-all duration-200"
                style={{ color: tab === t ? "#1e5878" : "#6a98b0" }}
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Stats row */}
        <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
          {[
            { label: "Sections", value: filtered.length },
            { label: "Members", value: totalMembers },
            { label: "Countries", value: [...new Set(filtered.flatMap(s => s.members.map(m => m.country)))].length },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-bold font-mono text-[#1e4a68]">{value}</div>
              <div className="text-[9px] text-[#5a90b0] uppercase tracking-[0.2em] font-mono">{label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 pb-28">
        <Separator className="mb-8" style={{ background: "rgba(168,200,216,0.28)" }} />

        {filtered.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}

        {/* Count footer */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(90,144,176,0.25))" }} />
          <span className="text-[10px] font-mono text-[#8aa8b8] tracking-widest uppercase">
            {totalMembers} members across {filtered.length} sections
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
          <span>System State: <span className="text-[#1e5878]">|Ψ⟩ = α|0⟩ + β|1⟩</span></span>
          <span>Committee: <span className="text-[#1e5878]">{totalMembers} Members · {tab}</span></span>
          <span>Entanglement: <span className="text-[#2a4878]">ACTIVE</span></span>
          <span>Conference.exe — <span className="text-[#1e5878]">READY</span></span>
        </div>
      </div>
    </div>
  );
}