const products = {
  petal: {name:"Petal Kiss", detail:"Помада + рум’яна · Rose", price:590},
  nude: {name:"Soft Nude", detail:"Помада + рум’яна · Nude", price:590},
  peach: {name:"Peach Bloom", detail:"Тінт + кремові рум’яна · Peach", price:620},
  gold: {name:"Golden Hour", detail:"Хайлайтер + сяйво для повік · Glow", price:640}
};
let cart = JSON.parse(localStorage.getItem("avera-cart") || "{}");
const $ = (s) => document.querySelector(s);
const money = (n) => "₴ " + n.toLocaleString("uk-UA");
function saveCart(){localStorage.setItem("avera-cart",JSON.stringify(cart));renderCart();}
function countCart(){return Object.values(cart).reduce((a,b)=>a+b,0);}
function renderCart(){
  const count=countCart(); $("#cartCount").textContent=count; $("#cartCountPanel").textContent=count;
  const items=$("#cartItems"); items.innerHTML="";
  if(!count){items.innerHTML='<p class="empty-cart">Тут поки порожньо — час знайти свій відтінок ✦</p>';}
  Object.entries(cart).forEach(([id,qty])=>{
    const p=products[id]; if(!p)return;
    const row=document.createElement("div"); row.className="cart-item";
    row.innerHTML=`<div><h3>${p.name}</h3><p>${p.detail}</p><div class="quantity"><button data-action="minus" data-id="${id}" aria-label="Зменшити кількість">−</button><span>${qty}</span><button data-action="plus" data-id="${id}" aria-label="Збільшити кількість">＋</button><button data-action="remove" data-id="${id}" aria-label="Видалити товар" title="Видалити">×</button></div></div><strong>${money(p.price*qty)}</strong>`;
    items.appendChild(row);
  });
  const total=Object.entries(cart).reduce((sum,[id,qty])=>sum+(products[id]?.price||0)*qty,0);
  $("#cartTotal").textContent=money(total);
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200);}
function openCart(){ $("#cartOverlay").classList.add("open");$("#cartOverlay").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){ $("#cartOverlay").classList.remove("open");$("#cartOverlay").setAttribute("aria-hidden","true");document.body.style.overflow="";}
document.querySelectorAll(".add-button").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.id;cart[id]=(cart[id]||0)+1;saveCart();toast(`${products[id].name} додано до кошика`);}));
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#closeCartBackdrop").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",e=>{const b=e.target.closest("button[data-action]");if(!b)return;const {id,action}=b.dataset;if(action==="plus")cart[id]=(cart[id]||0)+1;if(action==="minus")cart[id]=Math.max(0,(cart[id]||0)-1);if(action==="remove"||cart[id]===0)delete cart[id];saveCart();});
$("#checkout").addEventListener("click",()=>{if(!countCart()){toast("Спочатку додай товар до кошика");return;}const summary=Object.entries(cart).map(([id,q])=>`${products[id].name} — ${q} шт.`).join("%0D%0A");const total=Object.entries(cart).reduce((s,[id,q])=>s+products[id].price*q,0);window.location.href=`mailto:k.zubok@knute.edu.ua?subject=Замовлення%20AVÉRA&body=Вітаю!%0D%0AХочу%20оформити%20демонстраційне%20замовлення:%0D%0A${summary}%0D%0AРазом:%20${total}%20грн.%0D%0A%0D%0AМої%20контактні%20дані:%20`;});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".product-card").forEach(card=>{card.hidden=btn.dataset.filter!=="all"&&card.dataset.category!==btn.dataset.filter;});}));
$("#contactForm").addEventListener("submit",e=>{e.preventDefault();const d=new FormData(e.currentTarget);const subject=encodeURIComponent("Повідомлення з сайту AVÉRA");const body=encodeURIComponent(`Ім’я: ${d.get("name")}\nEmail: ${d.get("email")}\n\n${d.get("message")}`);window.location.href=`mailto:k.zubok@knute.edu.ua?subject=${subject}&body=${body}`;$("#formHint").textContent="Поштову програму відкрито. Перевір повідомлення та надішли його.";});
$("#menuToggle").addEventListener("click",()=>{const nav=$("#mainNav");const isOpen=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(isOpen));$("#menuToggle").textContent=isOpen?"×":"☰";});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").textContent="☰";}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
renderCart();
