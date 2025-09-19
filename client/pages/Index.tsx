import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileUp, Wand2, HelpCircle, ClipboardList, ShieldAlert, Send, AlertTriangle, Sparkles } from "lucide-react";

interface AnalysisResult {
  summary: string;
  riskScore: number; // 0-100
  risks: string[];
  advice: string[];
  highlights: string[];
}

const RISK_KEYWORDS: Array<[string, number]> = [
  ["indemnify", 15],
  ["indemnification", 18],
  ["liability", 12],
  ["penalty", 10],
  ["arbitration", 6],
  ["termination", 8],
  ["confidential", 6],
  ["non-compete", 14],
  ["breach", 10],
  ["damages", 10],
  ["waiver", 6],
  ["jurisdiction", 6],
  ["governing law", 8],
  ["auto-renew", 10],
  ["late fee", 8],
  ["exclusive", 8],
];

export default function Index() {
  const [docText, setDocText] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const analyze = () => {
    setLoading(true);
    const sample = `This Agreement is governed by the laws of California. Either party may terminate for material breach upon 30 days written notice. Liability is limited to the fees paid in the preceding 12 months and excludes indirect damages. The agreement auto-renews for successive one-year terms unless notice of non-renewal is provided 60 days prior to the end of the then-current term. Each party shall indemnify and hold harmless the other from third-party claims.`;
    const base = docText.trim() || sample;
    setTimeout(() => {
      const r = performAnalysis(base);
      setResult(r);
      if (query.trim()) setAnswer(answerQuery(base, query));
      setLoading(false);
    }, 400);
  };

  const riskVariant = useMemo(() => {
    const score = result?.riskScore ?? 0;
    if (score < 25) return { label: "Low", color: "from-emerald-500 to-lime-500", badge: "bg-emerald-100 text-emerald-700" } as const;
    if (score < 60) return { label: "Medium", color: "from-yellow-400 to-amber-500", badge: "bg-amber-100 text-amber-800" } as const;
    return { label: "High", color: "from-rose-500 to-red-600", badge: "bg-red-100 text-red-800" } as const;
  }, [result?.riskScore]);

  const onFile = async (file: File) => {
    if (!file) return;
    if (file.type.startsWith("text/") || file.name.endsWith(".md")) {
      const text = await file.text();
      setDocText(text);
      return;
    }
    // Fallback for unsupported types
    setDocText(`Unsupported file type for inline parsing. Please paste text.\nFile: ${file.name}`);
  };

  return (
    <div className="relative">
      <Hero onAnalyze={analyze} analyzing={loading} />
      <Decor />

      <section id="upload" className="container grid gap-6 md:gap-8 lg:grid-cols-2 py-10 md:py-16">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Upload or paste your legal document</CardTitle>
              <CardDescription>TXT/MD supported inline. Paste from PDF/Doc.</CardDescription>
            </div>
            <Button variant="secondary" className="pl-[11px]" onClick={() => fileInputRef.current?.click()}>
              <FileUp className="mr-2 h-4 w-4" /> Choose file
            </Button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files && onFile(e.target.files[0]!)} />
          </CardHeader>
          <CardContent>
            <Textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste the contract, policy, or terms here..."
              className="min-h-[220px]"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">We never upload your data in this prototype.</div>
              <Button onClick={analyze} disabled={loading}>
                <Wand2 className="mr-2 h-4 w-4" /> {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card id="query">
          <CardHeader>
            <CardTitle>Ask questions about the document</CardTitle>
            <CardDescription>Get plain-language answers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What are the termination conditions?"
              />
              <Button onClick={() => setAnswer(answerQuery(docText, query))} disabled={!docText.trim() || !query.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {answer && (
              <div className="mt-4 rounded-md border bg-muted/30 p-3 text-sm">
                {answer}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="container grid gap-6 md:gap-8 lg:grid-cols-3 py-6 md:py-2" id="summary">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Key points in simple language</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <p className="leading-relaxed">{result.summary}</p>
                {!!result.highlights.length && (
                  <div className="flex flex-wrap gap-2">
                    {result.highlights.map((h, i) => (
                      <Badge key={i} variant="secondary">{h}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Placeholder text="Run an analysis to view the summary." />
            )}
          </CardContent>
        </Card>

        <Card id="risk">
          <CardHeader>
            <CardTitle>Risk assessment</CardTitle>
            <CardDescription>Color gradation shows severity</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={cn("h-5 w-5", result.riskScore >= 60 ? "text-red-600" : result.riskScore >= 25 ? "text-amber-500" : "text-emerald-600")} />
                    <span className="text-sm text-muted-foreground">Overall risk</span>
                  </div>
                  <Badge className={cn(riskVariant.badge)}>{riskVariant.label} • {Math.round(result.riskScore)}</Badge>
                </div>
                <div className={cn("relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r", riskVariant.color)}>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-background bg-foreground/90 shadow"
                    style={{ left: `calc(${Math.min(100, Math.max(0, result.riskScore))}% - 10px)` }}
                    aria-label={`Risk pointer at ${Math.round(result.riskScore)}%`}
                  />
                </div>
                {!!result.risks.length && (
                  <ul className="space-y-2 text-sm">
                    {result.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /> {r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Placeholder text="Analyze a document to assess risk." />
            )}
          </CardContent>
        </Card>
      </section>

      <section id="advice" className="container py-6 md:py-10">
        <Card>
          <CardHeader>
            <CardTitle>Review & Advice</CardTitle>
            <CardDescription>Actionable suggestions to reduce risk</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="grid gap-3 md:grid-cols-2">
                {result.advice.map((a, i) => (
                  <div key={i} className="rounded-md border p-3 text-sm">
                    <div className="mb-1 font-medium inline-flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" /> Suggestion {i + 1}</div>
                    <p className="text-muted-foreground">{a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Placeholder text="You'll see tailored advice here after analysis." />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Hero({ onAnalyze, analyzing }: { onAnalyze: () => void; analyzing: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.violet.500/15),transparent_40%),radial-gradient(ellipse_at_bottom_right,theme(colors.blue.500/15),transparent_40%)]" />
      <div className="container py-14 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI for everyone
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Simplify legal documents into clear, human language
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Upload contracts or policies, ask questions, get a concise summary, visualize risk with color gradation, and receive guidance.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={onAnalyze} disabled={analyzing}>
              <Wand2 className="mr-2 h-5 w-5" /> {analyzing ? "Analyzing..." : "Analyze sample"}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#upload" className=""> <FileUp className="mr-2 h-5 w-5" /> Upload your own</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Decor() {
  return (
    <div aria-hidden className="pointer-events-none select-none">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground flex items-center gap-2">
      <HelpCircle className="h-4 w-4" /> {text}
    </div>
  );
}

function performAnalysis(text: string): AnalysisResult {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/);

  const scores = RISK_KEYWORDS.map(([kw, weight]) => {
    const count = (clean.toLowerCase().match(new RegExp(kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "g")) || []).length;
    return count * weight;
  });
  const baseRisk = Math.min(100, scores.reduce((a, b) => a + b, 0));
  const lengthAdj = Math.min(20, Math.max(0, (clean.length - 800) / 2000) * 20);
  const riskScore = Math.min(100, baseRisk + lengthAdj);

  const topSentences = sentences
    .sort((a, b) => scoreSentence(b) - scoreSentence(a))
    .slice(0, Math.max(3, Math.min(6, Math.ceil(sentences.length * 0.25))))
    .map((s) => s.trim());

  const summary = topSentences.join(" ");

  const risks: string[] = [];
  if (riskScore >= 60) risks.push("High overall risk. Seek legal review before signing.");
  if (/auto-?renew/i.test(clean)) risks.push("Auto-renewal present. Calendar cancellation dates.");
  if (/indemnif/i.test(clean)) risks.push("Indemnification may shift liability to you.");
  if (/termination/i.test(clean)) risks.push("Termination terms could be strict—check notice periods.");
  if (/jurisdiction|governing law/i.test(clean)) risks.push("Jurisdiction may be unfavorable.");

  const advice = buildAdvice(clean);

  const highlights = RISK_KEYWORDS.filter(([kw]) => new RegExp(kw, "i").test(clean)).map(([kw]) => kw);

  return { summary: summary || clean.slice(0, 240), riskScore, risks, advice, highlights };
}

function scoreSentence(s: string): number {
  const lower = s.toLowerCase();
  let score = 0;
  for (const [kw, weight] of RISK_KEYWORDS) if (lower.includes(kw)) score += weight;
  score += Math.min(10, Math.ceil(s.length / 120));
  return score;
}

function buildAdvice(clean: string): string[] {
  const tips: string[] = [];
  if (/indemnif/i.test(clean)) tips.push("Limit indemnification to direct damages and mutual obligations.");
  if (/liability/i.test(clean)) tips.push("Cap liability to fees paid in the last 12 months and exclude indirect damages.");
  if (/termination/i.test(clean)) tips.push("Add convenience termination with 30-day notice if possible.");
  if (/confidential/i.test(clean)) tips.push("Ensure confidentiality survives for at least 2 years.");
  if (/auto-?renew/i.test(clean)) tips.push("Replace auto-renewal with explicit renewal or add opt-out reminders.");
  if (/jurisdiction|governing law/i.test(clean)) tips.push("Choose a neutral jurisdiction or your home state.");
  if (!tips.length) tips.push("No obvious red flags detected. Still consider a legal review for important agreements.");
  return tips;
}

function answerQuery(text: string, q: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean || !q.trim()) return "Please provide a document and a question.";
  const words = q.toLowerCase().split(/\W+/).filter(Boolean).slice(0, 6);
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const ranked = sentences
    .map((s) => ({ s, score: words.reduce((acc, w) => acc + (s.toLowerCase().includes(w) ? 1 : 0), 0) + scoreSentence(s) / 50 }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0]?.s || sentences[0] || "";
  return top ? top : "No relevant passage found.";
}
