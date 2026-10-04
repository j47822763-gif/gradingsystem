const content=document.getElementById("content");
const db=()=>JSON.parse(localStorage.getItem("gt_students")||"[]");
const avg=s=>{const vals=[];(s.subjects||[]).forEach(x=>{["q1","q2","q3","q4"].forEach(k=>{if(Number.isFinite(Number(x[k])))vals.push(Number(x[k]));})});return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0};
const finalAvg=s=>{const vals=(s.subjects||[]).map(x=>Number(x.final)).filter(Number.isFinite);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0};
function render(){
 const students=db(), total=students.length, pass=students.filter(s=>finalAvg(s)>=75).length, fail=students.filter(s=>finalAvg(s)>0&&finalAvg(s)<75).length;
 const all=students.flatMap(s=>s.subjects||[]).map(x=>Number(x.final)).filter(Number.isFinite);
 const overall=all.length?all.reduce((a,b)=>a+b,0)/all.length:0;
 content.innerHTML=`<div class="page-head"><div><h2>Good day 👋</h2><p>Here is your academic records overview.</p></div><a class="btn btn-primary" href="students.html">＋ Add Student</a></div>
 <div class="stats-grid">
 <div class="stat-card"><div class="stat-top">Total Students <div class="stat-icon">♙</div></div><div class="stat-number">${total}</div><div class="stat-note">Registered students</div></div>
 <div class="stat-card"><div class="stat-top">Class Average <div class="stat-icon">%</div></div><div class="stat-number">${overall?overall.toFixed(2):"—"}</div><div class="stat-note">Across recorded final grades</div></div>
 <div class="stat-card"><div class="stat-top">Passed <div class="stat-icon">✓</div></div><div class="stat-number">${pass}</div><div class="stat-note">${total?((pass/total)*100).toFixed(0):0}% of students</div></div>
 <div class="stat-card"><div class="stat-top">Needs Attention <div class="stat-icon">!</div></div><div class="stat-number">${fail}</div><div class="stat-note">Below passing grade</div></div>
 </div>
 <div class="section-grid">
 <div class="panel"><div class="panel-head"><div><h3>Recent Students</h3><p>Latest records added to the system.</p></div><a class="btn btn-outline" href="students.html">View all</a></div>
 <div class="table-wrap"><table><thead><tr><th>Student</th><th>Grade/Section</th><th>Average</th><th>Status</th></tr></thead><tbody>${students.slice(-6).reverse().map(s=>`<tr><td class="student-cell"><strong>${GT.esc(s.name)}</strong><span>${GT.esc(s.studentId)}</span></td><td>${GT.esc(s.gradeLevel)} - ${GT.esc(s.section)}</td><td><strong>${finalAvg(s)?finalAvg(s).toFixed(2):"—"}</strong></td><td>${statusBadge(finalAvg(s))}</td></tr>`).join("")||`<tr><td colspan="4" class="empty">No students yet. Add your first student.</td></tr>`}</tbody></table></div></div>
 <div class="panel"><div class="panel-head"><div><h3>Quick Actions</h3><p>Common tasks</p></div></div><div class="panel-body"><div class="quick-actions"><a href="students.html">＋ Add Student<span>Create a new record</span></a><a href="grades.html">▤ Enter Grades<span>Update subject grades</span></a><a href="reports.html">▥ Print Report<span>Generate a report card</span></a><a href="reports.html#export">⇩ Export Excel<span>Download gradebook</span></a></div></div></div>
 </div>`;
}
function statusBadge(a){if(!a)return '<span class="badge pending">No Grades</span>';return a>=75?'<span class="badge pass">Passed</span>':'<span class="badge fail">Failed</span>';}
render();