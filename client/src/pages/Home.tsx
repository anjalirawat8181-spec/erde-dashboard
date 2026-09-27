import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CloudSun,
  Droplets,
  Filter,
  LayoutDashboard,
  Leaf,
  Map,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sprout,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

type FieldStatus = "Needs review" | "Healthy" | "Scheduled";
type SortKey = "field" | "state" | "irrigation" | "status" | "area";

type Field = {
  id: string;
  field: string;
  state: string;
  nextIrrigation: string;
  status: FieldStatus;
  area: string;
  crop: string;
  alert: boolean;
};

const fields: Field[] = [
  { id: "MH-04", field: "Field 04", state: "Maharashtra", nextIrrigation: "Today, 4:30 PM", status: "Needs review", area: "8.42 acres", crop: "Test crop", alert: true },
  { id: "MP-02", field: "Field 02", state: "Madhya Pradesh", nextIrrigation: "Tomorrow, 6:00 AM", status: "Healthy", area: "5.18 acres", crop: "Apricots", alert: false },
  { id: "MH-07", field: "Field 07", state: "Maharashtra", nextIrrigation: "Tomorrow, 8:15 AM", status: "Scheduled", area: "3.64 acres", crop: "Arak tree", alert: false },
  { id: "MP-05", field: "Field 05", state: "Madhya Pradesh", nextIrrigation: "Fri, 7:45 AM", status: "Healthy", area: "2.91 acres", crop: "Almonds", alert: false },
];

const cropMix = [
  { name: "Test crop", area: "12.86", percent: "55.72%", color: "#a87b00" },
  { name: "Apricots", area: "1.88", percent: "8.15%", color: "#6f89d7" },
  { name: "Lentil", area: "1.88", percent: "8.15%", color: "#e67562" },
  { name: "Arak tree", area: "1.81", percent: "7.84%", color: "#e7a942" },
  { name: "Grapes table", area: "1.43", percent: "6.20%", color: "#8f9adf" },
  { name: "Corn", area: "1.25", percent: "5.42%", color: "#cfd3df" },
  { name: "Almonds", area: "0.74", percent: "3.21%", color: "#6ab8a6" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Fields", icon: Map },
  { label: "Farmers", icon: Users },
  { label: "Reports", icon: BarChart3 },
];

function LogoMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, index) => (
        <span key={index} style={{ transform: `rotate(${index * 45}deg) translateY(-7px)` }} />
      ))}
      <i />
    </div>
  );
}

function StatusPill({ status }: { status: FieldStatus }) {
  const styles: Record<FieldStatus, string> = {
    "Needs review": "status-pill status-pill-alert",
    Healthy: "status-pill status-pill-healthy",
    Scheduled: "status-pill status-pill-scheduled",
  };
  return <span className={styles[status]}>{status}</span>;
}

