import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════
// DREVMCOOK DATABASE — 35+ recettes
// ═══════════════════════════════════════
const DREVMCOOK_DB = [
  {id:"dc-lait-amande",category:"base",name:"Lait d'amande maison",description:"Lait végétal doux et crémeux, base DrevmCook essentielle.",difficulty:"Facile",time_minutes:15,servings:4,vegan:true,glutenFree:true,ingredients:["100g amandes","700ml eau filtrée","1 pincée de sel","vanille (optionnel)"],steps:["Tremper les amandes 8-12h","Rincer","Mixer avec l'eau filtrée","Filtrer avec tissu propre","Conserver 2-3 jours au frais"],budget:"3,50 à 6€",tips:"L'okara (pulpe restante) peut servir dans des galettes ou crackers.",nutrition:["Vitamine E","Magnésium","Protéines végétales","Bons lipides"],tags:["anti-gaspi","base","lait végétal","amande"]},
  {id:"dc-lait-courge",category:"base",name:"Lait de graines de courge",description:"Lait végétal riche en zinc et magnésium, signature DrevmCook.",difficulty:"Facile",time_minutes:15,servings:4,vegan:true,glutenFree:true,ingredients:["100g graines de courge","700ml eau filtrée","1 pincée de sel","cannelle (optionnel)"],steps:["Tremper les graines 4-8h","Rincer","Mixer avec l'eau","Filtrer","Conserver au frais 2-3 jours"],budget:"2,50 à 5€",tips:"Ajouter cannelle pour goût chaud et soutien glycémique.",nutrition:["Zinc","Magnésium","Protéines végétales","Bons lipides"],tags:["base","lait végétal","graines de courge"]},
  {id:"dc-levain",category:"base",name:"Levain naturel sans gluten",description:"Le levain c'est une petite vie dans un bocal : tu le nourris, il te nourrit en retour.",difficulty:"Moyen",time_minutes:30,servings:1,vegan:true,glutenFree:true,ingredients:["Farine de riz complet","Farine de fruit à pain / sarrasin / pois chiche","Eau filtrée"],steps:["J1: 30g farine riz + 20g farine fruit à pain + 50ml eau","J2: +25g farine + 25-40ml eau","J3: Retirer si déborde, nourrir 30g+30ml","J4: Nourrir, des bulles apparaissent","J5: Prêt si bulles, gonfle, odeur acidulée"],budget:"3,80 à 6,80€",tips:"Entretien : 1x/jour à temp. ambiante, 1x/semaine au frigo. Restes → pancakes, galettes, crackers.",nutrition:["Glucides complexes","Fibres","Meilleure digestion","Meilleure assimilation"],tags:["base","levain","fermentation","pain","anti-gaspi"]},
  {id:"dc-mini-baguettes",category:"salé",name:"Mini baguettes maison",description:"4 petites baguettes sans gluten, croustillantes et moelleuses.",difficulty:"Moyen",time_minutes:120,servings:4,vegan:true,glutenFree:true,ingredients:["350g farine ou mélange sans gluten","1 sachet levure boulangère","250-280ml eau tiède","2 c.s. huile de tournesol","Sel","Herbes aromatiques","Graines de courge (optionnel)"],steps:["Activer la levure dans l'eau tiède avec l'huile","Ajouter farine, sel, herbes","Mélanger","Couvrir 30 min au chaud","Rabats toutes les 30 min × 3","Fariner le plan, séparer en 4","Griffer le dessus","Cuire 200°C, 15-20 min"],budget:"2,40 à 6€",tips:"Version enrichie : ajouter graines de courge pour zinc et protéines.",nutrition:["Énergie","Fibres","Zinc","Magnésium"],tags:["pain","baguette","sans gluten","base"]},
  {id:"dc-focaccia",category:"salé",name:"Focaccia DrevmCook sans gluten",description:"Focaccia moelleuse aux herbes et ail, base levain ou levure.",difficulty:"Moyen",time_minutes:150,servings:6,vegan:true,glutenFree:true,ingredients:["300g farine sans gluten","100g levain actif ou levure","250ml eau tiède","3 c.s. huile","Sel","Ail","Thym / romarin","Tomates ou oignons","Graines de courge (optionnel)"],steps:["Mélanger farine, levain, eau, huile et sel","Laisser pousser 1-2h","Verser dans un plat huilé","Faire des trous avec les doigts","Ajouter ail, herbes, tomates/oignons","Cuire 20-25 min à 200°C"],budget:"5 à 8€",tips:"Restes de focaccia → croûtons ou pain perdu salé.",nutrition:["Allicine","Lycopène","Antioxydants","Énergie"],tags:["pain","focaccia","levain","ail","herbes"]},
  {id:"dc-galettes",category:"salé",name:"Galettes anti-gaspillage au levain",description:"Transforme les restes de levain en galettes croustillantes.",difficulty:"Facile",time_minutes:15,servings:4,vegan:true,glutenFree:true,ingredients:["Reste de levain","Farine de pois chiche ou riz","Eau","Sel","Herbes","Huile pour cuisson"],steps:["Mélanger levain + farine + eau","Ajouter sel et herbes","Cuire à la poêle comme une crêpe épaisse"],budget:"1 à 2€",tips:"Zéro déchet : chaque rafraîchi de levain peut devenir galette.",nutrition:["Protéines végétales","Fibres","Fer","Fermentation"],tags:["anti-gaspi","levain","galette","rapide"]},
  {id:"dc-crackers",category:"salé",name:"Crackers au levain",description:"Crackers croustillants aux graines, parfaits pour l'apéro.",difficulty:"Facile",time_minutes:25,servings:6,vegan:true,glutenFree:true,ingredients:["Reste de levain","Graines de courge","Sel","Herbes","Huile"],steps:["Étaler très finement","Ajouter graines et herbes","Cuire à 180°C jusqu'à croustillant"],budget:"1,50 à 3€",tips:"Varier les graines : chia, sésame, lin.",nutrition:["Zinc","Magnésium","Protéines","Fermentation"],tags:["anti-gaspi","levain","snack","apéro"]},
  {id:"dc-pizza",category:"salé",name:"Pizza rustique sans gluten",description:"Pizza maison sur base focaccia ou levain, garnie selon le placard.",difficulty:"Moyen",time_minutes:40,servings:4,vegan:true,glutenFree:true,ingredients:["Pâte à focaccia ou levain","Sauce tomate","Oignons","Légumes disponibles","Fromage ou version vegan","Herbes"],steps:["Étaler la pâte","Précuire 8 min","Garnir","Cuire encore 12-15 min"],budget:"6 à 10€",tips:"Version vegan : crème de coco salée, tofu émietté ou levure nutritionnelle.",nutrition:["Lycopène","Fibres","Énergie","Antioxydants"],tags:["pizza","levain","anti-gaspi","placard"]},
  {id:"dc-houmous",category:"salé",name:"Houmous vivant",description:"Houmous crémeux aux graines de courge, boosté lactofermentation.",difficulty:"Facile",time_minutes:10,servings:4,vegan:true,glutenFree:true,ingredients:["Pois chiches cuits","Ail","Citron vert","Tahini ou graines de courge mixées","Huile","Sel","Jus de lactofermentation (optionnel)"],steps:["Mixer tous les ingrédients jusqu'à texture crémeuse"],budget:"4 à 7€",tips:"Ajouter jus de lactofermentation pour boost probiotique.",nutrition:["Protéines","Fibres","Fer","Zinc","Vitamine C"],tags:["houmous","pois chiche","rapide","probiotique"]},
  {id:"dc-riz-pilaf",category:"salé",name:"Riz pilaf aux pickles",description:"Riz parfumé accompagné de légumes fermentés maison.",difficulty:"Facile",time_minutes:25,servings:4,vegan:true,glutenFree:true,ingredients:["Riz basmati ou sauvage","Oignon","Ail","Bouquet garni","Pickles ou légumes fermentés","Huile"],steps:["Faire revenir oignon et ail","Ajouter riz","Ajouter eau et bouquet garni","Servir avec pickles"],budget:"4 à 6€",tips:"Restes de riz → pilaf le lendemain.",nutrition:["Énergie","Prébiotiques","Antioxydants","Probiotiques"],tags:["riz","pickles","fermentation","anti-gaspi"]},
  {id:"dc-rainbow",category:"salé",name:"Rainbow Salad DrevmCook",description:"Bowl coloré et vivant — chou, betterave, avocat, tofu.",difficulty:"Facile",time_minutes:15,servings:2,vegan:true,glutenFree:true,ingredients:["Chou rouge","Carotte","Betterave","Avocat","Tofu grillé ou pois chiches","Graines de courge","Sauce citron gingembre"],steps:["Assembler tous les ingrédients en bol coloré"],budget:"5 à 8€",tips:"Plus le bol est coloré, plus les antioxydants sont variés.",nutrition:["Anthocyanes","Fer végétal","Bons lipides","Protéines"],tags:["salade","bowl","coloré","rapide","healthy"]},
  {id:"dc-club-sandwich",category:"salé",name:"Club sandwich végétal",description:"Sandwich généreux au jacquier ou champignons et chou fermenté.",difficulty:"Facile",time_minutes:15,servings:2,vegan:true,glutenFree:true,ingredients:["Pain sans gluten maison","Jacquier ou champignons","Chou fermenté","Roquette ou salade","Sauce végétale"],steps:["Griller le pain","Garnir","Presser légèrement","Couper en triangles"],budget:"5 à 8€",tips:"Jacquier effiloché = texture viande bluffante.",nutrition:["Protéines","Probiotiques","Fibres","Vitamines"],tags:["sandwich","rapide","fermentation","jacquier"]},
  {id:"dc-carottes",category:"fermentation",name:"Carottes épicées fermentées",description:"Carottes croquantes au gingembre et cannelle, 2-3 semaines.",difficulty:"Facile",time_minutes:20,servings:8,vegan:true,glutenFree:true,ingredients:["1kg carottes","10g sel marin","Gingembre","Cannelle","Ail"],steps:["Râper les carottes","Ajouter sel et épices","Malaxer pour faire sortir le jus","Tasser en bocal","Compléter eau si besoin","Garder immergé","Fermenter 2-3 semaines"],budget:"4 à 6€",tips:"Goûter chaque semaine pour trouver l'acidité parfaite.",nutrition:["Bêta-carotène","Gingérols","Antioxydants","Probiotiques"],tags:["fermentation","carotte","conservation","probiotique"]},
  {id:"dc-choufleur",category:"fermentation",name:"Chou-fleur en saumure",description:"Chou-fleur lactofermenté, croquant et digestif.",difficulty:"Facile",time_minutes:15,servings:6,vegan:true,glutenFree:true,ingredients:["550g chou-fleur","30g sel","450g eau"],steps:["Couper le chou-fleur","Dissoudre sel dans l'eau","Mettre en bocal","Couvrir de saumure","Fermenter 2-3 semaines"],budget:"5 à 7€",tips:"Ajouter curcuma pour version dorée anti-inflammatoire.",nutrition:["Vitamine C","Sulforaphane","Fibres","Probiotiques"],tags:["fermentation","chou-fleur","saumure"]},
  {id:"dc-chou-rouge-lacto",category:"fermentation",name:"Chou rouge lactofermenté",description:"Choucroute rouge maison, riche en anthocyanes.",difficulty:"Facile",time_minutes:20,servings:8,vegan:true,glutenFree:true,ingredients:["Chou rouge","Sel marin","Ail (optionnel)","Gingembre (optionnel)"],steps:["Émincer","Saler et malaxer","Tasser en bocal","Garder immergé","Fermenter 1-3 semaines"],budget:"3 à 5€",tips:"Plus tu malaxes, plus le jus sort.",nutrition:["Anthocyanes","Vitamine C","Fibres","Antioxydants"],tags:["fermentation","chou rouge","lactofermentation"]},
  {id:"dc-pickles-chou",category:"fermentation",name:"Pickles de chou rouge doux",description:"Quick pickles sucrés-salés à la cardamome.",difficulty:"Facile",time_minutes:15,servings:6,vegan:true,glutenFree:true,ingredients:["1/2 chou rouge","Vinaigre de cidre","Eau","Sel","Sucre","Poivre","Cardamome"],steps:["Chauffer eau + vinaigre + sel + sucre","Verser sur chou émincé","Refroidir","Conserver au frais"],budget:"5 à 7€",tips:"Prêts en 1h, meilleurs après 24h.",nutrition:["Digestion","Antioxydants","Conservation"],tags:["pickles","rapide","chou rouge"]},
  {id:"dc-lahana",category:"fermentation",name:"Lahana Tursusu",description:"Pickles turcs de chou blanc — parfaits pour sandwichs et bowls.",difficulty:"Facile",time_minutes:15,servings:8,vegan:true,glutenFree:true,ingredients:["Chou blanc","Ail","Carotte (optionnel)","Vinaigre","Eau","Sel"],steps:["Émincer le chou","Préparer saumure vinaigrée","Mettre en bocal avec ail","Conserver au frais"],budget:"3 à 5€",tips:"Excellent accompagnement pour club sandwich végétal.",nutrition:["Probiotiques","Fibres","Allicine"],tags:["pickles","turc","chou blanc"]},
  {id:"dc-sauce-piquante",category:"fermentation",name:"Sauce piquante fermentée",description:"Hot sauce maison fermentée — capsaïcine et probiotiques.",difficulty:"Facile",time_minutes:15,servings:10,vegan:true,glutenFree:true,ingredients:["Piments","Ail","Sel","Eau","Gingembre (optionnel)"],steps:["Mettre en saumure","Fermenter 1-2 semaines","Mixer"],budget:"3 à 5€",tips:"Plus la fermentation est longue, plus la sauce est complexe.",nutrition:["Capsaïcine","Allicine","Anti-inflammatoire","Probiotiques"],tags:["sauce","piment","fermentation"]},
  {id:"dc-ail-miel",category:"fermentation",name:"Ail fermenté au miel",description:"Ail confit dans le miel — immunité et tradition.",difficulty:"Facile",time_minutes:10,servings:20,vegan:false,glutenFree:true,ingredients:["Ail cru","Miel brut"],steps:["Mettre gousses dans le miel","Retourner le bocal régulièrement","Attendre plusieurs semaines"],budget:"6 à 10€",tips:"Version vegan : ail lactofermenté en saumure.",nutrition:["Allicine","Immunité","Énergie rapide"],tags:["ail","miel","fermentation","immunité"]},
  {id:"dc-kombucha",category:"fermentation",name:"Kombucha maison",description:"Boisson vivante fermentée, alternative aux sodas.",difficulty:"Moyen",time_minutes:30,servings:8,vegan:true,glutenFree:true,ingredients:["Thé","Sucre","SCOBY","Starter de kombucha"],steps:["Préparer thé sucré","Laisser refroidir","Ajouter SCOBY et starter","Couvrir avec tissu","Fermenter 7-14 jours","Mettre en bouteille"],budget:"5 à 10€",tips:"Ne pas fermer hermétiquement en 1ère fermentation.",nutrition:["Probiotiques","Acidité digestive","Hydratation"],tags:["boisson","fermentation","kombucha"]},
  {id:"dc-kefir",category:"fermentation",name:"Kéfir de coco",description:"Boisson probiotique tropicale à base d'eau de coco.",difficulty:"Facile",time_minutes:10,servings:4,vegan:true,glutenFree:true,ingredients:["Eau de coco ou lait de coco dilué","Grains de kéfir adaptés"],steps:["Mélanger eau de coco et grains de kéfir","Fermenter 24-48h","Filtrer"],budget:"4 à 8€",tips:"Électrolytes + probiotiques = combo récupération.",nutrition:["Électrolytes","Hydratation","Flore intestinale"],tags:["boisson","kéfir","coco","tropical"]},
  {id:"dc-kvass",category:"fermentation",name:"Kvass de betterave",description:"Boisson fermentée de betterave — fer et circulation.",difficulty:"Facile",time_minutes:10,servings:4,vegan:true,glutenFree:true,ingredients:["Betterave","Eau","Sel"],steps:["Couper la betterave","Saumure légère","Fermenter quelques jours"],budget:"2 à 4€",tips:"Couleur intense, parfait en shot matin.",nutrition:["Fer végétal","Nitrates naturels","Circulation"],tags:["boisson","betterave","fermentation"]},
  {id:"dc-infusion-fap",category:"boisson",name:"Infusion feuilles de fruit à pain",description:"Infusion traditionnelle antillaise — polyphénols et digestion.",difficulty:"Facile",time_minutes:20,servings:4,vegan:true,glutenFree:true,ingredients:["4-6 feuilles de fruit à pain","1L eau","Gingembre (optionnel)","Cannelle (optionnel)","Miel (optionnel)"],steps:["Nettoyer les feuilles","Faire bouillir l'eau","Ajouter les feuilles","Frémir 10-15 min","Filtrer"],budget:"0,80 à 1,50€",tips:"Version fraîche : refroidir + citron vert + menthe + atoumo.",nutrition:["Polyphénols","Flavonoïdes","Potassium","Digestion"],tags:["boisson","infusion","fruit à pain","tradition"]},
  {id:"dc-matcha-moringa",category:"boisson",name:"Matcha ou Moringa DrevmCook",description:"Matin productif = matcha. Récupération = moringa.",difficulty:"Facile",time_minutes:5,servings:1,vegan:true,glutenFree:true,ingredients:["Matcha ou moringa en poudre","Lait végétal","Cannelle","Vanille"],steps:["Chauffer le lait végétal","Fouetter matcha ou moringa","Ajouter cannelle et vanille"],budget:"1 à 3€",tips:"Matcha = concentration calme. Moringa = boost minéraux local.",nutrition:["Catéchines","L-théanine","Fer","Calcium","Chlorophylle"],tags:["boisson","matcha","moringa","énergie"]},
  {id:"dc-banoffee",category:"dessert",name:"Banoffee Pie Créole sans gluten",description:"Tarte banane-caramel coco, base farine de fruit à pain.",difficulty:"Moyen",time_minutes:60,servings:6,vegan:true,glutenFree:true,ingredients:["Farine de fruit à pain ou riz","Coco râpée","Sucre roux","Huile de coco","Lait de coco","Vanille","Bananes mûres","Cannelle","Aquafaba (optionnel)"],steps:["Base : farine + coco + sucre + huile","Presser dans moule","Cuire légèrement","Réduire lait coco + sucre + vanille en caramel","Ajouter bananes","Couvrir d'aquafaba","Réfrigérer"],budget:"13 à 16€",tips:"Aquafaba remplace les blancs d'œufs.",nutrition:["Potassium","Vitamine B6","Bons lipides","Fibres"],tags:["dessert","banane","coco","créole"]},
  {id:"dc-tiramisu",category:"dessert",name:"Tiramisu Banane Chocolat",description:"Tiramisu tropical — banane, cacao brut, crème de coco.",difficulty:"Moyen",time_minutes:30,servings:6,vegan:true,glutenFree:true,ingredients:["4 bananes mûres","200g biscuits sans gluten","Cacao brut","Café (optionnel)","Cannelle","Crème de coco","Aquafaba","Sucre roux","Vanille","Chocolat noir fondu"],steps:["Préparer crème : coco + sucre + vanille + aquafaba","Préparer base biscuitée","Monter couches : biscuit, banane, crème, cacao","Ajouter chocolat noir fondu","Repos au frais 4h minimum"],budget:"11 à 18€",tips:"Ajouter graines de courge torréfiées et fleur de sel.",nutrition:["Potassium","Magnésium","Flavonoïdes","Fer"],tags:["dessert","tiramisu","banane","chocolat"]},
  {id:"dc-mm",category:"dessert",name:"M&M's Maison Naturels",description:"Bonbons cacao-amande enrobés de couleurs naturelles.",difficulty:"Moyen",time_minutes:60,servings:20,vegan:true,glutenFree:true,ingredients:["120g poudre d'amande","50g cacao 100%","60g sucre de coco","Sel","1 c.s. vanille","3 c.s. lait végétal","Chocolat blanc ou noir","Huile de coco","Poudres : matcha, spiruline, betterave, maca"],steps:["Mélanger amande, cacao, sucre, sel","Ajouter vanille et lait végétal","Former boule, couper 1cm","Congeler 10-20 min","Fondre chocolat + huile + colorant","Enrober","Congeler 10-30 min"],budget:"11 à 23€",tips:"Variante locale : cacao local, zeste citron vert, cannelle péyi.",nutrition:["Vitamine E","Magnésium","Antioxydants","Fer"],tags:["dessert","snack","chocolat","amande"]},
  {id:"dc-snickers",category:"dessert",name:"Snickers Maison DrevmCook",description:"Barres nougat-caramel-cacahuète enrobées chocolat noir.",difficulty:"Moyen",time_minutes:45,servings:10,vegan:true,glutenFree:true,ingredients:["Poudre d'amande","Beurre de cacahuète","Lait végétal","Sirop naturel","Sel","Vanille","Dattes","Eau chaude","Cacahuètes grillées","Chocolat noir","Huile de coco"],steps:["Mélanger base nougat","Étaler dans moule","Mixer dattes + beurre cacahuète + eau + sel","Étaler le caramel","Ajouter cacahuètes","Congeler","Couper en barres","Enrober chocolat + huile de coco"],budget:"14 à 25€",tips:"Variante : banane séchée, cacao local, cannelle péyi.",nutrition:["Potassium","Protéines","Bons lipides","Magnésium"],tags:["dessert","snack","barre","chocolat"]},
  {id:"dc-banane-givree",category:"dessert",name:"Banane givrée cacao graines de courge",description:"Nice cream express — banane congelée, cacao, graines de courge.",difficulty:"Facile",time_minutes:10,servings:2,vegan:true,glutenFree:true,ingredients:["Bananes mûres","Cacao brut","Graines de courge","Cannelle","Lait végétal (optionnel)"],steps:["Couper les bananes","Congeler","Mixer avec cacao et lait végétal","Ajouter graines de courge"],budget:"2 à 4€",tips:"Banane bien mûre = plus sucrée = zéro sucre ajouté.",nutrition:["Potassium","Magnésium","Zinc","Antioxydants"],tags:["dessert","glace","banane","rapide","anti-gaspi"]},
];

