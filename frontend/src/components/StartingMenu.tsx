
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Search,
  Filter,
  Layers,
  ShoppingCart,
  Sparkles,
  BookOpen,
  Calendar,
  Info,
  GaugeCircle,
  ArrowRight,
} from "lucide-react";

// --- Mock data (static placeholders for UI only) ---
const mockRequirements = [
  { id: 1, name: "Gen Ed: Composition (3cr)", status: "Remaining", code: "GE-C" },
  { id: 2, name: "Math Core: Calculus I (4cr)", status: "Fulfilled", code: "MAC2311" },
  { id: 3, name: "CS Core: Programming I (4cr)", status: "In Progress", code: "COP3502" },
  { id: 4, name: "Electives (6cr)", status: "Remaining", code: "ELEC" },
];

const mockCourses = [
  { code: "COP3502", title: "Programming Fundamentals 1", seats: 151, req: "CS Core", difficulty: 3 },
  { code: "MAC2311", title: "Analytic Geometry & Calculus 1", seats: 48, req: "Math Core", difficulty: 4 },
  { code: "ENC1101", title: "Expository & Argumentative Writing", seats: 12, req: "Gen Ed: Comp", difficulty: 2 },
  { code: "PSY2012", title: "General Psychology", seats: 77, req: "Gen Ed: Soc Sci", difficulty: 2 },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs rounded-full px-2 py-0.5 bg-muted border shadow-sm">
      {children}
    </div>
  );
}

function DifficultyMeter({ level }: { level: number }) {
  // level 1..5
  return (
    <div className="flex items-center gap-1" title={`Expected weekly hours: ~${level * 3}-${level * 4}`}> 
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-2 w-4 rounded ${i <= level ? "bg-foreground/70" : "bg-muted"}`}
        />
      ))}
      <GaugeCircle className="h-3.5 w-3.5 ml-1 opacity-70" />
    </div>
  );
}

export default function StartingMenu() {
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("Spring 2026");
  const [major, setMajor] = useState("Computer Science (BS)");
  const [whatIf, setWhatIf] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filtered = mockCourses.filter(
    (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            <span className="font-semibold tracking-tight">CoursePath</span>
            <Badge variant="secondary" className="ml-1">Preview</Badge>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2"><Calendar className="h-4 w-4" /> {semester}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Choose semester</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["Spring 2026", "Fall 2025", "Summer 2025"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setSemester(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2"><GraduationCap className="h-4 w-4" /> {major}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Select major</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["Computer Science (BS)", "Data Science (BS)", "Mathematics (BA)", "Information Systems (BS)"]
                  .map((m) => (
                    <DropdownMenuItem key={m} onClick={() => setMajor(m)}>{m}</DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>

            <Button variant="outline" size="sm" className="gap-2 relative">
              <ShoppingCart className="h-4 w-4" /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2 pl-2">
              <Tag>What-If</Tag>
              <Switch checked={whatIf} onCheckedChange={setWhatIf} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requirements */}
        <section className="lg:col-span-4 space-y-4">
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Remaining Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRequirements.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/60"
                  title={`Code ${r.code}`}
                >
                  <div className="text-sm">
                    <div className="font-medium leading-none">{r.name}</div>
                    <div className="text-xs text-muted-foreground">Code: {r.code}</div>
                  </div>
                  <Badge>{r.status}</Badge>
                </motion.div>
              ))}
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Info className="h-3.5 w-3.5"/> Hover a course to see which requirement it can satisfy.</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Quick Starts
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { title: "Freshman Plan", desc: "Gen Ed + Starter CS", icon: <ArrowRight className="h-4 w-4" /> },
                { title: "Upper-Division", desc: "Fill remaining core", icon: <ArrowRight className="h-4 w-4" /> },
                { title: "Transfer Map", desc: "Max credit overlap", icon: <ArrowRight className="h-4 w-4" /> },
                { title: "Explore Paths", desc: "See course pathways", icon: <ArrowRight className="h-4 w-4" /> },
              ].map((q, i) => (
                <Button key={i} variant="outline" className="justify-between">
                  <div className="text-left">
                    <div className="text-sm font-medium leading-none">{q.title}</div>
                    <div className="text-xs text-muted-foreground">{q.desc}</div>
                  </div>
                  {q.icon}
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Right: Search & Courses */}
        <section className="lg:col-span-8 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses, codes, or keywords…"
                    className="pl-9"
                  />
                </div>
                <Button className="gap-2"><Search className="h-4 w-4" /> Search</Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Try: "COP3502", "calculus", or "gen ed"</div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{filtered.length} result(s) • Semester: <span className="font-medium text-foreground">{semester}</span></div>
            <div className="flex items-center gap-2">
              <Tag>Seat availability</Tag>
              <Separator orientation="vertical" className="h-4"/>
              <Tag>Requirement match</Tag>
              <Separator orientation="vertical" className="h-4"/>
              <Tag>Difficulty</Tag>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <motion.div key={c.code} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                <Card className="group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base tracking-tight">{c.code} · {c.title}</CardTitle>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Tag>{c.req}</Tag>
                          <span>Seats: {c.seats}</span>
                        </div>
                      </div>
                      <DifficultyMeter level={c.difficulty} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Hover to preview satisfied requirements</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">What-If</Button>
                      <Button size="sm" onClick={() => setCartCount((n) => n + 1)}>Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} CoursePath — UI Preview</div>
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="#">Accessibility</a>
            <a className="hover:underline" href="#">Help</a>
            <a className="hover:underline" href="#">Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
