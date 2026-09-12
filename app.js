import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const toast = msg => { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),2600); };

let app, auth, db, user=null, activeFilter="all";

function showScreen(name){
  $$(".screen").forEach(x=>x.classList.toggle("active",x.id==="screen-"+name));
  $$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.screen===name));
  window.scrollTo({top:0,behavior:"smooth"});
}

$$("[data-screen]").forEach(el=>el.addEventListener("click",()=>showScreen(el.dataset.screen)));

$$("[data-filter]").forEach(el=>el.addEventListener("click",()=>{
  activeFilter=el.dataset.filter;
  $$(".chip").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));
  renderMoments(window.__moments||[]);
  showScreen("home");
}));

$$("[data-action]").forEach(el=>el.addEventListener("click",()=>{
  const a=el.dataset.action;
  if(a==="notifications") toast("Notifications will appear here.");
  if(a==="anonymous") toast(user ? "Signed in securely." : "Connecting to WORLD...");
  if(a==="privacy") toast("WORLD uses approximate location only.");
  if(a==="about") toast("WORLD 1.0 — See what's happening. Be part of it.");
}));

$("#moment-form").addEventListener("submit", async e=>{
  e.preventDefault();
  if(!db || !user){ toast("Connect Firebase first."); return; }
  const title=$("#moment-title").value.trim();
  if(!title) return;
  const duration=Number($("#moment-duration").value);
  const data={
    title,
    description:$("#moment-description").value.trim(),
    category:$("#moment-category").value,
    visibility:$("#moment-visibility").value,
    durationMinutes:duration,
    ownerId:user.uid,
    status:"active",
    createdAt:serverTimestamp(),
    expiresAt:new Date(Date.now()+duration*60000),
    hasApproxLocation:$("#use-location").checked
  };
  try{
    await addDoc(collection(db,"moments"),data);
    e.target.reset();
    toast("Moment published to WORLD.");
    showScreen("home");
  }catch(err){ console.error(err); toast("Could not publish. Check Firebase rules/config."); }
});

function renderMoments(items){
  const feed=$("#home-feed");
  const list=activeFilter==="all"?items:items.filter(x=>x.category===activeFilter);
  if(!list.length){
    feed.className="feed empty-state";
    feed.innerHTML='<div class="empty-icon">W</div><h3>No live Moments yet</h3><p>Create the first Moment and start your WORLD.</p><button class="secondary" data-screen="create">Create Moment</button>';
    feed.querySelector("[data-screen]")?.addEventListener("click",()=>showScreen("create"));
    return;
  }
  feed.className="feed";
  feed.innerHTML=list.map(m=>`<article class="card" style="margin-bottom:10px"><span class="eyebrow">${escapeHtml((m.category||"now").toUpperCase())}</span><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.description||"A live Moment on WORLD.")}</p><small style="color:#71877e">${m.visibility==="nearby"?"Nearby":"Public"} · Live now</small></article>`).join("");
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

async function init(){
  try{
    app=initializeApp(firebaseConfig); auth=getAuth(app); db=getFirestore(app);
    onAuthStateChanged(auth, async u=>{
      user=u;
      if(u){
        $("#profile-id").textContent=`WORLD ID · ${u.uid.slice(0,10)}`;
        const ref=doc(db,"users",u.uid);
        const snap=await getDoc(ref);
        if(!snap.exists()) await setDoc(ref,{uid:u.uid,createdAt:serverTimestamp(),displayName:"WORLD User",visibility:"public"});
      }
    });
    await signInAnonymously(auth);
    const q=query(collection(db,"moments"),where("status","==","active"),orderBy("createdAt","desc"));
    onSnapshot(q,snap=>{
      window.__moments=snap.docs.map(d=>({id:d.id,...d.data()}));
      $("#stat-moments").textContent=window.__moments.filter(m=>m.ownerId===user?.uid).length;
      renderMoments(window.__moments);
    },err=>{console.error(err);toast("Firebase connected, but feed rules/index need checking.");});
  }catch(err){ console.error(err); toast("Add your Firebase Web App config first."); }
}
init();