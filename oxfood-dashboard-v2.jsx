import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════
// OXFOOD — DASHBOARD V2 CONCEPT STRUCTURÉ
// 🔥 3 PILIERS + ABONNEMENTS + TARIFICATION
// ═══════════════════════════════════════

const DREVMCOOK_DB = [
  {id:"dc-lait-amande",category:"base",name:"Lait d'amande maison",description:"Lait végétal doux et crémeux, base DrevmCook essentielle.",difficulty:"Facile",time_minutes:15,servings:4,vegan:true,glutenFree:true,ingredients:["100g amandes","700ml eau filtrée","1 pincée de sel","vanille (optionnel)"],steps:["Tremper les amandes 8-12h","Rincer","Mixer avec l'eau filtrée","Filtrer avec tissu propre","Conserver 2-3 jours au frais"],budget:"3,50 à 6€",tips:"L'okara (pulpe restante) peut servir dans des galettes ou crackers.",nutrition:["Vitamine E","Magnésium","Protéines végétales","Bons lipides"],tags:["anti-gaspi","base","lait végétal","amande"]},
  {id:"dc-lait-courge",category:"base",name:"Lait de graines de courge",description:"Lait végétal riche en zinc et magnésium, signature DrevmCook.",difficulty:"Facile",time_minutes:15,servings:4,vegan:true,glutenFree:true,ingredients:["100g graines de courge","700ml eau filtrée","1 pincée de sel","cannelle (optionnel)"],steps:["Tremper les graines 4-8h","Rincer","Mixer avec l'eau","Filtrer","Conserver au frais 2-3 jours"],budget:"2,50 à 5€",tips:"Ajouter cannelle pour goût chaud et soutien glycémique.",nutrition:["Zinc","Magnésium","Protéines végétales","Bons lipides"],tags:["base","lait végétal","graines de courge"]},
  {id:"dc-levain",category:"base",name:"Levain naturel sans gluten",description:"Le levain c'est une petite vie dans un bocal : tu le nourris, il te nourrit en retour.",difficulty:"Moyen",time_minutes:30,servings:1,vegan:true,glutenFree:true,ingredients:["Farine de riz complet","Farine de fruit à pain / sarrasin / pois chiche","Eau filtrée"],steps:["J1: 30g farine riz + 20g farine fruit à pain + 50ml eau","J2: +25g farine + 25-40ml eau","J3: Retirer si déborde, nourrir 30g+30ml","J4: Nourrir, des bulles apparaissent","J5: Prêt si bulles, gonfle, odeur acidulée"],budget:"3,80 à 6,80€",tips:"Entretien : 1x/jour à temp. ambiante, 1x/semaine au frigo. Restes → pancakes, galettes, crackers.",nutrition:["Glucides complexes","Fibres","Meilleure digestion","Meilleure assimilation"],tags:["base","levain","fermentation","pain","anti-gaspi"]},
  {id:"dc-riz-pilaf",category:"salé",name:"Riz pilaf aux pickles",description:"Riz parfumé accompagné de légumes fermentés maison.",difficulty:"Facile",time_minutes:25,servings:4,vegan:true,glutenFree:true,ingredients:["Riz basmati ou sauvage","Oignon","Ail","Bouquet garni","Pickles ou légumes fermentés","Huile"],steps:["Faire revenir oignon et ail","Ajouter riz","Ajouter eau et bouquet garni","Servir avec pickles"],budget:"4 à 6€",tips:"Restes de riz → pilaf le lendemain.",nutrition:["Énergie","Prébiotiques","Antioxydants","Probiotiques"],tags:["riz","pickles","fermentation","anti-gaspi"]},
  {id:"dc-rainbow",category:"salé",name:"Rainbow Salad DrevmCook",description:"Bowl coloré et vivant — chou, betterave, avocat, tofu.",difficulty:"Facile",time_minutes:15,servings:2,vegan:true,glutenFree:true,ingredients:["Chou rouge","Carotte","Betterave","Avocat","Tofu grillé ou pois chiches","Graines de courge","Sauce citron gingembre"],steps:["Assembler tous les ingrédients en bol coloré"],budget:"5 à 8€",tips:"Plus le bol est coloré, plus les antioxydants sont variés.",nutrition:["Anthocyanes","Fer végétal","Bons lipides","Protéines"],tags:["salade","bowl","coloré","rapide","healthy"]},
  {id:"dc-banane-givree",category:"dessert",name:"Banane givrée cacao",description:"Nice cream express — banane congelée, cacao, graines de courge.",difficulty:"Facile",time_minutes:10,servings:2,vegan:true,glutenFree:true,ingredients:["Bananes mûres","Cacao brut","Graines de courge","Cannelle"],steps:["Couper les bananes","Congeler","Mixer avec cacao"],budget:"2 à 4€",tips:"Banane bien mûre = plus sucrée.",nutrition:["Potassium","Magnésium","Zinc"],tags:["dessert","glace","rapide"]},
];

