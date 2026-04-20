'use client'
import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const AVATAR_URL =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAyc90nOxsvhKsTuIRkKy3iIGam4zvgj69LowKmKbNpkLMQx2oYmziqHXb4sYoD0eIfbgRgDMg_3PI_wLAA2eHXsVYsNN5rKGCW8ejOXI6bU3yfPwmDD3YXqDczvl0w04C-NbTw4BdG-hNEyuUdTQkd2oSzYsGC12cXfKtED2x6nBIb4adjpG2ynjdXHgekTSwWMcfozfRhYX0w6jjJNh8lx0idhK6IjH0EkwjoGBDRIsgACym467GCviD6A2sBODnGIodM-bFgz5NV";

const PRODUCT_IMAGES = {
    watch: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_jZ2lb8xtLafLRJCWli2ldOO9LL2UGMIgHV11O9Bt-z-KlYiPvzQeZEoSEwFJB2cYbx5HeYeUVpiyOlgLvcKWKdRGpWueoykHJsK_gwTIWcJD5xkX50sC9gRw1PlKPV9adCVuElN4dueziECwz3CWzTFmcAkA7Nm6TgwBlTEik675RseciJBxA1LKIkqEhhoPgi7R-4b_x_McRZx8Y9grIljBV5OGWw6_K87Bq5UUyLZL5goyqUfTDbSZBtsq0DrXObcjKL3VhpF2",
    shoes: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9g3jse6neNVu9MSREdD4PrcMNkeVcw1qkrRkRggDgQlxV8b-TlG-KJFHfYlaa4hfH_9BtUzOeHKv7VN7qzevjHfRaCzKQ88EJAYBA6nxRoaMTKY3L39lrjMuxgR3kZdTR-WDtC9XoH0KE_1f-3qL1dAoaqhITT2XR8T4G2q1Dt0UtpQbghw86uSXWDEFvoZQUsPI3wcHwuaDfNnug6HVzXpQamNaqSCdLZQRSZRrxS_5qHGbvBus7slMwiZnrQf9EnDbP7iGzrFgk",
    headphones1: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4UY5YywT-1TD9PB-SFjsZaXOzMt0XFZQqyKRyX7gsmTRwRZhEXuk1Wpv4t3-sEbXcje2fuw2KWBMJWLNXB1rg2seMBg3gy9NlfTwzVbxVez8YOb9Ti19CqLcA9UTwGBuAV9qY59bSXDybiQB9ThDnKcRhIzdplrV5mNJ4y2WSGW8GMXC6Hj7upPGAYON4K2D_2Jhm6RHz8gUqVzkCK9LcT7dByWLzidMt9tvPkf3EiDrV-TuMadzl2a5S9zqodaFJ43qljRMrpGkv",
    camera: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ0CSncuVg049sp0gm5WvL9Neq56wJ7MzxOT7zPwjtXE0MZqMQ8PnWronx0HwZ6x68n2iIOgZLUA-CPVn6UVclarORWkIp4Ust9SStGW7DWzEJRW4gwx1Lgp8CQt0xUE-xYumB6XJP9nY7TRDY1VcSV2rlfiVUJ9M-0Y0wkJc3BnE8TM8cnT1Javn8ibENa0xyTV531dF6hpsPbwn3FukW0_Ugh5VpgLcWUUI5FYR56xnpmvwg4DqfmQamRENgm48c0PJ98REsY96y",
    headphones2: "https://lh3.googleusercontent.com/aida-public/AB6AXuButW4ETiuXJRIC9b_bcGauoWLvXbTUJzuuVlTOw1VfV58gw5-fOabxjtUxV0ibm2rFvIM6_fo6y0Suck7X9Pb1LQyLNEFDA0k0hAMclA6PHA6ju-N-KqXisAYXch3ovSOuWPblj3tS2lBFKoA81m8sowZm_MhIo5zzB3PfuYQB7oPyHIlEDKxVan1jxmx1c6STjp_QC4vp0K_Ke3ixLeoMMuTQ1UH3v6dhUs9QpeBH5aa9oP6WBDroVy6h5VT69Nhrtao4D62ogUkJ",
    desk: "https://lh3.googleusercontent.com/aida-public/AB6AXuABXfRrp6RQ0KHQPYkD1N3mFnLuffEUM0DgrBVzMzyQPIEpezlTGCWasU1OlrYWDjU6CS7H0suwO_bgbh62Ut59Rij_8UKv0RqTvkLbxbSBbtK1a0nPA2hn6_T-AVSoxZ1qeqCSUVh7jtyNUK1Jqu61ceQJQ6I2W7rx39gDIo_0fN0tpIbkbwejxAat-weWQ9vG3jcwss6zKVnQfb-zrovBWY-KJkW9kzzLq_OqiJf0eEl0NovBerTQd8OUNCEonkSNLe2rb4T-op8v",
};