const CATEGORIES = [
  {id:"all",label:"Tout",emoji:"📖"},
  {id:"base",label:"Bases",emoji:"🧪"},
  {id:"salé",label:"Salé",emoji:"🥗"},
  {id:"fermentation",label:"Fermentation",emoji:"🫙"},
  {id:"boisson",label:"Boissons",emoji:"🍵"},
  {id:"dessert",label:"Desserts",emoji:"🍫"},
];

const SK = {clients:"oxfood-clients",sessions:"oxfood-sessions",recipes:"oxfood-recipes",favorites:"oxfood-favorites"};
async function load(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null}catch{return null}}
async function save(k,d){try{await window.storage.set(k,JSON.stringify(d))}catch(e){console.error(e)}}

async function generateRecipe(ingredients,preferences,style){
  const prompt=`Tu es OXFOOD/DrevmCook, chef créatif cuisine végétale anti-gaspi, fusion caribéenne, sans gluten.
Ingrédients dispo : ${ingredients.join(", ")}
Préférences : ${preferences||"Végan, sans gluten"}
Style : ${style||"Fusion caribéenne"}
Propose UNE recette. Réponds UNIQUEMENT en JSON valide sans backticks :
{"name":"","description":"","difficulty":"Facile|Moyen|Avancé","time_minutes":30,"servings":2,"ingredients_used":[],"ingredients_extra":[],"steps":[],"tips":"","vegan":true,"glutenFree":true,"nutrition":[]}`;
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});const d=await r.json();const t=d.content?.map(b=>b.text||"").join("")||"";return JSON.parse(t.replace(/```json|```/g,"").trim())}catch(e){console.error(e);return null}
}