const CATEGORIES = [
  {id:"all",label:"Tout",emoji:"📖"},
  {id:"base",label:"Bases",emoji:"🧪"},
  {id:"salé",label:"Salé",emoji:"🥗"},
  {id:"dessert",label:"Desserts",emoji:"🍫"},
];

// ═══════════════════════════════════════
// MODÈLE ÉCONOMIQUE OXFOOD
// ═══════════════════════════════════════
const PRICING = {
  services: [
    {id:"placard",emoji:"🏠",name:"Placard → Assiette",desc:"Chef à domicile, placard → recette",base:50,range:[50,80]},
    {id:"prepared",emoji:"🍱",name:"Plats Préparés Revisités",desc:"Reprise ingrédients → plats signature",base:35,range:[30,50]},
    {id:"revaluation",emoji:"🔄",name:"Revalorisation Intelligente",desc:"Anti-gaspi : restes → créations",base:40,range:[30,60]},
  ],
  menus: [
    {id:"simple",name:"Menu Simple",price:10,servings:2},
    {id:"family",name:"Menu Famille",price:18,servings:4},
    {id:"premium",name:"Menu Premium",price:25,servings:4},
  ],
  subscriptions: [
    {id:"weekly-1",name:"1x / semaine",visits:4,price:180,monthly:true,save:"10%"},
    {id:"weekly-2",name:"2x / semaine",visits:8,price:320,monthly:true,save:"20%"},
    {id:"monthly-custom",name:"Forfait custom",visits:0,price:"À discuter",monthly:true,save:"Négocié"},
  ],
};

// ═══════════════════════════════════════
// SEGMENTS CLIENTS
// ═══════════════════════════════════════
const CLIENT_SEGMENTS = [
  {id:"active",emoji:"💼",name:"Actifs débordés",desc:"Cadres / freelancers",pain:"Pas le temps",solution:"Placard→Assiette express"},
  {id:"family",emoji:"👨‍👩‍👧‍👦",name:"Familles",desc:"Enfants / parents",pain:"Nutrition + cuisine",solution:"Placard→Assiette créatif"},
  {id:"airbnb",emoji:"🏡",name:"Airbnb / Touristes",desc:"Expérience unique",pain:"Authenticité locale",solution:"Plats revisités + experience"},
  {id:"artists",emoji:"🎨",name:"Artistes / Créateurs",desc:"Bohème créatif",pain:"Budget limité",solution:"Anti-gaspi + innovation"},
  {id:"health",emoji:"💚",name:"Health conscious",desc:"Végan / bio / détox",pain:"Ingrédients clean",solution:"Recettes DrevmCook signature"},
  {id:"corporate",emoji:"🏢",name:"Événements Corporate",desc:"Team building / lunch talks",pain:"Impact + storytelling",solution:"Expérience culinaire engagée"},
];