const INITIAL_ORDERS = [
    {
        id: "#ORD-9421",
        customer: { initials: "JD", name: "Jane Doe" },
        products: [PRODUCT_IMAGES.watch, PRODUCT_IMAGES.shoes],
        extra: 1,
        total: "$299.00",
        status: "Pending",
    },
    {
        id: "#ORD-9420",
        customer: { initials: "MA", name: "Marc Andre" },
        products: [PRODUCT_IMAGES.headphones1],
        extra: 0,
        total: "$120.00",
        status: "Validated",
    },
    {
        id: "#ORD-9419",
        customer: { initials: "SL", name: "Sarah Lee" },
        products: [PRODUCT_IMAGES.camera, PRODUCT_IMAGES.headphones2],
        extra: 0,
        total: "$450.50",
        status: "Shipped",
    },
    {
        id: "#ORD-9418",
        customer: { initials: "RB", name: "Robert Brown" },
        products: [PRODUCT_IMAGES.desk],
        extra: 0,
        total: "$89.00",
        status: "Pending",
    },
];

const NAV_ITEMS = [
    { icon: "dashboard", label: "Dashboard", active: false },
    { icon: "shopping_bag", label: "Orders", active: true },
    { icon: "inventory_2", label: "Products", active: false },
    { icon: "group", label: "Customers", active: false },
];

const SYSTEM_NAV = [
    { icon: "settings", label: "Settings" },
    { icon: "help", label: "Support" },
];

const STATS = [
    { label: "Total Orders", value: "1,284", accent: null, badge: "+12%", badgeGreen: true },
    { label: "Pending", value: "24", accent: "#f59e0b", sub: "Action required" },
    { label: "Validated", value: "86", accent: "#3b82f6", sub: "Ready for ship" },
    { label: "Shipped Today", value: "52", accent: "#81e240", badge: "+8%", badgeGreen: true },
];