const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

const IC={
  home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  book:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  spark:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  users:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  dollar:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  plus:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trash:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  clock:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  leaf:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A15.4 15.4 0 0117 8z"/></svg>,
  heart:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  heartF:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  search:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
};

// ═══════════════════════════════════════
export default function OxfoodApp(){
  const[tab,setTab]=useState("home");
  const[clients,setClients]=useState([]);
  const[sessions,setSessions]=useState([]);
  const[recipes,setRecipes]=useState([]);
  const[favorites,setFavorites]=useState([]);
  const[loaded,setLoaded]=useState(false);

  useEffect(()=>{(async()=>{const[c,s,r,f]=await Promise.all([load(SK.clients),load(SK.sessions),load(SK.recipes),load(SK.favorites)]);if(c)setClients(c);if(s)setSessions(s);if(r)setRecipes(r);if(f)setFavorites(f);setLoaded(true)})()},[]);
  useEffect(()=>{if(loaded)save(SK.clients,clients)},[clients,loaded]);
  useEffect(()=>{if(loaded)save(SK.sessions,sessions)},[sessions,loaded]);
  useEffect(()=>{if(loaded)save(SK.recipes,recipes)},[recipes,loaded]);
  useEffect(()=>{if(loaded)save(SK.favorites,favorites)},[favorites,loaded]);

  const toggleFav=(id)=>setFavorites(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const addClient=(c)=>setClients(p=>[...p,{id:uid(),...c}]);
  const removeClient=(id)=>setClients(p=>p.filter(c=>c.id!==id));
  const addSession=(s)=>setSessions(p=>[...p,{id:uid(),date:new Date().toISOString(),...s}]);
  const addRecipe=(r)=>setRecipes(p=>[...p,{id:uid(),date:new Date().toISOString(),...r}]);

  const thisMonth=sessions.filter(s=>{const d=new Date(s.date),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()});
  const monthRev=thisMonth.reduce((s,x)=>s+(x.amount||0),0);
  const totalRev=sessions.reduce((s,x)=>s+(x.amount||0),0);

  const tabs=[{id:"home",icon:IC.home,label:"Accueil"},{id:"cookbook",icon:IC.book,label:"Recettes"},{id:"ai",icon:IC.spark,label:"Chef IA"},{id:"clients",icon:IC.users,label:"Clients"},{id:"sessions",icon:IC.dollar,label:"Sessions"}];

  if(!loaded)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#0F0F1A"}}><div style={{fontSize:56}}>🔥</div><div style={{fontSize:26,fontWeight:800,color:"#FF6B35",letterSpacing:6,marginTop:12}}>OXFOOD</div></div>;

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#0F0F1A",color:"#F5F0E8",minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"linear-gradient(135deg,#16213E,#0F0F1A)",borderBottom:"1px solid rgba(255,107,53,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:24}}>🔥</span><span style={{fontSize:20,fontWeight:800,color:"#FF6B35",letterSpacing:3}}>OXFOOD</span></div>
        <span style={{fontSize:9,color:"#666",textTransform:"uppercase",letterSpacing:2}}>DrevmCook Ed.</span>
      </header>
      <main style={{flex:1,overflowY:"auto",paddingBottom:76}}>
        {tab==="home"&&<Home clients={clients} sessions={sessions} monthRev={monthRev} totalRev={totalRev} thisMonth={thisMonth} setTab={setTab}/>}
        {tab==="cookbook"&&<Cookbook favorites={favorites} toggleFav={toggleFav}/>}
        {tab==="ai"&&<AI clients={clients} addRecipe={addRecipe} recipes={recipes}/>}
        {tab==="clients"&&<Clients clients={clients} addClient={addClient} removeClient={removeClient} sessions={sessions}/>}
        {tab==="sessions"&&<Sessions sessions={sessions} addSession={addSession} clients={clients}/>}
      </main>
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,display:"flex",justifyContent:"space-around",background:"rgba(15,15,26,0.96)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,107,53,0.1)",padding:"6px 0 10px",zIndex:100}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",color:tab===t.id?"#FF6B35":"#666"}}><span style={{opacity:tab===t.id?1:0.45}}>{t.icon}</span><span style={{fontSize:9,fontWeight:tab===t.id?700:500}}>{t.label}</span></button>)}
      </nav>
    </div>
  );
}

