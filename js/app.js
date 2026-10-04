(() => {
if(localStorage.getItem("gt_session")!=="true"){window.location.href="index.html";return;}
const page=document.body.dataset.page;
const current=JSON.parse(localStorage.getItem("gt_current_user")||'{"name":"Administrator","role":"Administrator"}');
const nav=[
  ["dashboard.html","▦","Dashboard","dashboard"],
  ["students.html","♙","Students","students"],
  ["grades.html","▤","Grades","grades"],
  ["reports.html","▥","Reports","reports"]
];
document.getElementById("app").innerHTML=`
<div class="app-shell">
<aside class="sidebar" id="sidebar">
  <div class="side-brand"><div class="brand-mark">G</div><div><strong>GradeTrack</strong><span>Grading Management</span></div></div>
  <nav class="nav"><div class="nav-label">Main Menu</div>${nav.map(n=>`<a class="${page===n[3]?'active':''}" href="${n[0]}"><span class="icon">${n[1]}</span>${n[2]}</a>`).join("")}</nav>
  <div class="side-bottom">
    <div class="user-mini"><div class="avatar">${initials(current.name)}</div><div><strong style="font-size:12px">${esc(current.name)}</strong><small style="display:block">${esc(current.role||"User")}</small></div></div>
    <button class="logout" id="logoutBtn">↪ Sign out</button>
  </div>
</aside>
<main class="main">
<header class="topbar"><div style="display:flex;align-items:center;gap:11px"><button class="btn btn-outline mobile-menu" id="menuBtn">☰</button><div><h1>${titleFor(page)}</h1><p>Academic records and grading management</p></div></div><div class="top-actions"><span class="hide-mobile" style="font-size:11px;color:#687386">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</span><div class="avatar">${initials(current.name)}</div></div></header>
<div class="content" id="content"></div>
</main></div>`;
document.getElementById("logoutBtn").onclick=()=>{localStorage.removeItem("gt_session");localStorage.removeItem("gt_current_user");window.location.href="index.html";};
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
function titleFor(p){return {dashboard:"Dashboard",students:"Students",grades:"Gradebook",reports:"Reports"}[p]||"GradeTrack";}
function initials(n){return String(n||"U").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
window.GT={esc,initials,toast(msg){const d=document.createElement("div");d.className="toast";d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2400);}};
})();