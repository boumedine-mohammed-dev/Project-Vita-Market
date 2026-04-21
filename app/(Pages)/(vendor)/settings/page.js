'use client'
import { useState } from "react";
import { useAuthStore } from '@/app/Store/useAuthStore';

const STORE_LOGO =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCPWYIR2BWNI9LoI9J0Lxe2eq-lWlnYHQE5Za62CvoXczrzfvaOYKjUIKv-sk9RkEY9o3p6nqyXnEutNHlSKZfE5_mXBXSLc5mIFfrg1o_SmoWT5m8OyWcUGl9Z7V3pPGqoDRs3tnAf4qeZm9-3CkvNDChTAkNEYpYNQcxFSORmr6ZHB6Igvr9zoQ6J52y3C1qrxwF3xJVko1mRCqkHTBY-8N2uOzlLeShF1_b7-AOibyJE8p2qdv9RlxnO2tMXIe8nl9MGfVnNtjw0";
const STORE_ICON =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDDzIEAfkZwMIfckeswBoK1lYwesb10BTG2kUMaEiFl2hudkMGRC-pmxa8pxwh3QlwASv6eJr2pXtG4RFm3H2CDCX9eIklIi4fMYhCdCVH5vC8hTB4YpbuayFuexsr3qKkPEGUG03l0rjyNZyvK8O4jaOlPQMuDmCiR6zUUQFBN36iPAFPNbczypdtIIqMNctsFdkdQLY0gHycoZ5AZIhhD9JcD3UyfYnZLSpY4Q8B5qlU0nUGmhaAMCKxJWTxpBem4UsotAGhCmI2l";
const BANNER_URL =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuerE9hzj-HgqVGir5ovwqQy430NGEY_Ae40PoGGLDiVPoyrs2c3my4KQdaFTeD1n65JuCBvgGPpoVdoc73Qghh_I1yoCoHLIN0X_oPsLqTAkgE2LpDA1bvjfSNgAhhNhS4C_WDEbtCS_GZcsnLSnlcRWBpMYQpMZFkv9CUcosJK7yPeqyXVLEmR-0tojKv_X5TBCXZHn4j8RskRLCegwE9RYDQgPb1DIh1kP9afh35DitKFi1-bWXrL5RkEeEa5OpLN7Ko6iPcxl";

const businessCategories = [
    { value: "agriculture", label: "Sustainable Agriculture" },
    { value: "fashion", label: "Eco-Fashion" },
    { value: "home", label: "Zero Waste Home" },
    { value: "beauty", label: "Natural Beauty" },
    { value: "tech", label: "Green Tech" },
];

