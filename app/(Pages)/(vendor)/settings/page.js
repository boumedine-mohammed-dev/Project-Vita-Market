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
    const [nom, setNom] = useState(user?.nom ?? "");
    const [prenom, setPrenom] = useState(user?.prenom ?? "");
    console.log(username);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Password change state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passLoading, setPassLoading] = useState(false);
    const [passSuccess, setPassSuccess] = useState(false);
    const [passErrors, setPassErrors] = useState({});

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);
        setErrors({});
        try {
            // Update main user fields
            const userRes = await fetch("http://localhost:8000/auth/me/update/", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    telephone: phone, email, username,
                    nom, prenom,
                    nom_boutique: storeName,
                    description: storeDesc,
                    adresse_boutique: storeAddress,
                }),
            });

            const data = await userRes.json();
            if (!userRes.ok) {
                setErrors(typeof data === 'object' ? data : { global: "Erreur mise à jour" });
                return;
            }

            setUser({ ...user, ...data, info: { ...info, nom_boutique: storeName, description: storeDesc, adresse_boutique: storeAddress } });
            setSuccess(true);
        } catch (e) {
            setErrors({ global: e.message });
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
        setNom(user?.nom ?? "");
        setPrenom(user?.prenom ?? "");
        setSuccess(false);
        setErrors({});
    };

    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPassErrors({ global: "Veuillez remplir tous les champs" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPassErrors({ confirm_password: "Les mots de passe ne correspondent pas" });
            return;
        }
        setPassLoading(true);
        setPassSuccess(false);
        setPassErrors({});
        try {
            const res = await fetch("http://localhost:8000/auth/me/change-password/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPassErrors(typeof data === 'object' ? data : { global: data });
                return;
            }
            setPassSuccess(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (e) {
            setPassErrors({ global: e.message });
        } finally {
            setPassLoading(false);
        }
    };

    const getFieldError = (fieldName) => {
        const err = errors[fieldName];
        if (!err) return null;
        return Array.isArray(err) ? err[0] : err;
    };

    const getPassError = (fieldName) => {
        const err = passErrors[fieldName];
        if (!err) return null;
        return Array.isArray(err) ? err[0] : err;
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
                                        {user?.info?.created_at ? new Date(user.info.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "—"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ── Store Branding ── */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Identité de la boutique</h3>
                                <p style={sectionSub}>Gérez l’apparence de votre marque auprès des clients.</p>
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
                                        <label style={labelStyle} htmlFor="store-name">Nom de la boutique</label>
                                        <input
                                            id="store-name"
                                            type="text"
                                            value={storeName}
                                            onChange={e => setStoreName(e.target.value)}
                                            style={{ ...inputStyle, border: getFieldError('nom_boutique') ? '1px solid #ef4444' : inputStyle.border }}
                                        />
                                        {getFieldError('nom_boutique') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('nom_boutique')}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle} htmlFor="store-desc">Description de la boutique</label>
                                        <textarea
                                            id="store-desc"
                                            rows={4}
                                            value={storeDesc}
                                            onChange={e => setStoreDesc(e.target.value)}
                                            placeholder="Tell customers about your mission and eco-friendly products..."
                                            style={{ ...inputStyle, resize: "none", border: getFieldError('description') ? '1px solid #ef4444' : inputStyle.border }}
                                        />
                                        {getFieldError('description') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('description')}</p>}
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
                                                style={{ ...inputStyle, paddingLeft: 40, border: getFieldError('adresse_boutique') ? '1px solid #ef4444' : inputStyle.border }}
                                            />
                                        </div>
                                        {getFieldError('adresse_boutique') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('adresse_boutique')}</p>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Business Info ── */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Informations de l’entreprise</h3>
                                <p style={sectionSub}>Coordonnées et informations essentielles sur votre activité.</p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                <div>
                                    <label style={labelStyle} htmlFor="contact-phone">Numéro de téléphone</label>
                                    <div style={{ position: "relative" }}>
                                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                                            <span className="mat-icon" style={{ fontSize: 18 }}>call</span>
                                        </div>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            maxLength={10}
                                            value={phone}
                                            onChange={e => {
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                setPhone(value);
                                            }}
                                            style={{ ...inputStyle, paddingLeft: 40, border: getFieldError('telephone') ? '1px solid #ef4444' : inputStyle.border }}
                                        />
                                    </div>
                                    {getFieldError('telephone') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('telephone')}</p>}
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
                                            style={{ ...inputStyle, paddingLeft: 40, border: getFieldError('email') ? '1px solid #ef4444' : inputStyle.border }}
                                        />
                                    </div>
                                    {getFieldError('email') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('email')}</p>}
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
                                            style={{ ...inputStyle, paddingLeft: 40, border: getFieldError('username') ? '1px solid #ef4444' : inputStyle.border }}
                                        />
                                    </div>
                                    {getFieldError('username') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('username')}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="nom">Nom</label>
                                    <input
                                        id="nom"
                                        type="text"
                                        value={nom}
                                        onChange={e => setNom(e.target.value)}
                                        style={{ ...inputStyle, border: getFieldError('nom') ? '1px solid #ef4444' : inputStyle.border }}
                                    />
                                    {getFieldError('nom') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('nom')}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="prenom">Prénom</label>
                                    <input
                                        id="prenom"
                                        type="text"
                                        value={prenom}
                                        onChange={e => setPrenom(e.target.value)}
                                        style={{ ...inputStyle, border: getFieldError('prenom') ? '1px solid #ef4444' : inputStyle.border }}
                                    />
                                    {getFieldError('prenom') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getFieldError('prenom')}</p>}
                                </div>
                            </div>
                        </section>

                        {/* ── Change Password ── */}
                        <section style={sectionStyle}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={sectionTitle}>Sécurité</h3>
                                <p style={sectionSub}>Changer votre mot de passe.</p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle} htmlFor="old-pass">Ancien mot de passe</label>
                                    <input
                                        id="old-pass"
                                        type="password"
                                        value={oldPassword}
                                        onChange={e => setOldPassword(e.target.value)}
                                        style={{ ...inputStyle, border: getPassError('old_password') ? '1px solid #ef4444' : inputStyle.border }}
                                    />
                                    {getPassError('old_password') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getPassError('old_password')}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="new-pass">Nouveau mot de passe</label>
                                    <input
                                        id="new-pass"
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        style={{ ...inputStyle, border: getPassError('new_password') ? '1px solid #ef4444' : inputStyle.border }}
                                    />
                                    {getPassError('new_password') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getPassError('new_password')}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="confirm-pass">Confirmer le nouveau mot de passe</label>
                                    <input
                                        id="confirm-pass"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        style={{ ...inputStyle, border: getPassError('confirm_password') ? '1px solid #ef4444' : inputStyle.border }}
                                    />
                                    {getPassError('confirm_password') && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{getPassError('confirm_password')}</p>}
                                </div>
                            </div>
                            {passSuccess && (
                                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, backgroundColor: "rgba(129,226,64,0.1)", border: "1px solid rgba(129,226,64,0.3)", color: "#4a7c20", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="mat-icon" style={{ fontSize: 16 }}>check_circle</span>
                                    Mot de passe modifié avec succès.
                                </div>
                            )}
                            {getPassError('global') && (
                                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="mat-icon" style={{ fontSize: 16 }}>error</span>
                                    {getPassError('global')}
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={passLoading}
                                    style={{
                                        padding: "8px 24px", borderRadius: 8, border: "none",
                                        backgroundColor: passLoading ? "rgba(129,226,64,0.5)" : "#81e240",
                                        color: "#182111", fontSize: 13, fontWeight: 700, cursor: passLoading ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {passLoading ? "Chargement..." : "Changer le mot de passe"}
                                </button>
                            </div>
                        </section>


                        {/* ── Feedback & Actions ── */}
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 16 }}>
                            {success && (
                                <div style={{ padding: "12px 16px", borderRadius: 8, backgroundColor: "rgba(129,226,64,0.1)", border: "1px solid rgba(129,226,64,0.3)", color: "#4a7c20", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="mat-icon" style={{ fontSize: 18 }}>check_circle</span>
                                    Profil boutique mis à jour avec succès.
                                </div>
                            )}
                            {errors.global && (
                                <div style={{ padding: "12px 16px", borderRadius: 8, backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="mat-icon" style={{ fontSize: 18 }}>error</span>
                                    {errors.global}
                                </div>
                            )}
                        </div>

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