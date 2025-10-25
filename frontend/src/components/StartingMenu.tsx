import { useState, useEffect, useMemo } from "react";
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Typography,
    Button,
    Chip,
    Badge as MUIBadge,
    Menu,
    MenuItem,
    Divider,
    Card,
    CardHeader,
    CardContent,
    TextField,
    InputAdornment,
    Stack,
    Tooltip,
    Switch,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Link,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // <-- Grid v2
import LayersIcon from "@mui/icons-material/Layers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import BoltIcon from "@mui/icons-material/Bolt";

interface Course {
    code: string;
    title: string;
    req: string;
    difficulty: number;
    id: string;
}

// 1) Replace your Course interface with a course-level summary
interface Course {
    code: string;
    title: string;
    seats: number | "N/A";     // aggregated total (or "N/A")
    sectionsCount: number;      // how many sections exist
    req: string;
    difficulty: number;
    id: string;                 // use course code so it's unique per course
}

// 2) Helper to map API payload to unique courses
function mapApiToCourses(data: any, requirement: string | null): Course[] {
    const list: any[] = Array.isArray(data?.courses) ? data.courses : [];
    return list.map((c) => {
        const sections = Array.isArray(c.sections) ? c.sections : [];
        return {
            code: c.code,
            title: c.name,
            sectionsCount: sections.length,
            req: requirement ?? "Req TBD",
            difficulty: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)),
            id: c.code,
        } as Course;
    });
}

function DifficultyMeter({ level }: { level: number }) {
    const bars = useMemo(() => Array.from({ length: 5 }, (_, i) => i + 1), []);
    return (
        <Tooltip title={`Expected weekly hours: ~${level * 3}-${level * 4}`}>
            <Stack direction="row" spacing={0.5} alignItems="center">
                {bars.map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 16,
                            height: 8,
                            borderRadius: 1,
                            bgcolor: i <= level ? "text.primary" : "action.hover",
                            opacity: i <= level ? 0.7 : 1,
                        }}
                    />
                ))}
                <BoltIcon sx={{ fontSize: 16, ml: 0.5, opacity: 0.7 }} />
            </Stack>
        </Tooltip>
    );
}

const API_BASE = "http://127.0.0.1:8000";

