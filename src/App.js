import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://glcxzuadoelmouihsill.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3h6dWFkb2VsbW91aWhzaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjcyODcsImV4cCI6MjA4NzMwMzI4N30.VJ8T4Vodtd3f2W9JNQzFQXGYqq3m4TKT-FQYWL3rNcY"
);

const ADMIN_EMAIL = "javierglocret@icloud.com";

const CITIES = [
  {
    name: "Melbourne", country: "Australia", tournament: "Australian Open",
    tips: [
      { category: "Training", text: "Melbourne Park has practice courts available 6am–8pm. Book via Tennis Australia portal.", icon: "🎾" },
      { category: "Recovery", text: "Stretch Lab in South Yarra — best physio for players. Ask for Marcus.", icon: "💆" },
      { category: "Food", text: "Tipo 00 in CBD for carb loading. Incredible pasta, player-friendly portions.", icon: "🍝" },
      { category: "Hotel", text: "Crown Towers gives 20% off during AO if you show your player credential.", icon: "🏨" },
    ],
  },
  {
    name: "Paris", country: "France", tournament: "Roland Garros",
    tips: [
      { category: "Training", text: "Racing Club de France in Bois de Boulogne — clay courts, very close to RG.", icon: "🎾" },
      { category: "Recovery", text: "Institut du Sport in 13ème — excellent cryotherapy and physio team.", icon: "💆" },
      { category: "Food", text: "Café de Flore for breakfast. Order the omelette. Avoid tourist traps near RG.", icon: "🥐" },
      { category: "Hotel", text: "Molitor Hotel has a pool and is 10 min from Roland Garros by bike.", icon: "🏨" },
    ],
  },
  {
    name: "London", country: "United Kingdom", tournament: "Wimbledon",
    tips: [
      { category: "Training", text: "National Tennis Centre in Roehampton — book 2 weeks in advance during June.", icon: "🎾" },
      { category: "Recovery", text: "Third Space gym in Soho — best equipped gym central London, open 6am.", icon: "💆" },
      { category: "Food", text: "Gymkhana for Indian food — high protein, no dairy options available.", icon: "🍛" },
      { category: "Hotel", text: "Cannizaro House in Wimbledon Village — walking distance, peaceful.", icon: "🏨" },
    ],
  },
  {
    name: "New York", country: "USA", tournament: "US Open",
    tips: [
      { category: "Training", text: "USTA Billie Jean King Center — players get access. Courts 8-17 less crowded.", icon: "🎾" },
      { category: "Recovery", text: "Equinox Sports Club on 61st — full recovery suite, cold plunge, sauna.", icon: "💆" },
      { category: "Food", text: "Carbone for Italian — get there early or book 3 weeks ahead.", icon: "🍷" },
      { category: "Hotel", text: "1 Hotel Brooklyn Bridge — great views, spa, 25 min from Flushing by Uber.", icon: "🏨" },
    ],
  },
  {
    name: "Miami", country: "USA", tournament: "Miami Open",
    tips: [
      { category: "Training", text: "Crandon Park Tennis Center — public courts next to the venue, very humid.", icon: "🎾" },
      { category: "Recovery", text: "Ice barrel sessions at Next Health Brickell — essential in Miami heat.", icon: "💆" },
      { category: "Food", text: "Zuma in Brickell — Japanese, light and clean. Popular with players every year.", icon: "🍱" },
      { category: "Hotel", text: "EAST Miami in Brickell — rooftop pool, 15 min Uber to Key Biscayne.", icon: "🏨" },
    ],
  },
];

