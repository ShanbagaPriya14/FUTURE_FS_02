// fetch and render products; handle add-to-cart
async function fetchProducts(){
  const res = await fetch('/api/products');
  const products = await res.json();
  return products;
}

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const el = document.getElementById('cart-count');
  if(el) el.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function renderProductList(products){
  const list = document.getElementById('product-list');
  if(!list) return;
  list.innerHTML = products.map(p=>`
    <article class="card">
      <a href="/product.html?id=${p.id}"><img src="${p.image||'/images/placeholder.png'}" alt="${p.name}"/></a>
      <h3>${p.name}</h3>
      <p class="price">₹ ${p.price}</p>
      <button class="btn" data-id="${p.id}">Add to cart</button>
    </article>
  `).join('');
  list.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      addToCart(btn.dataset.id);
    })
  })
}

function addToCart(id){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id, qty:1});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Added to cart');
}

async function renderProductDetail(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  const res = await fetch('/api/products/' + id);
  if(!res.ok){ document.getElementById('product-detail').textContent = 'Product not found'; return; }
  const p = await res.json();
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <div class="card" style="display:flex;gap:16px;align-items:flex-start">
      <img src="${p.image||'/images/placeholder.png'}" alt="${p.name}" style="width:360px;height:360px;object-fit:cover"/>
      <div>
        <h2>${p.name}</h2>
        <p class="price">₹ ${p.price}</p>
        <p>${p.description}</p>
        <label>Size <select id="size-select">${p.sizes.map(s=>`<option>${s}</option>`).join('')}</select></label>
        <br/><br/>
        <button class="btn" id="add-btn">Add to cart</button>
      </div>
    </div>
  `;
  document.getElementById('add-btn').addEventListener('click',()=>{ addToCart(p.id); });
}

// on load
document.addEventListener('DOMContentLoaded', async ()=>{
  updateCartCount();
  if(document.getElementById('product-list')){
    const products = await fetchProducts();
    renderProductList(products);
  }
  if(document.getElementById('product-detail')){
    renderProductDetail();
  }
});