const TABS = ["All Orders", "Pending", "Validated", "Shipped"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MatIcon = ({ name, size = 22, filled = false, style: s = {} }) => (
    <span
        style={{
            fontFamily: "Material Symbols Outlined",
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: size,
            display: "inline-block",
            lineHeight: 1,
            letterSpacing: "normal",
            textTransform: "none",
            whiteSpace: "nowrap",
            userSelect: "none",
            fontVariationSettings: filled
                ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            ...s,
        }}
    >
        {name}
    </span>
);

const statusConfig = {
    Pending: { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" },
    Validated: { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
    Shipped: { bg: "rgba(129,226,64,0.2)", color: "#365314", dot: "#81e240" },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.Pending;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "2px 10px", borderRadius: 9999,
            fontSize: 11, fontWeight: 700,
            backgroundColor: cfg.bg, color: cfg.color,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.dot, marginRight: 6 }} />
            {status}
        </span>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderManagement() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [activeTab, setActiveTab] = useState("All Orders");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleAction = (orderId) => {
        setOrders((prev) =>
            prev.map((o) => {
                if (o.id !== orderId) return o;
                if (o.status === "Pending") return { ...o, status: "Validated" };
                if (o.status === "Validated") return { ...o, status: "Shipped" };
                return o;
            })
        );
    };

    const filteredOrders = orders.filter((o) => {
        const matchTab = activeTab === "All Orders" || o.status === activeTab;
        const matchSearch =
            !search ||
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.name.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <div className="flex h-screen overflow-hidden">
                {/* Side Navigation */}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto">



                    {/* Content */}
                    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>

                        {/* Stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                            {STATS.map((s) => (
                                <div key={s.label} style={{
                                    backgroundColor: "#fff", padding: 24, borderRadius: 12,
                                    border: "1px solid rgba(129,226,64,0.1)",
                                }}>
                                    <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{s.label}</p>
                                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 }}>
                                        <h3 style={{ fontSize: 30, fontWeight: 900, color: s.accent || "#0f172a" }}>{s.value}</h3>
                                        {s.badge && (
                                            <span style={{
                                                fontSize: 12, fontWeight: 700,
                                                backgroundColor: "rgba(129,226,64,0.1)", color: "#81e240",
                                                padding: "2px 8px", borderRadius: 9999,
                                            }}>{s.badge}</span>
                                        )}
                                        {s.sub && <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.sub}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Card */}
                        <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid rgba(129,226,64,0.1)", overflow: "hidden" }}>

                            {/* Tabs */}
                            <div style={{
                                display: "flex", alignItems: "center",
                                padding: "0 24px", borderBottom: "1px solid rgba(129,226,64,0.1)",
                                gap: 24,
                            }}>
                                {TABS.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                                            color: activeTab === tab ? "#81e240" : "#94a3b8",
                                            padding: "16px 0",
                                            borderBottom: activeTab === tab ? "2px solid #81e240" : "2px solid transparent",
                                            fontFamily: "'Manrope', sans-serif",
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                                <div style={{ flex: 1 }} />
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                                    <MatIcon name="filter_list" />
                                </button>
                            </div>

                            {/* Table */}
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    <thead style={{ backgroundColor: "#f8fafc" }}>
                                        <tr>
                                            {["Order ID", "Customer", "Products", "Total", "Status", "Actions"].map((h, i) => (
                                                <th key={h} style={{
                                                    padding: "14px 24px", fontSize: 11, fontWeight: 700,
                                                    textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8",
                                                    textAlign: i === 5 ? "right" : "left",
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <OrderRow key={order.id} order={order} onAction={handleAction} />
                                        ))}
                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                                                    No orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div style={{
                                padding: "16px 24px", borderTop: "1px solid rgba(129,226,64,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                            }}>
                                <p style={{ fontSize: 11, color: "#94a3b8" }}>
                                    Showing 1 to {filteredOrders.length} of 1,284 entries
                                </p>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {[null, 1, 2, 3, null].map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => p && setCurrentPage(p)}
                                            style={{
                                                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                                                borderRadius: 6, border: p === currentPage ? "none" : "1px solid rgba(129,226,64,0.2)",
                                                backgroundColor: p === currentPage ? "#81e240" : "transparent",
                                                color: p === currentPage ? "#182111" : "#64748b",
                                                fontWeight: p === currentPage ? 700 : 400,
                                                fontSize: 12, cursor: "pointer",
                                            }}
                                        >
                                            {p === null && i === 0 ? <MatIcon name="chevron_left" size={18} /> : null}
                                            {p === null && i === 4 ? <MatIcon name="chevron_right" size={18} /> : null}
                                            {p !== null ? p : null}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({ icon, label, active }) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href="#"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                fontSize: 13, fontWeight: active ? 700 : 500,
                backgroundColor: active ? "#81e240" : hovered ? "rgba(129,226,64,0.1)" : "transparent",
                color: active ? "#182111" : hovered ? "#81e240" : "#64748b",
                transition: "all 0.15s",
            }}
        >
            <MatIcon name={icon} />
            {label}
        </a>
    );
}

function OrderRow({ order, onAction }) {
    const [hovered, setHovered] = useState(false);

    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderTop: "1px solid rgba(129,226,64,0.05)",
                backgroundColor: hovered ? "rgba(129,226,64,0.04)" : "transparent",
                transition: "background-color 0.15s",
            }}
        >
            {/* Order ID */}
            <td style={{ padding: "16px 24px", fontWeight: 700, fontSize: 13 }}>{order.id}</td>

            {/* Customer */}
            <td style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%", backgroundColor: "#e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: "#475569", flexShrink: 0,
                    }}>
                        {order.customer.initials}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{order.customer.name}</span>
                </div>
            </td>

            {/* Products */}
            <td style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex" }}>
                    {order.products.map((src, i) => (
                        <div key={i} style={{
                            width: 32, height: 32, borderRadius: "50%",
                            border: "2px solid #fff", overflow: "hidden",
                            backgroundColor: "#e2e8f0",
                            marginLeft: i > 0 ? -8 : 0,
                        }}>
                            <img src={src} alt="product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    ))}
                    {order.extra > 0 && (
                        <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            border: "2px solid #fff", backgroundColor: "rgba(129,226,64,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, marginLeft: -8,
                        }}>
                            +{order.extra}
                        </div>
                    )}
                </div>
            </td>

            {/* Total */}
            <td style={{ padding: "16px 24px", fontSize: 13, fontWeight: 700 }}>{order.total}</td>

            {/* Status */}
            <td style={{ padding: "16px 24px" }}>
                <StatusBadge status={order.status} />
            </td>

            {/* Actions */}
            <td style={{ padding: "16px 24px", textAlign: "right" }}>
                {order.status === "Pending" && (
                    <ActionButton label="Validate" onClick={() => onAction(order.id)} outlined />
                )}
                {order.status === "Validated" && (
                    <ActionButton label="Mark as Shipped" onClick={() => onAction(order.id)} />
                )}
                {order.status === "Shipped" && (
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 6 }}>
                        <MatIcon name="more_vert" size={20} />
                    </button>
                )}
            </td>
        </tr>
    );
}

function ActionButton({ label, onClick, outlined = false }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: "6px 12px", borderRadius: 6, border: "none",
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                backgroundColor: outlined
                    ? hovered ? "#81e240" : "rgba(129,226,64,0.2)"
                    : "#81e240",
                color: "#182111",
                transition: "all 0.15s",
                fontFamily: "'Manrope', sans-serif",
            }}
        >
            {label}
        </button>
    );
}