const CATEGORY_COLORS = { Help: "#f59e0b", Tip: "#10b981", Rant: "#ef4444", Insight: "#6366f1" };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  *{margin:0;padding:0;box-sizing:border-box;}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#080c10}
  ::-webkit-scrollbar-thumb{background:#1f2937;border-radius:2px}
  button:hover{opacity:0.85}
  input[type=file]{display:none}
`;

export default function PlayerCircle() {
  const [screen, setScreen] = useState("loading");
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Insight");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [player, setPlayer] = useState(null);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [regForm, setRegForm] = useState({ name: "", country: "", ranking: "", tour: "ATP", email: "", password: "", inviteCode: "" });
  const [credentialFile, setCredentialFile] = useState(null);
  const [credentialPreview, setCredentialPreview] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const urlParams = new URLSearchParams(window.location.search);
  const inviteFromUrl = urlParams.get("invite");

  useEffect(() => {
    if (inviteFromUrl && screen === "loading") {
      setRegForm(f => ({ ...f, inviteCode: inviteFromUrl }));
    }
  }, [inviteFromUrl]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchPlayer(session.user.id);
      else setScreen("landing");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) fetchPlayer(session.user.id);
      else setScreen("landing");
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPlayer = async (userId) => {
    const { data } = await supabase.from("players").select("*").eq("user_id", userId).single();
    if (data) {
      setPlayer(data);
      if (data.status === "approved") {
        fetchPosts();
        setScreen("home");
      } else {
        setScreen("pending");
      }
    } else {
      setScreen("landing");
    }
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const fetchPendingPlayers = async () => {
    const { data } = await supabase.from("players").select("*").eq("status", "pending").order("created_at", { ascending: false });
    if (data) setPendingPlayers(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCredentialFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCredentialPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    if (!regForm.name || !regForm.ranking || !regForm.email || !regForm.password) { setError("Please fill in all fields."); return; }
    if (!credentialFile) { setError("Please upload your ATP/WTA credential photo."); return; }
    if (regForm.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");

    const { data: authData, error: authError } = await supabase.auth.signUp({ email: regForm.email, password: regForm.password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    const fileExt = credentialFile.name.split(".").pop();
    const fileName = `${authData.user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("credentials").upload(fileName, credentialFile);
    if (uploadError) { setError("Failed to upload credential. Try again."); setLoading(false); return; }

    const { data: urlData } = supabase.storage.from("credentials").getPublicUrl(fileName);

    await supabase.from("players").insert([{
      user_id: authData.user.id,
      name: regForm.name,
      country: regForm.country,
      ranking: parseInt(regForm.ranking),
      tour: regForm.tour,
      email: regForm.email,
      status: "pending",
      credential_url: urlData.publicUrl,
      invite_code: regForm.inviteCode || null,
    }]);

    setLoading(false);
    setScreen("pending");
  };

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password });
    setLoading(false);
    if (error) setError("Invalid email or password.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPlayer(null); setSession(null); setScreen("landing");
  };

  const approvePlayer = async (playerId) => {
    await supabase.from("players").update({ status: "approved" }).eq("id", playerId);
    fetchPendingPlayers();
  };

  const rejectPlayer = async (playerId) => {
    await supabase.from("players").update({ status: "rejected" }).eq("id", playerId);
    fetchPendingPlayers();
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    const code = generateInviteCode();
    await supabase.from("players").update({ invite_code: code }).eq("id", player.id);
    setInviteCode(code);
    setInviteSent(true);
  };

  const submitPost = async () => {
    if (!newPostText.trim()) return;
    const { data } = await supabase.from("posts").insert([{
      author: player?.name,
      country: player?.country,
      ranking: player?.ranking,
      content: newPostText,
      category: newPostCategory,
      likes: 0,
      replies: 0,
    }]).select().single();
    if (data) { setPosts([data, ...posts]); setNewPostText(""); setNewPostCategory("Insight"); }
  };

  const timeAgo = (d) => {
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredPosts = selectedCategory === "All" ? posts : posts.filter(p => p.category === selectedCategory);
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  // ─── STYLES ───
  const base = { fontFamily: "'DM Mono', 'Courier New', monospace", background: "#080c10", minHeight: "100vh", color: "#e8e4dc", display: "flex", flexDirection: "column" };
  const formWrap = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "#080c10" };
  const formCard = { width: "100%", maxWidth: "440px", border: "1px solid #1f2937", borderRadius: "8px", padding: "40px", background: "#0d1117" };
  const label = { display: "block", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "6px" };
  const input = { width: "100%", background: "#080c10", border: "1px solid #1f2937", borderRadius: "4px", padding: "12px 14px", color: "#e8e4dc", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none", marginBottom: "20px" };
  const primaryBtn = (disabled) => ({ width: "100%", background: disabled ? "#1f2937" : "#10b981", color: disabled ? "#374151" : "#000", border: "none", borderRadius: "4px", padding: "14px", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700 });
  const backBtn = { background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", marginBottom: "24px", padding: 0 };
  const tourBtn = (active) => ({ flex: 1, padding: "10px", border: `1px solid ${active ? "#10b981" : "#1f2937"}`, background: active ? "rgba(16,185,129,0.1)" : "transparent", color: active ? "#10b981" : "#6b7280", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" });

  if (screen === "loading") return (
    <div style={{ ...base, alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style>
      <div style={{ fontSize: "13px", color: "#374151" }}>Loading...</div>
    </div>
  );

  if (screen === "landing") return (
    <div style={base}>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", background: "radial-gradient(ellipse at 50% 0%, #0d2a1a 0%, #080c10 60%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "999px", padding: "6px 16px", marginBottom: "32px", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#10b981" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
          Verified players only
        </div>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 300, letterSpacing: "-0.03em", margin: "0 0 8px", lineHeight: 1.05, color: "#f0ece4", fontFamily: "'Playfair Display', Georgia, serif" }}>
          The circle<br /><span style={{ color: "#10b981", fontStyle: "italic" }}>players trust.</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "380px", lineHeight: 1.7, margin: "0 auto 48px" }}>
          A private network for ATP & WTA professionals. Verified players only.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button style={{ background: "#10b981", color: "#000", border: "none", borderRadius: "4px", padding: "16px 40px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }} onClick={() => { setError(""); setScreen("register"); }}>Apply for access</button>
          <button style={{ background: "transparent", color: "#10b981", border: "1px solid #10b981", borderRadius: "4px", padding: "16px 40px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }} onClick={() => { setError(""); setScreen("login"); }}>Sign in</button>
        </div>
        <p style={{ marginTop: "20px", fontSize: "11px", color: "#374151" }}>🔒 Manual verification · Invite or apply</p>
      </div>
    </div>
  );

  if (screen === "login") return (
    <div style={base}>
      <style>{CSS}</style>
      <div style={formWrap}>
        <div style={formCard}>
          <button style={backBtn} onClick={() => setScreen("landing")}>← Back</button>
          <div style={{ fontSize: "22px", fontWeight: 300, marginBottom: "8px", fontFamily: "'Playfair Display', Georgia, serif" }}>Welcome back</div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "32px" }}>Sign in to your PlayerCircle account.</div>
          {successMsg && <div style={{ fontSize: "12px", color: "#10b981", marginBottom: "16px" }}>{successMsg}</div>}
          <label style={label}>Email</label>
          <input style={input} type="email" placeholder="your@email.com" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
          <label style={label}>Password</label>
          <input style={input} type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
          {error && <div style={{ fontSize: "12px", color: "#ef4444", marginBottom: "16px" }}>{error}</div>}
          <button style={primaryBtn(loading)} onClick={handleLogin} disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#6b7280" }}>No account? <button style={{ background: "transparent", border: "none", color: "#10b981", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", textDecoration: "underline" }} onClick={() => { setError(""); setScreen("register"); }}>Apply for access</button></div>
        </div>
      </div>
    </div>
  );

  if (screen === "register") return (
    <div style={base}>
      <style>{CSS}</style>
      <div style={formWrap}>
        <div style={{ ...formCard, maxWidth: "480px" }}>
          <button style={backBtn} onClick={() => setScreen("landing")}>← Back</button>
          <div style={{ fontSize: "22px", fontWeight: 300, marginBottom: "8px", fontFamily: "'Playfair Display', Georgia, serif" }}>Apply for access</div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "32px" }}>We manually verify every player. You'll be notified once approved.</div>

          <label style={label}>Full name (as on ATP/WTA profile)</label>
          <input style={input} placeholder="e.g. Sebastian Báez" value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} />

          <label style={label}>Nationality</label>
          <input style={input} placeholder="e.g. Argentina" value={regForm.country} onChange={e => setRegForm({ ...regForm, country: e.target.value })} />

          <label style={label}>Current ranking</label>
          <input style={input} placeholder="e.g. 145" type="number" value={regForm.ranking} onChange={e => setRegForm({ ...regForm, ranking: e.target.value })} />

          <label style={label}>Tour</label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {["ATP", "WTA"].map(t => <button key={t} style={tourBtn(regForm.tour === t)} onClick={() => setRegForm({ ...regForm, tour: t })}>{t}</button>)}
          </div>

          <label style={label}>ATP/WTA Credential photo</label>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="credUpload" style={{ display: "block", border: "1px dashed #1f2937", borderRadius: "4px", padding: "20px", textAlign: "center", cursor: "pointer", color: credentialFile ? "#10b981" : "#6b7280", fontSize: "12px" }}>
              {credentialFile ? `✓ ${credentialFile.name}` : "Click to upload your player credential"}
            </label>
            <input id="credUpload" type="file" accept="image/*" onChange={handleFileChange} />
            {credentialPreview && <img src={credentialPreview} alt="preview" style={{ width: "100%", marginTop: "8px", borderRadius: "4px", border: "1px solid #1f2937", maxHeight: "120px", objectFit: "cover" }} />}
          </div>

          <label style={label}>Email</label>
          <input style={input} type="email" placeholder="your@email.com" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} />

          <label style={label}>Password</label>
          <input style={input} type="password" placeholder="Min. 6 characters" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} />

          {inviteFromUrl && (
            <>
              <label style={label}>Invite code</label>
              <input style={{ ...input, color: "#10b981" }} value={regForm.inviteCode} readOnly />
            </>
          )}

          {error && <div style={{ fontSize: "12px", color: "#ef4444", marginBottom: "16px" }}>{error}</div>}
          <button style={primaryBtn(loading)} onClick={handleRegister} disabled={loading}>{loading ? "Submitting application..." : "Submit application"}</button>
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#6b7280" }}>Already a member? <button style={{ background: "transparent", border: "none", color: "#10b981", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", textDecoration: "underline" }} onClick={() => { setError(""); setScreen("login"); }}>Sign in</button></div>
        </div>
      </div>
    </div>
  );

  if (screen === "pending") return (
    <div style={base}>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>⏳</div>
        <div style={{ fontSize: "22px", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "12px" }}>Application under review</div>
        <div style={{ fontSize: "14px", color: "#6b7280", maxWidth: "340px", lineHeight: 1.7, marginBottom: "32px" }}>We're verifying your ATP/WTA credentials. You'll receive an email once you're approved. This usually takes 24-48 hours.</div>
        <button style={{ background: "transparent", border: "1px solid #1f2937", color: "#6b7280", borderRadius: "4px", padding: "12px 24px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }} onClick={handleLogout}>Sign out</button>
      </div>
    </div>
  );

  // ADMIN PANEL
  if (screen === "home" && isAdmin && activeTab === "admin") {
    return (
      <div style={base}>
        <style>{CSS}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #111827", background: "#080c10", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: "14px", letterSpacing: "0.15em", color: "#10b981", fontWeight: 700 }}>PLAYERCIRCLE</div>
          <div style={{ fontSize: "11px", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "4px", padding: "4px 10px" }}>Admin</div>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid #111827", background: "#080c10" }}>
          {[["feed", "Feed"], ["cities", "Cities"], ["profile", "Profile"], ["admin", "Admin"]].map(([id, lbl]) => (
            <button key={id} style={{ flex: 1, padding: "14px 8px", textAlign: "center", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", color: activeTab === id ? "#10b981" : "#374151", background: "transparent", border: "none", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: activeTab === id ? "#10b981" : "transparent", fontFamily: "inherit" }} onClick={() => { setActiveTab(id); if (id === "admin") fetchPendingPlayers(); }}>{lbl}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <div style={{ fontSize: "11px", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Pending applications ({pendingPlayers.length})</div>
          {pendingPlayers.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#374151", fontSize: "13px" }}>No pending applications.</div>}
          {pendingPlayers.map(p => (
            <div key={p.id} style={{ border: "1px solid #1f2937", borderRadius: "6px", padding: "16px", marginBottom: "12px", background: "#0d1117" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>Rank #{p.ranking} · {p.tour} · {p.country}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{p.email}</div>
                  {p.invite_code && <div style={{ fontSize: "11px", color: "#6366f1", marginTop: "4px" }}>Invited with code: {p.invite_code}</div>}
                </div>
              </div>
              {p.credential_url && (
                <a href={p.credential_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "12px" }}>
                  <img src={p.credential_url} alt="credential" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "4px", border: "1px solid #1f2937" }} />
                  <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "4px", letterSpacing: "0.05em" }}>Click to view full credential</div>
                </a>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => approvePlayer(p.id)} style={{ flex: 1, background: "#10b981", color: "#000", border: "none", borderRadius: "4px", padding: "10px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>✓ Approve</button>
                <button onClick={() => rejectPlayer(p.id)} style={{ flex: 1, background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "4px", padding: "10px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>✗ Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN HOME
  return (
    <div style={base}>
      <style>{CSS}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #111827", background: "#080c10", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: "14px", letterSpacing: "0.15em", color: "#10b981", fontWeight: 700 }}>PLAYERCIRCLE</div>
        <div style={{ fontSize: "11px", color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "4px", padding: "4px 10px" }}>#{player?.ranking} {player?.tour}</div>
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid #111827", background: "#080c10" }}>
        {[["feed", "Feed"], ["cities", "Cities"], ["profile", "Profile"], ...(isAdmin ? [["admin", "Admin"]] : [])].map(([id, lbl]) => (
          <button key={id} style={{ flex: 1, padding: "14px 8px", textAlign: "center", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", color: activeTab === id ? "#10b981" : "#374151", background: "transparent", border: "none", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: activeTab === id ? "#10b981" : "transparent", fontFamily: "inherit" }} onClick={() => { setActiveTab(id); if (id === "admin") fetchPendingPlayers(); }}>{lbl}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>

        {activeTab === "feed" && (
          <>
            <div style={{ margin: "16px", border: "1px solid #1f2937", borderRadius: "6px", padding: "14px", background: "#0d1117" }}>
              <textarea style={{ width: "100%", background: "transparent", border: "none", color: "#e8e4dc", fontFamily: "inherit", fontSize: "13px", resize: "none", outline: "none", boxSizing: "border-box", minHeight: "60px" }} placeholder="Share a tip, ask a question, or vent. Players only." value={newPostText} onChange={e => setNewPostText(e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
                <select value={newPostCategory} onChange={e => setNewPostCategory(e.target.value)} style={{ background: "#080c10", border: "1px solid #1f2937", color: "#6b7280", borderRadius: "4px", padding: "6px 10px", fontFamily: "inherit", fontSize: "11px" }}>
                  {["Insight", "Tip", "Help", "Rant"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button style={{ background: "#10b981", color: "#000", border: "none", borderRadius: "4px", padding: "8px 20px", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }} onClick={submitPost}>Post</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", padding: "12px 16px", overflowX: "auto" }}>
              {["All", "Tip", "Help", "Rant", "Insight"].map(cat => (
                <button key={cat} style={{ whiteSpace: "nowrap", padding: "6px 14px", borderRadius: "999px", border: `1px solid ${selectedCategory === cat ? "#10b981" : "#1f2937"}`, background: selectedCategory === cat ? "rgba(16,185,129,0.1)" : "transparent", color: selectedCategory === cat ? "#10b981" : "#6b7280", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }} onClick={() => setSelectedCategory(cat)}>{cat}</button>
              ))}
            </div>
            {filteredPosts.length === 0 && <div style={{ textAlign: "center", padding: "60px 24px", color: "#374151", fontSize: "13px" }}>No posts yet. Be the first.</div>}
            {filteredPosts.map(post => (
              <div key={post.id} style={{ margin: "8px 16px", border: "1px solid #111827", borderRadius: "6px", padding: "16px", background: "#0d1117" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#10b981", flexShrink: 0 }}>{(post.author || "?")[0].toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>{post.author}</div>
                    <div style={{ fontSize: "11px", color: "#4b5563" }}>Rank #{post.ranking} · {timeAgo(post.created_at)}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: CATEGORY_COLORS[post.category] || "#6b7280", border: `1px solid ${CATEGORY_COLORS[post.category] || "#374151"}`, borderRadius: "4px", padding: "2px 8px" }}>{post.category}</div>
                </div>
                <div style={{ fontSize: "13px", lineHeight: 1.7, color: "#d1d5db", marginBottom: "12px" }}>{post.content}</div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontSize: "11px", color: "#4b5563" }}>💬 {post.replies} replies</span>
                  <span style={{ fontSize: "11px", color: "#4b5563" }}>♥ {post.likes}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "cities" && (
          <>
            {!selectedCity ? (
              <>
                <div style={{ padding: "16px 16px 8px", fontSize: "11px", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase" }}>Player-verified city guides</div>
                <div style={{ padding: "0 16px", display: "grid", gap: "10px" }}>
                  {CITIES.map(city => (
                    <div key={city.name} style={{ border: "1px solid #1f2937", borderRadius: "6px", padding: "16px", cursor: "pointer", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => setSelectedCity(city)}>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif" }}>{city.name}</div>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{city.tournament} · {city.country}</div>
                      </div>
                      <div style={{ fontSize: "18px", color: "#10b981" }}>→</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "14px 16px", fontSize: "11px", color: "#6b7280", cursor: "pointer", background: "transparent", border: "none", fontFamily: "inherit" }} onClick={() => setSelectedCity(null)}>← All cities</button>
                <div style={{ padding: "0 16px 16px" }}>
                  <div style={{ fontSize: "22px", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "4px" }}>{selectedCity.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "20px" }}>{selectedCity.tournament}</div>
                  {selectedCity.tips.map((tip, i) => (
                    <div key={i} style={{ border: "1px solid #1f2937", borderRadius: "6px", padding: "14px", marginBottom: "8px", background: "#0d1117", display: "flex", gap: "12px" }}>
                      <div style={{ fontSize: "20px", flexShrink: 0 }}>{tip.icon}</div>
                      <div>
                        <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#10b981", marginBottom: "4px" }}>{tip.category}</div>
                        <div style={{ fontSize: "13px", lineHeight: 1.6, color: "#d1d5db" }}>{tip.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <div style={{ padding: "24px 16px" }}>
            <div style={{ border: "1px solid #1f2937", borderRadius: "8px", padding: "24px", background: "#0d1117", marginBottom: "16px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#10b981", margin: "0 auto 12px" }}>{(player?.name || "P")[0].toUpperCase()}</div>
              <div style={{ fontSize: "20px", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "4px" }}>{player?.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{player?.country} · {player?.tour}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "8px", fontSize: "11px", color: "#10b981" }}>✓ Verified player · Rank #{player?.ranking}</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                {[["Posts", posts.filter(p => p.author === player?.name).length], ["Cities", CITIES.length], ["Ranking", player?.ranking]].map(([lbl, val]) => (
                  <div key={lbl} style={{ flex: 1, border: "1px solid #1f2937", borderRadius: "6px", padding: "12px", background: "#080c10", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#10b981" }}>{val}</div>
                    <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* INVITE SECTION */}
            <div style={{ border: "1px solid #1f2937", borderRadius: "6px", padding: "20px", background: "#0d1117", marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: "12px" }}>Invite a fellow player</div>
              {!inviteSent ? (
                <>
                  <input style={{ ...input, marginBottom: "12px" }} type="email" placeholder="Player's email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                  <button style={{ ...primaryBtn(false), padding: "10px" }} onClick={sendInvite}>Generate invite link</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "12px", color: "#10b981", marginBottom: "8px" }}>✓ Invite link generated</div>
                  <div style={{ background: "#080c10", border: "1px solid #1f2937", borderRadius: "4px", padding: "10px", fontSize: "11px", color: "#d1d5db", wordBreak: "break-all" }}>
                    {window.location.origin}?invite={inviteCode}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px" }}>Share this link. They'll still need to upload their credential and get approved.</div>
                  <button style={{ background: "transparent", border: "none", color: "#10b981", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", marginTop: "8px", padding: 0 }} onClick={() => { setInviteSent(false); setInviteEmail(""); setInviteCode(""); }}>Send another</button>
                </>
              )}
            </div>

            <button style={{ width: "100%", background: "transparent", border: "1px solid #1f2937", color: "#6b7280", borderRadius: "4px", padding: "12px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }} onClick={handleLogout}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}
