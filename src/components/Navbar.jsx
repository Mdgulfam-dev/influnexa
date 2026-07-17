import { useEffect, useState } from "react";
import Button from "./Button";
import influnexaLogo from "../assets/influnexa-logo.png";

const navItems = [
  ["Home", "/#home"],
  ["Services", "/#services"],
  ["Workflow", "/#workflow"],
  ["Creators", "/#influencers"],
  ["Case Studies", "/#case-studies"],
  ["Blog", "/blog"],
  ["About Us", "/about"],
];

export default function Navbar({ theme = "light", onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-950/82 shadow-2xl shadow-slate-950/15 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <a href="/#home" className="brand-lockup flex items-center" aria-label="Influnexa home">
          <span className="brand-logo-frame">
            <img src={influnexaLogo} alt="Influnexa" />
          </span>
          <span className={`brand-copy ${isDark ? "brand-copy-dark" : "brand-copy-light"}`}>
            <strong>Influnexa</strong>
            <small>Influence, connect, grow</small>
          </span>
        </a>

        <div className="nav-menu hidden items-center gap-1 text-[13px] font-bold text-slate-200 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            className="theme-toggle grid h-11 w-11 place-items-center rounded-full"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 15.4A8 8 0 0 1 8.6 4a8.7 8.7 0 1 0 11.4 11.4Z" />
              </svg>
            )}
          </button>
          <Button href="/register/brand">Start Campaign</Button>
        </div>

          <button
            className="theme-toggle nav-menu-button grid h-11 w-11 place-items-center rounded-full text-white lg:hidden"
            type="button"
            onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label="Open menu"
        >
          <span className="h-0.5 w-5 bg-current shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="mx-4 mb-4 rounded-[28px] border border-white/10 bg-slate-950/96 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl lg:hidden"
        >
          <div className="grid gap-2 text-sm font-bold text-slate-100">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                className="rounded-2xl px-4 py-3 transition hover:bg-white/10"
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white"
              type="button"
              onClick={onToggleTheme}
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            <Button className="flex-1" href="/register/brand">
              Start Campaign
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