// Storage keys
const SK = {clients:"oxfood-clients-v2",sessions:"oxfood-sessions-v2",recipes:"oxfood-recipes-v2",favorites:"oxfood-favorites-v2",subscriptions:"oxfood-subscriptions-v2"};

async function load(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null}catch{return null}}
async function save(k,d){try{await window.storage.set(k,JSON.stringify(d))}catch(e){console.error(e)}}

const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

const IC={
  home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  book:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  spark:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  users:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  price:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  plus:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trash:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  clock:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  heart:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  heartF:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
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
  const subRev=subscriptions.filter(s=>{const d=new Date(s.startDate),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()}).reduce((s,x)=>s+x.price,0);
  const totalMonthRev=monthRev+subRev;

  const tabs=[
    {id:"home",icon:IC.home,label:"Accueil"},
    {id:"pricing",icon:IC.price,label:"Tarifs"},
    {id:"cookbook",icon:IC.book,label:"Recettes"},
    {id:"clients",icon:IC.users,label:"Clients"},
    {id:"subscriptions",icon:IC.spark,label:"Abos"},
  ];

  if(!loaded)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#0F0F1A"}}><div style={{fontSize:56}}>🔥</div><div style={{fontSize:26,fontWeight:800,color:"#FF6B35",letterSpacing:6,marginTop:12}}>OXFOOD</div></div>;

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#0F0F1A",color:"#F5F0E8",minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"linear-gradient(135deg,#16213E,#0F0F1A)",borderBottom:"1px solid rgba(255,107,53,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:24}}>🔥</span><span style={{fontSize:18,fontWeight:800,color:"#FF6B35",letterSpacing:3}}>OXFOOD</span></div>
        <span style={{fontSize:9,color:"#666",textTransform:"uppercase",letterSpacing:2}}>V2 CONCEPT</span>
      </header>
      <main style={{flex:1,overflowY:"auto",paddingBottom:76}}>
        {tab==="home"&&<Home clients={clients} sessions={sessions} subscriptions={subscriptions} monthRev={monthRev} subRev={subRev} totalMonthRev={totalMonthRev} thisMonth={thisMonth} setTab={setTab}/>}
        {tab==="pricing"&&<Pricing/>}
        {tab==="cookbook"&&<Cookbook/>}
        {tab==="clients"&&<Clients clients={clients} addClient={addClient} removeClient={removeClient} sessions={sessions}/>}
        {tab==="subscriptions"&&<Subscriptions subscriptions={subscriptions} addSubscription={addSubscription} clients={clients}/>}
      </main>
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,display:"flex",justifyContent:"space-around",background:"rgba(15,15,26,0.96)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,107,53,0.1)",padding:"6px 0 10px",zIndex:100}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",color:tab===t.id?"#FF6B35":"#666"}}><span style={{opacity:tab===t.id?1:0.45}}>{t.icon}</span><span style={{fontSize:9,fontWeight:tab===t.id?700:500}}>{t.label}</span></button>)}
      </nav>
    </div>
  );
}

