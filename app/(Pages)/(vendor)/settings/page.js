'use client'
import { useState } from "react";

const materialIcon = (name, filled = false, extraClass = "") => (
    <span
        className={`material-symbols-outlined ${extraClass}`}
        style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}}
    >
        {name}
    </span>
);

const STORE_LOGO =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCPWYIR2BWNI9LoI9J0Lxe2eq-lWlnYHQE5Za62CvoXczrzfvaOYKjUIKv-sk9RkEY9o3p6nqyXnEutNHlSKZfE5_mXBXSLc5mIFfrg1o_SmoWT5m8OyWcUGl9Z7V3pPGqoDRs3tnAf4qeZm9-3CkvNDChTAkNEYpYNQcxFSORmr6ZHB6Igvr9zoQ6J52y3C1qrxwF3xJVko1mRCqkHTBY-8N2uOzlLeShF1_b7-AOibyJE8p2qdv9RlxnO2tMXIe8nl9MGfVnNtjw0";
const STORE_ICON =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDDzIEAfkZwMIfckeswBoK1lYwesb10BTG2kUMaEiFl2hudkMGRC-pmxa8pxwh3QlwASv6eJr2pXtG4RFm3H2CDCX9eIklIi4fMYhCdCVH5vC8hTB4YpbuayFuexsr3qKkPEGUG03l0rjyNZyvK8O4jaOlPQMuDmCiR6zUUQFBN36iPAFPNbczypdtIIqMNctsFdkdQLY0gHycoZ5AZIhhD9JcD3UyfYnZLSpY4Q8B5qlU0nUGmhaAMCKxJWTxpBem4UsotAGhCmI2l";
const BANNER_URL =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuerE9hzj-HgqVGir5ovwqQy430NGEY_Ae40PoGGLDiVPoyrs2c3my4KQdaFTeD1n65JuCBvgGPpoVdoc73Qghh_I1yoCoHLIN0X_oPsLqTAkgE2LpDA1bvjfSNgAhhNhS4C_WDEbtCS_GZcsnLSnlcRWBpMYQpMZFkv9CUcosJK7yPeqyXVLEmR-0tojKv_X5TBCXZHn4j8RskRLCegwE9RYDQgPb1DIh1kP9afh35DitKFi1-bWXrL5RkEeEa5OpLN7Ko6iPcxl";

const navItems = [
    { icon: "inventory_2", label: "My Products", active: false },
    { icon: "shopping_cart", label: "Orders", active: false },
    { icon: "analytics", label: "Analytics", active: false },
    { icon: "settings", label: "Store Settings", active: true, filled: true },
];

const businessCategories = [
    { value: "agriculture", label: "Sustainable Agriculture" },
    { value: "fashion", label: "Eco-Fashion" },
    { value: "home", label: "Zero Waste Home" },
    { value: "beauty", label: "Natural Beauty" },
    { value: "tech", label: "Green Tech" },
];

