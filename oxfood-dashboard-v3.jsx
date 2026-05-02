import { useState, useEffect, useRef, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════
// OXFOOD DASHBOARD V3 — ENHANCED UX
// 🔥 + Charts + Animations + Mobile Ready
// ═══════════════════════════════════════

const DREVMCOOK_DB = [
  {id:"dc-riz-pilaf",category:"salé",name:"Riz pilaf aux pickles",description:"Riz parfumé avec légumes fermentés.",difficulty:"Facile",time_minutes:25,servings:4,vegan:true,glutenFree:true,ingredients:["Riz basmati","Oignon","Ail","Pickles"],steps:["Faire revenir oignon","Ajouter riz","Cuire 15 min"],budget:"4€",tips:"Rapide et savoureux",nutrition:["Énergie","Probiotiques"],tags:["riz","pickles"]},
];

const PRICING = {
  services: [
    {id:"placard",emoji:"🏠",name:"Placard → Assiette",desc:"Chef à domicile",base:50,range:[50,80]},
    {id:"prepared",emoji:"🍱",name:"Plats Préparés",desc:"Reprise ingrédients",base:35,range:[30,50]},
    {id:"revaluation",emoji:"🔄",name:"Revalorisation",desc:"Anti-gaspi",base:40,range:[30,60]},
  ],
  subscriptions: [
    {id:"weekly-1",name:"1x/semaine",visits:4,price:180,monthly:true,save:"10%"},
    {id:"weekly-2",name:"2x/semaine",visits:8,price:320,monthly:true,save:"20%"},
  ],
};

const CLIENT_SEGMENTS = [
  {id:"active",emoji:"💼",name:"Actifs débordés"},
  {id:"family",emoji:"👨‍👩‍👧‍👦",name:"Familles"},
  {id:"airbnb",emoji:"🏡",name:"Airbnb / Touristes"},
  {id:"artists",emoji:"🎨",name:"Artistes"},
  {id:"health",emoji:"💚",name:"Health conscious"},
];

const SK = {clients:"oxfood-clients-v3",sessions:"oxfood-sessions-v3",subscriptions:"oxfood-subscriptions-v3"};

async function load(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null}catch{return null}}
async function save(k,d){try{await window.storage.set(k,JSON.stringify(d))}catch(e){console.error(e)}}

const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

const IC={
  home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chart:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  users:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  plus:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trash:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
};

