import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://glcxzuadoelmouihsill.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3h6dWFkb2VsbW91aWhzaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjcyODcsImV4cCI6MjA4NzMwMzI4N30.VJ8T4Vodtd3f2W9JNQzFQXGYqq3m4TKT-FQYWL3rNcY"
);

const ADMIN_EMAIL = "javierglocret@icloud.com";
const CAT_COLOR = { Help:"#f59e0b", Tip:"#10b981", Rant:"#ef4444", Insight:"#a78bfa" };
const CAT_BG = { Help:"rgba(245,158,11,0.12)", Tip:"rgba(16,185,129,0.12)", Rant:"rgba(239,68,68,0.12)", Insight:"rgba(167,139,250,0.12)" };
const CATS = ["Insight","Tip","Help","Rant"];
const TOURS = ["ATP","WTA"];

const CITIES = [
  { name:"Melbourne", flag:"🇦🇺", tournament:"Australian Open", color:"#3b82f6", tips:[{cat:"Training",text:"Melbourne Park practice courts 6am–8pm. Book via Tennis Australia portal.",icon:"🎾"},{cat:"Recovery",text:"Stretch Lab South Yarra — best physio on circuit. Ask for Marcus.",icon:"💆"},{cat:"Food",text:"Tipo 00 CBD — carb loading done right. Incredible fresh pasta.",icon:"🍝"},{cat:"Hotel",text:"Crown Towers — 20% off during AO with your player credential.",icon:"🏨"}]},
  { name:"Paris", flag:"🇫🇷", tournament:"Roland Garros", color:"#f97316", tips:[{cat:"Training",text:"Racing Club de France, Bois de Boulogne — clay courts 5 min from RG.",icon:"🎾"},{cat:"Recovery",text:"Institut du Sport 13ème — best cryotherapy in Paris.",icon:"💆"},{cat:"Food",text:"Café de Flore — breakfast only. The omelette is non-negotiable.",icon:"🥐"},{cat:"Hotel",text:"Molitor Hotel — rooftop pool, 10 min from Roland Garros by bike.",icon:"🏨"}]},
  { name:"London", flag:"🇬🇧", tournament:"Wimbledon", color:"#8b5cf6", tips:[{cat:"Training",text:"National Tennis Centre, Roehampton — book 2 weeks ahead in June.",icon:"🎾"},{cat:"Recovery",text:"Third Space Soho — best gym in central London, open 6am.",icon:"💆"},{cat:"Food",text:"Gymkhana — high protein Indian food, no dairy options available.",icon:"🍛"},{cat:"Hotel",text:"Cannizaro House, Wimbledon Village — walking distance to grounds.",icon:"🏨"}]},
  { name:"New York", flag:"🇺🇸", tournament:"US Open", color:"#ec4899", tips:[{cat:"Training",text:"USTA Billie Jean King Center — Courts 8-17 are always less crowded.",icon:"🎾"},{cat:"Recovery",text:"Equinox 61st — full recovery suite, cold plunge, sauna.",icon:"💆"},{cat:"Food",text:"Carbone — book 3 weeks ahead minimum. Worth every dollar.",icon:"🍷"},{cat:"Hotel",text:"1 Hotel Brooklyn Bridge — great views, 25 min Uber to Flushing.",icon:"🏨"}]},
  { name:"Miami", flag:"🇺🇸", tournament:"Miami Open", color:"#14b8a6", tips:[{cat:"Training",text:"Crandon Park — courts next to the venue. Go before 9am.",icon:"🎾"},{cat:"Recovery",text:"Next Health Brickell — ice barrels are essential in Miami heat.",icon:"💆"},{cat:"Food",text:"Zuma Brickell — light Japanese, clean proteins. Players go here every year.",icon:"🍱"},{cat:"Hotel",text:"EAST Miami — rooftop pool, 15 min Uber to Key Biscayne.",icon:"🏨"}]},
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { -webkit-tap-highlight-color: transparent; }

  :root {
    --bg: #0a0a0b;
    --bg1: #111113;
    --bg2: #18181b;
    --bg3: #232328;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.04);
    --text: #f0ede8;
    --text2: #8b8b8f;
    --text3: #4a4a50;
    --green: #00d084;
    --green2: #00b371;
    --glow: rgba(0,208,132,0.15);
    --font: 'Sora', -apple-system, sans-serif;
  }

  body { background: var(--bg); font-family: var(--font); color: var(--text); overscroll-behavior: none; }
  ::-webkit-scrollbar { display: none; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes heartPop { 0%{transform:scale(1)} 50%{transform:scale(1.5)} 100%{transform:scale(1)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .fu { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .fi { animation: fadeIn 0.3s ease both; }
  .su { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }

  button { cursor:pointer; font-family:inherit; border:none; transition:opacity 0.15s, transform 0.1s; }
  button:active { transform: scale(0.96); }
  textarea, input { font-family:inherit; }
  input[type=file] { display:none; }
  input::placeholder, textarea::placeholder { color: var(--text3); }
  input:focus, textarea:focus { outline:none; }

  .post { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .heart-pop { animation: heartPop 0.3s ease; }

  /* Bottom nav safe area */
  .bottom-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
`;

// ─── COMPONENTS ───────────────────────────────────────────────

const Avatar = ({ name, size = 38, glow = false }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, var(--green) 0%, #00b3d4 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, color: "#000",
    flexShrink: 0, position: "relative",
    boxShadow: glow ? "0 0 20px rgba(0,208,132,0.4)" : "none",
  }}>
    {(name || "?")[0].toUpperCase()}
  </div>
);

const GreenBtn = ({ children, onClick, disabled, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? "var(--bg3)" : "var(--green)",
    color: disabled ? "var(--text3)" : "#000",
    borderRadius: 10, padding: "13px 20px",
    fontSize: 14, fontWeight: 700, width: "100%",
    letterSpacing: "0.01em",
    boxShadow: disabled ? "none" : "0 0 24px var(--glow)",
    transition: "all 0.2s",
    ...style
  }}>
    {children}
  </button>
);

const Input = ({ label, style = {}, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{label}</div>}
    <input style={{
      width: "100%", background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 10, padding: "12px 14px",
      color: "var(--text)", fontSize: 14,
      transition: "border-color 0.2s, box-shadow 0.2s",
      ...style
    }} {...props} />
  </div>
);

const Badge = ({ children, color, bg }) => (
  <div style={{
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", padding: "3px 9px",
    borderRadius: 999, color: color || "var(--green)",
    background: bg || "rgba(0,208,132,0.12)",
    border: `1px solid ${color || "var(--green)"}22`,
    display: "inline-flex", alignItems: "center",
  }}>{children}</div>
);

// ─── MAIN APP ───────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [tab, setTab] = useState("feed");
  const [session, setSession] = useState(null);
  const [player, setPlayer] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pending, setPending] = useState([]);
  const [city, setCity] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLikes, setMyLikes] = useState(new Set());

  // Forms
  const [lf, setLf] = useState({ email: "", password: "" });
  const [rf, setRf] = useState({ name: "", country: "", ranking: "", tour: "ATP", email: "", password: "" });
  const [credFile, setCredFile] = useState(null);
  const [credPreview, setCredPreview] = useState(null);

  // Compose
  const [postText, setPostText] = useState("");
  const [postCat, setPostCat] = useState("Insight");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [composeFocused, setComposeFocused] = useState(false);
  const mediaRef = useRef();

  // Post interactions
  const [editPost, setEditPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [expandedCms, setExpandedCms] = useState({});
  const [comments, setComments] = useState({});
  const [cmText, setCmText] = useState({});
  const [editCm, setEditCm] = useState(null);
  const [editCmText, setEditCmText] = useState("");
  const [postMenu, setPostMenu] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});

  // Profile
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", country: "", ranking: "", tour: "ATP" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const inviteCode = new URLSearchParams(window.location.search).get("invite") || "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadPlayer(session.user.id);
      else setScreen("landing");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (s) loadPlayer(s.user.id);
      else setScreen("landing");
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const close = () => setPostMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const loadPlayer = async (uid) => {
    const { data } = await supabase.from("players").select("*").eq("user_id", uid).single();
    if (data) {
      setPlayer(data);
      if (data.status === "approved") { await loadPosts(); await loadLikes(uid); setScreen("home"); }
      else setScreen("pending");
    } else setScreen("landing");
  };

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const loadLikes = async (uid) => {
    const { data } = await supabase.from("post_likes").select("post_id").eq("user_id", uid);
    if (data) setMyLikes(new Set(data.map(l => l.post_id)));
  };

  const loadComments = async (pid) => {
    const { data } = await supabase.from("comments").select("*").eq("post_id", pid).order("created_at", { ascending: true });
    if (data) setComments(c => ({ ...c, [pid]: data }));
  };

  const loadPending = async () => {
    const { data } = await supabase.from("players").select("*").eq("status", "pending").order("created_at", { ascending: false });
    if (data) setPending(data);
  };

  const login = async () => {
    setErr(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: lf.email, password: lf.password });
    setLoading(false);
    if (error) setErr("Invalid email or password.");
  };

  const handleCredFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setCredFile(f);
    const r = new FileReader(); r.onloadend = () => setCredPreview(r.result); r.readAsDataURL(f);
  };

  const register = async () => {
    if (!rf.name || !rf.ranking || !rf.email || !rf.password) { setErr("Please fill in all fields."); return; }
    if (!credFile) { setErr("Please upload your ATP/WTA credential."); return; }
    if (rf.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setLoading(true); setErr("");
    const { data: ad, error: ae } = await supabase.auth.signUp({ email: rf.email, password: rf.password });
    if (ae) { setErr(ae.message); setLoading(false); return; }
    const ext = credFile.name.split(".").pop();
    await supabase.storage.from("credentials").upload(`${ad.user.id}.${ext}`, credFile);
    const { data: ud } = supabase.storage.from("credentials").getPublicUrl(`${ad.user.id}.${ext}`);
    await supabase.from("players").insert([{ user_id: ad.user.id, name: rf.name, country: rf.country, ranking: parseInt(rf.ranking), tour: rf.tour, email: rf.email, status: "pending", credential_url: ud.publicUrl, invite_code: inviteCode || null }]);
    setLoading(false); setScreen("pending");
  };

  const logout = async () => {
    await supabase.auth.signOut(); setPlayer(null); setSession(null); setScreen("landing");
  };

  const saveProfile = async () => {
    setLoading(true);
    const { data } = await supabase.from("players").update({ name: profileForm.name, country: profileForm.country, ranking: parseInt(profileForm.ranking), tour: profileForm.tour }).eq("id", player.id).select().single();
    setLoading(false);
    if (data) { setPlayer(data); setEditProfile(false); setOk("Profile updated!"); setTimeout(() => setOk(""), 3000); }
  };

  const handleMediaFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setMediaFile(f); setMediaType(f.type.startsWith("video") ? "video" : "image");
    const r = new FileReader(); r.onloadend = () => setMediaPreview(r.result); r.readAsDataURL(f);
  };

  const submitPost = async () => {
    if (!postText.trim() && !mediaFile) return;
    let media_url = null, media_type = null;
    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const fn = `posts/${Date.now()}.${ext}`;
      await supabase.storage.from("credentials").upload(fn, mediaFile);
      const { data: ud } = supabase.storage.from("credentials").getPublicUrl(fn);
      media_url = ud.publicUrl; media_type = mediaType;
    }
    const { data } = await supabase.from("posts").insert([{ author: player.name, country: player.country, ranking: player.ranking, content: postText, category: postCat, likes: 0, replies: 0, user_id: player.user_id, media_url, media_type }]).select().single();
    if (data) { setPosts([data, ...posts]); setPostText(""); setPostCat("Insight"); setMediaFile(null); setMediaPreview(null); setMediaType(null); setComposeFocused(false); }
  };

  const delPost = async (id) => {
    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter(p => p.id !== id)); setPostMenu(null);
  };

  const saveEditPost = async (id) => {
    const { data } = await supabase.from("posts").update({ content: editText }).eq("id", id).select().single();
    if (data) { setPosts(posts.map(p => p.id === id ? data : p)); setEditPost(null); }
  };

  const toggleLike = async (post) => {
    const uid = player.user_id;
    setLikedPosts(l => ({ ...l, [post.id]: true }));
    setTimeout(() => setLikedPosts(l => ({ ...l, [post.id]: false })), 300);
    if (myLikes.has(post.id)) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", uid);
      const nl = Math.max(0, (post.likes || 0) - 1);
      await supabase.from("posts").update({ likes: nl }).eq("id", post.id);
      setPosts(posts.map(p => p.id === post.id ? { ...p, likes: nl } : p));
      setMyLikes(s => { const n = new Set(s); n.delete(post.id); return n; });
    } else {
      await supabase.from("post_likes").insert([{ post_id: post.id, user_id: uid }]);
      const nl = (post.likes || 0) + 1;
      await supabase.from("posts").update({ likes: nl }).eq("id", post.id);
      setPosts(posts.map(p => p.id === post.id ? { ...p, likes: nl } : p));
      setMyLikes(s => new Set([...s, post.id]));
    }
  };

  const toggleCms = (pid) => {
    setExpandedCms(x => ({ ...x, [pid]: !x[pid] }));
    if (!comments[pid]) loadComments(pid);
  };

  const submitCm = async (pid) => {
    const text = cmText[pid]; if (!text?.trim()) return;
    const { data } = await supabase.from("comments").insert([{ post_id: pid, author: player.name, ranking: player.ranking, content: text, user_id: player.user_id }]).select().single();
    if (data) {
      setComments(c => ({ ...c, [pid]: [...(c[pid] || []), data] }));
      setCmText(t => ({ ...t, [pid]: "" }));
      const nr = (posts.find(p => p.id === pid)?.replies || 0) + 1;
      await supabase.from("posts").update({ replies: nr }).eq("id", pid);
      setPosts(posts.map(p => p.id === pid ? { ...p, replies: nr } : p));
    }
  };

  const delCm = async (pid, cid) => {
    await supabase.from("comments").delete().eq("id", cid);
    setComments(c => ({ ...c, [pid]: (c[pid] || []).filter(x => x.id !== cid) }));
    const nr = Math.max(0, (posts.find(p => p.id === pid)?.replies || 0) - 1);
    await supabase.from("posts").update({ replies: nr }).eq("id", pid);
    setPosts(posts.map(p => p.id === pid ? { ...p, replies: nr } : p));
  };

  const saveCm = async (pid, cid) => {
    const { data } = await supabase.from("comments").update({ content: editCmText }).eq("id", cid).select().single();
    if (data) { setComments(c => ({ ...c, [pid]: (c[pid] || []).map(x => x.id === cid ? data : x) })); setEditCm(null); }
  };

  const approve = async (id) => { await supabase.from("players").update({ status: "approved" }).eq("id", id); loadPending(); };
  const reject = async (id) => { await supabase.from("players").update({ status: "rejected" }).eq("id", id); loadPending(); };

  const genInvite = () => {
    if (!inviteEmail.trim()) return;
    const c = Math.random().toString(36).substring(2, 10).toUpperCase();
    setInviteLink(`${window.location.origin}?invite=${c}`);
  };

  const ago = (d) => {
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const filteredPosts = catFilter === "All" ? posts : posts.filter(p => p.category === catFilter);
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const isMyPost = (p) => p.user_id === player?.user_id;
  const isMyCm = (c) => c.user_id === player?.user_id;

  // ─── SCREENS ────────────────────────────────────────────────

  if (screen === "loading") return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style>
      <div style={{ width: 24, height: 24, border: "2px solid var(--bg3)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  if (screen === "landing") return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <style>{CSS}</style>
      {/* Radial glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(0,208,132,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border2) 1px,transparent 1px),linear-gradient(90deg,var(--border2) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div className="fu" style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,208,132,0.08)", border: "1px solid rgba(0,208,132,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 40, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", fontWeight: 600 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
          Verified players only
        </div>

        <h1 style={{ fontSize: "clamp(44px,8vw,76px)", fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 8, color: "var(--text)", fontFamily: "'Playfair Display', Georgia, serif" }}>
          The circle<br />
          <span style={{ fontStyle: "italic", color: "var(--green)" }}>players trust.</span>
        </h1>

        <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.75, margin: "24px auto 44px", maxWidth: 320 }}>
          A private network for ATP & WTA professionals. Real tips, real players, city by city.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300, margin: "0 auto 28px" }}>
          <button onClick={() => { setErr(""); setScreen("register"); }} style={{ background: "var(--green)", color: "#000", border: "none", borderRadius: 12, padding: "16px 32px", fontSize: 14, fontWeight: 700, letterSpacing: "0.02em", boxShadow: "0 0 32px var(--glow)" }}>
            Apply for access
          </button>
          <button onClick={() => { setErr(""); setScreen("login"); }} style={{ background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 32px", fontSize: 14, fontWeight: 500 }}>
            Sign in
          </button>
        </div>

        <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.06em" }}>🔒 Manual verification · ATP & WTA only</p>
      </div>
    </div>
  );

  if (screen === "login") return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 400 }} className="fu">
        <button onClick={() => setScreen("landing")} style={{ background: "transparent", color: "var(--text3)", fontSize: 13, marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <div style={{ fontSize: 28, fontWeight: 300, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text)" }}>Welcome back</div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 32 }}>Sign in to your PlayerCircle account.</div>
        <Input label="Email" type="email" placeholder="your@email.com" value={lf.email} onChange={e => setLf({ ...lf, email: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} />
        <Input label="Password" type="password" placeholder="••••••••" value={lf.password} onChange={e => setLf({ ...lf, password: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} />
        {err && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16, padding: "10px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>{err}</div>}
        <GreenBtn onClick={login} disabled={loading}>{loading ? "Signing in..." : "Sign in"}</GreenBtn>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text2)" }}>
          No account? <button onClick={() => { setErr(""); setScreen("register"); }} style={{ background: "transparent", color: "var(--green)", fontSize: 12, fontWeight: 600 }}>Apply for access</button>
        </div>
      </div>
    </div>
  );

  if (screen === "register") return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 420 }} className="fu">
        <button onClick={() => setScreen("landing")} style={{ background: "transparent", color: "var(--text3)", fontSize: 13, marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <div style={{ fontSize: 28, fontWeight: 300, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>Apply for access</div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 32 }}>We manually verify every player against ATP/WTA records.</div>

        <Input label="Full name (as on ATP/WTA profile)" placeholder="e.g. Sebastian Báez" value={rf.name} onChange={e => setRf({ ...rf, name: e.target.value })} />
        <Input label="Nationality" placeholder="e.g. Argentina" value={rf.country} onChange={e => setRf({ ...rf, country: e.target.value })} />
        <Input label="Current ranking" type="number" placeholder="e.g. 145" value={rf.ranking} onChange={e => setRf({ ...rf, ranking: e.target.value })} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Tour</div>
          <div style={{ display: "flex", gap: 8 }}>
            {TOURS.map(t => (
              <button key={t} onClick={() => setRf({ ...rf, tour: t })} style={{ flex: 1, padding: "10px", border: `1px solid ${rf.tour === t ? "var(--green)" : "var(--border)"}`, background: rf.tour === t ? "rgba(0,208,132,0.1)" : "transparent", color: rf.tour === t ? "var(--green)" : "var(--text2)", borderRadius: 10, fontSize: 13, fontWeight: rf.tour === t ? 700 : 400 }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>ATP/WTA Credential</div>
          <label htmlFor="cred" style={{ display: "flex", alignItems: "center", gap: 12, border: `1px dashed ${credFile ? "var(--green)" : "var(--border)"}`, borderRadius: 10, padding: 16, cursor: "pointer", background: credFile ? "rgba(0,208,132,0.05)" : "transparent", transition: "all 0.2s" }}>
            <span style={{ fontSize: 20 }}>{credFile ? "✓" : "📎"}</span>
            <span style={{ fontSize: 13, color: credFile ? "var(--green)" : "var(--text3)" }}>{credFile ? credFile.name : "Upload your player credential photo"}</span>
          </label>
          <input id="cred" type="file" accept="image/*" onChange={handleCredFile} />
          {credPreview && <img src={credPreview} alt="" style={{ width: "100%", marginTop: 8, borderRadius: 8, maxHeight: 120, objectFit: "cover", border: "1px solid var(--border)" }} />}
        </div>

        <Input label="Email" type="email" placeholder="your@email.com" value={rf.email} onChange={e => setRf({ ...rf, email: e.target.value })} />
        <Input label="Password" type="password" placeholder="Min. 6 characters" value={rf.password} onChange={e => setRf({ ...rf, password: e.target.value })} />

        {inviteCode && <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 16, padding: "10px 12px", background: "rgba(0,208,132,0.08)", borderRadius: 8, border: "1px solid rgba(0,208,132,0.2)" }}>✓ Invited with code: {inviteCode}</div>}
        {err && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16, padding: "10px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>{err}</div>}
        <GreenBtn onClick={register} disabled={loading}>{loading ? "Submitting..." : "Submit application"}</GreenBtn>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text2)" }}>
          Already a member? <button onClick={() => { setErr(""); setScreen("login"); }} style={{ background: "transparent", color: "var(--green)", fontSize: 12, fontWeight: 600 }}>Sign in</button>
        </div>
      </div>
    </div>
  );

  if (screen === "pending") return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <style>{CSS}</style>
      <div className="fu">
        <div style={{ width: 64, height: 64, background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px" }}>⏳</div>
        <div style={{ fontSize: 26, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 12 }}>Under review</div>
        <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, maxWidth: 280, margin: "0 auto 32px" }}>We're verifying your ATP/WTA credentials. You'll be notified by email once approved. Usually 24–48 hours.</div>
        <button onClick={logout} style={{ background: "var(--bg2)", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 24px", fontSize: 13 }}>Sign out</button>
      </div>
    </div>
  );

  // ─── EDIT PROFILE MODAL ────────────────────────────────────
  const ProfileModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, backdropFilter: "blur(8px)", padding: 0 }} onClick={() => setEditProfile(false)}>
      <div className="su" style={{ width: "100%", maxWidth: 480, background: "var(--bg1)", borderRadius: "20px 20px 0 0", padding: "24px 24px 40px", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: "var(--bg3)", borderRadius: 999, margin: "0 auto 24px" }} />
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Edit profile</div>
        <Input label="Full name" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
        <Input label="Nationality" value={profileForm.country} onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} />
        <Input label="Current ranking" type="number" value={profileForm.ranking} onChange={e => setProfileForm({ ...profileForm, ranking: e.target.value })} />
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Tour</div>
          <div style={{ display: "flex", gap: 8 }}>
            {TOURS.map(t => <button key={t} onClick={() => setProfileForm({ ...profileForm, tour: t })} style={{ flex: 1, padding: "10px", border: `1px solid ${profileForm.tour === t ? "var(--green)" : "var(--border)"}`, background: profileForm.tour === t ? "rgba(0,208,132,0.1)" : "transparent", color: profileForm.tour === t ? "var(--green)" : "var(--text2)", borderRadius: 10, fontSize: 13, fontWeight: profileForm.tour === t ? 700 : 400 }}>{t}</button>)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <GreenBtn onClick={saveProfile}>{loading ? "Saving..." : "Save changes"}</GreenBtn>
          <button onClick={() => setEditProfile(false)} style={{ flex: 1, background: "var(--bg2)", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px", fontSize: 14 }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  // ─── BOTTOM NAV ───────────────────────────────────────────
  const navItems = [
    { id: "feed", icon: (a) => <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={a ? "var(--green)" : "var(--text3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "Home" },
    { id: "cities", icon: (a) => <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={a ? "var(--green)" : "var(--text3)"}/></svg>, label: "Cities" },
    { id: "profile", icon: (a) => <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke={a ? "var(--green)" : "var(--text3)"} strokeWidth="1.8"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={a ? "var(--green)" : "var(--text3)"} strokeWidth="1.8" strokeLinecap="round"/></svg>, label: "Profile" },
    ...(isAdmin ? [{ id: "admin", icon: (a) => <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={a ? "#f59e0b" : "var(--text3)"} strokeWidth="1.8" strokeLinejoin="round"/></svg>, label: "Admin" }] : []),
  ];

  const BottomNav = () => (
    <div className="bottom-safe" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,11,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", display: "flex", zIndex: 50, maxWidth: 480, margin: "0 auto" }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => { setTab(item.id); if (item.id === "admin") loadPending(); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 8px 14px", background: "transparent", transition: "opacity 0.15s" }}>
          {item.icon(tab === item.id)}
          <span style={{ fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color: tab === item.id ? (item.id === "admin" ? "#f59e0b" : "var(--green)") : "var(--text3)", fontWeight: tab === item.id ? 700 : 400 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );

  // ─── FEED ─────────────────────────────────────────────────
  const FeedTab = () => (
    <div style={{ paddingBottom: 120 }}>
      {/* Compose */}
      <div style={{ margin: "16px 16px 8px", background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Avatar name={player?.name} size={36} />
            <textarea
              style={{ flex: 1, background: "transparent", border: "none", color: "var(--text)", fontSize: 14, resize: "none", lineHeight: 1.6, minHeight: composeFocused ? 80 : 40, transition: "min-height 0.2s ease" }}
              placeholder="Share a tip, ask a question, or vent..."
              value={postText}
              onChange={e => setPostText(e.target.value)}
              onFocus={() => setComposeFocused(true)}
            />
          </div>
          {mediaPreview && (
            <div style={{ position: "relative", marginTop: 12, marginLeft: 48 }}>
              {mediaType === "video"
                ? <video src={mediaPreview} controls style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", maxHeight: 200 }} />
                : <img src={mediaPreview} alt="" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", maxHeight: 200, objectFit: "cover" }} />
              }
              <button onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", borderRadius: "50%", width: 24, height: 24, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          )}
        </div>
        {(composeFocused || postText || mediaPreview) && (
          <div style={{ padding: "10px 16px 14px", borderTop: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => mediaRef.current?.click()} style={{ background: "transparent", color: "var(--text3)", fontSize: 18, display: "flex", alignItems: "center" }}>📷</button>
              <input ref={mediaRef} type="file" accept="image/*,video/*" onChange={handleMediaFile} />
              <select value={postCat} onChange={e => setPostCat(e.target.value)} style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: CAT_COLOR[postCat] || "var(--text2)", borderRadius: 8, padding: "5px 10px", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={submitPost} style={{ background: "var(--green)", color: "#000", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, boxShadow: "0 0 16px var(--glow)" }}>Post</button>
          </div>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 8, padding: "4px 16px 12px", overflowX: "auto" }}>
        {["All", ...CATS].map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{ whiteSpace: "nowrap", padding: "6px 16px", borderRadius: 999, border: `1px solid ${catFilter === c ? (CAT_COLOR[c] || "var(--green)") : "var(--border)"}`, background: catFilter === c ? (CAT_BG[c] || "rgba(0,208,132,0.1)") : "transparent", color: catFilter === c ? (CAT_COLOR[c] || "var(--green)") : "var(--text3)", fontSize: 11, fontWeight: catFilter === c ? 700 : 400, letterSpacing: "0.05em", transition: "all 0.15s" }}>{c}</button>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
          <div style={{ fontSize: 14 }}>No posts yet. Be the first.</div>
        </div>
      )}

      {filteredPosts.map((post, i) => (
        <div key={post.id} className="post" style={{ margin: "0 16px 10px", background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", animationDelay: `${i * 0.03}s` }}>
          {/* Header */}
          <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Avatar name={post.author} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{post.author}</span>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>#{post.ranking} · {ago(post.created_at)}</span>
                <Badge color={CAT_COLOR[post.category]} bg={CAT_BG[post.category]}>{post.category}</Badge>
              </div>
            </div>
            {isMyPost(post) && (
              <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setPostMenu(postMenu === post.id ? null : post.id)} style={{ background: "transparent", color: "var(--text3)", fontSize: 20, padding: "0 4px", letterSpacing: "1px", lineHeight: 1 }}>···</button>
                {postMenu === post.id && (
                  <div className="fi" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 4, zIndex: 20, minWidth: 140, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                    <button onClick={() => { setEditPost(post.id); setEditText(post.content); setPostMenu(null); }} style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", color: "var(--text)", padding: "9px 14px", fontSize: 13, borderRadius: 8 }}>Edit post</button>
                    <button onClick={() => delPost(post.id)} style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", color: "#ef4444", padding: "9px 14px", fontSize: 13, borderRadius: 8 }}>Delete post</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: "10px 16px 12px", paddingLeft: 64 }}>
            {editPost === post.id ? (
              <>
                <textarea style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 14, padding: "10px 12px", resize: "none", minHeight: 80, marginBottom: 10, lineHeight: 1.6 }} value={editText} onChange={e => setEditText(e.target.value)} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => saveEditPost(post.id)} style={{ background: "var(--green)", color: "#000", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700 }}>Save</button>
                  <button onClick={() => setEditPost(null)} style={{ background: "var(--bg2)", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", fontSize: 12 }}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}>{post.content}</div>
            )}
          </div>

          {/* Media */}
          {post.media_url && (
            <div style={{ margin: "0 16px 12px" }}>
              {post.media_type === "video"
                ? <video src={post.media_url} controls style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", maxHeight: 300 }} />
                : <img src={post.media_url} alt="" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", maxHeight: 300, objectFit: "cover" }} />
              }
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 10px", borderTop: "1px solid var(--border2)" }}>
            <button onClick={() => toggleLike(post)} className={likedPosts[post.id] ? "heart-pop" : ""} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", color: myLikes.has(post.id) ? "#ef4444" : "var(--text3)", fontSize: 13, padding: "6px 12px", borderRadius: 10, fontWeight: myLikes.has(post.id) ? 600 : 400 }}>
              {myLikes.has(post.id) ? "❤️" : "🤍"} {post.likes || 0}
            </button>
            <button onClick={() => toggleCms(post.id)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", color: expandedCms[post.id] ? "var(--green)" : "var(--text3)", fontSize: 13, padding: "6px 12px", borderRadius: 10, fontWeight: expandedCms[post.id] ? 600 : 400 }}>
              💬 {post.replies || 0}
            </button>
          </div>

          {/* Comments */}
          {expandedCms[post.id] && (
            <div style={{ borderTop: "1px solid var(--border2)", padding: "14px 16px", background: "rgba(0,0,0,0.2)" }}>
              {(comments[post.id] || []).length === 0 && <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginBottom: 12 }}>No replies yet.</div>}
              {(comments[post.id] || []).map(c => (
                <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <Avatar name={c.author} size={28} />
                  <div style={{ flex: 1, background: "var(--bg2)", borderRadius: 12, padding: "8px 12px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{c.author} <span style={{ color: "var(--text3)", fontWeight: 400 }}>· #{c.ranking}</span></span>
                      {isMyCm(c) && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => { setEditCm(c.id); setEditCmText(c.content); }} style={{ background: "transparent", color: "var(--text3)", fontSize: 11 }}>Edit</button>
                          <button onClick={() => delCm(post.id, c.id)} style={{ background: "transparent", color: "#ef4444", fontSize: 11 }}>Delete</button>
                        </div>
                      )}
                    </div>
                    {editCm === c.id ? (
                      <div>
                        <input style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13, marginBottom: 6 }} value={editCmText} onChange={e => setEditCmText(e.target.value)} />
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => saveCm(post.id, c.id)} style={{ background: "var(--green)", color: "#000", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>Save</button>
                          <button onClick={() => setEditCm(null)} style={{ background: "var(--bg2)", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 12px", fontSize: 11 }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{c.content}</div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <Avatar name={player?.name} size={28} />
                <input style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 999, padding: "8px 14px", color: "var(--text)", fontSize: 13 }} placeholder="Write a reply..." value={cmText[post.id] || ""} onChange={e => setCmText(t => ({ ...t, [post.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && submitCm(post.id)} />
                <button onClick={() => submitCm(post.id)} style={{ background: "var(--green)", color: "#000", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>↑</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─── CITIES ────────────────────────────────────────────────
  const CitiesTab = () => (
    <div style={{ padding: "0 0 120px" }}>
      {!city ? (
        <>
          <div style={{ padding: "20px 20px 12px", fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Player-verified city guides</div>
          <div style={{ padding: "0 16px", display: "grid", gap: 10 }}>
            {CITIES.map((c, i) => (
              <button key={c.name} onClick={() => setCity(c)} className="fu" style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, textAlign: "left", animationDelay: `${i * 0.06}s`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, transparent, ${c.color}08)`, pointerEvents: "none" }} />
                <span style={{ fontSize: 32 }}>{c.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.tournament}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${c.color}20`, border: `1px solid ${c.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: c.color, flexShrink: 0 }}>→</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border2)" }}>
            <button onClick={() => setCity(null)} style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: 10, padding: "8px 14px", fontSize: 12 }}>← Back</button>
            <span style={{ fontSize: 28 }}>{city.flag}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{city.name}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{city.tournament}</div>
            </div>
          </div>
          <div style={{ padding: "16px 16px 120px" }}>
            {city.tips.map((tip, i) => (
              <div key={i} className="fu" style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", marginBottom: 10, display: "flex", gap: 14, animationDelay: `${i * 0.07}s` }}>
                <div style={{ width: 40, height: 40, background: "var(--bg2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{tip.icon}</div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", marginBottom: 5, fontWeight: 700 }}>{tip.cat}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text)" }}>{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // ─── PROFILE ───────────────────────────────────────────────
  const ProfileTab = () => (
    <div style={{ padding: "20px 16px 120px" }}>
      {ok && <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 16, padding: "10px 14px", background: "rgba(0,208,132,0.08)", borderRadius: 10, border: "1px solid rgba(0,208,132,0.2)" }}>{ok}</div>}

      {/* Hero card */}
      <div style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 12, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avatar name={player?.name} size={56} glow={true} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>{player?.name}</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>{player?.country} · {player?.tour}</div>
            <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
              Verified player · Rank #{player?.ranking}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[["Posts", posts.filter(p => p.author === player?.name).length], ["Cities", CITIES.length], ["Ranking", `#${player?.ranking}`]].map(([l, v]) => (
            <div key={l} style={{ background: "var(--bg2)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid var(--border2)" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green)" }}>{v}</div>
              <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setProfileForm({ name: player.name, country: player.country, ranking: player.ranking, tour: player.tour }); setEditProfile(true); }} style={{ width: "100%", background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 500 }}>Edit profile</button>
      </div>

      {/* Invite */}
      <div style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Invite a fellow player</div>
        {!inviteLink ? (
          <>
            <Input type="email" placeholder="Player's email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            <GreenBtn onClick={genInvite} style={{ padding: "11px 20px" }}>Generate invite link</GreenBtn>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 10 }}>✓ Invite link ready — copy and share</div>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "var(--text2)", wordBreak: "break-all", lineHeight: 1.6 }}>{inviteLink}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>They'll still need to upload credentials and get approved.</div>
            <button onClick={() => { setInviteLink(""); setInviteEmail(""); }} style={{ background: "transparent", color: "var(--green)", fontSize: 12, marginTop: 10, fontWeight: 600 }}>Generate another</button>
          </>
        )}
      </div>

      <button onClick={logout} style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", color: "var(--text3)", borderRadius: 12, padding: 14, fontSize: 13 }}>Sign out</button>
    </div>
  );

  // ─── ADMIN ─────────────────────────────────────────────────
  const AdminTab = () => (
    <div style={{ padding: "0 0 120px" }}>
      <div style={{ padding: "20px 20px 12px", fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Pending applications ({pending.length})</div>
      {pending.length === 0 && <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text3)" }}><div style={{ fontSize: 32, marginBottom: 12 }}>✓</div><div style={{ fontSize: 14 }}>No pending applications</div></div>}
      {pending.map(p => (
        <div key={p.id} style={{ margin: "0 16px 12px", background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 16, padding: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Rank #{p.ranking} · {p.tour} · {p.country}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{p.email}</div>
            {p.invite_code && <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4 }}>Invite: {p.invite_code}</div>}
          </div>
          {p.credential_url && (
            <a href={p.credential_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: 14 }}>
              <img src={p.credential_url} alt="" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }} />
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>↗ Tap to view full credential</div>
            </a>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => approve(p.id)} style={{ flex: 1, background: "var(--green)", color: "#000", border: "none", borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 700 }}>✓ Approve</button>
            <button onClick={() => reject(p.id)} style={{ flex: 1, background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 12, fontSize: 13 }}>✗ Reject</button>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── MAIN RENDER ───────────────────────────────────────────
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{CSS}</style>
      {editProfile && <ProfileModal />}

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border2)", background: "rgba(10,10,11,0.92)", position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(20px)" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.12em", color: "var(--green)", fontWeight: 700, textTransform: "uppercase" }}>PlayerCircle</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, color: "var(--green)", background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.2)" }}>#{player?.ranking} {player?.tour}</div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 0 }}>
        {tab === "feed" && <FeedTab />}
        {tab === "cities" && <CitiesTab />}
        {tab === "profile" && <ProfileTab />}
        {tab === "admin" && <AdminTab />}
      </div>

      <BottomNav />
    </div>
  );
}