// ═══════════ HOME ═══════════
function Home({clients,sessions,subscriptions,monthRev,subRev,totalMonthRev,thisMonth,setTab}){
  const stats=[
    {l:"Clients",v:clients.length,c:"#FF6B35"},
    {l:"Abonnements",v:subscriptions.length,c:"#2EC4B6"},
    {l:"Sessions ce mois",v:thisMonth.length,c:"#E71D36"},
    {l:"Revenu du mois",v:`${totalMonthRev}€`,c:"#FF9F1C"},
  ];
  const recent=[...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const subRecent=[...subscriptions].sort((a,b)=>new Date(b.startDate)-new Date(a.startDate)).slice(0,3);

  return(<div style={P}>
    <h2 style={H2}>OXFOOD 🔥</h2><p style={SUB}>Chef à domicile × Anti-gaspi × Concept structuré</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      {stats.map((s,i)=><div key={i} style={{...CARD,borderLeft:`4px solid ${s.c}`}}><div style={{fontSize:22,fontWeight:800}}>{s.v}</div><div style={{fontSize:10,color:"#888",marginTop:3,textTransform:"uppercase",letterSpacing:1}}>{s.l}</div></div>)}
    </div>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <button style={{...QBTN,background:"#FF6B35"}} onClick={()=>setTab("pricing")}>💰 Tarifs</button>
      <button style={{...QBTN,background:"#2EC4B6"}} onClick={()=>setTab("subscriptions")}>⭐ Abos</button>
      <button style={{...QBTN,background:"#E71D36"}} onClick={()=>setTab("clients")}>👥 Clients</button>
    </div>

    {subRecent.length>0&&<><h3 style={H3}>Abonnements actifs</h3>{subRecent.map(s=><div key={s.id} style={CARD}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>{s.clientName}</span><span style={{fontWeight:800,color:"#2EC4B6"}}>{s.price}€/mois</span></div><div style={{fontSize:11,color:"#888",marginTop:4}}>📅 {s.planName}</div></div>)}</>}

    {recent.length>0&&<><h3 style={H3}>Dernières sessions</h3>{recent.map(s=><div key={s.id} style={CARD}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>{s.clientName||"—"}</span><span style={{fontWeight:800,color:"#FF9F1C"}}>{s.amount}€</span></div><div style={{fontSize:11,color:"#888",marginTop:4,display:"flex",alignItems:"center",gap:4}}>{IC.clock} {new Date(s.date).toLocaleDateString("fr-FR")} • {s.serviceType}</div></div>)}</>}
  </div>);
}

// ═══════════ PRICING PAGE ═══════════
function Pricing(){
  const[view,setView]=useState("services");
  return(<div style={P}>
    <h2 style={H2}>💰 Tarification OXFOOD</h2><p style={SUB}>Transparent × Modulable × Anti-gaspi</p>

    <div style={{display:"flex",gap:6,marginBottom:14}}>
      <button style={{...CHIP,...(view==="services"?CHIPA:{})}} onClick={()=>setView("services")}>Services</button>
      <button style={{...CHIP,...(view==="menus"?CHIPA:{})}} onClick={()=>setView("menus")}>Menus</button>
      <button style={{...CHIP,...(view==="subscriptions"?CHIPA:{})}} onClick={()=>setView("subscriptions")}>Abos</button>
    </div>

    {view==="services"&&<div>
      <h3 style={H3}>🏠 3 Services Core</h3>
      {PRICING.services.map(s=><div key={s.id} style={{...CARD,marginBottom:10}}>
        <div style={{fontSize:14,fontWeight:700}}>{s.emoji} {s.name}</div>
        <div style={{fontSize:12,color:"#888",marginTop:2}}>{s.desc}</div>
        <div style={{fontSize:18,fontWeight:800,color:"#FF6B35",marginTop:8}}>{s.range[0]}€ — {s.range[1]}€</div>
        <div style={{fontSize:11,color:"#666",marginTop:4}}>Base: {s.base}€</div>
      </div>)}
    </div>}

    {view==="menus"&&<div>
      <h3 style={H3}>🍱 Menus À La Carte</h3>
      {PRICING.menus.map(m=><div key={m.id} style={{...CARD,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700}}>{m.name}</div><div style={{fontSize:18,fontWeight:800,color:"#FF9F1C"}}>{m.price}€</div></div>
        <div style={{fontSize:11,color:"#888",marginTop:4}}>👥 {m.servings} personnes</div>
      </div>)}
    </div>}

    {view==="subscriptions"&&<div>
      <h3 style={H3}>⭐ Forfaits Abonnement</h3>
      {PRICING.subscriptions.map(s=><div key={s.id} style={{...CARD,marginBottom:10,borderLeft:`4px solid #2EC4B6`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700}}>{s.name}</div><div style={{fontSize:16,fontWeight:800,color:"#2EC4B6"}}>{s.price}{typeof s.price==="number"?"€":""}</div></div>
        {s.visits>0&&<div style={{fontSize:11,color:"#888",marginTop:4}}>📅 {s.visits} visites/mois</div>}
        <div style={{fontSize:10,color:"#2EC4B6",marginTop:4,fontWeight:700}}>{s.save} d'économies</div>
      </div>)}
    </div>}
  </div>);
}

// ═══════════ COOKBOOK ═══════════
function Cookbook(){
  const[cat,setCat]=useState("all");
  const[search,setSearch]=useState("");
  const[selected,setSelected]=useState(null);

  const filtered=useMemo(()=>{
    let l=DREVMCOOK_DB;
    if(cat!=="all")l=l.filter(r=>r.category===cat);
    if(search.trim()){const q=search.toLowerCase();l=l.filter(r=>r.name.toLowerCase().includes(q)||r.ingredients.some(i=>i.toLowerCase().includes(q)))}
    return l;
  },[cat,search]);

  if(selected)return<Detail r={selected} onBack={()=>setSelected(null)}/>;

  return(<div style={P}>
    <h2 style={H2}>📖 DrevmCook</h2><p style={SUB}>Recettes signature • Végan • Sans gluten • Anti-gaspi</p>
    <div style={{position:"relative",marginBottom:10}}><input style={{...INP,paddingLeft:36}} placeholder="Chercher recette, ingrédient..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      {CATEGORIES.map(c=><button key={c.id} style={{...CHIP,...(cat===c.id?CHIPA:{})}} onClick={()=>setCat(c.id)}>{c.emoji} {c.label}</button>)}
    </div>
    {filtered.length===0?<div style={EMPTY}><div style={{fontSize:40}}>🥥</div><p>Aucune recette trouvée</p></div>:
      filtered.map(r=><button key={r.id} style={ROW} onClick={()=>setSelected(r)}>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#F5F0E8",textAlign:"left"}}>{r.name}</div><div style={{fontSize:11,color:"#888",marginTop:2}}>{IC.clock} {r.time_minutes}min • {r.difficulty}</div></div>
      </button>)
    }
  </div>);
}

function Detail({r,onBack}){
  return(<div style={P}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <button style={BACK} onClick={onBack}>{IC.back}</button>
      <h2 style={{fontSize:19,fontWeight:800,color:"#FF6B35",margin:0,flex:1}}>{r.name}</h2>
    </div>
    <p style={{fontSize:13,color:"#CCC",lineHeight:1.5,margin:"0 0 14px"}}>{r.description}</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,fontSize:12,color:"#999",marginBottom:16,alignItems:"center"}}>
      <span style={{display:"flex",alignItems:"center",gap:3}}>{IC.clock} {r.time_minutes} min</span><span>👥 {r.servings}</span>
      <span style={{color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:r.difficulty==="Facile"?"#2EC4B6":"#FF9F1C"}}>{r.difficulty}</span>
    </div>
    <div style={{marginBottom:14}}><h4 style={SEC}>Ingrédients</h4>{r.ingredients.map((x,i)=><div key={i} style={{fontSize:13,color:"#CCC",padding:"4px 0"}}>• {x}</div>)}</div>
    <div style={{marginBottom:14}}><h4 style={SEC}>Préparation</h4>{r.steps.map((x,i)=><div key={i} style={{display:"flex",gap:10,padding:"6px 0",fontSize:13,color:"#CCC"}}><span style={STEPN}>{i+1}</span><span>{x}</span></div>)}</div>
    {r.budget&&<div style={{fontSize:13,color:"#FF9F1C"}}>💰 {r.budget}</div>}
  </div>);
}

