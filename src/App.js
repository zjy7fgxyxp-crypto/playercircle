import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://glcxzuadoelmouihsill.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3h6dWFkb2VsbW91aWhzaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjcyODcsImV4cCI6MjA4NzMwMzI4N30.VJ8T4Vodtd3f2W9JNQzFQXGYqq3m4TKT-FQYWL3rNcY"
);

const CITIES = [
  {
    name: "Melbourne",
    country: "Australia",
    tournament: "Australian Open",
    tips: [
      {
        category: "Training",
        text: "Melbourne Park has practice courts available 6am–8pm. Book via Tennis Australia portal.",
        icon: "🎾",
      },
      {
        category: "Recovery",
        text: "Stretch Lab in South Yarra — best physio for players. Ask for Marcus.",
        icon: "💆",
      },
      {
        category: "Food",
        text: "Tipo 00 in CBD for carb loading. Incredible pasta, player-friendly portions.",
        icon: "🍝",
      },
      {
        category: "Hotel",
        text: "Crown Towers gives 20% off during AO if you show your player credential.",
        icon: "🏨",
      },
    ],
  },
  {
    name: "Paris",
    country: "France",
    tournament: "Roland Garros",
    tips: [
      {
        category: "Training",
        text: "Racing Club de France in Bois de Boulogne — clay courts, very close to RG.",
        icon: "🎾",
      },
      {
        category: "Recovery",
        text: "Institut du Sport in 13ème — excellent cryotherapy and physio team.",
        icon: "💆",
      },
      {
        category: "Food",
        text: "Café de Flore for breakfast. Order the omelette. Avoid tourist traps near RG.",
        icon: "🥐",
      },
      {
        category: "Hotel",
        text: "Molitor Hotel has a pool and is 10 min from Roland Garros by bike.",
        icon: "🏨",
      },
    ],
  },
  {
    name: "London",
    country: "United Kingdom",
    tournament: "Wimbledon",
    tips: [
      {
        category: "Training",
        text: "National Tennis Centre in Roehampton — book 2 weeks in advance during June.",
        icon: "🎾",
      },
      {
        category: "Recovery",
        text: "Third Space gym in Soho — best equipped gym central London, open 6am.",
        icon: "💆",
      },
      {
        category: "Food",
        text: "Gymkhana for Indian food — high protein, no dairy options available.",
        icon: "🍛",
      },
      {
        category: "Hotel",
        text: "Cannizaro House in Wimbledon Village — walking distance, peaceful.",
        icon: "🏨",
      },
    ],
  },
  {
    name: "New York",
    country: "USA",
    tournament: "US Open",
    tips: [
      {
        category: "Training",
        text: "USTA Billie Jean King Center — players get access. Courts 8-17 less crowded.",
        icon: "🎾",
      },
      {
        category: "Recovery",
        text: "Equinox Sports Club on 61st — full recovery suite, cold plunge, sauna.",
        icon: "💆",
      },
      {
        category: "Food",
        text: "Carbone for Italian — get there early or book 3 weeks ahead.",
        icon: "🍷",
      },
      {
        category: "Hotel",
        text: "1 Hotel Brooklyn Bridge — great views, spa, 25 min from Flushing by Uber.",
        icon: "🏨",
      },
    ],
  },
  {
    name: "Miami",
    country: "USA",
    tournament: "Miami Open",
    tips: [
      {
        category: "Training",
        text: "Crandon Park Tennis Center — public courts next to the venue, very humid.",
        icon: "🎾",
      },
      {
        category: "Recovery",
        text: "Ice barrel sessions at Next Health Brickell — essential in Miami heat.",
        icon: "💆",
      },
      {
        category: "Food",
        text: "Zuma in Brickell — Japanese, light and clean. Popular with players every year.",
        icon: "🍱",
      },
      {
        category: "Hotel",
        text: "EAST Miami in Brickell — rooftop pool, 15 min Uber to Key Biscayne.",
        icon: "🏨",
      },
    ],
  },
];

const CATEGORY_COLORS = {
  Help: "#f59e0b",
  Tip: "#10b981",
  Rant: "#ef4444",
  Insight: "#6366f1",
};