// ═══════════ HOME ═══════════
function Home({clients,sessions,monthRev,totalRev,thisMonth,setTab}){
  const stats=[{l:"Recettes DrevmCook",v:DREVMCOOK_DB.length,c:"#2EC4B6"},{l:"Clients",v:clients.length,c:"#FF6B35"},{l:"Sessions ce mois",v:thisMonth.length,c:"#E71D36"},{l:"Revenu du mois",v:`${monthRev}€`,c:"#FF9F1C"}];
  const recent=[...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
  return(<div style={P}>
    <h2 style={H2}>Salut Chef 🔥</h2><p style={SUB}>Dashboard OXFOOD × DrevmCook</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>{stats.map((s,i)=><div key={i} style={{...CARD,borderLeft:`4px solid ${s.c}`}}><div style={{fontSize:22,fontWeight:800}}>{s.v}</div><div style={{fontSize:10,color:"#888",marginTop:3,textTransform:"uppercase",letterSpacing:1}}>{s.l}</div></div>)}</div>
    <div style={{display:"flex",gap:10,marginBottom:20}}>
      <button style={QBTN} onClick={()=>setTab("cookbook")}>📖 Recettes</button>
      <button style={{...QBTN,background:"#2EC4B6"}} onClick={()=>setTab("ai")}>🤖 Chef IA</button>
    </div>
    {recent.length>0&&<><h3 style={H3}>Dernières sessions</h3>{recent.map(s=><div key={s.id} style={CARD}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>{s.clientName||"—"}</span><span style={{fontWeight:800,color:"#FF9F1C"}}>{s.amount}€</span></div><div style={{fontSize:11,color:"#888",marginTop:4,display:"flex",alignItems:"center",gap:4}}>{IC.clock} {new Date(s.date).toLocaleDateString("fr-FR")}{s.recipeName&&<span style={{color:"#2EC4B6"}}>• {s.recipeName}</span>}</div></div>)}</>}
  </div>);
}

// ═══════════ COOKBOOK ═══════════
function Cookbook({favorites,toggleFav}){
  const[cat,setCat]=useState("all");
  const[search,setSearch]=useState("");
  const[selected,setSelected]=useState(null);
  const[showFavs,setShowFavs]=useState(false);

  const filtered=useMemo(()=>{
    let l=DREVMCOOK_DB;
    if(cat!=="all")l=l.filter(r=>r.category===cat);
    if(showFavs)l=l.filter(r=>favorites.includes(r.id));
    if(search.trim()){const q=search.toLowerCase();l=l.filter(r=>r.name.toLowerCase().includes(q)||r.tags.some(t=>t.includes(q))||r.ingredients.some(i=>i.toLowerCase().includes(q)))}
    return l;
  },[cat,search,showFavs,favorites]);

  if(selected)return<Detail r={selected} onBack={()=>setSelected(null)} fav={favorites.includes(selected.id)} toggle={()=>toggleFav(selected.id)}/>;

  return(<div style={P}>
    <h2 style={H2}>DrevmCook 🌴</h2><p style={SUB}>{DREVMCOOK_DB.length} recettes • végétal • sans gluten • anti-gaspi</p>
    <div style={{position:"relative",marginBottom:10}}><span style={{position:"absolute",left:12,top:11,opacity:0.4}}>{IC.search}</span><input style={{...INP,paddingLeft:36}} placeholder="Chercher recette, ingrédient..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      <button style={{...CHIP,...(showFavs?CHIPA:{})}} onClick={()=>setShowFavs(!showFavs)}>{showFavs?IC.heartF:IC.heart}<span style={{marginLeft:3}}>Favoris</span></button>
      {CATEGORIES.map(c=><button key={c.id} style={{...CHIP,...(cat===c.id?CHIPA:{})}} onClick={()=>setCat(c.id)}>{c.emoji} {c.label}</button>)}
    </div>
    <div style={{fontSize:11,color:"#666",marginBottom:8}}>{filtered.length} recette{filtered.length>1?"s":""}</div>
    {filtered.length===0?<div style={EMPTY}><div style={{fontSize:40}}>🥥</div><p>Aucune recette trouvée</p></div>:
      filtered.map(r=><button key={r.id} style={ROW} onClick={()=>setSelected(r)}>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#F5F0E8",textAlign:"left"}}>{r.name}</div><div style={{fontSize:11,color:"#888",marginTop:2,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>{IC.clock} {r.time_minutes}min <span style={{color:"#444"}}>•</span> {r.difficulty}{r.vegan&&<><span style={{color:"#444"}}>•</span><span style={{color:"#2EC4B6"}}>{IC.leaf}</span></>}</div></div>
        <button style={{background:"none",border:"none",cursor:"pointer",color:favorites.includes(r.id)?"#E71D36":"#444",padding:4}} onClick={e=>{e.stopPropagation();toggleFav(r.id)}}>{favorites.includes(r.id)?IC.heartF:IC.heart}</button>
      </button>)
    }
  </div>);
}

function Detail({r,onBack,fav,toggle}){
  return(<div style={P}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <button style={BACK} onClick={onBack}>{IC.back}</button>
      <h2 style={{fontSize:19,fontWeight:800,color:"#FF6B35",margin:0,flex:1}}>{r.name}</h2>
      <button style={{background:"none",border:"none",cursor:"pointer",color:fav?"#E71D36":"#555"}} onClick={toggle}>{fav?IC.heartF:IC.heart}</button>
    </div>
    <p style={{fontSize:13,color:"#CCC",lineHeight:1.5,margin:"0 0 14px"}}>{r.description}</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,fontSize:12,color:"#999",marginBottom:16,alignItems:"center"}}>
      <span style={{display:"flex",alignItems:"center",gap:3}}>{IC.clock} {r.time_minutes} min</span><span>👥 {r.servings}</span>
      <span style={{color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:r.difficulty==="Facile"?"#2EC4B6":r.difficulty==="Moyen"?"#FF9F1C":"#E71D36"}}>{r.difficulty}</span>
      {r.vegan&&<span style={{color:"#2EC4B6",display:"flex",alignItems:"center",gap:3}}>{IC.leaf} Végan</span>}
      {r.glutenFree&&<span style={{color:"#FF9F1C"}}>🌾 Sans gluten</span>}
    </div>
    <div style={{marginBottom:14}}><h4 style={SEC}>Ingrédients</h4>{r.ingredients.map((x,i)=><div key={i} style={{fontSize:13,color:"#CCC",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>• {x}</div>)}</div>
    <div style={{marginBottom:14}}><h4 style={SEC}>Préparation</h4>{r.steps.map((x,i)=><div key={i} style={{display:"flex",gap:10,padding:"6px 0",fontSize:13,color:"#CCC",lineHeight:1.5}}><span style={STEPN}>{i+1}</span><span>{x}</span></div>)}</div>
    {r.nutrition?.length>0&&<div style={{marginBottom:14}}><h4 style={SEC}>Apports nutritifs</h4><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{r.nutrition.map((n,i)=><span key={i} style={{fontSize:10,color:"#2EC4B6",background:"rgba(46,196,182,0.1)",padding:"3px 8px",borderRadius:10}}>{n}</span>)}</div></div>}
    {r.tips&&<div style={TIP}>💡 <strong>Astuce :</strong> {r.tips}</div>}
    {r.budget&&<div style={{fontSize:13,color:"#FF9F1C",marginTop:10}}>💰 Budget : {r.budget}</div>}
    {r.tags&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:14}}>{r.tags.map((t,i)=><span key={i} style={{fontSize:9,color:"#555",background:"rgba(255,255,255,0.04)",padding:"2px 7px",borderRadius:8}}>#{t}</span>)}</div>}
  </div>);
}

// ═══════════ AI ═══════════
function AI({clients,addRecipe,recipes}){
  const[ingList,setIngList]=useState([]);const[inp,setInp]=useState("");
  const[prefs,setPrefs]=useState("Végan, sans gluten");const[style,setStyle]=useState("Fusion caribéenne");
  const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);const[saved,setSaved]=useState(false);
  const[selClient,setSelClient]=useState("");

  const addIng=()=>{if(!inp.trim())return;setIngList(p=>[...p,inp.trim()]);setInp("")};
  const remIng=(i)=>setIngList(p=>p.filter((_,idx)=>idx!==i));

  const dbMatch=useMemo(()=>{
    if(!ingList.length)return[];
    return DREVMCOOK_DB.filter(r=>{const ri=r.ingredients.join(" ").toLowerCase();return ingList.some(i=>ri.includes(i.toLowerCase()))}).slice(0,3);
  },[ingList]);

  const gen=async()=>{if(!ingList.length)return;setLoading(true);setResult(null);setSaved(false);const r=await generateRecipe(ingList,prefs,style);setResult(r);setLoading(false)};
  const saveR=()=>{if(!result)return;addRecipe({...result,clientId:selClient,ingredients_input:ingList});setSaved(true)};

  const sOpts=["Fusion caribéenne","Comfort food","Gastronomique","Street food","Healthy / détox","Créole traditionnel","Asiatique fusion","Méditerranéen"];

  return(<div style={P}>
    <h2 style={H2}>Chef IA 🤖🔥</h2><p style={SUB}>Placard → recette magique (IA + DrevmCook)</p>
    {clients.length>0&&<select style={SEL} value={selClient} onChange={e=>setSelClient(e.target.value)}><option value="">— Client —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>}
    <div style={{display:"flex",gap:8,marginBottom:10}}><input style={{...INP,flex:1,marginBottom:0}} placeholder="Ajouter un ingrédient..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addIng()}/><button style={ADDBTN} onClick={addIng}>{IC.plus}</button></div>
    {ingList.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>{ingList.map((x,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,107,53,0.12)",color:"#FF6B35",padding:"4px 10px",borderRadius:14,fontSize:12,fontWeight:600}}>{x}<button style={{background:"none",border:"none",color:"#FF6B35",cursor:"pointer",fontSize:15,padding:0}} onClick={()=>remIng(i)}>×</button></span>)}</div>}
    <input style={INP} placeholder="Préférences..." value={prefs} onChange={e=>setPrefs(e.target.value)}/>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{sOpts.map(s=><button key={s} style={{...CHIP,...(style===s?CHIPA:{})}} onClick={()=>setStyle(s)}>{s}</button>)}</div>
    {dbMatch.length>0&&<div style={{marginBottom:14}}><h4 style={{fontSize:12,fontWeight:700,color:"#2EC4B6",margin:"0 0 6px"}}>📖 Suggestions DrevmCook :</h4>{dbMatch.map(r=><div key={r.id} style={{...CARD,padding:10,marginBottom:5}}><div style={{fontWeight:700,fontSize:12,color:"#F5F0E8"}}>{r.name}</div><div style={{fontSize:10,color:"#888"}}>{r.time_minutes}min • {r.difficulty} • {r.budget}</div></div>)}</div>}
    <button style={{...SBTN,opacity:ingList.length===0?0.4:1}} onClick={gen} disabled={loading||!ingList.length}>{loading?"⏳ Le chef réfléchit...":"🔥 Générer la recette IA"}</button>
    {result&&<div style={{...CARD,marginTop:16,padding:16}}>
      <h3 style={{fontSize:18,fontWeight:800,color:"#FF6B35",margin:"0 0 6px"}}>{result.name}</h3>
      <p style={{fontSize:12,color:"#CCC",lineHeight:1.5,margin:"0 0 12px"}}>{result.description}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,fontSize:11,color:"#999",marginBottom:12,alignItems:"center"}}>{IC.clock} {result.time_minutes}min • 👥 {result.servings}<span style={{color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:result.difficulty==="Facile"?"#2EC4B6":"#FF9F1C"}}>{result.difficulty}</span>{result.vegan&&<span style={{color:"#2EC4B6"}}>{IC.leaf}</span>}</div>
      <div style={{marginBottom:10}}><h4 style={SEC}>Ingrédients utilisés</h4>{result.ingredients_used?.map((x,i)=><div key={i} style={{fontSize:12,color:"#CCC",padding:"2px 0"}}>✓ {x}</div>)}</div>
      {result.ingredients_extra?.length>0&&<div style={{marginBottom:10}}><h4 style={SEC}>À ajouter</h4>{result.ingredients_extra.map((x,i)=><div key={i} style={{fontSize:12,color:"#999",padding:"2px 0"}}>+ {x}</div>)}</div>}
      <div style={{marginBottom:10}}><h4 style={SEC}>Étapes</h4>{result.steps?.map((x,i)=><div key={i} style={{display:"flex",gap:10,padding:"5px 0",fontSize:12,color:"#CCC",lineHeight:1.5}}><span style={STEPN}>{i+1}</span><span>{x}</span></div>)}</div>
      {result.tips&&<div style={TIP}>💡 {result.tips}</div>}
      <button style={{...SBTN,background:saved?"#2EC4B6":"#FF6B35",marginTop:8}} onClick={saveR} disabled={saved}>{saved?"✓ Sauvegardée":"💾 Sauvegarder"}</button>
    </div>}
    {recipes.length>0&&<><h3 style={H3}>IA sauvegardées ({recipes.length})</h3>{[...recipes].reverse().slice(0,5).map(r=><div key={r.id} style={{...CARD,padding:10,marginBottom:5}}><div style={{fontWeight:700,fontSize:12,color:"#F5F0E8"}}>{r.name}</div><div style={{fontSize:10,color:"#888"}}>{r.time_minutes}min • {r.difficulty} • {new Date(r.date).toLocaleDateString("fr-FR")}</div></div>)}</>}
  </div>);
}

// ═══════════ CLIENTS ═══════════
function Clients({clients,addClient,removeClient,sessions}){
  const[show,setShow]=useState(false);
  const[f,sF]=useState({name:"",phone:"",address:"",preferences:"",allergies:"",notes:""});
  const submit=()=>{if(!f.name.trim())return;addClient(f);sF({name:"",phone:"",address:"",preferences:"",allergies:"",notes:""});setShow(false)};
  const cs=(id)=>sessions.filter(s=>s.clientId===id);
  return(<div style={P}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h2 style={{...H2,margin:0}}>Clients</h2><button style={ADDBTN} onClick={()=>setShow(!show)}>{show?IC.x:IC.plus}</button></div>
    {show&&<div style={{...CARD,padding:14,display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
      <input style={INP} placeholder="Nom *" value={f.name} onChange={e=>sF({...f,name:e.target.value})}/>
      <input style={INP} placeholder="Téléphone" value={f.phone} onChange={e=>sF({...f,phone:e.target.value})}/>
      <input style={INP} placeholder="Adresse" value={f.address} onChange={e=>sF({...f,address:e.target.value})}/>
      <input style={INP} placeholder="Préférences" value={f.preferences} onChange={e=>sF({...f,preferences:e.target.value})}/>
      <input style={INP} placeholder="Allergies" value={f.allergies} onChange={e=>sF({...f,allergies:e.target.value})}/>
      <textarea style={{...INP,minHeight:40}} placeholder="Notes" value={f.notes} onChange={e=>sF({...f,notes:e.target.value})}/>
      <button style={SBTN} onClick={submit}>Ajouter</button>
    </div>}
    {clients.length===0?<div style={EMPTY}><div style={{fontSize:40}}>👥</div><p>Aucun client</p></div>:
      clients.map(c=>{const s=cs(c.id);const t=s.reduce((a,x)=>a+(x.amount||0),0);return<div key={c.id} style={{...CARD,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:14}}>{c.name}</div>{c.phone&&<div style={{fontSize:11,color:"#888"}}>📱 {c.phone}</div>}{c.address&&<div style={{fontSize:11,color:"#888"}}>📍 {c.address}</div>}</div><button style={{background:"none",border:"none",color:"#555",cursor:"pointer"}} onClick={()=>removeClient(c.id)}>{IC.trash}</button></div>
        {c.preferences&&<div style={{display:"inline-block",background:"rgba(46,196,182,0.12)",color:"#2EC4B6",fontSize:10,padding:"3px 8px",borderRadius:14,marginTop:6,marginRight:4}}>🍽 {c.preferences}</div>}
        {c.allergies&&<div style={{display:"inline-block",background:"rgba(231,29,54,0.15)",color:"#E71D36",fontSize:10,padding:"3px 8px",borderRadius:14,marginTop:6}}>⚠️ {c.allergies}</div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)",fontSize:12,color:"#888"}}><span>{s.length} session{s.length>1?"s":""}</span><span style={{fontWeight:700,color:"#FF9F1C"}}>{t}€</span></div>
      </div>})
    }
  </div>);
}

// ═══════════ SESSIONS ═══════════
function Sessions({sessions,addSession,clients}){
  const[show,setShow]=useState(false);
  const[f,sF]=useState({clientId:"",clientName:"",type:"placard",recipeName:"",amount:50,notes:""});
  const TL={placard:"🏠 Placard→Assiette",prepared:"🍱 Plat préparé",revaluation:"🔄 Revalorisation"};
  const submit=()=>{const cn=f.clientId?clients.find(c=>c.id===f.clientId)?.name||f.clientName:f.clientName;addSession({...f,clientName:cn});sF({clientId:"",clientName:"",type:"placard",recipeName:"",amount:50,notes:""});setShow(false)};
  const sorted=[...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const total=sessions.reduce((s,x)=>s+(x.amount||0),0);
  return(<div style={P}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><h2 style={{...H2,margin:0}}>Sessions</h2><button style={ADDBTN} onClick={()=>setShow(!show)}>{show?IC.x:IC.plus}</button></div>
    <p style={SUB}>Total : <strong style={{color:"#FF9F1C"}}>{total}€</strong></p>
    {show&&<div style={{...CARD,padding:14,display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
      <select style={SEL} value={f.clientId} onChange={e=>sF({...f,clientId:e.target.value})}><option value="">— Client —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      {!f.clientId&&<input style={INP} placeholder="Nom client" value={f.clientName} onChange={e=>sF({...f,clientName:e.target.value})}/>}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(TL).map(([k,v])=><button key={k} style={{...CHIP,...(f.type===k?CHIPA:{})}} onClick={()=>sF({...f,type:k})}>{v}</button>)}</div>
      <input style={INP} placeholder="Recette / plat" value={f.recipeName} onChange={e=>sF({...f,recipeName:e.target.value})}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,color:"#CCC"}}>Montant (€)</span><input style={{...INP,width:100,textAlign:"center",fontSize:18,fontWeight:800,marginBottom:0}} type="number" value={f.amount} onChange={e=>sF({...f,amount:Number(e.target.value)})}/></div>
      <textarea style={{...INP,minHeight:40}} placeholder="Notes" value={f.notes} onChange={e=>sF({...f,notes:e.target.value})}/>
      <button style={SBTN} onClick={submit}>Enregistrer</button>
    </div>}
    {sorted.length===0?<div style={EMPTY}><div style={{fontSize:40}}>🍳</div><p>Aucune session</p></div>:
      sorted.map(s=><div key={s.id} style={{...CARD,marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div><span style={{fontWeight:700,fontSize:13}}>{s.clientName||"—"}</span><div style={{fontSize:10,color:"#888"}}>{TL[s.type]||s.type}</div></div><span style={{fontSize:18,fontWeight:800,color:"#FF9F1C"}}>{s.amount}€</span></div>
        {s.recipeName&&<div style={{fontSize:12,color:"#2EC4B6",marginTop:4}}>🍽 {s.recipeName}</div>}
        <div style={{fontSize:11,color:"#666",marginTop:4,display:"flex",alignItems:"center",gap:4}}>{IC.clock} {new Date(s.date).toLocaleDateString("fr-FR")}{s.notes&&<span style={{fontStyle:"italic"}}>— {s.notes}</span>}</div>
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
const QBTN={flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#FF6B35",color:"#fff",border:"none",borderRadius:10,padding:"12px 10px",fontSize:12,fontWeight:700,cursor:"pointer"};
const INP={width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.05)",color:"#F5F0E8",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8};
const SEL={...INP};
const SBTN={padding:"12px 16px",borderRadius:10,background:"#FF6B35",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",textAlign:"center",width:"100%"};
const ADDBTN={width:38,height:38,borderRadius:10,background:"#FF6B35",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};
const CHIP={padding:"6px 11px",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",color:"#888",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3};
const CHIPA={background:"rgba(255,107,53,0.18)",borderColor:"#FF6B35",color:"#FF6B35"};
const EMPTY={textAlign:"center",padding:"32px 16px",color:"#555"};
const SEC={fontSize:13,fontWeight:700,color:"#F5F0E8",margin:"0 0 6px"};
const STEPN={width:22,height:22,borderRadius:"50%",background:"#FF6B35",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0};
const TIP={background:"rgba(255,159,28,0.08)",border:"1px solid rgba(255,159,28,0.2)",borderRadius:10,padding:12,fontSize:12,color:"#FF9F1C",lineHeight:1.5};
const ROW={width:"100%",display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"11px 12px",marginBottom:5,border:"1px solid rgba(255,255,255,0.04)",cursor:"pointer",textAlign:"left",fontFamily:"inherit"};
const BACK={width:34,height:34,borderRadius:8,background:"rgba(255,255,255,0.06)",color:"#F5F0E8",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"};
