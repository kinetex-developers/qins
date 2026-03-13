"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Link map: label → href ───────────────────────────────────────────────────
const dropdownLinks: Record<string, { label: string; href: string }[]> = {
  Programme: [
    { label: "Programme/Session Details", href: "/programme/sessions" },
    { label: "Call for Paper",            href: "/programme/call-for-paper" },
  ],
  Submission: [
    { label: "Submit Paper",    href: "/submission/submit" },
    { label: "Guidelines",      href: "/submission/guidelines" },
    { label: "Topics",          href: "/submission/topics" },
    { label: "Review Process",  href: "/submission/review-process" },
  ],
  Information: [
    { label: "Venue & Travel", href: "/information/venue" },
    { label: "Attractions",    href: "/information/attractions" },
    { label: "University",     href: "/information/university" },
    { label: "FAQ",            href: "/information/faq" },
  ],
};

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slightly tighter padding + smaller text at xl to fit all items
  const linkCls =
    "px-2 py-1.5 text-[10.5px] xl:text-[11px] font-mono uppercase tracking-wider rounded-md transition-all duration-200 whitespace-nowrap " +
    "text-[#2a5068] hover:text-[#1a3e58] hover:bg-[#5a90b0]/10";

  return (
    <header
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500")}
      style={{
        background: scrolled
          ? "rgba(186, 220, 245, 0.62)"
          : "rgba(176, 214, 242, 0.38)",
        backdropFilter:       "blur(24px) saturate(180%) brightness(1.08)",
        WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.08)",
        borderBottom: scrolled
          ? "1px solid rgba(100, 170, 220, 0.30)"
          : "1px solid rgba(100, 170, 220, 0.14)",
        boxShadow: scrolled
          ? "0 2px 24px rgba(80,160,220,0.14), 0 1px 0 rgba(220,240,255,0.65) inset"
          : "none",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(80,170,230,0.60) 30%, rgba(58,160,200,0.50) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 xl:px-5 h-14 flex items-center justify-between gap-2">

        {/* ── Logo ── */}
        <a href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative w-7 h-7">
            <div
              className="absolute inset-0 rounded-full border border-[#5a90b0]/55 animate-spin group-hover:border-[#3a7090]/70 transition-colors"
              style={{ animationDuration: "8s" }}
            />
            <div
              className="absolute inset-[3px] rounded-full border border-[#5a9880]/40 animate-spin"
              style={{ animationDuration: "5s", animationDirection: "reverse" }}
            />
            <div className="absolute inset-[7px] rounded-full bg-[#4a88a8] shadow-[0_0_8px_3px_rgba(90,144,176,0.40)]" />
          </div>
          <div className="flex flex-col leading-none select-none">
            <span className="font-black tracking-[0.18em] text-sm font-mono" style={{ color: "#1e4860" }}>
              qins<span style={{ color: "#5a90b0" }}>·</span>2026
            </span>
            <span className="hidden sm:block text-[8px] tracking-[0.25em] uppercase font-mono" style={{ color: "#7aaac0" }}>
              Quantum Conference
            </span>
          </div>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center flex-wrap">
          <a href="/tracks"     className={linkCls}>Track/Topics</a>
          <a href="/committee"  className={linkCls}>Committee</a>

          <NavDropdown label="Programme"   items={dropdownLinks.Programme}   linkCls={linkCls} />
          <NavDropdown label="Submission"  items={dropdownLinks.Submission}  linkCls={linkCls} />
          <NavDropdown label="Information" items={dropdownLinks.Information} linkCls={linkCls} />

          <a href="/partners"            className={linkCls}>Partners</a>
          <a href="/gallery"             className={linkCls}>Gallery</a>
          <a href="/certificate-authors" className={linkCls}>Certificate Authors</a>
          <a href="/contact"             className={linkCls}>Contact Us</a>
        </nav>

        {/* ── Right: CTA + mobile toggle ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Register CTA button */}
          <a
            href="#register"
            className="hidden md:inline-flex items-center px-3 xl:px-4 py-1.5 rounded-full text-[10.5px] xl:text-[11px] font-mono font-bold tracking-widest uppercase transition-all duration-200 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #1e5878, #2a7868)",
              color: "#eef6f8",
              boxShadow: "0 2px 12px rgba(30,88,120,0.20)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(30,88,120,0.32)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(30,88,120,0.20)"; }}
          >
            Register
          </a>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="lg:hidden transition-colors p-1 rounded-md hover:bg-[#5a90b0]/10"
            style={{ color: "#3a6880" }}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            borderTop: "1px solid rgba(90,144,176,0.14)",
            background: "rgba(180, 218, 245, 0.88)",
            backdropFilter:       "blur(28px) saturate(180%) brightness(1.07)",
            WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.07)",
          }}
        >
          <div className="max-w-[1400px] mx-auto px-5 py-4 flex flex-col gap-0.5">
            {[
              { label: "Track/Topics",         href: "/tracks" },
              { label: "Committee",            href: "/committee" },
              { label: "Programme",            href: "/programme" },
              { label: "Submission",           href: "/submission" },
              { label: "Information",          href: "/information" },
              { label: "Partners",             href: "/partners" },
              { label: "Gallery",              href: "/gallery" },
              { label: "Certificate Authors",  href: "/certificate-authors" },
              { label: "Contact Us",           href: "/contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider rounded-lg transition-colors duration-150"
                style={{ color: "#2a5068" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(90,144,176,0.10)"; (e.currentTarget as HTMLElement).style.color = "#1a3e58"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent";           (e.currentTarget as HTMLElement).style.color = "#2a5068"; }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="pt-2 mt-1" style={{ borderTop: "1px solid rgba(90,144,176,0.14)" }}>
              <a
                href="#register"
                className="flex items-center justify-center px-4 py-2 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase"
                style={{ background: "linear-gradient(135deg, #1e5878, #2a7868)", color: "#eef6f8" }}
                onClick={() => setMobileOpen(false)}
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom hairline */}
      <div
        className="h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(80,170,230,0.20) 50%, transparent 100%)",
        }}
      />
    </header>
  );
}