export default function EcoVendorStoreSettings() {
    const { user, setUser } = useAuthStore();

    // Derived from user
    const info = user?.info ?? {};

    const [storeName, setStoreName] = useState(info.nom_boutique ?? "");
    const [storeDesc, setStoreDesc] = useState(info.description ?? "");
    const [storeAddress, setStoreAddress] = useState(info.adresse_boutique ?? "");
    const [category, setCategory] = useState("agriculture");
    const [phone, setPhone] = useState(user?.telephone ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [username, setUsername] = useState(user?.username ?? "");
    console.log(username);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);
        setError("");
        try {
            // Update main user fields
            const userRes = await fetch("http://localhost:8000/auth/me/update/", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    telephone: phone, email, username, nom_boutique: storeName,
                    description: storeDesc,
                    adresse_boutique: storeAddress,
                }),
            });

            if (!userRes.ok) throw new Error("Erreur mise à jour utilisateur");

            // Update vendor profile fields


            const updatedUser = await userRes.json();
            setUser({ ...user, ...updatedUser, info: { ...info, nom_boutique: storeName, description: storeDesc, adresse_boutique: storeAddress } });
            setSuccess(true);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        setStoreName(info.nom_boutique ?? "");
        setStoreDesc(info.description ?? "");
        setStoreAddress(info.adresse_boutique ?? "");
        setPhone(user?.telephone ?? "");
        setEmail(user?.email ?? "");
        setUsername(user?.username ?? "");
        setSuccess(false);
        setError("");
    };

    // Statut badge
    const statutColor = info.statut === "approuve"
        ? { bg: "rgba(129,226,64,0.1)", color: "#81e240" }
        : info.statut === "en_attente"
            ? { bg: "rgba(251,191,36,0.1)", color: "#f59e0b" }
            : { bg: "rgba(239,68,68,0.1)", color: "#ef4444" };
    const statutLabel = info.statut === "approuve" ? "Approuvé" : info.statut === "en_attente" ? "En attente" : info.statut ?? "—";

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <style>{`
                .mat-icon { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; letter-spacing: normal; text-transform: none; white-space: nowrap; word-wrap: normal; direction: ltr; font-size: 22px; user-select: none; }
            `}</style>

            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 flex flex-col overflow-y-auto">
                    <div style={{ maxWidth: 896, padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>

                        {/* ── Account Overview ── */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Compte vendeur</h3>
                                <p style={sectionSub}>Informations générales de votre compte.</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                                {/* Avatar placeholder */}
                                <div style={{
                                    width: 64, height: 64, borderRadius: "50%",
                                    background: "rgba(129,226,64,0.12)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 26, fontWeight: 800, color: "#81e240", flexShrink: 0,
                                }}>
                                    {(user?.nom?.[0] ?? "?").toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
                                        {user?.nom} {user?.prenom}
                                    </p>
                                    <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{user?.email}</p>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{
                                            padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                                            backgroundColor: statutColor.bg, color: statutColor.color,
                                        }}>
                                            {statutLabel}
                                        </span>
                                        <span style={{
                                            padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                                            backgroundColor: "rgba(129,226,64,0.08)", color: "#81e240",
                                        }}>
                                            Vendeur
                                        </span>
                                        {info.date_approbation && (
                                            <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center" }}>
                                                Approuvé le {new Date(info.date_approbation).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8" }}>
                                    <p>Membre depuis</p>
                                    <p style={{ fontWeight: 700, color: "#64748b" }}>
                                        {user?.date_joined ? new Date(user.date_joined).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "—"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ── Store Branding ── */}
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
                                    }}>
                                        <img src={STORE_ICON} alt="Store icon" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                                    </div>
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
                                    <div>
                                        <label style={labelStyle} htmlFor="store-address">Adresse de la boutique</label>
                                        <div style={{ position: "relative" }}>
                                            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                                                <span className="mat-icon" style={{ fontSize: 18 }}>location_on</span>
                                            </div>
                                            <input
                                                id="store-address"
                                                type="text"
                                                value={storeAddress}
                                                onChange={e => setStoreAddress(e.target.value)}
                                                style={{ ...inputStyle, paddingLeft: 40 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Business Info ── */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Business Information</h3>
                                <p style={sectionSub}>Essential contact and category details.</p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
                                <div>
                                    <label style={labelStyle} htmlFor="contact-email">Email</label>
                                    <div style={{ position: "relative" }}>
                                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                                            <span className="mat-icon" style={{ fontSize: 18 }}>mail</span>
                                        </div>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            style={{ ...inputStyle, paddingLeft: 40 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="username">Nom d'utilisateur</label>
                                    <div style={{ position: "relative" }}>
                                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                                            <span className="mat-icon" style={{ fontSize: 18 }}>person</span>
                                        </div>
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            style={{ ...inputStyle, paddingLeft: 40 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Banner ── */}


                        {/* ── Feedback ── */}
                        {success && (
                            <div style={{ padding: "12px 16px", borderRadius: 8, backgroundColor: "rgba(129,226,64,0.1)", border: "1px solid rgba(129,226,64,0.3)", color: "#4a7c20", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                <span className="mat-icon" style={{ fontSize: 18 }}>check_circle</span>
                                Profil boutique mis à jour avec succès.
                            </div>
                        )}
                        {error && (
                            <div style={{ padding: "12px 16px", borderRadius: 8, backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                <span className="mat-icon" style={{ fontSize: 18 }}>error</span>
                                {error}
                            </div>
                        )}

                        {/* ── Actions ── */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, paddingTop: 16 }}>
                            <button
                                onClick={handleDiscard}
                                style={{
                                    padding: "10px 24px", borderRadius: 8,
                                    border: "1px solid rgba(129,226,64,0.2)",
                                    backgroundColor: "transparent", color: "#64748b",
                                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                                }}
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                style={{
                                    padding: "10px 32px", borderRadius: 8, border: "none",
                                    backgroundColor: loading ? "rgba(129,226,64,0.5)" : "#81e240",
                                    color: "#182111", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                                    boxShadow: "0 8px 20px rgba(129,226,64,0.25)",
                                    display: "flex", alignItems: "center", gap: 8,
                                }}
                            >
                                {loading && <span className="mat-icon" style={{ fontSize: 18, animation: "spin 1s linear infinite" }}>progress_activity</span>}
                                {loading ? "Enregistrement..." : "Update Store Profile"}
                            </button>
                        </div>

                    </div>
                </main>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// Shared styles — identical to original
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