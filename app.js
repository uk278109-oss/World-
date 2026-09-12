import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp, Timestamp, increment } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

let currentUser=null, unsubscribeMoments=null, moments=[], category="All", visibility="nearby";

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2300)};

document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",()=>showScreen(b.dataset.screen)));
function showScreen(name){
 document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
 document.querySelector("#screen-"+name).classList.add("active");
 document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.screen===name));
 window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.category;render();
}));
$("searchInput").addEventListener("input",render);
document.querySelectorAll(".vis").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".vis").forEach(x=>x.classList.remove("active"));b.classList.add("active");visibility=b.dataset.value}));
document.querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",()=>b.classList.toggle("on")));
$("notificationBtn").onclick=()=>toast("Notifications will appear here.");
$("modalClose").onclick=()=>closeModal();

function empty(text){return `<div class="empty">${esc(text)}</div>`}
function momentCard(m){
 const name=m.creatorName||"WORLD user", letter=(name.trim()[0]||"W").toUpperCase();
 const created=m.createdAt?.toDate?m.createdAt.toDate():new Date();
 const mins=Math.max(0,Math.floor((Date.now()-created.getTime())/60000));
 return `<article class="card">
 <div class="cardtop"><div class="avatar">${esc(letter)}</div><div class="meta"><b>${esc(name)}</b><small>${esc(m.visibility||"Nearby")} · ${mins<1?"just now":mins+"m ago"}</small></div><div class="live"><i></i>Live</div></div>
 <h3>${esc(m.title)}</h3><p>${esc(m.description)}</p>
 <div class="tags"><span class="tag">${esc(m.category)}</span><span class="tag">${esc(m.visibility||"nearby")}</span></div>
 <div class="card-actions"><button class="btn primary" data-join="${m.id}">Join</button><button class="btn secondary" data-share="${m.id}">Share</button></div>
 </article>`;
}
function render(){
 const q=$("searchInput").value.trim().toLowerCase();
 const filtered=moments.filter(m=>(category==="All"||m.category===category)&&(!q||`${m.title} ${m.description} ${m.creatorName}`.toLowerCase().includes(q)));
 $("homeList").innerHTML=filtered.length?filtered.map(momentCard).join(""):empty("No live Moments yet.");
 $("exploreList").innerHTML=moments.length?moments.map(momentCard).join(""):empty("No Moments available yet.");
 bindCards();
}
function bindCards(){
 document.querySelectorAll("[data-join]").forEach(b=>b.onclick=()=>joinMoment(b.dataset.join));
 document.querySelectorAll("[data-share]").forEach(b=>b.onclick=()=>shareMoment(b.dataset.share));
}
function openModal(html){$("modalContent").innerHTML=html;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
async function joinMoment(id){
 if(!currentUser)return toast("Signing you in...");
 const m=moments.find(x=>x.id===id);if(!m)return;
 const ref=doc(db,"moments",id), participant=doc(db,"moments",id,"participants",currentUser.uid);
 try{await setDoc(participant,{userId:currentUser.uid,joinedAt:serverTimestamp()},{merge:true});await updateDoc(ref,{participantsCount:increment(1)});toast("Joined Moment");}
 catch(e){toast("Could not join this Moment.");console.error(e)}
}
async function shareMoment(id){
 const m=moments.find(x=>x.id===id);if(!m)return;
 const text=`${m.title} — live on WORLD`;
 try{if(navigator.share)await navigator.share({title:"WORLD",text,url:location.href});else{await navigator.clipboard.writeText(text);toast("Moment copied");}}catch{}
}

$("createForm").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!currentUser)return toast("Please wait for sign-in.");
 const title=$("title").value.trim(),description=$("description").value.trim();
 if(!title||!description)return;
 const mins=Number($("duration").value);
 const expiresAt=Timestamp.fromMillis(Date.now()+mins*60000);
 const data={creatorId:currentUser.uid,creatorName:currentUser.displayName||currentUser.email||"WORLD user",title,description,category:$("category").value,visibility,createdAt:serverTimestamp(),expiresAt,participantsCount:0,reactionsCount:0,commentsCount:0,status:"active",hasApproximateLocation:$("useLocation").checked};
 try{await addDoc(collection(db,"moments"),data);e.target.reset();document.querySelectorAll(".vis").forEach((x,i)=>x.classList.toggle("active",i===0));visibility="nearby";toast("Moment published");showScreen("home");}
 catch(err){console.error(err);toast("Could not publish. Check Firebase setup.");}
});

