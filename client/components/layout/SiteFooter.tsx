export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container py-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LegalEase AI. All rights reserved.
        </p>
        <div className="text-xs text-muted-foreground/80">
          This prototype helps summarize legal documents, assess risk with color gradation, and provide human-friendly advice.
        </div>
      </div>
    </footer>
  );
}
