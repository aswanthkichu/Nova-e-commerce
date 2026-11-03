const products = [
  {id:1,name:"Studio Wireless Headphones",category:"Tech",price:3499,oldPrice:4299,rating:4.9,badge:"Bestseller",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",alt:"Wireless over-ear headphones"},
  {id:2,name:"Everyday Ceramic Mug",category:"Home",price:699,oldPrice:899,rating:4.8,badge:"Good find",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=85",alt:"Minimal ceramic coffee mug"},
  {id:3,name:"Minimal Watch",category:"Style",price:2499,oldPrice:3199,rating:4.7,badge:"-22%",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",alt:"Minimal wrist watch"},
  {id:4,name:"Soft Touch Desk Lamp",category:"Home",price:1899,oldPrice:2299,rating:4.8,badge:"Popular",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",alt:"Contemporary table lamp"},
  {id:5,name:"Portable Bluetooth Speaker",category:"Tech",price:1599,oldPrice:1999,rating:4.6,badge:"-20%",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85",alt:"Compact portable speaker"},
  {id:6,name:"Everyday Tote Bag",category:"Style",price:999,oldPrice:1299,rating:4.8,badge:"Customer fave",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85",alt:"Neutral everyday tote bag"},
  {id:7,name:"Calm Space Diffuser",category:"Home",price:1199,oldPrice:1499,rating:4.5,badge:"New",image:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85",alt:"Home fragrance and diffuser"},
  {id:8,name:"Wireless Charging Stand",category:"Tech",price:1299,oldPrice:1599,rating:4.7,badge:"Smart pick",image:"https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=85",alt:"Minimal wireless charging stand"}
];
const ACCOUNT_STORAGE_KEY = "novaDemoAccounts";
const SESSION_STORAGE_KEY = "novaDemoSession";
const state = {category:"All",search:"",sort:"featured",cart:[],wishlist:new Set(),manualAuthMode:"login",user:null};
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const money = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const safe = str => String(str).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function refreshIcons(){if(window.lucide)lucide.createIcons();}
function toast(message){$("#toastMessage").textContent=message;$("#toast").classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>$("#toast").classList.remove("show"),2500);}
function renderProducts(){
  let list=products.filter(p=>(state.category==="All"||p.category===state.category)&&`${p.name} ${p.category}`.toLowerCase().includes(state.search.toLowerCase()));
  if(state.sort==="price-low")list.sort((a,b)=>a.price-b.price);
  if(state.sort==="price-high")list.sort((a,b)=>b.price-a.price);
  if(state.sort==="rating")list.sort((a,b)=>b.rating-a.rating);
  $("#productGrid").innerHTML=list.map((p,i)=>`<article class="product-card" style="animation-delay:${Math.min(i*45,250)}ms">
    <div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${safe(p.alt)}" loading="lazy"><span class="product-badge">${safe(p.badge)}</span>
    <button class="wish-button ${state.wishlist.has(p.id)?"liked":""}" data-wish="${p.id}" aria-label="${state.wishlist.has(p.id)?"Remove from":"Add to"} wishlist"><i data-lucide="heart"></i></button>
    <button class="quick-add" data-add="${p.id}">Add to bag <i data-lucide="plus"></i></button></div>
    <div class="product-info"><span class="product-category">${safe(p.category)}</span><div class="product-title-row"><span class="product-title">${safe(p.name)}</span><span class="product-rating">★ ${p.rating.toFixed(1)}</span></div>
    <div class="product-price"><strong>${money(p.price)}</strong><del>${money(p.oldPrice)}</del><span class="discount">${Math.round((1-p.price/p.oldPrice)*100)}% off</span></div></div></article>`).join("");
  $("#emptyState").classList.toggle("hidden",list.length!==0);
  $("#productGrid").classList.toggle("hidden",list.length===0);
  refreshIcons();
}
function renderCart(){
  const count=state.cart.reduce((sum,item)=>sum+item.qty,0);
  const subtotal=state.cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;$("#cartSubtotal").textContent=money(subtotal);$("#checkoutTotal").textContent=money(subtotal);
  $("#cartItems").innerHTML=state.cart.map(item=>`<div class="cart-row"><img src="${item.image}" alt="${safe(item.name)}"><div><h4>${safe(item.name)}</h4><small>${money(item.price)} each</small><div class="quantity-control"><button data-qty="${item.id}" data-change="-1" aria-label="Decrease quantity"><i data-lucide="minus"></i></button><span>${item.qty}</span><button data-qty="${item.id}" data-change="1" aria-label="Increase quantity"><i data-lucide="plus"></i></button></div><button class="remove-item" data-remove="${item.id}">Remove</button></div><strong class="row-price">${money(item.price*item.qty)}</strong></div>`).join("");
  $("#cartEmpty").classList.toggle("hidden",count>0);$("#cartFooter").classList.toggle("hidden",count===0);refreshIcons();
}
function addToCart(id){const p=products.find(x=>x.id===Number(id));if(!p)return;const existing=state.cart.find(x=>x.id===p.id);existing?existing.qty++:state.cart.push({...p,qty:1});renderCart();toast(`${p.name} added to your bag`);}
function openPanel(el){closePanels();$("#overlay").classList.add("open");el.classList.add("open");el.setAttribute("aria-hidden","false");document.body.classList.add("locked");}
function closePanels(){$$(".drawer.open,.modal.open").forEach(el=>{el.classList.remove("open");el.setAttribute("aria-hidden","true")});$("#overlay").classList.remove("open");document.body.classList.remove("locked");}
function readLocalAccounts(){
  const saved=localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if(!saved)return [];
  const accounts=JSON.parse(saved);
  if(!Array.isArray(accounts))throw new Error("Saved account data is invalid. Clear this site's browser storage and try again.");
  return accounts;
}
function createSalt(){
  return [...crypto.getRandomValues(new Uint8Array(16))].map(byte=>byte.toString(16).padStart(2,"0")).join("");
}
async function hashPassword(password,salt){
  if(!crypto.subtle)throw new Error("Secure browser cryptography is unavailable. Open the site using HTTPS or localhost.");
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
  const saltBytes=new Uint8Array(salt.match(/.{2}/g).map(byte=>parseInt(byte,16)));
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:saltBytes,iterations:310000,hash:"SHA-256"},key,256);
  return [...new Uint8Array(bits)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
}
function renderAccountView(){
  const signedIn=Boolean(state.user);
  $("#accountAuthView").classList.toggle("hidden",signedIn);
  $("#accountProfile").classList.toggle("hidden",!signedIn);
  if(signedIn){
    $("#profileName").textContent=state.user.name;
    $("#profileEmail").textContent=state.user.email;
    $("#profileInitials").textContent=state.user.name.split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();
    $("#accountToggle").setAttribute("aria-label",`Account: ${state.user.name}`);
  }else{
    $("#accountToggle").setAttribute("aria-label","Account");
  }
}
function restoreLocalSession(){
  try{
    const email=localStorage.getItem(SESSION_STORAGE_KEY);
    if(!email)return;
    const account=readLocalAccounts().find(item=>item.email===email);
    if(account)state.user={name:account.name,email:account.email};
    else localStorage.removeItem(SESSION_STORAGE_KEY);
  }catch(error){
    $("#manualAuthNote").textContent=`Could not load your saved profile: ${error.message}`;
  }
  renderAccountView();
}
function setManualAuthMode(mode){
  state.manualAuthMode=mode;
  const isRegister=mode==="register";
  $("#manualLoginTab").classList.toggle("active",!isRegister);
  $("#manualRegisterTab").classList.toggle("active",isRegister);
  $("#manualLoginTab").setAttribute("aria-selected",String(!isRegister));
  $("#manualRegisterTab").setAttribute("aria-selected",String(isRegister));
  $("#manualNameLabel").classList.toggle("hidden",!isRegister);
  $("#manualName").classList.toggle("hidden",!isRegister);
  $("#manualName").required=isRegister;
  $("#manualPassword").autocomplete=isRegister?"new-password":"current-password";
  $("#manualAuthSubmit").textContent=isRegister?"Create NOVA account":"Log in";
  $("#manualAuthNote").textContent="Demo only. Do not use a real or reused password.";
}
async function submitManualAuth(event){
  event.preventDefault();
  const form=event.currentTarget;
  const note=$("#manualAuthNote");
  const submit=$("#manualAuthSubmit");
  const loginTab=$("#manualLoginTab");
  const registerTab=$("#manualRegisterTab");
  const mode=state.manualAuthMode;
  const email=$("#manualEmail").value.trim().toLowerCase();
  const password=$("#manualPassword").value;
  submit.disabled=true;
  loginTab.disabled=true;
  registerTab.disabled=true;
  note.textContent=mode==="register"?"Creating your demo account…":"Checking your account…";
  try{
    const accounts=readLocalAccounts();
    let account;
    if(mode==="register"){
      const name=$("#manualName").value.trim();
      if(!name)throw new Error("Please enter your name.");
      if(accounts.some(item=>item.email===email))throw new Error("An account with this email already exists. Log in instead.");
      const salt=createSalt();
      account={name,email,salt,passwordHash:await hashPassword(password,salt)};
      accounts.push(account);
      localStorage.setItem(ACCOUNT_STORAGE_KEY,JSON.stringify(accounts));
    }else{
      account=accounts.find(item=>item.email===email);
      if(!account||typeof account.salt!=="string"||typeof account.passwordHash!=="string"||await hashPassword(password,account.salt)!==account.passwordHash){
        throw new Error("Email or password is incorrect.");
      }
    }
    localStorage.setItem(SESSION_STORAGE_KEY,account.email);
    state.user={name:account.name,email:account.email};
    renderAccountView();
    toast(mode==="register"?"Demo account created":"Logged in");
    form.reset();
  }catch(error){
    note.textContent=`${mode==="register"?"Account creation":"Login"} failed: ${error.message}`;
  }finally{
    submit.disabled=false;
    loginTab.disabled=false;
    registerTab.disabled=false;
  }
}
$("#filterRow").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;state.category=b.dataset.filter;$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("#productSearch").addEventListener("input",e=>{state.search=e.target.value;renderProducts();});
$("#searchToggle").addEventListener("click",()=>{$("#productSearch").focus();$("#shop").scrollIntoView({behavior:"smooth"});});
$("#sortProducts").addEventListener("change",e=>{state.sort=e.target.value;renderProducts();});
$("#productGrid").addEventListener("click",e=>{const add=e.target.closest("[data-add]");const wish=e.target.closest("[data-wish]");if(add)addToCart(add.dataset.add);if(wish){const id=Number(wish.dataset.wish);state.wishlist.has(id)?(state.wishlist.delete(id),toast("Removed from wishlist")):(state.wishlist.add(id),toast("Saved to wishlist"));renderProducts();}});
$("#cartItems").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");if(qty){const item=state.cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)state.cart=state.cart.filter(x=>x.id!==item.id);}}if(remove)state.cart=state.cart.filter(x=>x.id!==Number(remove.dataset.remove));renderCart();});
$("#cartToggle").addEventListener("click",()=>openPanel($("#cartDrawer")));
$("#accountToggle").addEventListener("click",()=>{renderAccountView();openPanel($("#accountModal"));});
$("#overlay").addEventListener("click",closePanels);
$$("[data-close]").forEach(b=>b.addEventListener("click",closePanels));
$("#manualLoginTab").addEventListener("click",()=>setManualAuthMode("login"));
$("#manualRegisterTab").addEventListener("click",()=>setManualAuthMode("register"));
$("#manualAuthForm").addEventListener("submit",submitManualAuth);
$("#logoutButton").addEventListener("click",()=>{
  try{
    localStorage.removeItem(SESSION_STORAGE_KEY);
    state.user=null;
    setManualAuthMode("login");
    renderAccountView();
    toast("Logged out");
  }catch(error){
    $("#manualAuthNote").textContent=`Could not log out: ${error.message}`;
  }
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePanels();});
$("#menuToggle").addEventListener("click",()=>{$("#mainNav").classList.toggle("open");const opened=$("#mainNav").classList.contains("open");$("#menuToggle").setAttribute("aria-label",opened?"Close navigation":"Open navigation");$("#menuToggle").innerHTML=opened?'<i data-lucide="x"></i>':'<i data-lucide="menu"></i>';refreshIcons();});
$$(".nav-link").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$("#checkoutBtn").addEventListener("click",()=>{if(!state.cart.length)return;openPanel($("#checkoutModal"));});
$("#checkoutForm").addEventListener("submit",e=>{e.preventDefault();if(!state.cart.length){closePanels();toast("Your bag is empty");return;}const orderNo="NV"+Math.random().toString(36).slice(2,8).toUpperCase();$("#orderNumber").textContent=orderNo;closePanels();state.cart=[];renderCart();openPanel($("#orderModal"));e.target.reset();});
$("#finishOrder").addEventListener("click",()=>{closePanels();window.scrollTo({top:0,behavior:"smooth"});toast("Thanks for exploring NOVA");});
$("#showAllBtn").addEventListener("click",()=>{state.category="All";state.search="";$("#productSearch").value="";$$("[data-filter]").forEach(x=>x.classList.toggle("active",x.dataset.filter==="All"));renderProducts();$("#shop").scrollIntoView({behavior:"smooth"});});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Thanks for your interest! Connect a backend to save subscriptions.");e.target.reset();});
window.addEventListener("scroll",()=>$("#backToTop").classList.toggle("visible",window.scrollY>500));
$("#backToTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
$("#year").textContent=new Date().getFullYear();
restoreLocalSession();
renderProducts();renderCart();refreshIcons();