export default function PlayerCircle() {
  const [screen, setScreen] = useState("landing");
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [form, setForm] = useState({
    name: "",
    country: "",
    ranking: "",
    tour: "ATP",
  });
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (screen === "home") fetchPosts();
  }, [screen]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPosts(data);
  };

  const handleVerify = () => {
    if (!form.name || !form.ranking) {
      setError("Please fill in your name and ranking first.");
      return;
    }
    setError("");
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2200);
  };

  const handleJoin = async () => {
    if (!verified) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("players")
      .insert([
        {
          name: form.name,
          country: form.country,
          ranking: parseInt(form.ranking),
          tour: form.tour,
        },
      ])
      .select()
      .single();
    setLoading(false);
    if (error) {
      setError("Something went wrong. Try again.");
      return;
    }
    setCurrentPlayer(data);
    setScreen("home");
  };

  const submitPost = async () => {
    if (!newPost.trim()) return;
    const postData = {
      author: currentPlayer?.name || form.name || "Anonymous",
      country: form.country || "🌍",
      ranking: parseInt(form.ranking) || 999,
      content: newPost,
      category: "Insight",
      likes: 0,
      replies: 0,
    };
    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select()
      .single();
    if (!error && data) {
      setPosts([data, ...posts]);
      setNewPost("");
    }
  };

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const s = {
    root: {
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#080c10",
      minHeight: "100vh",
      color: "#e8e4dc",
      display: "flex",
      flexDirection: "column",
    },
    landing: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      textAlign: "center",
      background: "radial-gradient(ellipse at 50% 0%, #0d2a1a 0%, #080c10 60%)",
      position: "relative",
      overflow: "hidden",
    },
    landingGrid: {
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      pointerEvents: "none",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(16,185,129,0.1)",
      border: "1px solid rgba(16,185,129,0.3)",
      borderRadius: "999px",
      padding: "6px 16px",
      marginBottom: "32px",
      fontSize: "11px",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#10b981",
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#10b981",
      animation: "pulse 2s infinite",
    },
    h1: {
      fontSize: "clamp(42px, 8vw, 80px)",
      fontWeight: 300,
      letterSpacing: "-0.03em",
      margin: "0 0 8px",
      lineHeight: 1.05,
      color: "#f0ece4",
      fontFamily: "'Playfair Display', Georgia, serif",
    },
    h1accent: { color: "#10b981", fontStyle: "italic" },
    sub: {
      fontSize: "16px",
      color: "#6b7280",
      maxWidth: "380px",
      lineHeight: 1.7,
      margin: "0 auto 48px",
    },
    ctaBtn: {
      background: "#10b981",
      color: "#000",
      border: "none",
      borderRadius: "4px",
      padding: "16px 48px",
      fontSize: "13px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "inherit",
      fontWeight: 700,
    },
    lockNote: {
      marginTop: "20px",
      fontSize: "11px",
      color: "#374151",
      letterSpacing: "0.08em",
    },
    formWrap: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      background: "#080c10",
    },
    formCard: {
      width: "100%",
      maxWidth: "420px",
      border: "1px solid #1f2937",
      borderRadius: "8px",
      padding: "40px",
      background: "#0d1117",
    },
    formTitle: {
      fontSize: "22px",
      fontWeight: 300,
      marginBottom: "8px",
      fontFamily: "'Playfair Display', Georgia, serif",
    },
    formSub: {
      fontSize: "12px",
      color: "#6b7280",
      marginBottom: "32px",
      letterSpacing: "0.05em",
    },
    label: {
      display: "block",
      fontSize: "10px",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#6b7280",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      background: "#080c10",
      border: "1px solid #1f2937",
      borderRadius: "4px",
      padding: "12px 14px",
      color: "#e8e4dc",
      fontSize: "14px",
      fontFamily: "inherit",
      boxSizing: "border-box",
      outline: "none",
      marginBottom: "20px",
    },
    tourToggle: { display: "flex", gap: "8px", marginBottom: "20px" },
    tourBtn: (active) => ({
      flex: 1,
      padding: "10px",
      border: `1px solid ${active ? "#10b981" : "#1f2937"}`,
      background: active ? "rgba(16,185,129,0.1)" : "transparent",
      color: active ? "#10b981" : "#6b7280",
      borderRadius: "4px",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "12px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    }),
    verifyBox: {
      border: `1px solid ${verified ? "#10b981" : "#1f2937"}`,
      borderRadius: "4px",
      padding: "16px",
      marginBottom: "24px",
      background: verified ? "rgba(16,185,129,0.05)" : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    verifyText: { fontSize: "12px", color: verified ? "#10b981" : "#6b7280" },
    verifyBtn: {
      background: "transparent",
      border: `1px solid ${verified ? "#10b981" : "#374151"}`,
      color: verified ? "#10b981" : "#9ca3af",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "11px",
      fontFamily: "inherit",
      letterSpacing: "0.1em",
    },
    primaryBtn: (disabled) => ({
      width: "100%",
      background: disabled ? "#1f2937" : "#10b981",
      color: disabled ? "#374151" : "#000",
      border: "none",
      borderRadius: "4px",
      padding: "14px",
      fontSize: "12px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      fontWeight: 700,
    }),
    backBtn: {
      background: "transparent",
      border: "none",
      color: "#6b7280",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "11px",
      marginBottom: "24px",
      padding: 0,
      letterSpacing: "0.05em",
    },
    errorMsg: { fontSize: "12px", color: "#ef4444", marginBottom: "16px" },
    topBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: "1px solid #111827",
      background: "#080c10",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    logo: {
      fontSize: "14px",
      letterSpacing: "0.15em",
      color: "#10b981",
      fontWeight: 700,
    },
    rankBadge: {
      background: "rgba(16,185,129,0.1)",
      border: "1px solid rgba(16,185,129,0.2)",
      borderRadius: "4px",
      padding: "4px 10px",
      fontSize: "11px",
      color: "#10b981",
    },
    tabs: {
      display: "flex",
      borderBottom: "1px solid #111827",
      background: "#080c10",
    },
    tab: (active) => ({
      flex: 1,
      padding: "14px 8px",
      textAlign: "center",
      fontSize: "10px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      cursor: "pointer",
      color: active ? "#10b981" : "#374151",
      borderBottom: active ? "2px solid #10b981" : "2px solid transparent",
      background: "transparent",
      border: "none",
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: active ? "#10b981" : "transparent",
      fontFamily: "inherit",
    }),
    content: { flex: 1, overflowY: "auto", padding: "0 0 80px" },
    postCompose: {
      margin: "16px",
      border: "1px solid #1f2937",
      borderRadius: "6px",
      padding: "14px",
      background: "#0d1117",
    },
    postInput: {
      width: "100%",
      background: "transparent",
      border: "none",
      color: "#e8e4dc",
      fontFamily: "inherit",
      fontSize: "13px",
      resize: "none",
      outline: "none",
      boxSizing: "border-box",
      minHeight: "60px",
    },
    postSubmit: {
      background: "#10b981",
      color: "#000",
      border: "none",
      borderRadius: "4px",
      padding: "8px 20px",
      fontSize: "11px",
      letterSpacing: "0.1em",
      cursor: "pointer",
      fontFamily: "inherit",
      fontWeight: 700,
    },
    filterRow: {
      display: "flex",
      gap: "8px",
      padding: "12px 16px",
      overflowX: "auto",
    },
    filterChip: (active) => ({
      whiteSpace: "nowrap",
      padding: "6px 14px",
      borderRadius: "999px",
      border: `1px solid ${active ? "#10b981" : "#1f2937"}`,
      background: active ? "rgba(16,185,129,0.1)" : "transparent",
      color: active ? "#10b981" : "#6b7280",
      fontSize: "11px",
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: "0.05em",
    }),
    postCard: {
      margin: "8px 16px",
      border: "1px solid #111827",
      borderRadius: "6px",
      padding: "16px",
      background: "#0d1117",
    },
    postHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#1f2937",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: 700,
      color: "#10b981",
      flexShrink: 0,
    },
    postAuthor: { fontSize: "13px", fontWeight: 700 },
    postMeta: { fontSize: "11px", color: "#4b5563" },
    catTag: (cat) => ({
      marginLeft: "auto",
      fontSize: "9px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: CATEGORY_COLORS[cat] || "#6b7280",
      border: `1px solid ${CATEGORY_COLORS[cat] || "#374151"}`,
      borderRadius: "4px",
      padding: "2px 8px",
    }),
    postContent: {
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#d1d5db",
      marginBottom: "12px",
    },
    postFooter: { display: "flex", gap: "16px" },
    postStat: { fontSize: "11px", color: "#4b5563" },
    emptyState: {
      textAlign: "center",
      padding: "60px 24px",
      color: "#374151",
      fontSize: "13px",
    },
    cityGrid: { padding: "16px", display: "grid", gap: "10px" },
    cityCard: {
      border: "1px solid #1f2937",
      borderRadius: "6px",
      padding: "16px",
      cursor: "pointer",
      background: "#0d1117",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cityName: {
      fontSize: "15px",
      fontWeight: 600,
      fontFamily: "'Playfair Display', Georgia, serif",
    },
    cityTournament: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },
    cityArrow: { fontSize: "18px", color: "#10b981" },
    tipsWrap: { padding: "0 16px 16px" },
    tipCard: {
      border: "1px solid #1f2937",
      borderRadius: "6px",
      padding: "14px",
      marginBottom: "8px",
      background: "#0d1117",
      display: "flex",
      gap: "12px",
    },
    tipIcon: { fontSize: "20px", flexShrink: 0, marginTop: "2px" },
    tipCat: {
      fontSize: "10px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#10b981",
      marginBottom: "4px",
    },
    tipText: { fontSize: "13px", lineHeight: 1.6, color: "#d1d5db" },
    backCityBtn: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "14px 16px",
      fontSize: "11px",
      color: "#6b7280",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      fontFamily: "inherit",
      letterSpacing: "0.05em",
    },
    profileWrap: { padding: "24px 16px" },
    profileHeader: {
      border: "1px solid #1f2937",
      borderRadius: "8px",
      padding: "24px",
      background: "#0d1117",
      marginBottom: "16px",
      textAlign: "center",
    },
    profileAvatar: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "rgba(16,185,129,0.1)",
      border: "2px solid #10b981",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      fontWeight: 700,
      color: "#10b981",
      margin: "0 auto 12px",
    },
    profileName: {
      fontSize: "20px",
      fontFamily: "'Playfair Display', Georgia, serif",
      marginBottom: "4px",
    },
    profileSub: { fontSize: "12px", color: "#6b7280" },
    statRow: { display: "flex", gap: "8px", marginTop: "16px" },
    statBox: {
      flex: 1,
      border: "1px solid #1f2937",
      borderRadius: "6px",
      padding: "12px",
      background: "#080c10",
      textAlign: "center",
    },
    statNum: { fontSize: "20px", fontWeight: 700, color: "#10b981" },
    statLabel: {
      fontSize: "10px",
      color: "#6b7280",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    verifiedRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      marginTop: "12px",
      fontSize: "11px",
      color: "#10b981",
    },
  };

  if (screen === "landing")
    return (
      <div style={s.root}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} *{margin:0;padding:0;box-sizing:border-box;}`}</style>
        <div style={s.landing}>
          <div style={s.landingGrid} />
          <div style={s.badge}>
            <div style={s.dot} />
            Verified players only
          </div>
          <h1 style={s.h1}>
            The circle
            <br />
            <span style={s.h1accent}>players trust.</span>
          </h1>
          <p style={s.sub}>
            A private network for ATP & WTA professionals. Real tips from real
            players, city by city, week by week.
          </p>
          <button style={s.ctaBtn} onClick={() => setScreen("register")}>
            Apply for access
          </button>
          <p style={s.lockNote}>🔒 Ranking-verified · Players-only community</p>
        </div>
      </div>
    );

  if (screen === "register")
    return (
      <div style={s.root}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap'); *{margin:0;padding:0;box-sizing:border-box;}`}</style>
        <div style={s.formWrap}>
          <div style={s.formCard}>
            <button style={s.backBtn} onClick={() => setScreen("landing")}>
              ← Back
            </button>
            <div style={s.formTitle}>Create your profile</div>
            <div style={s.formSub}>
              We verify every player against official ATP/WTA rankings before
              granting access.
            </div>
            <label style={s.label}>Full name</label>
            <input
              style={s.input}
              placeholder="As it appears on ATP/WTA profile"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label style={s.label}>Nationality</label>
            <input
              style={s.input}
              placeholder="e.g. Argentina"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <label style={s.label}>Current ranking</label>
            <input
              style={s.input}
              placeholder="e.g. 145"
              type="number"
              value={form.ranking}
              onChange={(e) => setForm({ ...form, ranking: e.target.value })}
            />
            <label style={s.label}>Tour</label>
            <div style={s.tourToggle}>
              {["ATP", "WTA"].map((t) => (
                <button
                  key={t}
                  style={s.tourBtn(form.tour === t)}
                  onClick={() => setForm({ ...form, tour: t })}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={s.verifyBox}>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    marginBottom: "2px",
                  }}
                >
                  Ranking verification
                </div>
                <div style={s.verifyText}>
                  {verified
                    ? "✓ Verified against ATP/WTA database"
                    : verifying
                    ? "Checking..."
                    : "Confirm you appear in rankings"}
                </div>
              </div>
              <button
                style={s.verifyBtn}
                onClick={handleVerify}
                disabled={verifying || verified}
              >
                {verified ? "✓" : verifying ? "..." : "Verify"}
              </button>
            </div>
            {error && <div style={s.errorMsg}>{error}</div>}
            <button
              style={s.primaryBtn(
                !verified || !form.name || !form.ranking || loading
              )}
              onClick={handleJoin}
              disabled={!verified || !form.name || !form.ranking || loading}
            >
              {loading ? "Joining..." : "Enter PlayerCircle"}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={s.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} button:hover{opacity:0.85}`}</style>
      <div style={s.topBar}>
        <div style={s.logo}>PLAYERCIRCLE</div>
        <div style={s.rankBadge}>
          #{form.ranking} {form.tour}
        </div>
      </div>
      <div style={s.tabs}>
        {[
          ["feed", "Feed"],
          ["cities", "Cities"],
          ["profile", "Profile"],
        ].map(([id, label]) => (
          <button
            key={id}
            style={s.tab(activeTab === id)}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={s.content}>
        {activeTab === "feed" && (
          <>
            <div style={s.postCompose}>
              <textarea
                style={s.postInput}
                placeholder="Share a tip, ask a question, or vent. Players only."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div style={{ textAlign: "right", paddingTop: "8px" }}>
                <button style={s.postSubmit} onClick={submitPost}>
                  Post
                </button>
              </div>
            </div>
            <div style={s.filterRow}>
              {["All", "Tip", "Help", "Rant", "Insight"].map((cat) => (
                <button
                  key={cat}
                  style={s.filterChip(selectedCategory === cat)}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <div style={s.emptyState}>
                No posts yet. Be the first to share something.
              </div>
            )}
            {filteredPosts.map((post) => (
              <div key={post.id} style={s.postCard}>
                <div style={s.postHeader}>
                  <div style={s.avatar}>
                    {(post.author || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={s.postAuthor}>{post.author}</div>
                    <div style={s.postMeta}>
                      Rank #{post.ranking} · {timeAgo(post.created_at)}
                    </div>
                  </div>
                  <div style={s.catTag(post.category)}>{post.category}</div>
                </div>
                <div style={s.postContent}>{post.content}</div>
                <div style={s.postFooter}>
                  <span style={s.postStat}>💬 {post.replies} replies</span>
                  <span style={s.postStat}>♥ {post.likes}</span>
                </div>
              </div>
            ))}
          </>
        )}
        {activeTab === "cities" && (
          <>
            {!selectedCity ? (
              <>
                <div
                  style={{
                    padding: "16px 16px 8px",
                    fontSize: "11px",
                    color: "#4b5563",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Player-verified city guides
                </div>
                <div style={s.cityGrid}>
                  {CITIES.map((city) => (
                    <div
                      key={city.name}
                      style={s.cityCard}
                      onClick={() => setSelectedCity(city)}
                    >
                      <div>
                        <div style={s.cityName}>{city.name}</div>
                        <div style={s.cityTournament}>
                          {city.tournament} · {city.country}
                        </div>
                      </div>
                      <div style={s.cityArrow}>→</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  style={s.backCityBtn}
                  onClick={() => setSelectedCity(null)}
                >
                  ← All cities
                </button>
                <div style={{ padding: "0 16px 16px" }}>
                  <div
                    style={{
                      fontSize: "22px",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedCity.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "20px",
                    }}
                  >
                    {selectedCity.tournament}
                  </div>
                  <div style={s.tipsWrap}>
                    {selectedCity.tips.map((tip, i) => (
                      <div key={i} style={s.tipCard}>
                        <div style={s.tipIcon}>{tip.icon}</div>
                        <div>
                          <div style={s.tipCat}>{tip.category}</div>
                          <div style={s.tipText}>{tip.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {activeTab === "profile" && (
          <div style={s.profileWrap}>
            <div style={s.profileHeader}>
              <div style={s.profileAvatar}>
                {(currentPlayer?.name || form.name || "P")[0].toUpperCase()}
              </div>
              <div style={s.profileName}>
                {currentPlayer?.name || form.name}
              </div>
              <div style={s.profileSub}>
                {form.country} · {form.tour}
              </div>
              <div style={s.verifiedRow}>
                ✓ Verified player · Rank #{form.ranking}
              </div>
              <div style={s.statRow}>
                <div style={s.statBox}>
                  <div style={s.statNum}>
                    {
                      posts.filter(
                        (p) => p.author === (currentPlayer?.name || form.name)
                      ).length
                    }
                  </div>
                  <div style={s.statLabel}>Posts</div>
                </div>
                <div style={s.statBox}>
                  <div style={s.statNum}>{CITIES.length}</div>
                  <div style={s.statLabel}>Cities</div>
                </div>
                <div style={s.statBox}>
                  <div style={s.statNum}>{form.ranking}</div>
                  <div style={s.statLabel}>Ranking</div>
                </div>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #1f2937",
                borderRadius: "6px",
                padding: "16px",
                background: "#0d1117",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                  marginBottom: "12px",
                }}
              >
                Member since
              </div>
              <div style={{ fontSize: "14px", color: "#d1d5db" }}>
                February 2026
              </div>
              <div
                style={{ fontSize: "11px", color: "#374151", marginTop: "4px" }}
              >
                Early access member
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