export default function EcoVendorStoreSettings() {
    const [storeName, setStoreName] = useState("Organic Farm Co.");
    const [storeDesc, setStoreDesc] = useState(
        "At Organic Farm Co., we believe in sustainable agriculture and providing our community with the freshest, pesticide-free produce directly from our local fields to your doorstep."
    );
    const [category, setCategory] = useState("agriculture");
    const [phone, setPhone] = useState("+1 (555) 0123-4567");

    return (



        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <style>{`
        .mat-icon { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; letter-spacing: normal; text-transform: none; white-space: nowrap; word-wrap: normal; direction: ltr; font-size: 22px; user-select: none; }
      `}</style>
            <div className="flex h-screen overflow-hidden">
                {/* Side Navigation */}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto">


                    {/* Content */}
                    <div style={{ maxWidth: 896, padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>

                        {/* Branding Section */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Store Branding</h3>
                                <p style={sectionSub}>Manage how your brand appears to customers.</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
                                {/* Logo Upload */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 128, height: 128, borderRadius: 12,
                                        backgroundColor: "#f7f8f6", border: "2px dashed rgba(129,226,64,0.3)",
                                        overflow: "hidden", position: "relative", cursor: "pointer",
                                    }}
                                        className="logo-hover-group"
                                    >
                                        <img src={STORE_LOGO} alt="Store logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div style={{
                                            position: "absolute", inset: 0, backgroundColor: "rgba(129,226,64,0.2)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            opacity: 0, transition: "opacity 0.2s",
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                        >
                                            <span className="mat-icon" style={{ color: "#182111" }}>photo_camera</span>
                                        </div>
                                    </div>
                                    <button style={{ background: "none", border: "none", color: "#81e240", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                                        Change Logo
                                    </button>
                                </div>

                                {/* Fields */}
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div>
                                        <label style={labelStyle} htmlFor="store-name">Store Name</label>
                                        <input
                                            id="store-name"
                                            type="text"
                                            value={storeName}
                                            onChange={e => setStoreName(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle} htmlFor="store-desc">Store Description</label>
                                        <textarea
                                            id="store-desc"
                                            rows={4}
                                            value={storeDesc}
                                            onChange={e => setStoreDesc(e.target.value)}
                                            placeholder="Tell customers about your mission and eco-friendly products..."
                                            style={{ ...inputStyle, resize: "none" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Business Info */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Business Information</h3>
                                <p style={sectionSub}>Essential contact and category details.</p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                <div>
                                    <label style={labelStyle} htmlFor="business-category">Business Category</label>
                                    <div style={{ position: "relative" }}>
                                        <select
                                            id="business-category"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            style={{ ...inputStyle, appearance: "none", paddingRight: 40 }}
                                        >
                                            {businessCategories.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}>
                                            <span className="mat-icon">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="contact-phone">Contact Phone</label>
                                    <div style={{ position: "relative" }}>
                                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                                            <span className="mat-icon" style={{ fontSize: 18 }}>call</span>
                                        </div>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            style={{ ...inputStyle, paddingLeft: 40 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Banner */}
                        <section style={{ ...sectionStyle, overflow: "hidden" }}>
                            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h3 style={sectionTitle}>Storefront Banner</h3>
                                    <p style={sectionSub}>Visible at the top of your shop page.</p>
                                </div>
                                <button style={{
                                    backgroundColor: "rgba(129,226,64,0.1)", color: "#81e240",
                                    padding: "6px 12px", borderRadius: 8, border: "none",
                                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                                }}>
                                    Replace Image
                                </button>
                            </div>
                            <div style={{
                                height: 192, width: "100%", borderRadius: 12,
                                position: "relative", overflow: "hidden",
                                backgroundColor: "#f1f5f9",
                            }}>
                                <img src={BANNER_URL} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                                <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "flex-end", gap: 12 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: "#fff", padding: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                                        <img src={STORE_ICON} alt="Store icon" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                                    </div>
                                    <div style={{ color: "#fff", paddingBottom: 4 }}>
                                        <h4 style={{ fontWeight: 700, fontSize: 14 }}>Organic Farm Co.</h4>
                                        <p style={{ fontSize: 10, opacity: 0.8 }}>Sustainable Agriculture • Portland, OR</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, paddingTop: 16 }}>
                            <button style={{
                                padding: "10px 24px", borderRadius: 8,
                                border: "1px solid rgba(129,226,64,0.2)",
                                backgroundColor: "transparent", color: "#64748b",
                                fontSize: 14, fontWeight: 700, cursor: "pointer",
                            }}>
                                Discard Changes
                            </button>
                            <button style={{
                                padding: "10px 32px", borderRadius: 8, border: "none",
                                backgroundColor: "#81e240", color: "#182111",
                                fontSize: 14, fontWeight: 700, cursor: "pointer",
                                boxShadow: "0 8px 20px rgba(129,226,64,0.25)",
                            }}>
                                Update Store Profile
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Shared styles
const sectionStyle = {
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid rgba(129,226,64,0.1)",
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const sectionTitle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
};

const sectionSub = {
    fontSize: 14,
    color: "#94a3b8",
};

const labelStyle = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
};

const inputStyle = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid rgba(129,226,64,0.2)",
    backgroundColor: "rgba(247,248,246,0.5)",
    fontSize: 14,
    fontFamily: "'Manrope', sans-serif",
    outline: "none",
    transition: "all 0.15s",
    color: "#0f172a",
};