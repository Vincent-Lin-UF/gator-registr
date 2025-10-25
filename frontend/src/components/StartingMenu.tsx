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
import Grid from "@mui/material/Grid";
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
    seats: number | "N/A";
    req: string;
    difficulty: number;
    id: string;
}

// --- Mock requirements for left panel ---
const mockRequirements = [
    { id: 1, name: "Gen Ed: Composition (3cr)", status: "Remaining", code: "GE-C" },
    { id: 2, name: "Math Core: Calculus I (4cr)", status: "Fulfilled", code: "MAC2311" },
    { id: 3, name: "CS Core: Programming I (4cr)", status: "In Progress", code: "COP3502" },
    { id: 4, name: "Electives (6cr)", status: "Remaining", code: "ELEC" },
];

// --- Difficulty meter component ---
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

    // --- Fetch courses from backend ---
    useEffect(() => {
        async function fetchCourses(searchQuery = "") {
            try {
                const courseCode = "null";
                const instructor = "null";
                const requirementSatisfied = "null";
                const url = new URL("http://127.0.0.1:8000/v1/uf/search");
                if (courseCode) url.searchParams.append("course_code", courseCode);
                if (instructor) url.searchParams.append("instructor", instructor);
                if (requirementSatisfied) url.searchParams.append("requirement_satisfied", requirementSatisfied);

                const res = await fetch(url.toString());
                const data = await res.json();

                const mapped: Course[] = (data.courses || []).flatMap((c: any) =>
                    (c.sections || []).map((s: any) => ({
                        code: c.code,
                        title: c.name,
                        seats: s.openSeats ?? "N/A",
                        req: "Req TBD",
                        difficulty: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)),
                        id: s.classNumber ?? `${c.code}-${s.number}`,
                    }))
                );

                setCourses(mapped);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        }

        fetchCourses();
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return courses.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q)
        );
    }, [courses, query]);

    const handleSearch = () => {
        const courseCode = query || "null";
        const instructor = "null";
        const requirementSatisfied = "null"; 

        const url = new URL("http://127.0.0.1:8000/v1/uf/search");
        url.searchParams.append("course_code", courseCode);
        url.searchParams.append("instructor", instructor);
        url.searchParams.append("requirement_satisfied", requirementSatisfied);

        fetch(url.toString())
            .then((res) => res.json())
            .then((data) => {
                const mapped: Course[] = (data.courses || []).flatMap((c: any) =>
                    (c.sections || []).map((s: any) => ({
                        code: c.code,
                        title: c.name,
                        seats: s.openSeats ?? "N/A",
                        req: "Req TBD",
                        difficulty: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)),
                        id: s.classNumber ?? `${c.code}-${s.number}`,
                    }))
                );
                setCourses(mapped);
                setVisibleCount(4);
            })
            .catch((err) => console.error("Failed to fetch courses:", err));
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

                    <Button variant="outlined" size="small" startIcon={<FilterListIcon fontSize="small" />}>Filters</Button>

                    <MUIBadge color="primary" badgeContent={cartCount} overlap="circular">
                        <Button variant="outlined" size="small" startIcon={<ShoppingCartIcon fontSize="small" />}>Cart</Button>
                    </MUIBadge>

                    <FormControlLabel
                        sx={{ ml: 1 }}
                        control={<Switch checked={whatIf} onChange={(e) => setWhatIf(e.target.checked)} />}
                        label={<Chip label="What-If" size="small" variant="outlined" />}
                    />
                </Toolbar>
            </AppBar>

            {/* Main */}
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Grid container spacing={3}>
                    {/* Left: Requirements */}
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
                                        {mockRequirements.map((r) => (
                                            <ListItem
                                                key={r.id}
                                                sx={{ my: 0.5, border: 1, borderColor: "divider", borderRadius: 1.5, px: 1.5 }}
                                                secondaryAction={<Chip label={r.status} size="small" />}
                                            >
                                                <ListItemText
                                                    primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                                                    secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                                                    primary={r.name}
                                                    secondary={`Code: ${r.code}`}
                                                />
                                            </ListItem>
                                        ))}
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
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                            <Chip size="small" variant="outlined" label={c.req} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                Seats: {c.seats}
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                }
                                                action={<DifficultyMeter level={c.difficulty} />}
                                                sx={{ pb: 0.5 }}
                                            />
                                            <CardContent sx={{ pt: 1.5 }}>
                                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                    <Typography variant="caption" color="text.secondary">
                                                        Hover to preview satisfied requirements
                                                    </Typography>
                                                    <Stack direction="row" spacing={1}>
                                                        <Button size="small" variant="outlined">What-If</Button>
                                                        <Button size="small" variant="contained" onClick={() => setCartCount((n) => n + 1)}>
                                                            Add to Cart
                                                        </Button>
                                                    </Stack>
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
                <Container maxWidth="lg" sx={{ py: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
