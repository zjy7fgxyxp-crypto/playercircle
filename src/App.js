import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://glcxzuadoelmouihsill.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3h6dWFkb2VsbW91aWhzaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjcyODcsImV4cCI6MjA4NzMwMzI4N30.VJ8T4Vodtd3f2W9JNQzFQXGYqq3m4TKT-FQYWL3rNcY"
);

const ADMIN_EMAIL = "javierglocret@icloud.com";
const CATEGORY_COLORS = { Help:"#f59e0b", Tip:"#10b981", Rant:"#ef4444", Insight:"#818cf8" };
const CATEGORY_BG = { Help:"rgba(245,158,11,0.08)", Tip:"rgba(16,185,129,0.08)", Rant:"rgba(239,68,68,0.08)", Insight:"rgba(129,140,248,0.08)" };
const CATEGORIES = ["Insight","Tip","Help","Rant"];
const TOURS = ["ATP","WTA"];

const CITIES = [
  { name:"Melbourne", country:"Australia", tournament:"Australian Open", emoji:"🇦🇺", tips:[{category:"Training",text:"Melbourne Park practice courts 6am–8pm. Book via Tennis Australia portal.",icon:"🎾"},{category:"Recovery",text:"Stretch Lab South Yarra — best physio. Ask for Marcus.",icon:"💆"},{category:"Food",text:"Tipo 00 CBD — incredible pasta, player-friendly portions.",icon:"🍝"},{category:"Hotel",text:"Crown Towers 20% off during AO with player credential.",icon:"🏨"}]},
  { name:"Paris", country:"France", tournament:"Roland Garros", emoji:"🇫🇷", tips:[{category:"Training",text:"Racing Club de France, Bois de Boulogne — clay courts near RG.",icon:"🎾"},{category:"Recovery",text:"Institut du Sport 13ème — cryotherapy and physio team.",icon:"💆"},{category:"Food",text:"Café de Flore breakfast. Order the omelette.",icon:"🥐"},{category:"Hotel",text:"Molitor Hotel — pool, 10 min from Roland Garros by bike.",icon:"🏨"}]},
  { name:"London", country:"United Kingdom", tournament:"Wimbledon", emoji:"🇬🇧", tips:[{category:"Training",text:"National Tennis Centre Roehampton — book 2 weeks ahead in June.",icon:"🎾"},{category:"Recovery",text:"Third Space Soho — best gym central London, open 6am.",icon:"💆"},{category:"Food",text:"Gymkhana — high protein Indian, no dairy options.",icon:"🍛"},{category:"Hotel",text:"Cannizaro House Wimbledon Village — walking distance.",icon:"🏨"}]},
  { name:"New York", country:"USA", tournament:"US Open", emoji:"🇺🇸", tips:[{category:"Training",text:"USTA Billie Jean King Center — Courts 8-17 less crowded.",icon:"🎾"},{category:"Recovery",text:"Equinox Sports Club 61st — cold plunge, sauna, full recovery.",icon:"💆"},{category:"Food",text:"Carbone — book 3 weeks ahead, worth every dollar.",icon:"🍷"},{category:"Hotel",text:"1 Hotel Brooklyn Bridge — 25 min Uber to Flushing.",icon:"🏨"}]},
  { name:"Miami", country:"USA", tournament:"Miami Open", emoji:"🇺🇸", tips:[{category:"Training",text:"Crandon Park Tennis Center — humid, go early.",icon:"🎾"},{category:"Recovery",text:"Next Health Brickell — ice barrels essential in Miami heat.",icon:"💆"},{category:"Food",text:"Zuma Brickell — light Japanese, popular with players.",icon:"🍱"},{category:"Hotel",text:"EAST Miami — rooftop pool, 15 min Uber to Key Biscayne.",icon:"🏨"}]},
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500;600&display=swap');
  :root {
    --bg:#fafaf9; --bg2:#ffffff; --border:#e5e5e3; --border2:#f0f0ee;
    --text:#1a1a18; --text2:#6b6b67; --text3:#a8a8a4;
    --green:#059669; --gl:#ecfdf5; --gb:#d1fae5;
    --r:10px; --sh:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    --shm:0 4px 16px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fu{animation:fadeUp 0.35s ease both}
  .pc{animation:fadeUp 0.25s ease both}
  button{cursor:pointer;font-family:inherit;transition:opacity 0.15s}
  button:active{transform:scale(0.97)}
  textarea{font-family:inherit}
  input[type=file]{display:none}
  input,textarea{color:var(--text)}
  input::placeholder,textarea::placeholder{color:var(--text3)}
  input:focus,textarea:focus{outline:none;border-color:var(--green)!important;box-shadow:0 0 0 3px rgba(5,150,105,0.08)}
  .cc{transition:background 0.15s,transform 0.15s}
  .cc:hover{background:var(--bg)!important;transform:translateX(2px)}
  .lk{transition:color 0.2s,transform 0.15s}
  .lk:active{transform:scale(1.3)}
`;

const s = {
  root:{fontFamily:"'Geist Mono','Courier New',monospace",background:"var(--bg)",minHeight:"100vh",color:"var(--text)",display:"flex",flexDirection:"column"},
  lbl:{display:"block",fontSize:"11px",letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--text2)",marginBottom:"6px",fontWeight:500},
  inp:{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"11px 14px",color:"var(--text)",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color 0.15s,box-shadow 0.15s",marginBottom:"16px"},
  ta:{width:"100%",background:"transparent",border:"none",color:"var(--text)",fontSize:"14px",fontFamily:"inherit",boxSizing:"border-box",resize:"none",lineHeight:1.65},
  btn:(d)=>({width:"100%",background:d?"var(--border)":"var(--green)",color:d?"var(--text3)":"#fff",border:"none",borderRadius:"8px",padding:"13px",fontSize:"13px",letterSpacing:"0.03em",cursor:d?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:600}),
  bsm:{background:"var(--green)",color:"#fff",border:"none",borderRadius:"7px",padding:"8px 16px",fontSize:"12px",fontWeight:600,cursor:"pointer"},
  bgh:{background:"transparent",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:"8px",padding:"11px 16px",fontSize:"13px",cursor:"pointer"},
  btx:(c)=>({background:"transparent",border:"none",color:c||"var(--text3)",cursor:"pointer",fontSize:"12px",padding:0}),
  bk:{background:"transparent",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"12px",marginBottom:"28px",padding:0},
  tbtn:(a)=>({flex:1,padding:"9px",border:`1px solid ${a?"var(--green)":"var(--border)"}`,background:a?"var(--gl)":"transparent",color:a?"var(--green)":"var(--text2)",borderRadius:"7px",cursor:"pointer",fontSize:"12px",fontWeight:a?600:400,transition:"all 0.15s"}),
  top:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid var(--border2)",background:"rgba(250,250,249,0.92)",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(12px)"},
  tabs:{display:"flex",borderBottom:"1px solid var(--border2)",background:"rgba(250,250,249,0.92)",backdropFilter:"blur(12px)",position:"sticky",top:"53px",zIndex:9},
  tab:(a)=>({flex:1,padding:"13px 8px",textAlign:"center",fontSize:"11px",letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",color:a?"var(--green)":"var(--text3)",background:"transparent",border:"none",borderBottomWidth:"2px",borderBottomStyle:"solid",borderBottomColor:a?"var(--green)":"transparent",fontFamily:"inherit",fontWeight:a?600:400,transition:"color 0.15s,border-color 0.15s"}),
  av:(sz)=>({width:sz||36,height:sz||36,borderRadius:"50%",background:"var(--gl)",border:"1.5px solid var(--gb)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round((sz||36)*0.38),fontWeight:700,color:"var(--green)",flexShrink:0}),
  modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"24px",backdropFilter:"blur(4px)"},
  mc:{width:"100%",maxWidth:"420px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"16px",padding:"28px",boxShadow:"var(--shm)",animation:"slideIn 0.2s ease"},
  err:{fontSize:"12px",color:"#ef4444",marginBottom:"14px",padding:"10px 12px",background:"#fef2f2",borderRadius:"7px",border:"1px solid #fecaca"},
  ok:{fontSize:"12px",color:"var(--green)",marginBottom:"14px",padding:"10px 12px",background:"var(--gl)",borderRadius:"7px",border:"1px solid var(--gb)"},
  bdg:{fontSize:"10px",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",padding:"3px 10px",borderRadius:"999px"},
};

export default function App() {
  const [screen,setScreen]=useState("loading");
  const [tab,setTab]=useState("feed");
  const [session,setSession]=useState(null);
  const [player,setPlayer]=useState(null);
  const [posts,setPosts]=useState([]);
  const [pending,setPending]=useState([]);
  const [city,setCity]=useState(null);
  const [cat,setCat]=useState("All");
  const [err,setErr]=useState("");
  const [ok,setOk]=useState("");
  const [loading,setLoading]=useState(false);
  const [likes,setLikes]=useState(new Set());
  const [lf,setLf]=useState({email:"",password:""});
  const [rf,setRf]=useState({name:"",country:"",ranking:"",tour:"ATP",email:"",password:""});
  const [cf,setCf]=useState(null);
  const [cp,setCp]=useState(null);
  const [pt,setPt]=useState("");
  const [pc,setPc]=useState("Insight");
  const [mf,setMf]=useState(null);
  const [mp,setMp]=useState(null);
  const [mt,setMt]=useState(null);
  const mref=useRef();
  const [ep,setEp]=useState(null);
  const [et,setEt]=useState("");
  const [xc,setXc]=useState({});
  const [cms,setCms]=useState({});
  const [ctx,setCtx]=useState({});
  const [ec,setEc]=useState(null);
  const [ect,setEct]=useState("");
  const [menu,setMenu]=useState(null);
  const [epf,setEpf]=useState(false);
  const [pf,setPf]=useState({name:"",country:"",ranking:"",tour:"ATP"});
  const [ie,setIe]=useState("");
  const [il,setIl]=useState("");
  const inv=new URLSearchParams(window.location.search).get("invite")||"";

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      if(session)loadPlayer(session.user.id); else setScreen("landing");
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>{
      setSession(s);
      if(s)loadPlayer(s.user.id); else setScreen("landing");
    });
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    const h=()=>setMenu(null);
    document.addEventListener("click",h);
    return()=>document.removeEventListener("click",h);
  },[]);

  const loadPlayer=async(uid)=>{
    const{data}=await supabase.from("players").select("*").eq("user_id",uid).single();
    if(data){setPlayer(data);if(data.status==="approved"){await loadPosts();await loadLikes(uid);setScreen("home");}else setScreen("pending");}
    else setScreen("landing");
  };
  const loadPosts=async()=>{const{data}=await supabase.from("posts").select("*").order("created_at",{ascending:false});if(data)setPosts(data);};
  const loadLikes=async(uid)=>{const{data}=await supabase.from("post_likes").select("post_id").eq("user_id",uid);if(data)setLikes(new Set(data.map(l=>l.post_id)));};
  const loadComments=async(pid)=>{const{data}=await supabase.from("comments").select("*").eq("post_id",pid).order("created_at",{ascending:true});if(data)setCms(c=>({...c,[pid]:data}));};
  const loadPending=async()=>{const{data}=await supabase.from("players").select("*").eq("status","pending").order("created_at",{ascending:false});if(data)setPending(data);};

  const login=async()=>{
    setErr("");setLoading(true);
    const{error}=await supabase.auth.signInWithPassword({email:lf.email,password:lf.password});
    setLoading(false);if(error)setErr("Invalid email or password.");
  };
  const handleCf=e=>{const f=e.target.files[0];if(!f)return;setCf(f);const r=new FileReader();r.onloadend=()=>setCp(r.result);r.readAsDataURL(f);};
  const register=async()=>{
    if(!rf.name||!rf.ranking||!rf.email||!rf.password){setErr("Please fill in all fields.");return;}
    if(!cf){setErr("Please upload your ATP/WTA credential photo.");return;}
    if(rf.password.length<6){setErr("Password must be at least 6 characters.");return;}
    setLoading(true);setErr("");
    const{data:ad,error:ae}=await supabase.auth.signUp({email:rf.email,password:rf.password});
    if(ae){setErr(ae.message);setLoading(false);return;}
    const ext=cf.name.split(".").pop();
    await supabase.storage.from("credentials").upload(`${ad.user.id}.${ext}`,cf);
    const{data:ud}=supabase.storage.from("credentials").getPublicUrl(`${ad.user.id}.${ext}`);
    await supabase.from("players").insert([{user_id:ad.user.id,name:rf.name,country:rf.country,ranking:parseInt(rf.ranking),tour:rf.tour,email:rf.email,status:"pending",credential_url:ud.publicUrl,invite_code:inv||null}]);
    setLoading(false);setScreen("pending");
  };
  const logout=async()=>{await supabase.auth.signOut();setPlayer(null);setSession(null);setScreen("landing");};
  const saveProfile=async()=>{
    setLoading(true);
    const{data}=await supabase.from("players").update({name:pf.name,country:pf.country,ranking:parseInt(pf.ranking),tour:pf.tour}).eq("id",player.id).select().single();
    setLoading(false);if(data){setPlayer(data);setEpf(false);setOk("Profile updated!");setTimeout(()=>setOk(""),3000);}
  };
  const handleMf=e=>{const f=e.target.files[0];if(!f)return;setMf(f);setMt(f.type.startsWith("video")?"video":"image");const r=new FileReader();r.onloadend=()=>setMp(r.result);r.readAsDataURL(f);};
  const rmMedia=()=>{setMf(null);setMp(null);setMt(null);};
  const submitPost=async()=>{
    if(!pt.trim()&&!mf)return;
    let mu=null,mtype=null;
    if(mf){const ext=mf.name.split(".").pop();const fn=`posts/${Date.now()}.${ext}`;await supabase.storage.from("credentials").upload(fn,mf);const{data:ud}=supabase.storage.from("credentials").getPublicUrl(fn);mu=ud.publicUrl;mtype=mt;}
    const{data}=await supabase.from("posts").insert([{author:player.name,country:player.country,ranking:player.ranking,content:pt,category:pc,likes:0,replies:0,user_id:player.user_id,media_url:mu,media_type:mtype}]).select().single();
    if(data){setPosts([data,...posts]);setPt("");setPc("Insight");rmMedia();}
  };
  const delPost=async(id)=>{await supabase.from("posts").delete().eq("id",id);setPosts(posts.filter(p=>p.id!==id));setMenu(null);};
  const savePost=async(id)=>{const{data}=await supabase.from("posts").update({content:et}).eq("id",id).select().single();if(data){setPosts(posts.map(p=>p.id===id?data:p));setEp(null);}};
  const toggleLike=async(post)=>{
    const uid=player.user_id;
    if(likes.has(post.id)){
      await supabase.from("post_likes").delete().eq("post_id",post.id).eq("user_id",uid);
      const nl=Math.max(0,(post.likes||0)-1);
      await supabase.from("posts").update({likes:nl}).eq("id",post.id);
      setPosts(posts.map(p=>p.id===post.id?{...p,likes:nl}:p));
      setLikes(s=>{const n=new Set(s);n.delete(post.id);return n;});
    }else{
      await supabase.from("post_likes").insert([{post_id:post.id,user_id:uid}]);
      const nl=(post.likes||0)+1;
      await supabase.from("posts").update({likes:nl}).eq("id",post.id);
      setPosts(posts.map(p=>p.id===post.id?{...p,likes:nl}:p));
      setLikes(s=>new Set([...s,post.id]));
    }
  };
  const toggleCms=pid=>{setXc(x=>({...x,[pid]:!x[pid]}));if(!cms[pid])loadComments(pid);};
  const submitCm=async(pid)=>{
    const text=ctx[pid];if(!text?.trim())return;
    const{data}=await supabase.from("comments").insert([{post_id:pid,author:player.name,ranking:player.ranking,content:text,user_id:player.user_id}]).select().single();
    if(data){setCms(c=>({...c,[pid]:[...(c[pid]||[]),data]}));setCtx(t=>({...t,[pid]:""}));const nr=(posts.find(p=>p.id===pid)?.replies||0)+1;await supabase.from("posts").update({replies:nr}).eq("id",pid);setPosts(posts.map(p=>p.id===pid?{...p,replies:nr}:p));}
  };
  const delCm=async(pid,cid)=>{
    await supabase.from("comments").delete().eq("id",cid);
    setCms(c=>({...c,[pid]:(c[pid]||[]).filter(x=>x.id!==cid)}));
    const nr=Math.max(0,(posts.find(p=>p.id===pid)?.replies||0)-1);
    await supabase.from("posts").update({replies:nr}).eq("id",pid);
    setPosts(posts.map(p=>p.id===pid?{...p,replies:nr}:p));
  };
  const saveCm=async(pid,cid)=>{const{data}=await supabase.from("comments").update({content:ect}).eq("id",cid).select().single();if(data){setCms(c=>({...c,[pid]:(c[pid]||[]).map(x=>x.id===cid?data:x)}));setEc(null);}};
  const approve=async(id)=>{await supabase.from("players").update({status:"approved"}).eq("id",id);loadPending();};
  const reject=async(id)=>{await supabase.from("players").update({status:"rejected"}).eq("id",id);loadPending();};
  const genInvite=()=>{if(!ie.trim())return;const c=Math.random().toString(36).substring(2,10).toUpperCase();setIl(`${window.location.origin}?invite=${c}`);};
  const ago=d=>{const diff=(Date.now()-new Date(d))/1000;if(diff<60)return"now";if(diff<3600)return`${Math.floor(diff/60)}m`;if(diff<86400)return`${Math.floor(diff/3600)}h`;return`${Math.floor(diff/86400)}d`;};

  const fp=cat==="All"?posts:posts.filter(p=>p.category===cat);
  const isAdmin=session?.user?.email===ADMIN_EMAIL;
  const mine=p=>p.user_id===player?.user_id;
  const mineCm=c=>c.user_id===player?.user_id;

  if(screen==="loading")return(<div style={{...s.root,alignItems:"center",justifyContent:"center"}}><style>{CSS}</style><div style={{width:20,height:20,border:"2px solid var(--border)",borderTopColor:"var(--green)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>);

  if(screen==="landing")return(
    <div style={{...s.root,background:"#fff"}}><style>{CSS}</style>
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(0,0,0,0.05) 1px,transparent 0)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"15%",left:"50%",transform:"translateX(-50%)",width:"600px",height:"300px",background:"radial-gradient(ellipse,rgba(5,150,105,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div className="fu" style={{position:"relative",zIndex:1,maxWidth:"560px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"7px",background:"var(--gl)",border:"1px solid var(--gb)",borderRadius:"999px",padding:"5px 14px",marginBottom:"36px",fontSize:"11px",letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--green)",fontWeight:600}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s infinite"}}/>Verified players only
        </div>
        <h1 style={{fontSize:"clamp(48px,7vw,84px)",fontWeight:400,letterSpacing:"-0.04em",margin:"0 0 6px",lineHeight:1.0,color:"#0f0f0e",fontFamily:"'Instrument Serif',Georgia,serif"}}>
          The circle<br/><span style={{fontStyle:"italic",color:"var(--green)"}}>players trust.</span>
        </h1>
        <p style={{fontSize:"16px",color:"var(--text2)",maxWidth:"340px",lineHeight:1.7,margin:"24px auto 48px"}}>A private network for ATP & WTA professionals. Real tips, real players, city by city.</p>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center",marginBottom:"24px"}}>
          <button style={{background:"var(--green)",color:"#fff",border:"none",borderRadius:"9px",padding:"14px 36px",fontSize:"13px",letterSpacing:"0.03em",cursor:"pointer",fontWeight:600,boxShadow:"0 2px 12px rgba(5,150,105,0.22)"}} onClick={()=>{setErr("");setScreen("register");}}>Apply for access</button>
          <button style={{background:"transparent",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"9px",padding:"14px 36px",fontSize:"13px",cursor:"pointer",fontWeight:500}} onClick={()=>{setErr("");setScreen("login");}}>Sign in</button>
        </div>
        <p style={{fontSize:"11px",color:"var(--text3)",letterSpacing:"0.04em"}}>Manual verification · Invite or apply · ATP & WTA only</p>
      </div>
    </div></div>
  );

  const Wrap=({ch})=>(<div style={{...s.root,alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px"}}><style>{CSS}</style><div style={{width:"100%",maxWidth:"420px"}} className="fu">{ch}</div></div>);

  if(screen==="login")return(<Wrap ch={<>
    <button style={s.bk} onClick={()=>setScreen("landing")}>← Back</button>
    <div style={{fontSize:"26px",fontWeight:400,marginBottom:"6px",fontFamily:"'Instrument Serif',Georgia,serif"}}>Welcome back</div>
    <div style={{fontSize:"13px",color:"var(--text2)",marginBottom:"28px"}}>Sign in to your PlayerCircle account.</div>
    <label style={s.lbl}>Email</label>
    <input style={s.inp} type="email" placeholder="your@email.com" value={lf.email} onChange={e=>setLf({...lf,email:e.target.value})} onKeyDown={e=>e.key==="Enter"&&login()}/>
    <label style={s.lbl}>Password</label>
    <input style={s.inp} type="password" placeholder="••••••••" value={lf.password} onChange={e=>setLf({...lf,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&login()}/>
    {err&&<div style={s.err}>{err}</div>}
    <button style={s.btn(loading)} onClick={login} disabled={loading}>{loading?"Signing in...":"Sign in"}</button>
    <div style={{textAlign:"center",marginTop:"20px",fontSize:"12px",color:"var(--text2)"}}>No account? <button style={s.btx("var(--green)")} onClick={()=>{setErr("");setScreen("register");}}>Apply for access</button></div>
  </>}/>);

  if(screen==="register")return(<div style={{...s.root,alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px"}}><style>{CSS}</style>
    <div style={{width:"100%",maxWidth:"440px"}} className="fu">
      <button style={s.bk} onClick={()=>setScreen("landing")}>← Back</button>
      <div style={{fontSize:"26px",fontWeight:400,marginBottom:"6px",fontFamily:"'Instrument Serif',Georgia,serif"}}>Apply for access</div>
      <div style={{fontSize:"13px",color:"var(--text2)",marginBottom:"28px"}}>We manually verify every player. You'll be notified once approved.</div>
      <label style={s.lbl}>Full name (as on ATP/WTA profile)</label>
      <input style={s.inp} placeholder="e.g. Sebastian Báez" value={rf.name} onChange={e=>setRf({...rf,name:e.target.value})}/>
      <label style={s.lbl}>Nationality</label>
      <input style={s.inp} placeholder="e.g. Argentina" value={rf.country} onChange={e=>setRf({...rf,country:e.target.value})}/>
      <label style={s.lbl}>Current ranking</label>
      <input style={s.inp} placeholder="e.g. 145" type="number" value={rf.ranking} onChange={e=>setRf({...rf,ranking:e.target.value})}/>
      <label style={s.lbl}>Tour</label>
      <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
        {TOURS.map(t=><button key={t} style={s.tbtn(rf.tour===t)} onClick={()=>setRf({...rf,tour:t})}>{t}</button>)}
      </div>
      <label style={s.lbl}>ATP/WTA Credential photo</label>
      <div style={{marginBottom:"16px"}}>
        <label htmlFor="cfu" style={{display:"flex",alignItems:"center",gap:"10px",border:"1px dashed var(--border)",borderRadius:"8px",padding:"16px",cursor:"pointer",color:cf?"var(--green)":"var(--text3)",fontSize:"12px",background:cf?"var(--gl)":"transparent",transition:"all 0.15s"}}>
          <span style={{fontSize:"18px"}}>{cf?"✓":"📎"}</span>{cf?cf.name:"Click to upload your player credential"}
        </label>
        <input id="cfu" type="file" accept="image/*" onChange={handleCf}/>
        {cp&&<img src={cp} alt="" style={{width:"100%",marginTop:"8px",borderRadius:"8px",border:"1px solid var(--border)",maxHeight:"120px",objectFit:"cover"}}/>}
      </div>
      <label style={s.lbl}>Email</label>
      <input style={s.inp} type="email" placeholder="your@email.com" value={rf.email} onChange={e=>setRf({...rf,email:e.target.value})}/>
      <label style={s.lbl}>Password</label>
      <input style={s.inp} type="password" placeholder="Min. 6 characters" value={rf.password} onChange={e=>setRf({...rf,password:e.target.value})}/>
      {inv&&<div style={{...s.ok,marginBottom:"16px"}}>✓ Invited with code: {inv}</div>}
      {err&&<div style={s.err}>{err}</div>}
      <button style={s.btn(loading)} onClick={register} disabled={loading}>{loading?"Submitting...":"Submit application"}</button>
      <div style={{textAlign:"center",marginTop:"20px",fontSize:"12px",color:"var(--text2)"}}>Already a member? <button style={s.btx("var(--green)")} onClick={()=>{setErr("");setScreen("login");}}>Sign in</button></div>
    </div>
  </div>);

  if(screen==="pending")return(<div style={{...s.root,alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px",textAlign:"center"}}><style>{CSS}</style>
    <div className="fu">
      <div style={{width:52,height:52,background:"var(--gl)",border:"1px solid var(--gb)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",margin:"0 auto 20px"}}>⏳</div>
      <div style={{fontSize:"24px",fontFamily:"'Instrument Serif',Georgia,serif",marginBottom:"10px"}}>Application under review</div>
      <div style={{fontSize:"14px",color:"var(--text2)",maxWidth:"300px",lineHeight:1.7,margin:"0 auto 28px"}}>We're verifying your credentials. You'll receive an email once approved. Usually 24–48 hours.</div>
      <button style={s.bgh} onClick={logout}>Sign out</button>
    </div>
  </div>);

  const PModal=()=>(<div style={s.modal}><div style={s.mc}>
    <div style={{fontSize:"18px",fontFamily:"'Instrument Serif',Georgia,serif",marginBottom:"20px"}}>Edit profile</div>
    <label style={s.lbl}>Full name</label><input style={s.inp} value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})}/>
    <label style={s.lbl}>Nationality</label><input style={s.inp} value={pf.country} onChange={e=>setPf({...pf,country:e.target.value})}/>
    <label style={s.lbl}>Current ranking</label><input style={s.inp} type="number" value={pf.ranking} onChange={e=>setPf({...pf,ranking:e.target.value})}/>
    <label style={s.lbl}>Tour</label>
    <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>{TOURS.map(t=><button key={t} style={s.tbtn(pf.tour===t)} onClick={()=>setPf({...pf,tour:t})}>{t}</button>)}</div>
    <div style={{display:"flex",gap:"8px"}}>
      <button style={s.btn(loading)} onClick={saveProfile}>{loading?"Saving...":"Save changes"}</button>
      <button style={{...s.bgh,flex:1}} onClick={()=>setEpf(false)}>Cancel</button>
    </div>
  </div></div>);

  if(tab==="admin")return(<div style={s.root}><style>{CSS}</style>
    <div style={s.top}>
      <div style={{fontSize:"13px",letterSpacing:"0.1em",color:"var(--green)",fontWeight:700,textTransform:"uppercase"}}>PlayerCircle</div>
      <div style={{...s.bdg,color:"#92400e",background:"#fef3c7",border:"1px solid #fde68a"}}>Admin</div>
    </div>
    <div style={s.tabs}>{[["feed","Feed"],["cities","Cities"],["profile","Profile"],["admin","Admin"]].map(([id,l])=>(<button key={id} style={s.tab(tab===id)} onClick={()=>{setTab(id);if(id==="admin")loadPending();}}>{l}</button>))}</div>
    <div style={{flex:1,overflowY:"auto",padding:"0 0 80px"}}>
      <div style={{padding:"20px 20px 10px",fontSize:"11px",color:"var(--text3)",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:500}}>Pending ({pending.length})</div>
      {pending.length===0&&<div style={{textAlign:"center",padding:"60px",color:"var(--text3)",fontSize:"13px"}}><div style={{fontSize:"28px",marginBottom:"10px"}}>✓</div>No pending applications</div>}
      {pending.map(p=>(<div key={p.id} style={{margin:"8px 16px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"18px",boxShadow:"var(--sh)"}}>
        <div style={{marginBottom:"12px"}}>
          <div style={{fontSize:"15px",fontWeight:600,marginBottom:"3px"}}>{p.name}</div>
          <div style={{fontSize:"12px",color:"var(--text2)"}}>Rank #{p.ranking} · {p.tour} · {p.country}</div>
          <div style={{fontSize:"12px",color:"var(--text3)"}}>{p.email}</div>
          {p.invite_code&&<div style={{fontSize:"11px",color:"var(--green)",marginTop:"4px"}}>Invite: {p.invite_code}</div>}
        </div>
        {p.credential_url&&<a href={p.credential_url} target="_blank" rel="noopener noreferrer" style={{display:"block",marginBottom:"12px"}}><img src={p.credential_url} alt="" style={{width:"100%",maxHeight:"160px",objectFit:"cover",borderRadius:"8px",border:"1px solid var(--border)"}}/><div style={{fontSize:"11px",color:"var(--text3)",marginTop:"4px"}}>↗ View full credential</div></a>}
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={()=>approve(p.id)} style={{flex:1,background:"var(--green)",color:"#fff",border:"none",borderRadius:"8px",padding:"10px",fontSize:"12px",cursor:"pointer",fontWeight:600}}>✓ Approve</button>
          <button onClick={()=>reject(p.id)} style={{flex:1,background:"transparent",color:"#ef4444",border:"1px solid #fecaca",borderRadius:"8px",padding:"10px",fontSize:"12px",cursor:"pointer"}}>✗ Reject</button>
        </div>
      </div>))}
    </div>
  </div>);

  return(<div style={s.root}><style>{CSS}</style>
    {epf&&<PModal/>}
    <div style={s.top}>
      <div style={{fontSize:"13px",letterSpacing:"0.1em",color:"var(--green)",fontWeight:700,textTransform:"uppercase"}}>PlayerCircle</div>
      <div style={{...s.bdg,color:"var(--green)",background:"var(--gl)",border:"1px solid var(--gb)"}}>#{player?.ranking} {player?.tour}</div>
    </div>
    <div style={s.tabs}>
      {[["feed","Feed"],["cities","Cities"],["profile","Profile"],...(isAdmin?[["admin","Admin"]]:[])] .map(([id,l])=>(<button key={id} style={s.tab(tab===id)} onClick={()=>{setTab(id);if(id==="admin")loadPending();}}>{l}</button>))}
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"0 0 100px"}}>

      {tab==="feed"&&<>
        {/* Compose */}
        <div style={{margin:"16px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px",boxShadow:"var(--sh)"}}>
          <div style={{display:"flex",gap:"12px"}}>
            <div style={s.av(36)}>{(player?.name||"P")[0].toUpperCase()}</div>
            <textarea style={{...s.ta,flex:1,minHeight:"60px"}} placeholder="Share a tip, ask a question, or vent..." value={pt} onChange={e=>setPt(e.target.value)}/>
          </div>
          {mp&&<div style={{position:"relative",margin:"12px 0 0 48px"}}>
            {mt==="video"?<video src={mp} controls style={{width:"100%",borderRadius:"8px",border:"1px solid var(--border)",maxHeight:"220px"}}/>:<img src={mp} alt="" style={{width:"100%",borderRadius:"8px",border:"1px solid var(--border)",maxHeight:"220px",objectFit:"cover"}}/>}
            <button onClick={rmMedia} style={{position:"absolute",top:"8px",right:"8px",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:"11px",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"12px",paddingTop:"10px",borderTop:"1px solid var(--border2)",marginLeft:"48px"}}>
            <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
              <button onClick={()=>mref.current?.click()} style={{...s.btx("var(--text3)"),display:"flex",alignItems:"center",gap:"5px",fontSize:"12px"}}>📷 <span>Photo/Video</span></button>
              <input ref={mref} type="file" accept="image/*,video/*" onChange={handleMf}/>
              <select value={pc} onChange={e=>setPc(e.target.value)} style={{background:"transparent",border:"1px solid var(--border2)",color:"var(--text2)",borderRadius:"6px",padding:"4px 8px",fontFamily:"inherit",fontSize:"11px",cursor:"pointer"}}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button style={s.bsm} onClick={submitPost}>Post</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:"6px",padding:"4px 16px 12px",overflowX:"auto"}}>
          {["All","Tip","Help","Rant","Insight"].map(c=>(<button key={c} style={{whiteSpace:"nowrap",padding:"5px 14px",borderRadius:"999px",border:`1px solid ${cat===c?"var(--green)":"var(--border)"}`,background:cat===c?"var(--gl)":"transparent",color:cat===c?"var(--green)":"var(--text2)",fontSize:"11px",cursor:"pointer",fontWeight:cat===c?600:400,transition:"all 0.15s"}} onClick={()=>setCat(c)}>{c}</button>))}
        </div>

        {fp.length===0&&<div style={{textAlign:"center",padding:"60px 24px",color:"var(--text3)",fontSize:"13px"}}><div style={{fontSize:"28px",marginBottom:"10px"}}>✦</div>No posts yet. Be the first.</div>}

        {fp.map((post,i)=>(<div key={post.id} className="pc" style={{margin:"0 16px 10px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",boxShadow:"var(--sh)",animationDelay:`${i*0.04}s`}}>
          <div style={{padding:"14px 16px 0",display:"flex",alignItems:"flex-start",gap:"10px"}}>
            <div style={s.av(36)}>{(post.author||"?")[0].toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                <span style={{fontSize:"13px",fontWeight:600}}>{post.author}</span>
                <span style={{fontSize:"11px",color:"var(--text3)"}}>#{post.ranking} · {ago(post.created_at)}</span>
                <div style={{...s.bdg,color:CATEGORY_COLORS[post.category]||"var(--text3)",background:CATEGORY_BG[post.category]||"transparent",border:`1px solid ${CATEGORY_COLORS[post.category]||"var(--border)"}33`}}>{post.category}</div>
              </div>
            </div>
            {mine(post)&&<div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setMenu(menu===post.id?null:post.id)} style={{background:"transparent",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"18px",padding:"0 4px",lineHeight:1,letterSpacing:"1px"}}>···</button>
              {menu===post.id&&<div style={{position:"absolute",right:0,top:"calc(100% + 4px)",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"4px",zIndex:10,minWidth:"128px",boxShadow:"var(--shm)",animation:"slideIn 0.15s ease"}}>
                <button onClick={()=>{setEp(post.id);setEt(post.content);setMenu(null);}} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",color:"var(--text)",padding:"8px 12px",cursor:"pointer",fontSize:"12px",borderRadius:"5px"}}>Edit post</button>
                <button onClick={()=>delPost(post.id)} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",border:"none",color:"#ef4444",padding:"8px 12px",cursor:"pointer",fontSize:"12px",borderRadius:"5px"}}>Delete post</button>
              </div>}
            </div>}
          </div>

          <div style={{padding:"10px 16px 12px",paddingLeft:"62px"}}>
            {ep===post.id?(<>
              <textarea style={{...s.ta,width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",minHeight:"80px",marginBottom:"8px"}} value={et} onChange={e=>setEt(e.target.value)}/>
              <div style={{display:"flex",gap:"8px"}}><button style={s.bsm} onClick={()=>savePost(post.id)}>Save</button><button style={s.bgh} onClick={()=>setEp(null)}>Cancel</button></div>
            </>):(<div style={{fontSize:"14px",lineHeight:1.65,color:"var(--text)",whiteSpace:"pre-wrap"}}>{post.content}</div>)}
          </div>

          {post.media_url&&<div style={{margin:"0 16px 12px"}}>
            {post.media_type==="video"?<video src={post.media_url} controls style={{width:"100%",borderRadius:"8px",border:"1px solid var(--border)",maxHeight:"300px"}}/>:<img src={post.media_url} alt="" style={{width:"100%",borderRadius:"8px",border:"1px solid var(--border)",maxHeight:"300px",objectFit:"cover"}}/>}
          </div>}

          <div style={{display:"flex",alignItems:"center",gap:"2px",padding:"8px 12px",borderTop:"1px solid var(--border2)"}}>
            <button className="lk" onClick={()=>toggleLike(post)} style={{display:"flex",alignItems:"center",gap:"5px",background:"transparent",border:"none",color:likes.has(post.id)?"#ef4444":"var(--text3)",cursor:"pointer",fontSize:"12px",padding:"6px 10px",borderRadius:"7px"}}>
              {likes.has(post.id)?"❤️":"🤍"} {post.likes||0}
            </button>
            <button onClick={()=>toggleCms(post.id)} style={{display:"flex",alignItems:"center",gap:"5px",background:"transparent",border:"none",color:xc[post.id]?"var(--green)":"var(--text3)",cursor:"pointer",fontSize:"12px",padding:"6px 10px",borderRadius:"7px"}}>
              💬 {post.replies||0}
            </button>
          </div>

          {xc[post.id]&&<div style={{borderTop:"1px solid var(--border2)",padding:"14px 16px",background:"var(--bg)"}}>
            {(cms[post.id]||[]).length===0&&<div style={{fontSize:"12px",color:"var(--text3)",textAlign:"center",marginBottom:"12px"}}>No replies yet.</div>}
            {(cms[post.id]||[]).map(c=>(<div key={c.id} style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
              <div style={s.av(28)}>{(c.author||"?")[0].toUpperCase()}</div>
              <div style={{flex:1,background:"var(--bg2)",borderRadius:"10px",padding:"8px 12px",border:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
                  <span style={{fontSize:"11px",fontWeight:600}}>{c.author} <span style={{color:"var(--text3)",fontWeight:400}}>· #{c.ranking}</span></span>
                  {mineCm(c)&&<div style={{display:"flex",gap:"8px"}}>
                    <button onClick={()=>{setEc(c.id);setEct(c.content);}} style={s.btx("var(--text3)")}>Edit</button>
                    <button onClick={()=>delCm(post.id,c.id)} style={s.btx("#ef4444")}>Delete</button>
                  </div>}
                </div>
                {ec===c.id?(<div>
                  <input style={{...s.inp,marginBottom:"8px",fontSize:"12px",padding:"6px 10px"}} value={ect} onChange={e=>setEct(e.target.value)}/>
                  <div style={{display:"flex",gap:"6px"}}><button style={{...s.bsm,padding:"4px 12px",fontSize:"11px"}} onClick={()=>saveCm(post.id,c.id)}>Save</button><button style={{...s.bgh,padding:"4px 12px",fontSize:"11px"}} onClick={()=>setEc(null)}>Cancel</button></div>
                </div>):(<div style={{fontSize:"13px",color:"var(--text)",lineHeight:1.55}}>{c.content}</div>)}
              </div>
            </div>))}
            <div style={{display:"flex",gap:"8px",alignItems:"center",marginTop:"8px"}}>
              <div style={s.av(28)}>{(player?.name||"P")[0].toUpperCase()}</div>
              <input style={{...s.inp,marginBottom:0,flex:1,fontSize:"13px",padding:"8px 14px",borderRadius:"999px"}} placeholder="Write a reply..." value={ctx[post.id]||""} onChange={e=>setCtx(t=>({...t,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submitCm(post.id)}/>
              <button style={s.bsm} onClick={()=>submitCm(post.id)}>↑</button>
            </div>
          </div>}
        </div>))}
      </>}

      {tab==="cities"&&<>
        {!city?(<>
          <div style={{padding:"20px 20px 12px",fontSize:"11px",color:"var(--text3)",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:500}}>Player-verified city guides</div>
          <div style={{padding:"0 16px",display:"grid",gap:"8px"}}>
            {CITIES.map(c=>(<div key={c.name} className="cc" style={{border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 18px",cursor:"pointer",background:"var(--bg2)",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"var(--sh)"}} onClick={()=>setCity(c)}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <span style={{fontSize:"22px"}}>{c.emoji}</span>
                <div>
                  <div style={{fontSize:"15px",fontWeight:600,fontFamily:"'Instrument Serif',Georgia,serif"}}>{c.name}</div>
                  <div style={{fontSize:"11px",color:"var(--text3)",marginTop:"1px"}}>{c.tournament}</div>
                </div>
              </div>
              <span style={{fontSize:"16px",color:"var(--green)",opacity:0.6}}>→</span>
            </div>))}
          </div>
        </>):(<>
          <button style={{display:"flex",alignItems:"center",gap:"6px",padding:"16px 20px",fontSize:"12px",color:"var(--text2)",cursor:"pointer",background:"transparent",border:"none",fontFamily:"inherit"}} onClick={()=>setCity(null)}>← All cities</button>
          <div style={{padding:"0 16px 24px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}>
              <span style={{fontSize:"32px"}}>{city.emoji}</span>
              <div>
                <div style={{fontSize:"24px",fontFamily:"'Instrument Serif',Georgia,serif"}}>{city.name}</div>
                <div style={{fontSize:"12px",color:"var(--text3)"}}>{city.tournament} · {city.country}</div>
              </div>
            </div>
            {city.tips.map((t,i)=>(<div key={i} style={{border:"1px solid var(--border)",borderRadius:"10px",padding:"14px 16px",marginBottom:"8px",background:"var(--bg2)",display:"flex",gap:"12px",boxShadow:"var(--sh)"}}>
              <span style={{fontSize:"20px",flexShrink:0,marginTop:"1px"}}>{t.icon}</span>
              <div>
                <div style={{fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--green)",marginBottom:"5px",fontWeight:600}}>{t.category}</div>
                <div style={{fontSize:"13px",lineHeight:1.6,color:"var(--text)"}}>{t.text}</div>
              </div>
            </div>))}
          </div>
        </>)}
      </>}

      {tab==="profile"&&<div style={{padding:"20px 16px"}}>
        {ok&&<div style={s.ok}>{ok}</div>}
        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"14px",padding:"24px",marginBottom:"12px",boxShadow:"var(--sh)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"20px"}}>
            <div style={{...s.av(52),fontSize:"20px"}}>{(player?.name||"P")[0].toUpperCase()}</div>
            <div>
              <div style={{fontSize:"19px",fontFamily:"'Instrument Serif',Georgia,serif",marginBottom:"3px"}}>{player?.name}</div>
              <div style={{fontSize:"12px",color:"var(--text2)"}}>{player?.country} · {player?.tour}</div>
              <div style={{fontSize:"11px",color:"var(--green)",marginTop:"3px"}}>✓ Verified · Rank #{player?.ranking}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
            {[["Posts",posts.filter(p=>p.author===player?.name).length],["Cities",CITIES.length],["Ranking",player?.ranking]].map(([l,v])=>(<div key={l} style={{flex:1,border:"1px solid var(--border)",borderRadius:"8px",padding:"10px",background:"var(--bg)",textAlign:"center"}}>
              <div style={{fontSize:"18px",fontWeight:700,color:"var(--green)"}}>{v}</div>
              <div style={{fontSize:"10px",color:"var(--text3)",letterSpacing:"0.06em",textTransform:"uppercase",marginTop:"2px"}}>{l}</div>
            </div>))}
          </div>
          <button style={{...s.bgh,width:"100%",fontSize:"12px",padding:"10px"}} onClick={()=>{setPf({name:player.name,country:player.country,ranking:player.ranking,tour:player.tour});setEpf(true);}}>Edit profile</button>
        </div>

        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px",marginBottom:"12px",boxShadow:"var(--sh)"}}>
          <div style={{fontSize:"11px",letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--text3)",marginBottom:"14px",fontWeight:500}}>Invite a fellow player</div>
          {!il?(<>
            <input style={{...s.inp,marginBottom:"10px"}} type="email" placeholder="Player's email" value={ie} onChange={e=>setIe(e.target.value)}/>
            <button style={{...s.btn(false),padding:"11px"}} onClick={genInvite}>Generate invite link</button>
          </>):(<>
            <div style={{...s.ok,marginBottom:"10px"}}>✓ Invite link ready</div>
            <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",fontSize:"11px",color:"var(--text)",wordBreak:"break-all",lineHeight:1.5}}>{il}</div>
            <div style={{fontSize:"11px",color:"var(--text3)",marginTop:"8px"}}>They'll still need to upload their credential and get approved.</div>
            <button style={{...s.btx("var(--green)"),marginTop:"10px",fontSize:"11px"}} onClick={()=>{setIl("");setIe("");}}>Generate another</button>
          </>)}
        </div>

        <button style={{width:"100%",background:"transparent",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:"9px",padding:"12px",fontSize:"12px",letterSpacing:"0.04em",cursor:"pointer",fontFamily:"inherit"}} onClick={logout}>Sign out</button>
      </div>}
    </div>
  </div>);
}