async function loadProfile(){
 if(!currentUser){$("profileBox").innerHTML=empty("Sign in to create your WORLD profile.");$("profileList").innerHTML="";return}
 const ref=doc(db,"users",currentUser.uid), snap=await getDoc(ref);
 const u=snap.exists()?snap.data():{};
 const name=u.displayName||currentUser.displayName||"WORLD user";
 $("profileBox").innerHTML=`<div class="profile-header"><div class="big-avatar">${esc((name[0]||"W").toUpperCase())}</div><h2>${esc(name)}</h2><p>${esc(u.username?"@"+u.username:"WORLD profile")}</p></div><div class="profile-stats"><div class="pstat"><b>${u.momentsCount||0}</b><small>Moments</small></div><div class="pstat"><b>${u.followersCount||0}</b><small>Followers</small></div><div class="pstat"><b>${u.followingCount||0}</b><small>Following</small></div></div>`;
 const q=query(collection(db,"moments"),where("creatorId","==",currentUser.uid),orderBy("createdAt","desc"),limit(30));
 onSnapshot(q,s=>{$("profileList").innerHTML=s.empty?empty("You have not created a Moment yet."):s.docs.map(d=>momentCard({id:d.id,...d.data()})).join("");bindCards()},()=>{$("profileList").innerHTML=empty("Profile Moments could not be loaded.")});
}

function subscribeMoments(){
 if(unsubscribeMoments)unsubscribeMoments();
 const q=query(collection(db,"moments"),where("status","==","active"),orderBy("createdAt","desc"),limit(50));
 unsubscribeMoments=onSnapshot(q,s=>{
  const now=Date.now();
  moments=s.docs.map(d=>({id:d.id,...d.data()})).filter(m=>!m.expiresAt||m.expiresAt.toMillis()>now);
  render();
 },e=>{console.error(e);$("homeList").innerHTML=empty("Moments could not be loaded. Check Firebase indexes/rules.")});
}

onAuthStateChanged(auth,async user=>{
 currentUser=user;
 $("accountStatus").textContent=user?`Signed in · ${user.isAnonymous?"Guest":"Account"}`:"Not signed in";
 $("authBtn").textContent=user?"Sign out":"Sign in";
 if(user){
  const ref=doc(db,"users",user.uid), snap=await getDoc(ref);
  if(!snap.exists())await setDoc(ref,{displayName:"WORLD user",createdAt:serverTimestamp(),momentsCount:0,followersCount:0,followingCount:0,privacyMode:"approximate"},{merge:true});
  subscribeMoments();loadProfile();
 }else{moments=[];render();loadProfile()}
});
$("authBtn").onclick=async()=>{if(currentUser){await signOut(auth);toast("Signed out")}else{try{await signInAnonymously(auth)}catch(e){console.error(e);toast("Enable Anonymous Auth in Firebase.")}}};
$("locationBtn").onclick=()=>{
 if(!navigator.geolocation)return toast("Location is not supported.");
 navigator.geolocation.getCurrentPosition(()=>{$("locationText").textContent="Approximate location available";$("locationBtn").textContent="Enabled";$("status-dot")?.classList.add("on")},()=>toast("Location permission was not granted."),{enableHighAccuracy:false,timeout:8000});
};
render();