// ═══════════ CLIENTS ═══════════
function Clients({clients,addClient,removeClient,sessions}){
  const[show,setShow]=useState(false);
  const[f,sF]=useState({name:"",segment:"",phone:"",address:"",notes:""});
  const submit=()=>{if(!f.name.trim())return;addClient(f);sF({name:"",segment:"",phone:"",address:"",notes:""});setShow(false)};
  const cs=(id)=>sessions.filter(s=>s.clientId===id).length;

  return(<div style={P}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h2 style={{...H2,margin:0}}>Clients</h2>
      <button style={ADDBTN} onClick={()=>setShow(!show)}>{show?IC.x:IC.plus}</button>
    </div>

    {show&&<div style={{...CARD,padding:14,display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
      <input style={INP} placeholder="Nom *" value={f.name} onChange={e=>sF({...f,name:e.target.value})}/>
      <select style={SEL} value={f.segment} onChange={e=>sF({...f,segment:e.target.value})}><option value="">— Segment —</option>{CLIENT_SEGMENTS.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}</select>
      <input style={INP} placeholder="Téléphone" value={f.phone} onChange={e=>sF({...f,phone:e.target.value})}/>
      <input style={INP} placeholder="Adresse" value={f.address} onChange={e=>sF({...f,address:e.target.value})}/>
      <textarea style={{...INP,minHeight:40}} placeholder="Notes" value={f.notes} onChange={e=>sF({...f,notes:e.target.value})}/>
      <button style={SBTN} onClick={submit}>Ajouter</button>
    </div>}

    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,marginBottom:20}}>
      {CLIENT_SEGMENTS.map(s=>{const cnt=clients.filter(c=>c.segment===s.id).length;return cnt>0?<div key={s.id} style={{...CARD,borderLeft:`4px solid #FF6B35`}}><div style={{fontSize:12,fontWeight:700}}>{s.emoji} {s.name}</div><div style={{fontSize:32,fontWeight:800,color:"#FF6B35",marginTop:4}}>{cnt}</div></div>:null})}
    </div>

    {clients.length===0?<div style={EMPTY}><div style={{fontSize:40}}>👥</div><p>Aucun client</p></div>:
      clients.map(c=>{const seg=CLIENT_SEGMENTS.find(s=>s.id===c.segment);return<div key={c.id} style={{...CARD,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:14}}>{c.name}</div>{seg&&<div style={{fontSize:10,color:"#2EC4B6"}}>{seg.emoji} {seg.name}</div>}{c.phone&&<div style={{fontSize:11,color:"#888"}}>📱 {c.phone}</div>}</div><button style={{background:"none",border:"none",color:"#555",cursor:"pointer"}} onClick={()=>removeClient(c.id)}>{IC.trash}</button></div>
        <div style={{fontSize:12,color:"#888",marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)"}}>{cs(c.id)} sessions</div>
      </div>})
    }
  </div>);
}

// ═══════════ SUBSCRIPTIONS ═══════════
function Subscriptions({subscriptions,addSubscription,clients}){
  const[show,setShow]=useState(false);
  const[f,sF]=useState({clientId:"",clientName:"",planId:"",planName:"",price:180,startDate:new Date().toISOString().split("T")[0]});
  const submit=()=>{const cn=f.clientId?clients.find(c=>c.id===f.clientId)?.name:f.clientName;const plan=PRICING.subscriptions.find(p=>p.id===f.planId);addSubscription({...f,clientName:cn,planName:plan?.name||f.planName,price:typeof plan?.price==="number"?plan.price:f.price});sF({clientId:"",clientName:"",planId:"",planName:"",price:180,startDate:new Date().toISOString().split("T")[0]});setShow(false)};

  return(<div style={P}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h2 style={{...H2,margin:0}}>Abonnements</h2>
      <button style={ADDBTN} onClick={()=>setShow(!show)}>{show?IC.x:IC.plus}</button>
    </div>
    <p style={SUB}>Récurrence × Loyalty × Revenue stable</p>

    {show&&<div style={{...CARD,padding:14,display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
      <select style={SEL} value={f.clientId} onChange={e=>sF({...f,clientId:e.target.value})}><option value="">— Client —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      {!f.clientId&&<input style={INP} placeholder="Nom client" value={f.clientName} onChange={e=>sF({...f,clientName:e.target.value})}/>}
      <select style={SEL} value={f.planId} onChange={e=>{const p=PRICING.subscriptions.find(x=>x.id===e.target.value);sF({...f,planId:e.target.value,price:typeof p?.price==="number"?p.price:f.price})}}><option value="">— Plan —</option>{PRICING.subscriptions.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <input style={INP} type="date" value={f.startDate} onChange={e=>sF({...f,startDate:e.target.value})}/>
      <button style={SBTN} onClick={submit}>Créer abo</button>
    </div>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      <div style={{...CARD,borderLeft:`4px solid #2EC4B6`}}><div style={{fontSize:12,color:"#888"}}>Abos actifs</div><div style={{fontSize:28,fontWeight:800,color:"#2EC4B6"}}>{subscriptions.length}</div></div>
      <div style={{...CARD,borderLeft:`4px solid #FF9F1C`}}><div style={{fontSize:12,color:"#888"}}>MRR (mensuel)</div><div style={{fontSize:28,fontWeight:800,color:"#FF9F1C"}}>{subscriptions.reduce((s,x)=>s+(typeof x.price==="number"?x.price:0),0)}€</div></div>
    </div>

    {subscriptions.length===0?<div style={EMPTY}><div style={{fontSize:40}}>⭐</div><p>Aucun abonnement</p></div>:
      subscriptions.map(s=><div key={s.id} style={{...CARD,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:700}}>{s.clientName}</div><div style={{fontSize:11,color:"#888"}}>📅 {s.planName}</div></div><span style={{fontSize:18,fontWeight:800,color:"#2EC4B6"}}>{s.price}€</span></div>
        <div style={{fontSize:10,color:"#666",marginTop:6}}>Depuis: {new Date(s.startDate).toLocaleDateString("fr-FR")}</div>
      </div>)
    }
  </div>);
}

// ═══════════ STYLES ═══════════
const P={padding:"16px 14px"};
const H2={fontSize:24,fontWeight:800,margin:"0 0 4px"};
const H3={fontSize:15,fontWeight:700,margin:"20px 0 10px"};
const SUB={fontSize:12,color:"#888",margin:"0 0 16px"};
const CARD={background:"rgba(255,255,255,0.04)",borderRadius:12,padding:14,marginBottom:8};
const QBTN={flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#FF6B35",color:"#fff",border:"none",borderRadius:10,padding:"12px 10px",fontSize:12,fontWeight:700,cursor:"pointer",minHeight:40};
const INP={width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.05)",color:"#F5F0E8",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8};
const SEL={...INP};
const SBTN={padding:"12px 16px",borderRadius:10,background:"#FF6B35",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",textAlign:"center",width:"100%"};
const ADDBTN={width:38,height:38,borderRadius:10,background:"#FF6B35",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};
const CHIP={padding:"6px 11px",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",color:"#888",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3};
const CHIPA={background:"rgba(255,107,53,0.18)",borderColor:"#FF6B35",color:"#FF6B35"};
const EMPTY={textAlign:"center",padding:"32px 16px",color:"#555"};
const SEC={fontSize:13,fontWeight:700,color:"#F5F0E8",margin:"0 0 6px"};
const STEPN={width:22,height:22,borderRadius:"50%",background:"#FF6B35",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0};
const ROW={width:"100%",display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"11px 12px",marginBottom:5,border:"1px solid rgba(255,255,255,0.04)",cursor:"pointer",textAlign:"left",fontFamily:"inherit"};
const BACK={width:34,height:34,borderRadius:8,background:"rgba(255,255,255,0.06)",color:"#F5F0E8",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"};