// ─── Frosted dropdown panel ───────────────────────────────────────────────────
function NavDropdown({
  label,
  items,
  linkCls,
}: {
  label: string;
  items: { label: string; href: string }[];
  linkCls: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleToggle = () => {
    if (!triggerRef.current) return;
    const rect      = triggerRef.current.getBoundingClientRect();
    const menuWidth = 210;
    const padding   = 16;
    const viewportW = window.innerWidth;
    let left = rect.left;
    if (left + menuWidth > viewportW - padding) left = viewportW - menuWidth - padding;
    if (left < padding) left = padding;
    setMenuStyle({ position: "fixed", top: rect.bottom + 6, left, width: menuWidth, zIndex: 9999 });
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
          open && "text-[#1a3e58] bg-[#5a90b0]/10"
        )}
      >
        {label}
        <ChevronDown
          className={cn("w-3 h-3 opacity-40 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            background:           "rgba(186, 222, 248, 0.78)",
            backdropFilter:       "blur(28px) saturate(180%) brightness(1.07)",
            WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.07)",
            border:               "1px solid rgba(100,170,220,0.28)",
            borderRadius:         "14px",
            boxShadow:
              "0 8px 32px rgba(30,100,160,0.12), " +
              "0 1px 0 rgba(220,240,255,0.80) inset, " +
              "0 -1px 0 rgba(100,170,220,0.08) inset",
            padding: "6px",
          }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block w-full text-left px-3 py-2 text-[11px] font-mono uppercase tracking-wider rounded-lg transition-colors duration-150"
              style={{ color: "#2a5068" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(90,144,176,0.12)"; (e.currentTarget as HTMLElement).style.color = "#1a3e58"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent";           (e.currentTarget as HTMLElement).style.color = "#2a5068"; }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}