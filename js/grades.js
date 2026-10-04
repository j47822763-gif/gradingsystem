const content=document.getElementById("content");
let students=JSON.parse(localStorage.getItem("gt_students")||"[]");
const subjects=["English","Mathematics","Science","Filipino","Araling Panlipunan","MAPEH"];
const uid=new URLSearchParams(location.search).get("student");
function ensureSubjects(s){if(!Array.isArray(s.subjects))s.subjects=[];subjects.forEach(name=>{if(!s.subjects.find(x=>x.name===name))s.subjects.push({name,q1:"",q2:"",q3:"",q4:"",final:""});});}
students.forEach(ensureSubjects);
function calc(sub){const q=["q1","q2","q3","q4"].map(k=>Number(sub[k])).filter(v=>v>=0);sub.final=q.length===4?Math.round(q.reduce((a,b)=>a+b,0)/4):"";return sub.final;}
function render(){
 let selected=students.find(s=>s.uid===uid)||students[0];
 content.innerHTML=`<div class="page-head"><div><h2>Gradebook</h2><p>Enter quarterly grades and calculate final grades automatically.</p></div><a class="btn btn-outline" href="students.html">Manage Students</a></div>
 ${!students.length?'<div class="panel"><div class="panel-body empty">Add a student first before entering grades.</div></div>':`
 <div class="toolbar"><select id="studentSelect">${students.map(s=>`<option value="${s.uid}" ${selected&&s.uid===selected.uid?"selected":""}>${GT.esc(s.studentId)} — ${GT.esc(s.name)}</option>`).join("")}</select></div>
 <div class="panel"><div class="panel-head"><div><h3>${GT.esc(selected.name)}</h3><p>${GT.esc(selected.studentId)} • ${GT.esc(selected.gradeLevel)} - ${GT.esc(selected.section)}</p></div><button class="btn btn-primary" id="saveGrades">Save Grades</button></div>
 <div class="table-wrap"><table class="grade-table"><thead><tr><th>Subject</th><th>1st Quarter</th><th>2nd Quarter</th><th>3rd Quarter</th><th>4th Quarter</th><th>Final Grade</th><th>Status</th></tr></thead><tbody>${selected.subjects.map((sub,i)=>`<tr><td><strong>${GT.esc(sub.name)}</strong></td>${["q1","q2","q3","q4"].map(k=>`<td><input type="number" min="0" max="100" data-i="${i}" data-k="${k}" value="${sub[k]??""}"></td>`).join("")}<td><strong id="final-${i}">${sub.final||"—"}</strong></td><td id="status-${i}">${badge(sub.final)}</td></tr>`).join("")}</tbody></table></div></div>
 <div class="summary-box"><strong id="overall">Overall Average: ${overall(selected)}</strong><span>Passing grade is 75. Final grades are calculated only after all four quarters are entered.</span></div>`}`;
 if(selected){document.querySelectorAll(".grade-table input").forEach(inp=>inp.oninput=()=>{const i=+inp.dataset.i,k=inp.dataset.k;selected.subjects[i][k]=inp.value;calc(selected.subjects[i]);document.getElementById("final-"+i).textContent=selected.subjects[i].final||"—";document.getElementById("status-"+i).innerHTML=badge(selected.subjects[i].final);document.getElementById("overall").textContent="Overall Average: "+overall(selected);});document.getElementById("studentSelect").onchange=e=>{location.href="grades.html?student="+encodeURIComponent(e.target.value)};document.getElementById("saveGrades").onclick=()=>{localStorage.setItem("gt_students",JSON.stringify(students));GT.toast("Grades saved successfully");};}
}
function overall(s){const a=s.subjects.map(x=>Number(x.final)).filter(v=>v>0);return a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2):"—";}
function badge(v){v=Number(v);if(!v)return'<span class="badge pending">Pending</span>';return v>=75?'<span class="badge pass">Passed</span>':'<span class="badge fail">Failed</span>';}
render();