export default function StartingMenu() {
    const [query, setQuery] = useState("");
    const [semester, setSemester] = useState("Spring 2026");
    const [major, setMajor] = useState("Computer Science (BS)");
    const [whatIf, setWhatIf] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [visibleCount, setVisibleCount] = useState(4);

    const [semAnchor, setSemAnchor] = useState<null | HTMLElement>(null);
    const [majorAnchor, setMajorAnchor] = useState<null | HTMLElement>(null);

    // Filters
    const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
    const [allRequirements, setAllRequirements] = useState<string[]>([]);
    const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);

    // Remaining requirements
    const [remainingReqs, setRemainingReqs] = useState<string[]>([]);

    const fetchCourses = async (searchQuery = "", requirement: string | null = selectedRequirement) => {
        try {
            const courseCode = searchQuery || "null";
            const instructor = "null";
            const requirementSatisfied = requirement ?? "null";
            const url = new URL(`${API_BASE}/v1/uf/search`);
            url.searchParams.append("course_code", courseCode);
            url.searchParams.append("instructor", instructor);
            url.searchParams.append("requirement_satisfied", requirementSatisfied);

            const res = await fetch(url.toString());
            const data = await res.json();

            const mapped: Course[] = (data.courses || []).flatMap((c: any) =>
                (c.sections || []).map((s: any) => ({
                    code: c.code,
                    title: c.name,
                    seats: s.openSeats ?? "N/A",
                    req: requirement ?? "Req TBD",
                    difficulty: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)),
                    id: s.classNumber ?? `${c.code}-${s.number}`,
                }))
            );
            setCourses(mapApiToCourses(data, requirement));
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    useEffect(() => {
        fetchCourses();

        (async () => {
            try {
                const r = await fetch(`${API_BASE}/v1/uf/all_requirements`);
                const list: string[] = await r.json();
                setAllRequirements(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error("Failed to load all requirements:", e);
            }
        })();

        (async () => {
            try {
                const r = await fetch(`${API_BASE}/v1/uf/user_requirements`);
                const list: string[] = await r.json();
                setRemainingReqs(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error("Failed to load user requirements:", e);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return courses.filter(
            (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
        );
    }, [courses, query]);

    const handleSearch = () => {
        fetchCourses(query, selectedRequirement);
        setVisibleCount(4);
    };

    const handleRequirementPick = async (req: string | null) => {
        setSelectedRequirement(req);
        setFilterAnchor(null);
        await fetchCourses(query, req);
        setVisibleCount(4);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
            {/* Top Bar */}
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar sx={{ gap: 1 }}>
                    <LayersIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1 }}>
                        CoursePath
                    </Typography>
                    <Chip label="Preview" size="small" variant="outlined" />
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Semester */}
                    <Box>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CalendarTodayIcon fontSize="small" />}
                            onClick={(e) => setSemAnchor(e.currentTarget)}
                        >
                            {semester}
                        </Button>
                        <Menu anchorEl={semAnchor} open={Boolean(semAnchor)} onClose={() => setSemAnchor(null)}>
                            <Typography variant="caption" sx={{ px: 2, pt: 1 }}>Choose semester</Typography>
                            <Divider sx={{ my: 1 }} />
                            {["Spring 2026", "Fall 2025", "Summer 2025"].map((s) => (
                                <MenuItem key={s} onClick={() => { setSemester(s); setSemAnchor(null); }}>{s}</MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Major */}
                    <Box>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<SchoolIcon fontSize="small" />}
                            onClick={(e) => setMajorAnchor(e.currentTarget)}
                        >
                            {major}
                        </Button>
                        <Menu anchorEl={majorAnchor} open={Boolean(majorAnchor)} onClose={() => setMajorAnchor(null)}>
                            <Typography variant="caption" sx={{ px: 2, pt: 1 }}>Select major</Typography>
                            <Divider sx={{ my: 1 }} />
                            {["Computer Science (BS)", "Data Science (BS)", "Mathematics (BA)", "Information Systems (BS)"].map(
                                (m) => (
                                    <MenuItem key={m} onClick={() => { setMajor(m); setMajorAnchor(null); }}>{m}</MenuItem>
                                )
                            )}
                        </Menu>
                    </Box>

                    {/* Filters */}
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FilterListIcon fontSize="small" />}
                        onClick={(e) => setFilterAnchor(e.currentTarget)}
                    >
                        {selectedRequirement ? `Filter: ${selectedRequirement}` : "Filters"}
                    </Button>
                    <Menu
                        anchorEl={filterAnchor}
                        open={Boolean(filterAnchor)}
                        onClose={() => setFilterAnchor(null)}
                        sx={{ maxHeight: 480 }}
                    >
                        <Typography variant="caption" sx={{ px: 2, pt: 1 }}>Filter by requirement</Typography>
                        <Divider sx={{ my: 1 }} />
                        <MenuItem onClick={() => handleRequirementPick(null)} dense>
                            <Chip size="small" label="Clear filter" variant="outlined" />
                        </MenuItem>
                        <Divider />
                        {allRequirements.length === 0 ? (
                            <MenuItem disabled dense>Loading…</MenuItem>
                        ) : (
                            allRequirements.map((req) => (
                                <MenuItem
                                    key={req}
                                    onClick={() => handleRequirementPick(req)}
                                    selected={req === selectedRequirement}
                                    dense
                                >
                                    {req}
                                </MenuItem>
                            ))
                        )}
                    </Menu>

                </Toolbar>
            </AppBar>

            {/* Main */}
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Grid container spacing={3}>
                    {/* Left: Remaining Requirements */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={2}>
                            <Card variant="outlined">
                                <CardHeader
                                    title={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <BookOutlinedIcon sx={{ fontSize: 18 }} />
                                            <Typography variant="subtitle1">Remaining Requirements</Typography>
                                        </Stack>
                                    }
                                    sx={{ pb: 0 }}
                                />
                                <CardContent>
                                    <List dense disablePadding>
                                        {remainingReqs.map((name) => (
                                            <ListItem
                                                key={name}
                                                sx={{
                                                    my: 0.5,
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: 1.5,
                                                    px: 1.5,
                                                    // make sure item has enough right padding so text wraps before the chip
                                                    pr: 12, // ~96px; adjust if your chip gets wider
                                                }}
                                                secondaryAction={
                                                    <Box sx={{ minWidth: 90, display: "flex", justifyContent: "flex-end" }}>
                                                        <Chip label="Remaining" size="small" />
                                                    </Box>
                                                }
                                            >
                                                <ListItemText
                                                    primary={name}
                                                    primaryTypographyProps={{
                                                        variant: "body2",
                                                        fontWeight: 600,
                                                        // ensure wrapping even for long tokens
                                                        noWrap: false,
                                                    }}
                                                    sx={{
                                                        overflowWrap: "anywhere",
                                                        wordBreak: "break-word",
                                                    }}
                                                />
                                            </ListItem>
                                        ))}

                                        {remainingReqs.length === 0 && (
                                            <Typography variant="caption" color="text.secondary">
                                                No remaining requirements found.
                                            </Typography>
                                        )}
                                    </List>
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.5 }}>
                                        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                                        <Typography variant="caption">Hover a course to see which requirement it can satisfy.</Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right: Search & Courses */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Stack spacing={2}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                                        <TextField
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search courses, codes, or keywords…"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
                                            Search
                                        </Button>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                        Try: "ABE2012C", "calculus", or "gen ed"
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Grid container spacing={2}>
                                {filtered.slice(0, visibleCount).map((c) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={c.id}>
                                        <Card variant="outlined" sx={{ transition: "background .15s", "&:hover": { bgcolor: "action.hover" } }}>
                                            <CardHeader
                                                title={
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight={700}>
                                                            {c.code} · {c.title}
                                                        </Typography>
                                                    </Box>
                                                }
                                                action={<DifficultyMeter level={c.difficulty} />}
                                                sx={{ pb: 0.5 }}
                                            />
                                            <CardContent sx={{ pt: 1.5 }}>
                                                <Stack direction="row" alignItems="center" justifyContent="space-between">

                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {visibleCount < filtered.length && (
                                <Box sx={{ textAlign: "center", mt: 2 }}>
                                    <Button variant="outlined" onClick={() => setVisibleCount((prev) => prev + 4)}>Show More</Button>
                                </Box>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", mt: 6 }}>
                <Container
                    maxWidth="lg"
                    sx={{ py: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} CoursePath — UI Preview
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Link href="#" underline="hover" variant="caption">Accessibility</Link>
                        <Link href="#" underline="hover" variant="caption">Help</Link>
                        <Link href="#" underline="hover" variant="caption">Feedback</Link>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
