import { useMemo, useState } from "react";
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Typography,
    IconButton,
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
import Grid from "@mui/material/Grid"
import LayersIcon from "@mui/icons-material/Layers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

    // Menus
    const [semAnchor, setSemAnchor] = useState<null | HTMLElement>(null);
    const [majorAnchor, setMajorAnchor] = useState<null | HTMLElement>(null);

    const filtered = useMemo(
        () =>
            mockCourses.filter(
                (c) =>
                    c.title.toLowerCase().includes(query.toLowerCase()) ||
                    c.code.toLowerCase().includes(query.toLowerCase())
            ),
        [query]
    );

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
                                <MenuItem
                                    key={s}
                                    onClick={() => {
                                        setSemester(s);
                                        setSemAnchor(null);
                                    }}
                                >
                                    {s}
                                </MenuItem>
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
                                    <MenuItem
                                        key={m}
                                        onClick={() => {
                                            setMajor(m);
                                            setMajorAnchor(null);
                                        }}
                                    >
                                        {m}
                                    </MenuItem>
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
                    <Grid size={{xs: 12, lg: 4}}>
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
                                                sx={{
                                                    my: 0.5,
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: 1.5,
                                                    px: 1.5,
                                                }}
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
                                        <Typography variant="caption">
                                            Hover a course to see which requirement it can satisfy.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardHeader
                                    title={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <BoltIcon sx={{ fontSize: 18 }} />
                                            <Typography variant="subtitle1">Quick Starts</Typography>
                                        </Stack>
                                    }
                                    sx={{ pb: 0 }}
                                />
                                <CardContent>
                                    <Grid container spacing={1.5}>
                                        {[
                                            { title: "Freshman Plan", desc: "Gen Ed + Starter CS" },
                                            { title: "Upper-Division", desc: "Fill remaining core" },
                                            { title: "Transfer Map", desc: "Max credit overlap" },
                                            { title: "Explore Paths", desc: "See course pathways" },
                                        ].map((q) => (
                                            <Grid size={{xs: 12, sm:6}} key={q.title}>
                                                <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: "space-between", textTransform: "none" }}>
                                                    <Box textAlign="left">
                                                        <Typography variant="body2" fontWeight={600}>{q.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{q.desc}</Typography>
                                                    </Box>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right: Search & Courses */}
                    <Grid size={{xs:12, lg:8}}>
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
                                        <Button variant="contained" startIcon={<SearchIcon />}>Search</Button>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                        Try: "COP3502", "calculus", or "gen ed"
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                    {filtered.length} result(s) • Semester: <Typography component="span" variant="body2" color="text.primary" fontWeight={600}>{semester}</Typography>
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label="Seat availability" size="small" variant="outlined" />
                                    <Divider flexItem orientation="vertical" />
                                    <Chip label="Requirement match" size="small" variant="outlined" />
                                    <Divider flexItem orientation="vertical" />
                                    <Chip label="Difficulty" size="small" variant="outlined" />
                                </Stack>
                            </Stack>

                            <Grid container spacing={2}>
                                {filtered.map((c) => (
                                    <Grid size={{xs: 12, sm:6}} key={c.code}>
                                        <Card variant="outlined" sx={{ transition: "background .15s", '&:hover': { bgcolor: 'action.hover' } }}>
                                            <CardHeader
                                                title={
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight={700}>
                                                            {c.code} · {c.title}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                            <Chip size="small" variant="outlined" label={c.req} />
                                                            <Typography variant="caption" color="text.secondary">Seats: {c.seats}</Typography>
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
