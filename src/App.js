import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://glcxzuadoelmouihsill.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3h6dWFkb2VsbW91aWhzaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjcyODcsImV4cCI6MjA4NzMwMzI4N30.VJ8T4Vodtd3f2W9JNQzFQXGYqq3m4TKT-FQYWL3rNcY"
);

const ADMIN_EMAIL = "javierglocret@icloud.com";
const CATEGORY_COLORS = { Help:"#f59e0b", Tip:"#10b981", Rant:"#ef4444", Insight:"#6366f1" };
const CATEGORIES = ["Insight","Tip","Help","Rant"];
const TOURS = ["ATP","WTA"];

const CITIES = [
  { name:"Melbourne", country:"Australia", tournament:"Australian Open", tips:[{category:"Training",text:"Melbourne Park practice courts 6am–8pm. Book via Tennis Australia portal.",icon:"🎾"},{category:"Recovery",text:"Stretch Lab South Yarra — best physio. Ask for Marcus.",icon:"💆"},{category:"Food",text:"Tipo 00 CBD — incredible pasta, player-friendly portions.",icon:"🍝"},{category:"Hotel",text:"Crown Towers 20% off during AO with player credential.",icon:"🏨"}]},
  { name:"Paris", country:"France", tournament:"Roland Garros", tips:[{category:"Training",text:"Racing Club de France, Bois de Boulogne — clay courts near RG.",icon:"🎾"},{category:"Recovery",text:"Institut du Sport 13ème — cryotherapy and physio team.",icon:"💆"},{category:"Food",text:"Café de Flore breakfast. Order the omelette.",icon:"🥐"},{category:"Hotel",text:"Molitor Hotel — pool, 10 min from Roland Garros by bike.",icon:"🏨"}]},
  { name:"London", country:"United Kingdom", tournament:"Wimbledon", tips:[{category:"Training",text:"National Tennis Centre Roehampton — book 2 weeks ahead in June.",icon:"🎾"},{category:"Recovery",text:"Third Space Soho — best gym central London, open 6am.",icon:"💆"},{category:"Food",text:"Gymkhana — high protein Indian, no dairy options.",icon:"🍛"},{category:"Hotel",text:"Cannizaro House Wimbledon Village — walking distance.",icon:"🏨"}]},
  { name:"New York", country:"USA", tournament:"US Open", tips:[{category:"Training",text:"USTA Billie Jean King Center — Courts 8-17 less crowded.",icon:"🎾"},{category:"Recovery",text:"Equinox Sports Club 61st — cold plunge, sauna, full recovery.",icon:"💆"},{category:"Food",text:"Carbone — book 3 weeks ahead, worth every dollar.",icon:"🍷"},{category:"Hotel",text:"1 Hotel Brooklyn Bridge — 25 min Uber to Flushing.",icon:"🏨"}]},
  { name:"Miami", country:"USA", tournament:"Miami Open", tips:[{category:"Training",text:"Crandon Park Tennis Center — humid, go early.",icon:"🎾"},{category:"Recovery",text:"Next Health Brickell — ice barrels essential in Miami heat.",icon:"💆"},{category:"Food",text:"Zuma Brickell — light Japanese, popular with players.",icon:"🍱"},{category:"Hotel",text:"EAST Miami — rooftop pool, 15 min Uber to Key Biscayne.",icon:"🏨"}]},
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  *{margin:0;padding:0;box-sizing:border-box;}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#080c10}::-webkit-scrollbar-thumb{background:#1f2937;border-radius:2px}
  button:hover{opacity:0.85} input[type=file]{display:none} textarea{font-family:inherit}
  .post-card{animation:fadeIn 0.3s ease}
`;

const g = {
  root:{fontFamily:"'DM Mono','Courier New',monospace",background:"#080c10",minHeight:"100vh",color:"#e8e4dc",display:"flex",flexDirection:"column"},
  center:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",background:"#080c10"},
  card:{width:"100%",maxWidth:"440px",border:"1px solid #1f2937",borderRadius:"8px",padding:"40px",background:"#0d1117"},
  cardWide:{width:"100%",maxWidth:"480px",border:"1px solid #1f2937",borderRadius:"8px",padding:"40px",background:"#0d1117"},
  label:{display:"block",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"#6b7280",marginBottom:"6px"},
  input:{width:"100%",background:"#080c10",border:"1px solid #1f2937",borderRadius:"4px",padding:"12px 14px",color:"#e8e4dc",fontSize:"14px",fontFamily:"inherit",boxSizing:"border-box",outline:"none",marginBottom:"20px"},
  btn:(d)=>({width:"100%",background:d?"#1f2937":"#10b981",color:d?"#374151":"#000",border:"none",borderRadius:"4px",padding:"14px",fontSize:"12px",letterSpacing:"0.12em",textTransform:"uppercase",cursor:d?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:700}),
  btnSm:{background:"#10b981",color:"#000",border:"none",borderRadius:"4px",padding:"8px 18px",fontSize:"11px",letterSpacing:"0.08em",cursor:"pointer",fontFamily:"inherit",fontWeight:700},
  btnGhost:{background:"transparent",border:"1px solid #1f2937",color:"#6b7280",borderRadius:"4px",padding:"8px 16px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"},
  btnText:(color)=>({background:"transparent",border:"none",color:color||"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",padding:"0",letterSpacing:"0.03em"}),
  backBtn:{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:"11px",marginBottom:"24px",padding:0},
  tourBtn:(a)=>({flex:1,padding:"10px",border:`1px solid ${a?"#10b981":"#1f2937"}`,background:a?"rgba(16,185,129,0.1)":"transparent",color:a?"#10b981":"#6b7280",borderRadius:"4px",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",letterSpacing:"0.1em",textTransform:"uppercase"}),
  topBar:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid #111827",background:"#080c10",position:"sticky",top:0,zIndex:10},
  tabs:{display:"flex",borderBottom:"1px solid #111827",background:"#080c10"},
  tab:(a)=>({flex:1,padding:"14px 8px",textAlign:"center",fontSize:"10px",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",color:a?"#10b981":"#374151",background:"transparent",border:"none",borderBottomWidth:"2px",borderBottomStyle:"solid",borderBottomColor:a?"#10b981":"transparent",fontFamily:"inherit"}),
  content:{flex:1,overflowY:"auto",padding:"0 0 80px"},
  avatar:(size)=>({width:size||36,height:size||36,borderRadius:"50%",background:"#1f2937",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size?size*0.38:13,fontWeight:700,color:"#10b981",flexShrink:0}),
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"24px"},
  modalCard:{width:"100%",maxWidth:"400px",background:"#0d1117",border:"1px solid #1f2937",borderRadius:"8px",padding:"24px"},
  error:{fontSize:"12px",color:"#ef4444",marginBottom:"16px"},
  success:{fontSize:"12px",color:"#10b981",marginBottom:"16px"},
};

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [activeTab, setActiveTab] = useState("feed");
  const [session, setSession] = useState(null);
  const [player, setPlayer] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLikes, setMyLikes] = useState(new Set());

  // Auth
  const [loginForm, setLoginForm] = useState({email:"",password:""});
  const [regForm, setRegForm] = useState({name:"",country:"",ranking:"",tour:"ATP",email:"",password:""});
  const [credFile, setCredFile] = useState(null);
  const [credPreview, setCredPreview] = useState(null);

  // Feed compose
  const [postText, setPostText] = useState("");
  const [postCategory, setPostCategory] = useState("Insight");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const mediaInputRef = useRef();

  // Post actions
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [postMenuOpen, setPostMenuOpen] = useState(null);

  // Profile edit
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({name:"",country:"",ranking:"",tour:"ATP"});

  // Invite
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const inviteFromUrl = new URLSearchParams(window.location.search).get("invite") || "";

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      setSession(session);
      if (session) fetchPlayer(session.user.id);
      else setScreen("landing");
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_e,session) => {
      setSession(session);
      if (session) fetchPlayer(session.user.id);
      else setScreen("landing");
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const close = () => setPostMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const fetchPlayer = async (userId) => {
    const {data} = await supabase.from("players").select("*").eq("user_id", userId).single();
    if (data) {
      setPlayer(data);
      if (data.status === "approved") { await fetchPosts(); await fetchMyLikes(userId); setScreen("home"); }
      else setScreen("pending");
    } else setScreen("landing");
  };

  const fetchPosts = async () => {
    const {data} = await supabase.from("posts").select("*").order("created_at", {ascending:false});
    if (data) setPosts(data);
  };

  const fetchMyLikes = async (userId) => {
    const {data} = await supabase.from("post_likes").select("post_id").eq("user_id", userId);
    if (data) setMyLikes(new Set(data.map(l => l.post_id)));
  };

  const fetchComments = async (postId) => {
    const {data} = await supabase.from("comments").select("*").eq("post_id", postId).order("created_at", {ascending:true});
    if (data) setComments(c => ({...c, [postId]: data}));
  };

  const fetchPendingPlayers = async () => {
    const {data} = await supabase.from("players").select("*").eq("status","pending").order("created_at",{ascending:false});
    if (data) setPendingPlayers(data);
  };

  // AUTH
  const handleLogin = async () => {
    setError(""); setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({email:loginForm.email, password:loginForm.password});
    setLoading(false);
    if (error) setError("Invalid email or password.");
  };

  const handleCredFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setCredFile(file);
    const r = new FileReader(); r.onloadend = () => setCredPreview(r.result); r.readAsDataURL(file);
  };

  const handleRegister = async () => {
    if (!regForm.name||!regForm.ranking||!regForm.email||!regForm.password) { setError("Please fill in all fields."); return; }
    if (!credFile) { setError("Please upload your ATP/WTA credential photo."); return; }
    if (regForm.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    const {data:authData, error:authError} = await supabase.auth.signUp({email:regForm.email, password:regForm.password});
    if (authError) { setError(authError.message); setLoading(false); return; }
    const ext = credFile.name.split(".").pop();
    const fileName = `${authData.user.id}.${ext}`;
    await supabase.storage.from("credentials").upload(fileName, credFile);
    const {data:urlData} = supabase.storage.from("credentials").getPublicUrl(fileName);
    await supabase.from("players").insert([{user_id:authData.user.id, name:regForm.name, country:regForm.country, ranking:parseInt(regForm.ranking), tour:regForm.tour, email:regForm.email, status:"pending", credential_url:urlData.publicUrl, invite_code:inviteFromUrl||null}]);
    setLoading(false); setScreen("pending");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); setPlayer(null); setSession(null); setScreen("landing");
  };

  // PROFILE
  const saveProfile = async () => {
    setLoading(true);
    const {data} = await supabase.from("players").update({name:profileForm.name, country:profileForm.country, ranking:parseInt(profileForm.ranking), tour:profileForm.tour}).eq("id",player.id).select().single();
    setLoading(false);
    if (data) { setPlayer(data); setEditingProfile(false); setSuccessMsg("Profile updated!"); setTimeout(()=>setSuccessMsg(""),3000); }
  };

  // MEDIA
  const handleMediaFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setMediaFile(file);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    const r = new FileReader(); r.onloadend = () => setMediaPreview(r.result); r.readAsDataURL(file);
  };

  const removeMedia = () => { setMediaFile(null); setMediaPreview(null); setMediaType(null); };

  // POSTS
  const submitPost = async () => {
    if (!postText.trim() && !mediaFile) return;
    let media_url = null; let media_type_val = null;
    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const fileName = `posts/${Date.now()}.${ext}`;
      await supabase.storage.from("credentials").upload(fileName, mediaFile);
      const {data:urlData} = supabase.storage.from("credentials").getPublicUrl(fileName);
      media_url = urlData.publicUrl; media_type_val = mediaType;
    }
    const {data} = await supabase.from("posts").insert([{author:player.name, country:player.country, ranking:player.ranking, content:postText, category:postCategory, likes:0, replies:0, user_id:player.user_id, media_url, media_type:media_type_val}]).select().single();
    if (data) { setPosts([data,...posts]); setPostText(""); setPostCategory("Insight"); removeMedia(); }
  };

  const deletePost = async (postId) => {
    await supabase.from("posts").delete().eq("id",postId);
    setPosts(posts.filter(p=>p.id!==postId));
    setPostMenuOpen(null);
  };

  const saveEditPost = async (postId) => {
    const {data} = await supabase.from("posts").update({content:editText}).eq("id",postId).select().single();
    if (data) { setPosts(posts.map(p=>p.id===postId?data:p)); setEditingPost(null); setPostMenuOpen(null); }
  };

  const toggleLike = async (post) => {
    const userId = player.user_id;
    if (myLikes.has(post.id)) {
      await supabase.from("post_likes").delete().eq("post_id",post.id).eq("user_id",userId);
      const newLikes = Math.max(0,(post.likes||0)-1);
      await supabase.from("posts").update({likes:newLikes}).eq("id",post.id);
      setPosts(posts.map(p=>p.id===post.id?{...p,likes:newLikes}:p));
      setMyLikes(s=>{const n=new Set(s);n.delete(post.id);return n;});
    } else {
      await supabase.from("post_likes").insert([{post_id:post.id,user_id:userId}]);
      const newLikes = (post.likes||0)+1;
      await supabase.from("posts").update({likes:newLikes}).eq("id",post.id);
      setPosts(posts.map(p=>p.id===post.id?{...p,likes:newLikes}:p));
      setMyLikes(s=>new Set([...s,post.id]));
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(s=>({...s,[postId]:!s[postId]}));
    if (!comments[postId]) fetchComments(postId);
  };

  const submitComment = async (postId) => {
    const text = commentText[postId]; if (!text?.trim()) return;
    const {data} = await supabase.from("comments").insert([{post_id:postId, author:player.name, ranking:player.ranking, content:text, user_id:player.user_id}]).select().single();
    if (data) {
      setComments(c=>({...c,[postId]:[...(c[postId]||[]),data]}));
      setCommentText(ct=>({...ct,[postId]:""}));
      const newReplies = (posts.find(p=>p.id===postId)?.replies||0)+1;
      await supabase.from("posts").update({replies:newReplies}).eq("id",postId);
      setPosts(posts.map(p=>p.id===postId?{...p,replies:newReplies}:p));
    }
  };

  const deleteComment = async (postId, commentId) => {
    await supabase.from("comments").delete().eq("id",commentId);
    setComments(c=>({...c,[postId]:(c[postId]||[]).filter(cm=>cm.id!==commentId)}));
    const newReplies = Math.max(0,(posts.find(p=>p.id===postId)?.replies||0)-1);
    await supabase.from("posts").update({replies:newReplies}).eq("id",postId);
    setPosts(posts.map(p=>p.id===postId?{...p,replies:newReplies}:p));
  };

  const saveEditComment = async (postId, commentId) => {
    const {data} = await supabase.from("comments").update({content:editCommentText}).eq("id",commentId).select().single();
    if (data) { setComments(c=>({...c,[postId]:(c[postId]||[]).map(cm=>cm.id===commentId?data:cm)})); setEditingComment(null); }
  };

  // ADMIN
  const approvePlayer = async (id) => { await supabase.from("players").update({status:"approved"}).eq("id",id); fetchPendingPlayers(); };
  const rejectPlayer = async (id) => { await supabase.from("players").update({status:"rejected"}).eq("id",id); fetchPendingPlayers(); };

  const generateInvite = () => {
    if (!inviteEmail.trim()) return;
    const code = Math.random().toString(36).substring(2,10).toUpperCase();
    setInviteLink(`${window.location.origin}?invite=${code}`);
  };

  const timeAgo = (d) => {
    const diff = (Date.now()-new Date(d))/1000;
    if (diff<60) return "Just now";
    if (diff<3600) return `${Math.floor(diff/60)}m`;
    if (diff<86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  };

  const filteredPosts = selectedCategory==="All"?posts:posts.filter(p=>p.category===selectedCategory);
  const isAdmin = session?.user?.email===ADMIN_EMAIL;
  const isMyPost = (post) => post.user_id===player?.user_id;
  const isMyComment = (comment) => comment.user_id===player?.user_id;

  if (screen==="loading") return <div style={{...g.root,alignItems:"center",justifyContent:"center"}}><style>{CSS}</style><div style={{color:"#374151",fontSize:"13px"}}>Loading...</div></div>;

  if (screen==="landing") return (
    <div style={g.root}><style>{CSS}</style>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center",background:"radial-gradient(ellipse at 50% 0%, #0d2a1a 0%, #080c10 60%)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:"999px",padding:"6px 16px",marginBottom:"32px",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"#10b981"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#10b981",animation:"pulse 2s infinite"}}/>Verified players only
        </div>
        <h1 style={{fontSize:"clamp(42px,8vw,80px)",fontWeight:300,letterSpacing:"-0.03em",margin:"0 0 8px",lineHeight:1.05,color:"#f0ece4",fontFamily:"'Playfair Display',Georgia,serif"}}>The circle<br/><span style={{color:"#10b981",fontStyle:"italic"}}>players trust.</span></h1>
        <p style={{fontSize:"16px",color:"#6b7280",maxWidth:"380px",lineHeight:1.7,margin:"0 auto 48px"}}>A private network for ATP & WTA professionals. Verified players only.</p>
        <div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center"}}>
          <button style={{background:"#10b981",color:"#000",border:"none",borderRadius:"4px",padding:"16px 40px",fontSize:"13px",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",fontWeight:700}} onClick={()=>{setError("");setScreen("register");}}>Apply for access</button>
          <button style={{background:"transparent",color:"#10b981",border:"1px solid #10b981",borderRadius:"4px",padding:"16px 40px",fontSize:"13px",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",fontWeight:700}} onClick={()=>{setError("");setScreen("login");}}>Sign in</button>
        </div>
        <p style={{marginTop:"20px",fontSize:"11px",color:"#374151"}}>🔒 Manual verification · Invite or apply</p>
      </div>
    </div>
  );

  if (screen==="login") return (
    <div style={g.root}><style>{CSS}</style>
      <div style={g.center}><div style={g.card}>
        <button style={g.backBtn} onClick={()=>setScreen("landing")}>← Back</button>
        <div style={{fontSize:"22px",fontWeight:300,marginBottom:"8px",fontFamily:"'Playfair Display',Georgia,serif"}}>Welcome back</div>
        <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"32px"}}>Sign in to your PlayerCircle account.</div>
        <label style={g.label}>Email</label>
        <input style={g.input} type="email" placeholder="your@email.com" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})}/>
        <label style={g.label}>Password</label>
        <input style={g.input} type="password" placeholder="••••••••" value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>
        {error&&<div style={g.error}>{error}</div>}
        <button style={g.btn(loading)} onClick={handleLogin} disabled={loading}>{loading?"Signing in...":"Sign in"}</button>
        <div style={{textAlign:"center",marginTop:"20px",fontSize:"12px",color:"#6b7280"}}>No account? <button style={g.btnText("#10b981")} onClick={()=>{setError("");setScreen("register");}}>Apply for access</button></div>
      </div></div>
    </div>
  );

  if (screen==="register") return (
    <div style={g.root}><style>{CSS}</style>
      <div style={g.center}><div style={g.cardWide}>
        <button style={g.backBtn} onClick={()=>setScreen("landing")}>← Back</button>
        <div style={{fontSize:"22px",fontWeight:300,marginBottom:"8px",fontFamily:"'Playfair Display',Georgia,serif"}}>Apply for access</div>
        <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"32px"}}>We manually verify every player. You'll be notified once approved.</div>
        <label style={g.label}>Full name (as on ATP/WTA profile)</label>
        <input style={g.input} placeholder="e.g. Sebastian Báez" value={regForm.name} onChange={e=>setRegForm({...regForm,name:e.target.value})}/>
        <label style={g.label}>Nationality</label>
        <input style={g.input} placeholder="e.g. Argentina" value={regForm.country} onChange={e=>setRegForm({...regForm,country:e.target.value})}/>
        <label style={g.label}>Current ranking</label>
        <input style={g.input} placeholder="e.g. 145" type="number" value={regForm.ranking} onChange={e=>setRegForm({...regForm,ranking:e.target.value})}/>
        <label style={g.label}>Tour</label>
        <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
          {TOURS.map(t=><button key={t} style={g.tourBtn(regForm.tour===t)} onClick={()=>setRegForm({...regForm,tour:t})}>{t}</button>)}
        </div>
        <label style={g.label}>ATP/WTA Credential photo</label>
        <div style={{marginBottom:"20px"}}>
          <label htmlFor="credUpload" style={{display:"block",border:"1px dashed #1f2937",borderRadius:"4px",padding:"20px",textAlign:"center",cursor:"pointer",color:credFile?"#10b981":"#6b7280",fontSize:"12px"}}>
            {credFile?`✓ ${credFile.name}`:"Click to upload your player credential"}
          </label>
          <input id="credUpload" type="file" accept="image/*" onChange={handleCredFile}/>
          {credPreview&&<img src={credPreview} alt="preview" style={{width:"100%",marginTop:"8px",borderRadius:"4px",border:"1px solid #1f2937",maxHeight:"120px",objectFit:"cover"}}/>}
        </div>
        <label style={g.label}>Email</label>
        <input style={g.input} type="email" placeholder="your@email.com" value={regForm.email} onChange={e=>setRegForm({...regForm,email:e.target.value})}/>
        <label style={g.label}>Password</label>
        <input style={g.input} type="password" placeholder="Min. 6 characters" value={regForm.password} onChange={e=>setRegForm({...regForm,password:e.target.value})}/>
        {inviteFromUrl&&<div style={{fontSize:"11px",color:"#10b981",marginBottom:"16px"}}>✓ Invited with code: {inviteFromUrl}</div>}
        {error&&<div style={g.error}>{error}</div>}
        <button style={g.btn(loading)} onClick={handleRegister} disabled={loading}>{loading?"Submitting...":"Submit application"}</button>
        <div style={{textAlign:"center",marginTop:"20px",fontSize:"12px",color:"#6b7280"}}>Already a member? <button style={g.btnText("#10b981")} onClick={()=>{setError("");setScreen("login");}}>Sign in</button></div>
      </div></div>
    </div>
  );

  if (screen==="pending") return (
    <div style={g.root}><style>{CSS}</style>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
        <div style={{fontSize:"48px",marginBottom:"24px"}}>⏳</div>
        <div style={{fontSize:"22px",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:"12px"}}>Application under review</div>
        <div style={{fontSize:"14px",color:"#6b7280",maxWidth:"340px",lineHeight:1.7,marginBottom:"32px"}}>We're verifying your ATP/WTA credentials. You'll receive an email once approved. Usually 24-48 hours.</div>
        <button style={g.btnGhost} onClick={handleLogout}>Sign out</button>
      </div>
    </div>
  );

  // EDIT PROFILE MODAL
  const ProfileModal = () => (
    <div style={g.modal}>
      <div style={g.modalCard}>
        <div style={{fontSize:"16px",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:"20px"}}>Edit profile</div>
        <label style={g.label}>Full name</label>
        <input style={g.input} value={profileForm.name} onChange={e=>setProfileForm({...profileForm,name:e.target.value})}/>
        <label style={g.label}>Nationality</label>
        <input style={g.input} value={profileForm.country} onChange={e=>setProfileForm({...profileForm,country:e.target.value})}/>
        <label style={g.label}>Current ranking</label>
        <input style={g.input} type="number" value={profileForm.ranking} onChange={e=>setProfileForm({...profileForm,ranking:e.target.value})}/>
        <label style={g.label}>Tour</label>
        <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
          {TOURS.map(t=><button key={t} style={g.tourBtn(profileForm.tour===t)} onClick={()=>setProfileForm({...profileForm,tour:t})}>{t}</button>)}
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button style={g.btn(loading)} onClick={saveProfile}>{loading?"Saving...":"Save changes"}</button>
          <button style={{...g.btnGhost,flex:1}} onClick={()=>setEditingProfile(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  // ADMIN
  if (activeTab==="admin") return (
    <div style={g.root}><style>{CSS}</style>
      <div style={g.topBar}>
        <div style={{fontSize:"14px",letterSpacing:"0.15em",color:"#10b981",fontWeight:700}}>PLAYERCIRCLE</div>
        <div style={{fontSize:"11px",color:"#f59e0b",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:"4px",padding:"4px 10px"}}>Admin</div>
      </div>
      <div style={g.tabs}>
        {[["feed","Feed"],["cities","Cities"],["profile","Profile"],["admin","Admin"]].map(([id,lbl])=>(
          <button key={id} style={g.tab(activeTab===id)} onClick={()=>{setActiveTab(id);if(id==="admin")fetchPendingPlayers();}}>{lbl}</button>
        ))}
      </div>
      <div style={g.content}>
        <div style={{padding:"16px 16px 8px",fontSize:"11px",color:"#4b5563",letterSpacing:"0.1em",textTransform:"uppercase"}}>Pending applications ({pendingPlayers.length})</div>
        {pendingPlayers.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#374151",fontSize:"13px"}}>No pending applications.</div>}
        {pendingPlayers.map(p=>(
          <div key={p.id} style={{margin:"8px 16px",border:"1px solid #1f2937",borderRadius:"6px",padding:"16px",background:"#0d1117"}}>
            <div style={{marginBottom:"12px"}}>
              <div style={{fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>{p.name}</div>
              <div style={{fontSize:"11px",color:"#6b7280"}}>Rank #{p.ranking} · {p.tour} · {p.country}</div>
              <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{p.email}</div>
              {p.invite_code&&<div style={{fontSize:"11px",color:"#6366f1",marginTop:"4px"}}>Invite: {p.invite_code}</div>}
            </div>
            {p.credential_url&&(
              <a href={p.credential_url} target="_blank" rel="noopener noreferrer" style={{display:"block",marginBottom:"12px"}}>
                <img src={p.credential_url} alt="credential" style={{width:"100%",maxHeight:"150px",objectFit:"cover",borderRadius:"4px",border:"1px solid #1f2937"}}/>
                <div style={{fontSize:"10px",color:"#6b7280",marginTop:"4px"}}>Click to view full credential</div>
              </a>
            )}
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>approvePlayer(p.id)} style={{flex:1,background:"#10b981",color:"#000",border:"none",borderRadius:"4px",padding:"10px",fontSize:"11px",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✓ Approve</button>
              <button onClick={()=>rejectPlayer(p.id)} style={{flex:1,background:"transparent",color:"#ef4444",border:"1px solid #ef4444",borderRadius:"4px",padding:"10px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>✗ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // MAIN HOME
  return (
    <div style={g.root}>
      <style>{CSS}</style>
      {editingProfile&&<ProfileModal/>}
      <div style={g.topBar}>
        <div style={{fontSize:"14px",letterSpacing:"0.15em",color:"#10b981",fontWeight:700}}>PLAYERCIRCLE</div>
        <div style={{fontSize:"11px",color:"#10b981",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"4px",padding:"4px 10px"}}>#{player?.ranking} {player?.tour}</div>
      </div>
      <div style={g.tabs}>
        {[["feed","Feed"],["cities","Cities"],["profile","Profile"],...(isAdmin?[["admin","Admin"]]:[])] .map(([id,lbl])=>(
          <button key={id} style={g.tab(activeTab===id)} onClick={()=>{setActiveTab(id);if(id==="admin")fetchPendingPlayers();}}>{lbl}</button>
        ))}
      </div>
      <div style={g.content}>

        {/* ── FEED ── */}
        {activeTab==="feed"&&(
          <>
            {/* Compose */}
            <div style={{margin:"16px",border:"1px solid #1f2937",borderRadius:"8px",padding:"16px",background:"#0d1117"}}>
              <div style={{display:"flex",gap:"10px",marginBottom:"12px"}}>
                <div style={g.avatar(36)}>{(player?.name||"P")[0].toUpperCase()}</div>
                <textarea style={{flex:1,background:"transparent",border:"none",color:"#e8e4dc",fontSize:"13px",resize:"none",outline:"none",minHeight:"60px",lineHeight:1.6}} placeholder="What's on your mind? Tips, questions, rants..." value={postText} onChange={e=>setPostText(e.target.value)}/>
              </div>
              {mediaPreview&&(
                <div style={{position:"relative",marginBottom:"12px"}}>
                  {mediaType==="video"
                    ?<video src={mediaPreview} controls style={{width:"100%",borderRadius:"6px",border:"1px solid #1f2937",maxHeight:"200px"}}/>
                    :<img src={mediaPreview} alt="preview" style={{width:"100%",borderRadius:"6px",border:"1px solid #1f2937",maxHeight:"200px",objectFit:"cover"}}/>
                  }
                  <button onClick={removeMedia} style={{position:"absolute",top:"8px",right:"8px",background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid #111827",paddingTop:"10px"}}>
                <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
                  <button onClick={()=>mediaInputRef.current?.click()} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",padding:0}}>📷 Photo/Video</button>
                  <input ref={mediaInputRef} type="file" accept="image/*,video/*" onChange={handleMediaFile}/>
                  <select value={postCategory} onChange={e=>setPostCategory(e.target.value)} style={{background:"#080c10",border:"1px solid #1f2937",color:"#6b7280",borderRadius:"4px",padding:"4px 8px",fontFamily:"inherit",fontSize:"11px"}}>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button style={g.btnSm} onClick={submitPost}>Post</button>
              </div>
            </div>

            {/* Filters */}
            <div style={{display:"flex",gap:"8px",padding:"8px 16px",overflowX:"auto"}}>
              {["All","Tip","Help","Rant","Insight"].map(cat=>(
                <button key={cat} style={{whiteSpace:"nowrap",padding:"5px 14px",borderRadius:"999px",border:`1px solid ${selectedCategory===cat?"#10b981":"#1f2937"}`,background:selectedCategory===cat?"rgba(16,185,129,0.1)":"transparent",color:selectedCategory===cat?"#10b981":"#6b7280",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setSelectedCategory(cat)}>{cat}</button>
              ))}
            </div>

            {filteredPosts.length===0&&<div style={{textAlign:"center",padding:"60px 24px",color:"#374151",fontSize:"13px"}}>No posts yet. Be the first.</div>}

            {filteredPosts.map(post=>(
              <div key={post.id} className="post-card" style={{margin:"8px 16px",border:"1px solid #111827",borderRadius:"8px",background:"#0d1117",overflow:"hidden"}}>
                {/* Post header */}
                <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"14px 16px 0"}}>
                  <div style={g.avatar(38)}>{(post.author||"?")[0].toUpperCase()}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"13px",fontWeight:700}}>{post.author}</div>
                    <div style={{fontSize:"11px",color:"#4b5563"}}>Rank #{post.ranking} · {timeAgo(post.created_at)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <div style={{fontSize:"9px",letterSpacing:"0.08em",textTransform:"uppercase",color:CATEGORY_COLORS[post.category]||"#6b7280",border:`1px solid ${CATEGORY_COLORS[post.category]||"#374151"}`,borderRadius:"4px",padding:"2px 8px"}}>{post.category}</div>
                    {isMyPost(post)&&(
                      <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>setPostMenuOpen(postMenuOpen===post.id?null:post.id)} style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:"16px",padding:"0 4px",lineHeight:1}}>···</button>
                        {postMenuOpen===post.id&&(
                          <div style={{position:"absolute",right:0,top:"100%",background:"#0d1117",border:"1px solid #1f2937",borderRadius:"6px",padding:"4px",zIndex:10,minWidth:"120px"}}>
                            <button onClick={()=>{setEditingPost(post.id);setEditText(post.content);setPostMenuOpen(null);}} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",color:"#d1d5db",padding:"8px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:"12px"}}>Edit post</button>
                            <button onClick={()=>deletePost(post.id)} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",color:"#ef4444",padding:"8px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:"12px"}}>Delete post</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Post content */}
                <div style={{padding:"12px 16px"}}>
                  {editingPost===post.id?(
                    <>
                      <textarea style={{width:"100%",background:"#080c10",border:"1px solid #1f2937",borderRadius:"4px",color:"#e8e4dc",fontSize:"13px",padding:"10px",resize:"none",outline:"none",minHeight:"80px",marginBottom:"8px",fontFamily:"inherit"}} value={editText} onChange={e=>setEditText(e.target.value)}/>
                      <div style={{display:"flex",gap:"8px"}}>
                        <button style={g.btnSm} onClick={()=>saveEditPost(post.id)}>Save</button>
                        <button style={g.btnGhost} onClick={()=>setEditingPost(null)}>Cancel</button>
                      </div>
                    </>
                  ):(
                    <div style={{fontSize:"13px",lineHeight:1.7,color:"#d1d5db"}}>{post.content}</div>
                  )}
                </div>

                {/* Media */}
                {post.media_url&&(
                  <div style={{margin:"0 16px 12px"}}>
                    {post.media_type==="video"
                      ?<video src={post.media_url} controls style={{width:"100%",borderRadius:"6px",border:"1px solid #1f2937",maxHeight:"300px"}}/>
                      :<img src={post.media_url} alt="post media" style={{width:"100%",borderRadius:"6px",border:"1px solid #1f2937",maxHeight:"300px",objectFit:"cover"}}/>
                    }
                  </div>
                )}

                {/* Actions */}
                <div style={{display:"flex",alignItems:"center",gap:"4px",padding:"8px 16px 12px",borderTop:"1px solid #111827"}}>
                  <button onClick={()=>toggleLike(post)} style={{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",color:myLikes.has(post.id)?"#ef4444":"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",padding:"6px 10px",borderRadius:"6px",transition:"background 0.15s"}}>
                    {myLikes.has(post.id)?"❤️":"🤍"} {post.likes||0}
                  </button>
                  <button onClick={()=>toggleComments(post.id)} style={{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",padding:"6px 10px",borderRadius:"6px"}}>
                    💬 {post.replies||0}
                  </button>
                </div>

                {/* Comments */}
                {expandedComments[post.id]&&(
                  <div style={{borderTop:"1px solid #111827",padding:"12px 16px",background:"rgba(0,0,0,0.2)"}}>
                    {(comments[post.id]||[]).length===0&&<div style={{fontSize:"12px",color:"#374151",marginBottom:"12px"}}>No replies yet.</div>}
                    {(comments[post.id]||[]).map(c=>(
                      <div key={c.id} style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
                        <div style={g.avatar(28)}>{(c.author||"?")[0].toUpperCase()}</div>
                        <div style={{flex:1,background:"#080c10",borderRadius:"8px",padding:"8px 12px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                            <span style={{fontSize:"11px",fontWeight:700}}>{c.author} <span style={{color:"#4b5563",fontWeight:400}}>#{c.ranking}</span></span>
                            {isMyComment(c)&&(
                              <div style={{display:"flex",gap:"8px"}}>
                                <button onClick={()=>{setEditingComment(c.id);setEditCommentText(c.content);}} style={g.btnText("#6b7280")} className="text-xs">Edit</button>
                                <button onClick={()=>deleteComment(post.id,c.id)} style={g.btnText("#ef4444")} className="text-xs">Delete</button>
                              </div>
                            )}
                          </div>
                          {editingComment===c.id?(
                            <div>
                              <input style={{...g.input,marginBottom:"8px",fontSize:"12px",padding:"6px 10px"}} value={editCommentText} onChange={e=>setEditCommentText(e.target.value)}/>
                              <div style={{display:"flex",gap:"6px"}}>
                                <button style={{...g.btnSm,padding:"4px 12px",fontSize:"10px"}} onClick={()=>saveEditComment(post.id,c.id)}>Save</button>
                                <button style={{...g.btnGhost,padding:"4px 12px",fontSize:"10px"}} onClick={()=>setEditingComment(null)}>Cancel</button>
                              </div>
                            </div>
                          ):(
                            <div style={{fontSize:"12px",color:"#d1d5db",lineHeight:1.5}}>{c.content}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div style={{display:"flex",gap:"8px",alignItems:"center",marginTop:"8px"}}>
                      <div style={g.avatar(28)}>{(player?.name||"P")[0].toUpperCase()}</div>
                      <input style={{...g.input,marginBottom:0,flex:1,fontSize:"12px",padding:"8px 12px",borderRadius:"999px"}} placeholder="Write a reply..." value={commentText[post.id]||""} onChange={e=>setCommentText(ct=>({...ct,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submitComment(post.id)}/>
                      <button style={g.btnSm} onClick={()=>submitComment(post.id)}>↑</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── CITIES ── */}
        {activeTab==="cities"&&(
          <>
            {!selectedCity?(
              <>
                <div style={{padding:"16px 16px 8px",fontSize:"11px",color:"#4b5563",letterSpacing:"0.1em",textTransform:"uppercase"}}>Player-verified city guides</div>
                <div style={{padding:"0 16px",display:"grid",gap:"10px"}}>
                  {CITIES.map(city=>(
                    <div key={city.name} style={{border:"1px solid #1f2937",borderRadius:"6px",padding:"16px",cursor:"pointer",background:"#0d1117",display:"flex",alignItems:"center",justifyContent:"space-between"}} onClick={()=>setSelectedCity(city)}>
                      <div>
                        <div style={{fontSize:"15px",fontWeight:600,fontFamily:"'Playfair Display',Georgia,serif"}}>{city.name}</div>
                        <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{city.tournament} · {city.country}</div>
                      </div>
                      <div style={{fontSize:"18px",color:"#10b981"}}>→</div>
                    </div>
                  ))}
                </div>
              </>
            ):(
              <>
                <button style={{display:"flex",alignItems:"center",gap:"6px",padding:"14px 16px",fontSize:"11px",color:"#6b7280",cursor:"pointer",background:"transparent",border:"none",fontFamily:"inherit"}} onClick={()=>setSelectedCity(null)}>← All cities</button>
                <div style={{padding:"0 16px 16px"}}>
                  <div style={{fontSize:"22px",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:"4px"}}>{selectedCity.name}</div>
                  <div style={{fontSize:"12px",color:"#6b7280",marginBottom:"20px"}}>{selectedCity.tournament}</div>
                  {selectedCity.tips.map((tip,i)=>(
                    <div key={i} style={{border:"1px solid #1f2937",borderRadius:"6px",padding:"14px",marginBottom:"8px",background:"#0d1117",display:"flex",gap:"12px"}}>
                      <div style={{fontSize:"20px",flexShrink:0}}>{tip.icon}</div>
                      <div>
                        <div style={{fontSize:"10px",letterSpacing:"0.12em",textTransform:"uppercase",color:"#10b981",marginBottom:"4px"}}>{tip.category}</div>
                        <div style={{fontSize:"13px",lineHeight:1.6,color:"#d1d5db"}}>{tip.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── PROFILE ── */}
        {activeTab==="profile"&&(
          <div style={{padding:"24px 16px"}}>
            {successMsg&&<div style={g.success}>{successMsg}</div>}
            <div style={{border:"1px solid #1f2937",borderRadius:"8px",padding:"24px",background:"#0d1117",marginBottom:"16px",textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(16,185,129,0.1)",border:"2px solid #10b981",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:700,color:"#10b981",margin:"0 auto 12px"}}>{(player?.name||"P")[0].toUpperCase()}</div>
              <div style={{fontSize:"20px",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:"4px"}}>{player?.name}</div>
              <div style={{fontSize:"12px",color:"#6b7280"}}>{player?.country} · {player?.tour}</div>
              <div style={{display:"flex",alignItems:"center",gap:"8px",justifyContent:"center",marginTop:"8px",fontSize:"11px",color:"#10b981"}}>✓ Verified · Rank #{player?.ranking}</div>
              <div style={{display:"flex",gap:"8px",marginTop:"16px"}}>
                {[["Posts",posts.filter(p=>p.author===player?.name).length],["Cities",CITIES.length],["Ranking",player?.ranking]].map(([lbl,val])=>(
                  <div key={lbl} style={{flex:1,border:"1px solid #1f2937",borderRadius:"6px",padding:"12px",background:"#080c10",textAlign:"center"}}>
                    <div style={{fontSize:"20px",fontWeight:700,color:"#10b981"}}>{val}</div>
                    <div style={{fontSize:"10px",color:"#6b7280",letterSpacing:"0.1em",textTransform:"uppercase"}}>{lbl}</div>
                  </div>
                ))}
              </div>
              <button style={{...g.btnGhost,marginTop:"16px",width:"100%"}} onClick={()=>{setProfileForm({name:player.name,country:player.country,ranking:player.ranking,tour:player.tour});setEditingProfile(true);}}>Edit profile</button>
            </div>

            {/* Invite */}
            <div style={{border:"1px solid #1f2937",borderRadius:"6px",padding:"20px",background:"#0d1117",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",color:"#6b7280",marginBottom:"12px"}}>Invite a fellow player</div>
              {!inviteLink?(
                <>
                  <input style={{...g.input,marginBottom:"12px"}} type="email" placeholder="Player's email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/>
                  <button style={{...g.btn(false),padding:"10px"}} onClick={generateInvite}>Generate invite link</button>
                </>
              ):(
                <>
                  <div style={{fontSize:"12px",color:"#10b981",marginBottom:"8px"}}>✓ Invite link ready — copy and send manually</div>
                  <div style={{background:"#080c10",border:"1px solid #1f2937",borderRadius:"4px",padding:"10px",fontSize:"11px",color:"#d1d5db",wordBreak:"break-all"}}>{inviteLink}</div>
                  <div style={{fontSize:"11px",color:"#6b7280",marginTop:"8px"}}>They'll still need to upload their credential and get approved.</div>
                  <button style={{...g.btnText("#10b981"),marginTop:"8px",fontSize:"11px"}} onClick={()=>{setInviteLink("");setInviteEmail("");}}>Generate another</button>
                </>
              )}
            </div>

            <button style={{width:"100%",background:"transparent",border:"1px solid #1f2937",color:"#6b7280",borderRadius:"4px",padding:"12px",fontSize:"11px",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}} onClick={handleLogout}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}
