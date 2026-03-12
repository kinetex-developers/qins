"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const dropdownLinks: Record<string, string[]> = {
  Programme:   ["Keynotes", "Schedule", "Workshops", "Poster Sessions"],
  Submission:  ["Submit Paper", "Guidelines", "Topics", "Review Process"],
  Information: ["Venue & Travel", "Accommodation", "Visa Info", "FAQ"],
};

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls =
    "px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md transition-colors duration-200 " +
    "text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/[0.08]";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#03050f]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(99,210,255,0.12),0_8px_32px_rgba(0,0,0,0.65)]"
          : "bg-[#060d1f]/90 backdrop-blur-md"
      )}
    >
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-5 h-14 flex items-center justify-between gap-3">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-7 h-7">
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/60 animate-spin group-hover:border-cyan-300 transition-colors"
              style={{ animationDuration: "8s" }}
            />
            <div
              className="absolute inset-[3px] rounded-full border border-violet-400/40 animate-spin"
              style={{ animationDuration: "5s", animationDirection: "reverse" }}
            />
            <div className="absolute inset-[7px] rounded-full bg-cyan-400 shadow-[0_0_8px_3px_rgba(99,210,255,0.55)]" />
          </div>
          <div className="flex flex-col leading-none select-none">
            <span className="text-white font-black tracking-[0.18em] text-sm font-mono">
              qins<span className="text-cyan-400">·</span>2025
            </span>
            <span className="hidden sm:block text-[8px] text-slate-500 tracking-[0.25em] uppercase font-mono">
              Quantum Conference
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          <a href="#" className={linkCls}>Track/Topics</a>
          <a href="#" className={linkCls}>Committee</a>

          <NavDropdown label="Programme"   items={dropdownLinks.Programme}   linkCls={linkCls} />
          <NavDropdown label="Submission"  items={dropdownLinks.Submission}  linkCls={linkCls} />
          <NavDropdown label="Information" items={dropdownLinks.Information} linkCls={linkCls} />

          <a href="#" className={linkCls}>Partners</a>
          <a href="/gallery" className={linkCls}>Gallery</a>
          <a href="#" className={linkCls}>Certificate Authors</a>
          <a href="#" className={linkCls}>Contact Us</a>
        </nav>

        {/* Right: Institution pill + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 transition-colors duration-200 rounded-lg px-3 py-1.5 cursor-pointer select-none">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full border border-white/60" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white text-[9px] font-bold tracking-wide">Samarkand State</span>
              <span className="text-cyan-100 text-[8px] tracking-wide">University · SamSU</span>
            </div>
          </div>

          <button
            aria-label="Toggle menu"
            className="lg:hidden text-slate-300 hover:text-cyan-300 transition-colors p-1"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-cyan-500/[0.12] bg-[#04080f]/98 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-5 py-4 flex flex-col gap-0.5">
            {[
              "Track/Topics", "Committee", "Programme", "Submission",
              "Information", "Partners", "Gallery", "Certificate Authors", "Contact Us",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-2 text-[11px] text-slate-300 hover:text-cyan-300 font-mono uppercase tracking-wider rounded-lg hover:bg-cyan-500/10 transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </header>
  );
}

// Custom dropdown — no Radix, no shadcn
function NavDropdown({
  label,
  items,
  linkCls,
}: {
  label: string;
  items: string[];
  linkCls: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleToggle = () => {
    if (!triggerRef.current) return;

    const rect       = triggerRef.current.getBoundingClientRect();
    const menuWidth  = 200;
    const padding    = 16;
    const viewportW  = window.innerWidth;

    let left = rect.left;
    if (left + menuWidth > viewportW - padding) {
      left = viewportW - menuWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left,
      width: menuWidth,
      zIndex: 9999,
    });

    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={cn(
          linkCls,
          "flex items-center gap-1 outline-none",
          open && "text-cyan-300 bg-cyan-500/[0.08]"
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "w-3 h-3 opacity-50 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="rounded-xl border border-cyan-500/20 bg-[#070e20] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] p-1"
        >
          {items.map((item) => (
            <button
              key={item}
              onClick={() => setOpen(false)}
              className="w-full text-left px-3 py-2 text-[11px] text-slate-300 hover:text-cyan-300 font-mono uppercase tracking-wider rounded-xs hover:bg-cyan-500/10 transition-colors duration-150"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}