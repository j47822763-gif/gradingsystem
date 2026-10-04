const DEFAULT_USER = {username:"admin", password:"admin123", name:"Administrator", role:"Administrator"};
if (!localStorage.getItem("gt_users")) localStorage.setItem("gt_users", JSON.stringify([DEFAULT_USER]));
if (localStorage.getItem("gt_session") === "true") window.location.href = "dashboard.html";
const form = document.getElementById("loginForm");
const error = document.getElementById("loginError");
document.getElementById("togglePassword").addEventListener("click", e => {
  const input=document.getElementById("password");
  input.type=input.type==="password"?"text":"password";
  e.target.textContent=input.type==="password"?"Show":"Hide";
});
form.addEventListener("submit", e => {
  e.preventDefault();
  const username=document.getElementById("username").value.trim();
  const password=document.getElementById("password").value;
  const users=JSON.parse(localStorage.getItem("gt_users")||"[]");
  const user=users.find(u=>u.username===username && u.password===password);
  if(!user){error.textContent="Invalid username or password.";error.classList.remove("hidden");return;}
  localStorage.setItem("gt_session","true");
  localStorage.setItem("gt_current_user",JSON.stringify(user));
  window.location.href="dashboard.html";
});