export default function OxfoodApp(){
  const[tab,setTab]=useState("home");
  const[clients,setClients]=useState([]);
  const[sessions,setSessions]=useState([]);
  const[subscriptions,setSubscriptions]=useState([]);
  const[loaded,setLoaded]=useState(false);

  useEffect(()=>{(async()=>{const[c,s,sub]=await Promise.all([load(SK.clients),load(SK.sessions),load(SK.subscriptions)]);if(c)setClients(c);if(s)setSessions(s);if(sub)setSubscriptions(sub);setLoaded(true)})()},[]);
  useEffect(()=>{if(loaded)save(SK.clients,clients)},[clients,loaded]);
  useEffect(()=>{if(loaded)save(SK.sessions,sessions)},[sessions,loaded]);
  useEffect(()=>{if(loaded)save(SK.subscriptions,subscriptions)},[subscriptions,loaded]);

  const addClient=(c)=>setClients(p=>[...p,{id:uid(),...c}]);
  const removeClient=(id)=>setClients(p=>p.filter(c=>c.id!==id));
  const addSession=(s)=>setSessions(p=>[...p,{id:uid(),date:new Date().toISOString(),...s}]);
  const addSubscription=(s)=>setSubscriptions(p=>[...p,{id:uid(),startDate:new Date().toISOString(),...s}]);

  const thisMonth=sessions.filter(s=>{const d=new Date(s.date),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()});
  const monthRev=thisMonth.reduce((s,x)=>s+(x.amount||0),0);

  const tabs=[
    {id:"home",icon:IC.home,label:"Accueil"},
    {id:"analytics",icon:IC.chart,label:"Analytics"},
    {id:"clients",icon:IC.users,label:"Clients"},
  ];

  if(!loaded)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#0F0F1A"}}><div style={{fontSize:56}}>🔥</div><div style={{fontSize:26,fontWeight:800,color:"#FF6B35",letterSpacing:6,marginTop:12}}>OXFOOD</div></div>;

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#0F0F1A",color:"#F5F0E8",minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"linear-gradient(135deg,#16213E,#0F0F1A)",borderBottom:"1px solid rgba(255,107,53,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:24}}>🔥</span><span style={{fontSize:18,fontWeight:800,color:"#FF6B35",letterSpacing:3}}>OXFOOD</span></div>
      </header>
      <main style={{flex:1,overflowY:"auto",paddingBottom:76}}>
        {tab==="home"&&<Home clients={clients} sessions={sessions} subscriptions={subscriptions} monthRev={monthRev} thisMonth={thisMonth} setTab={setTab} addClient={addClient} removeClient={removeClient} addSession={addSession}/>}
        {tab==="analytics"&&<Analytics sessions={sessions} subscriptions={subscriptions} clients={clients}/>}
        {tab==="clients"&&<Clients clients={clients} addClient={addClient} removeClient={removeClient}/>}
      </main>
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,display:"flex",justifyContent:"space-around",background:"rgba(15,15,26,0.96)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,107,53,0.1)",padding:"6px 0 10px",zIndex:100}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",color:tab===t.id?"#FF6B35":"#666",transition:"color 0.3s ease"}}><span style={{opacity:tab===t.id?1:0.45}}>{t.icon}</span><span style={{fontSize:9,fontWeight:tab===t.id?700:500}}>{t.label}</span></button>)}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════
// HOME — Dashboard
// ═══════════════════════════════════════
function Home({clients,sessions,subscriptions,monthRev,thisMonth,setTab,addClient,removeClient,addSession}){
  const[showClientForm,setShowClientForm]=useState(false);
  const[showSessionForm,setShowSessionForm]=useState(false);
  const[clientForm,setClientForm]=useState({name:"",segment:""});
  const[sessionForm,setSessionForm]=useState({clientId:"",amount:50});

  const submitClient=()=>{if(!clientForm.name.trim())return;addClient(clientForm);setClientForm({name:"",segment:""});setShowClientForm(false)};
  const submitSession=()=>{if(!sessionForm.clientId)return;const c=clients.find(x=>x.id===sessionForm.clientId);addSession({...sessionForm,clientName:c?.name||""});setSessionForm({clientId:"",amount:50});setShowSessionForm(false)};

  const stats=[
    {l:"Clients",v:clients.length,c:"#FF6B35"},
    {l:"Abos",v:subscriptions.length,c:"#2EC4B6"},
    {l:"Sessions",v:thisMonth.length,c:"#E71D36"},
    {l:"Revenue",v:`${monthRev}€`,c:"#FF9F1C"},
  ];

  return(<div style={P}>
    <h2 style={H2}>Dashboard 🔥</h2>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      {stats.map((s,i)=><div key={i} style={{...CARD,...CARD_HOVER,borderLeft:`4px solid ${s.c}`}}><div style={{fontSize:22,fontWeight:800}}>{s.v}</div><div style={{fontSize:10,color:"#888",marginTop:3}}>{s.l}</div></div>)}
    </div>

    <div style={{display:"flex",gap:8,marginBottom:16}}>
      <button style={{...ADDBTN,flex:1}} onClick={()=>setShowClientForm(!showClientForm)}>{showClientForm?IC.x:IC.plus} Client</button>
      <button style={{...ADDBTN,flex:1}} onClick={()=>setShowSessionForm(!showSessionForm)}>{showSessionForm?IC.x:IC.plus} Session</button>
    </div>

    {showClientForm&&<div style={{...CARD,marginBottom:14,padding:12}}>
      <input style={INP} placeholder="Nom *" value={clientForm.name} onChange={e=>setClientForm({...clientForm,name:e.target.value})}/>
      <select style={SEL} value={clientForm.segment} onChange={e=>setClientForm({...clientForm,segment:e.target.value})}><option value="">Segment</option>{CLIENT_SEGMENTS.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}</select>
      <button style={SBTN} onClick={submitClient}>Ajouter</button>
    </div>}

    {showSessionForm&&<div style={{...CARD,marginBottom:14,padding:12}}>
      <select style={SEL} value={sessionForm.clientId} onChange={e=>setSessionForm({...sessionForm,clientId:e.target.value})}><option value="">Client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input style={{...INP,marginBottom:8}} type="number" placeholder="Montant €" value={sessionForm.amount} onChange={e=>setSessionForm({...sessionForm,amount:Number(e.target.value)})}/>
      <button style={SBTN} onClick={submitSession}>Enregistrer</button>
    </div>}

    <h3 style={H3}>Clients</h3>
    {clients.length===0?<div style={EMPTY}>Aucun client</div>:clients.map(c=><div key={c.id} style={{...CARD,...CARD_HOVER}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>{c.name}</span><button style={{background:"none",border:"none",color:"#E71D36",cursor:"pointer"}} onClick={()=>removeClient(c.id)}>{IC.trash}</button></div></div>)}
  </div>);
}

// ═══════════════════════════════════════
// ANALYTICS — Charts & Insights
// ═══════════════════════════════════════
function Analytics({sessions,subscriptions,clients}){
  const chartData=useMemo(()=>{
    const last7Days=[];
    for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const day=d.toLocaleDateString("fr-FR",{weekday:"short"});const rev=sessions.filter(s=>new Date(s.date).toLocaleDateString("fr-FR")===d.toLocaleDateString("fr-FR")).reduce((sum,x)=>sum+(x.amount||0),0);last7Days.push({day,revenue:rev})}
    return last7Days;
  },[sessions]);

  const segmentData=useMemo(()=>{
    return CLIENT_SEGMENTS.map(s=>({name:s.name,value:clients.filter(c=>c.segment===s.id).length,color:["#FF6B35","#2EC4B6","#E71D36","#FF9F1C","#00D9FF"][Math.random()*5|0]}))
  },[clients]);

  const COLORS=["#FF6B35","#2EC4B6","#E71D36","#FF9F1C","#00D9FF","#6C5B7B"];

  return(<div style={P}>
    <h2 style={H2}>Analytics 📊</h2>

    <h3 style={H3}>Revenue (7 derniers jours)</h3>
    <div style={{...CARD,padding:10,marginBottom:14}}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
          <XAxis dataKey="day" stroke="#888" style={{fontSize:10}}/>
          <YAxis stroke="#888" style={{fontSize:10}}/>
          <Tooltip contentStyle={{background:"#1a1a2e",border:"1px solid #FF6B35"}}/>
          <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} dot={{fill:"#FF6B35",r:4}}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

    <h3 style={H3}>Clients par segment</h3>
    <div style={{...CARD,padding:10,marginBottom:14}}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={segmentData} cx="50%" cy="50%" labelLine={false} label={e=>`${e.name.split(" ")[0]} (${e.value})`} outerRadius={60} fill="#FF6B35" dataKey="value">
            {segmentData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]}/>)}
          </Pie>
          <Tooltip contentStyle={{background:"#1a1a2e",border:"1px solid #FF6B35"}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>

    <h3 style={H3}>Métriques clés</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <div style={{...CARD,...CARD_HOVER}}><div style={{fontSize:11,color:"#888"}}>Revenue total</div><div style={{fontSize:24,fontWeight:800,color:"#FF9F1C",marginTop:8}}>{sessions.reduce((s,x)=>s+(x.amount||0),0)}€</div></div>
      <div style={{...CARD,...CARD_HOVER}}><div style={{fontSize:11,color:"#888"}}>MRR (Abos)</div><div style={{fontSize:24,fontWeight:800,color:"#2EC4B6",marginTop:8}}>{subscriptions.reduce((s,x)=>s+x.price,0)}€</div></div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════
function Clients({clients,addClient,removeClient}){
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({name:"",segment:""});

  const submit=()=>{if(!form.name.trim())return;addClient(form);setForm({name:"",segment:""});setShowForm(false)};

  return(<div style={P}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h2 style={{...H2,margin:0}}>Clients</h2>
      <button style={ADDBTN} onClick={()=>setShowForm(!showForm)}>{showForm?IC.x:IC.plus}</button>
    </div>

    {showForm&&<div style={{...CARD,padding:14,display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
      <input style={INP} placeholder="Nom *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <select style={SEL} value={form.segment} onChange={e=>setForm({...form,segment:e.target.value})}><option value="">Segment</option>{CLIENT_SEGMENTS.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}</select>
      <button style={SBTN} onClick={submit}>Ajouter</button>
    </div>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      {CLIENT_SEGMENTS.map(s=>{const cnt=clients.filter(c=>c.segment===s.id).length;return<div key={s.id} style={{...CARD,...CARD_HOVER,borderLeft:`4px solid #FF6B35`}}><div style={{fontSize:12,fontWeight:700}}>{s.emoji} {s.name}</div><div style={{fontSize:24,fontWeight:800,color:"#FF6B35",marginTop:4}}>{cnt}</div></div>})}
    </div>

    {clients.length===0?<div style={EMPTY}>Aucun client</div>:clients.map(c=>{const seg=CLIENT_SEGMENTS.find(s=>s.id===c.segment);return<div key={c.id} style={{...CARD,...CARD_HOVER,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700}}>{c.name}</div>{seg&&<div style={{fontSize:10,color:"#2EC4B6"}}>{seg.emoji} {seg.name}</div>}</div><button style={{background:"none",border:"none",color:"#555",cursor:"pointer"}} onClick={()=>removeClient(c.id)}>{IC.trash}</button></div>
    </div>})}
  </div>);
}

// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════
const P={padding:"16px 14px"};
const H2={fontSize:24,fontWeight:800,margin:"0 0 4px"};
const H3={fontSize:15,fontWeight:700,margin:"20px 0 10px"};
const CARD={background:"rgba(255,255,255,0.04)",borderRadius:12,padding:14,marginBottom:8};
const CARD_HOVER={transition:"all 0.3s ease",cursor:"pointer",":hover":{background:"rgba(255,255,255,0.08)"}};
const INP={width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.05)",color:"#F5F0E8",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8,transition:"border-color 0.3s ease"};
const SEL={...INP};
const SBTN={padding:"12px 16px",borderRadius:10,background:"#FF6B35",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",textAlign:"center",width:"100%",transition:"background 0.3s ease"};
const ADDBTN={width:38,height:38,borderRadius:10,background:"#FF6B35",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.3s ease"};
const EMPTY={textAlign:"center",padding:"32px 16px",color:"#555"};

// Add hover effects for interactive elements
if(typeof document!=="undefined"){
  const style=document.createElement("style");
  style.textContent=`
    button:hover { opacity: 0.9; transform: translateY(-2px); }
    input:focus, select:focus { border-color: #FF6B35; background: rgba(255,255,255,0.08); }
    @media (max-width: 640px) {
      main { padding-bottom: 100px; }
    }
  `;
  document.head.appendChild(style);
}
