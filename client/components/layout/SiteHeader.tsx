import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ShieldCheck, FileText, Sparkles } from "lucide-react";

export default function SiteHeader() {
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink = (href: string, label: string) => (
    <a
      key={href}
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors",
        pathname === "/" && hash === href.replace("/#", "#") && "text-foreground"
      )}
    >
      {label}
    </a>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        scrolled ? "shadow-sm" : "shadow-none"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-purple-500 text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">LegalEase AI</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Simplify legalese</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLink("/#query", "Query")}
          {navLink("/#summary", "Summary")}
          {navLink("/#risk", "Risk Assessment")}
          {navLink("/#advice", "Review & Advice")}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <a href="/#upload" className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload
            </a>
          </Button>
          <Button asChild>
            <Link to="/auth" className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Login / Register
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