function MetricCard({ label, value, suffix, detail, icon: Icon, tone }: { label: string; value: string; suffix?: string; detail: string; icon: typeof Activity; tone: "green" | "amber" | "coral" | "blue" }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon metric-icon-${tone}`}><Icon size={17} strokeWidth={2.1} /></div>
      <p className="eyebrow">{label}</p>
      <div className="metric-value">{value}<span>{suffix}</span></div>
      <p className="metric-detail">{detail}</p>
    </div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All states");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("field");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const visibleFields = useMemo(() => {
    const filtered = fields.filter((field) => {
      const matchesQuery = `${field.field} ${field.state} ${field.crop}`.toLowerCase().includes(query.toLowerCase());
      const matchesState = stateFilter === "All states" || field.state === stateFilter;
      const matchesStatus = statusFilter === "All status" || field.status === statusFilter;
      return matchesQuery && matchesState && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      const aValue = sortKey === "area" ? Number.parseFloat(a.area) : a[sortKey === "irrigation" ? "nextIrrigation" : sortKey];
      const bValue = sortKey === "area" ? Number.parseFloat(b.area) : b[sortKey === "irrigation" ? "nextIrrigation" : sortKey];
      const result = typeof aValue === "number" && typeof bValue === "number" ? aValue - bValue : String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? result : -result;
    });
  }, [query, sortDirection, sortKey, stateFilter, statusFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection("asc"); }
  };

  const sortLabel = (key: SortKey) => sortKey === key ? (sortDirection === "asc" ? "↑" : "↓") : "↕";

  const handleNav = (label: string) => {
    setActiveNav(label);
    if (label !== "Overview") toast(`${label} view is coming next`, { description: "This prototype keeps the overview flow front and center." });
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
         <img
  src="/erde-agro-logo.png"
  alt="Erde Agro"
  style={{
    width: "178px",
    height: "53px",
    objectFit: "contain",
    display: "block"
  }}
/>
         
        </div>x
        <div className="topbar-actions">
          <button className="icon-button topbar-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <button className="notification-button" onClick={() => toast("You’re all caught up", { description: "There is 1 moisture alert waiting for review." })} aria-label="Notifications">
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          <div className="workspace-switcher"><span className="avatar">E</span><span>Erde Agro Ecosystems</span><ChevronDown size={15} /></div>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-mobile-head"><span>Navigation</span><button className="icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
          <div className="sidebar-date"><CalendarDays size={23} /><span>Fri 25/09/2026</span><ChevronDown size={19} /></div>
          <div className="sidebar-breadcrumb">FPO / Company / FPC</div>
          <button className="company-selector" onClick={() => toast("Company selector opened")}><span className="company-home"><LayoutDashboard size={20} fill="currentColor" /></span><span>Erde Agro Ecosystems</span></button>
          <div className="sidebar-section-title">Farmers and Fields</div>
          <div className="sidebar-filter"><Search size={24} /><input placeholder="Filter states, villages, farmers, farms" aria-label="Filter states, villages, farmers, farms" /></div>
          <div className="location-tree" aria-label="Farmers and fields locations">
            <div className="location-state location-state-open"><ChevronDown size={18} /><span>Madhya Pradesh</span></div>
            <div className="location-village"><ChevronRight size={17} /><span className="village-name">Mandla</span><span className="dot dot-neutral" /><span className="dot dot-neutral" /><span className="farmer-count">1 farmers</span></div>
            <div className="location-state location-state-selected"><ChevronDown size={18} /><span>Maharashtra</span></div>
            <div className="location-village"><ChevronRight size={17} /><span className="village-name">Mumbai</span><span className="dot dot-red" /><span className="dot dot-blue" /><span className="farmer-count">5 farmers</span></div>
            <div className="location-village"><ChevronRight size={17} /><span className="village-name">Sangli</span><span className="dot dot-neutral" /><span className="dot dot-blue" /><span className="farmer-count">1 farmers</span></div>
            <div className="location-village"><ChevronRight size={17} /><span className="village-name">Sindhudurg</span><span className="dot dot-neutral" /><span className="dot dot-neutral" /><span className="farmer-count">1 farmers</span></div>
          </div>
        </aside>
        {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}

        <main className="main-content">
          <div className="content-header">
            <div>
              <div className="date-kicker"><CalendarDays size={14} /> Wednesday, 23 September 2026</div>
              <h1>Operations overview</h1>
              <p className="page-subtitle">Current field activity and alerts across all farms.</p>
            </div>
            <button className="primary-button" onClick={() => toast("Add field flow opened", { description: "Connect this button to your field onboarding flow." })}><Plus size={17} /> Add field</button>
          </div>

          <section className="metrics-grid" aria-label="Overview metrics">
            <MetricCard label="Total area" value="23.08" suffix=" acres" detail="7 active fields" icon={Sprout} tone="green" />
            <MetricCard label="Active fields" value="7" detail="2 states" icon={MapPin} tone="blue" />
            <MetricCard label="Open alerts" value="1" detail="1 requires review" icon={CircleAlert} tone="coral" />
          </section>

          <section className="insight-grid" aria-label="Field overview insights">
            <div className="panel crop-panel">
              <div className="panel-heading"><div><div className="section-kicker">Crop distribution</div><h2>Area by crop</h2><p>Active field allocation</p></div><button className="icon-button" onClick={() => toast("Crop mix is up to date")} aria-label="More crop mix actions"><MoreHorizontal size={19} /></button></div>
              <div className="crop-content">
                <div className="crop-visual" aria-label="Crop footprint mosaic chart">
                  <div className="crop-visual-topline"><span>FIELD FOOTPRINT</span><strong>7 crop zones</strong></div>
                  <svg className="field-mosaic" viewBox="0 0 420 220" role="img" aria-label="A proportional mosaic of crop areas">
                    <rect x="5" y="5" width="236" height="210" rx="14" fill="#ad8107" />
                    <path d="M28 37 C65 19, 104 45, 143 27 S207 32, 225 20" fill="none" stroke="#f8e8a8" strokeOpacity=".3" strokeWidth="2" />
                    <path d="M22 75 C68 55, 102 83, 151 65 S207 73, 229 59" fill="none" stroke="#f8e8a8" strokeOpacity=".24" strokeWidth="2" />
                    <path d="M22 114 C70 92, 109 128, 154 104 S208 111, 229 96" fill="none" stroke="#f8e8a8" strokeOpacity=".21" strokeWidth="2" />
                    <path d="M22 154 C67 136, 106 165, 151 143 S206 153, 229 138" fill="none" stroke="#f8e8a8" strokeOpacity=".22" strokeWidth="2" />
                    <text x="27" y="190" fill="#fff7d1" fontSize="12" fontWeight="700" letterSpacing="1.1">TEST CROP</text><text x="27" y="207" fill="#f6dfa0" fontSize="11">12.86 acres · 55.72%</text>
                    <rect x="252" y="5" width="163" height="76" rx="14" fill="#7188cf" /><text x="270" y="34" fill="#fff" fontSize="12" fontWeight="700">APRICOTS</text><text x="270" y="55" fill="#e7edff" fontSize="11">1.88 ac · 8.15%</text>
                    <rect x="252" y="91" width="77" height="124" rx="14" fill="#e2a33b" /><text x="268" y="119" fill="#684600" fontSize="10" fontWeight="800" transform="rotate(90 268 119)">ARAK TREE</text><text x="301" y="191" textAnchor="middle" fill="#714f08" fontSize="10" transform="rotate(-90 301 191)">1.81 ac</text>
                    <rect x="338" y="91" width="77" height="58" rx="14" fill="#d97361" /><text x="354" y="117" fill="#fff3ef" fontSize="10" fontWeight="800">LENTIL</text><text x="354" y="134" fill="#ffe0d8" fontSize="10">1.88 ac</text>
                    <rect x="338" y="159" width="77" height="56" rx="14" fill="#69aa97" /><text x="351" y="184" fill="#eafff7" fontSize="10" fontWeight="800">ALMONDS</text><text x="351" y="201" fill="#d2f4e7" fontSize="10">0.74 ac</text>
                  </svg>
                  <div className="crop-visual-note"><span className="crop-note-line" /> <span>The field footprint is concentrated in one dominant test crop.</span></div>
                </div>
                <div className="crop-legend">{cropMix.map((crop) => <div className="legend-row" key={crop.name}><span className="legend-label"><i style={{ backgroundColor: crop.color }} />{crop.name}</span><span className="legend-area">{crop.area} <small>ac</small></span><span className="legend-percent">{crop.percent}</span></div>)}</div>
              </div>
            </div>
            <div className="attention-panel">
              <div className="attention-topline"><span className="attention-label"><span className="attention-pulse" /> Open alert</span><button className="attention-more" onClick={() => toast("Alert menu opened") } aria-label="More alert actions"><MoreHorizontal size={18} /></button></div>
              <div className="attention-icon"><Droplets size={23} /></div>
              <h2>Moisture below threshold</h2>
              <p className="attention-description">Maharashtra · Field 04 · Reading 34 minutes ago</p>
              <div className="attention-meta"><span>Moisture: 28% · Threshold: 35%</span><span className="attention-risk">Needs review</span></div>
              <button className="attention-link" onClick={() => { setQuery("Field 04"); toast("Field 04 highlighted", { description: "The field is now highlighted in the table below." }); }}>Open field record <ArrowUpRight size={15} /></button>
            </div>
          </section>

          <section className="table-panel panel" aria-labelledby="fields-heading">
            <div className="table-heading">
              <div><div className="section-kicker">Field register</div><h2 id="fields-heading">Fields</h2><p>Current status, irrigation schedule, and alerts.</p></div>
              <div className="table-actions"><button className="secondary-button" onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={16} /> Filters <span className="filter-count">{stateFilter !== "All states" || statusFilter !== "All status" ? "2" : ""}</span></button><button className="secondary-button export-button" onClick={() => toast("Report export prepared", { description: "Your CSV report is ready for download." })}><ArrowUpRight size={16} /> Export report</button></div>
            </div>
            <div className={`filter-toolbar ${showFilters ? "filter-toolbar-open" : ""}`}>
              <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search fields or crops" aria-label="Search fields" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</div>
              <label className="select-field"><span>State</span><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}><option>All states</option><option>Maharashtra</option><option>Madhya Pradesh</option></select><ChevronDown size={15} /></label>
              <label className="select-field"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All status</option><option>Needs review</option><option>Healthy</option><option>Scheduled</option></select><ChevronDown size={15} /></label>
              <button className="filter-view-button" onClick={() => toast("More filters are coming next")}><Filter size={16} /></button>
            </div>
            <div className="table-wrap">
              <table><thead><tr><th><button className="sort-header" onClick={() => toggleSort("field")}>Field <span>{sortLabel("field")}</span></button></th><th><button className="sort-header" onClick={() => toggleSort("state")}>State <span>{sortLabel("state")}</span></button></th><th><button className="sort-header" onClick={() => toggleSort("irrigation")}>Next irrigation <span>{sortLabel("irrigation")}</span></button></th><th><button className="sort-header" onClick={() => toggleSort("status")}>Status <span>{sortLabel("status")}</span></button></th><th>Crop</th><th className="align-right"><button className="sort-header sort-header-right" onClick={() => toggleSort("area")}>Area <span>{sortLabel("area")}</span></button></th><th aria-label="Actions" /></tr></thead><tbody>{visibleFields.map((field) => <tr key={field.id}><td><div className="field-name"><span className={`field-chevron ${field.alert ? "field-chevron-alert" : ""}`}><ChevronRight size={14} /></span><span><strong>{field.field}</strong><small>{field.id}</small></span></div></td><td><span className="state-cell"><MapPin size={14} />{field.state}</span></td><td>{field.nextIrrigation}</td><td><StatusPill status={field.status} /></td><td><span className="crop-cell"><i style={{ background: cropMix.find((crop) => crop.name === field.crop)?.color ?? "#a87b00" }} />{field.crop}</span></td><td className="align-right"><strong className="area-cell">{field.area}</strong></td><td><button className="row-action" onClick={() => toast(`${field.field} selected`, { description: `${field.state} · ${field.area}` })} aria-label={`Open ${field.field}`}><MoreHorizontal size={17} /></button></td></tr>)}{visibleFields.length === 0 && <tr><td colSpan={7} className="empty-row"><Search size={18} /><span>No fields match those filters.</span><button onClick={() => { setQuery(""); setStateFilter("All states"); setStatusFilter("All status"); }}>Clear filters</button></td></tr>}</tbody></table>
            </div>
            <div className="table-footer"><span>Showing {visibleFields.length} of {fields.length} fields</span><button onClick={() => toast("All fields view is coming next")}>View all fields <ArrowUpRight size={14} /></button></div>
          </section>

          <footer className="main-footer"><span><Leaf size={14} /> Built for clearer decisions in the field.</span><span>ERDE AGRO · 2026</span></footer>
        </main>
      </div>
    </div>
  );
}
