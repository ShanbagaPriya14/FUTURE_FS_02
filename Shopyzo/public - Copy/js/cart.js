function loadCart(){
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

async function getProductById(id){
  const res = await fetch('/api/products/' + id);
  if(!res.ok) return null;
  return await res.json();
}

async function renderCart(){
  const cart = loadCart();
  const container = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if(cart.length===0){ 
    container.innerHTML = '<p>Your cart is empty</p>'; 
    summaryEl.innerHTML=''; 
    return; 
  }

  let html = '';
  let total = 0;

  for(const item of cart){
    const p = await getProductById(item.id);
    const sub = p.price * item.qty;
    total += sub;

    html += `
      <div class="card" style="display:flex;gap:12px;margin-bottom:12px">
        <img src="${p.image||'/images/placeholder.png'}" alt="${p.name}" 
             style="width:100px;height:100px;object-fit:cover">
        <div>
          <h4>${p.name}</h4>
          <p>Qty: ${item.qty}</p>
          <p>₹ ${sub}</p>
        </div>
      </div>`;
  }

  container.innerHTML = html;

  summaryEl.innerHTML = `
    <h3>Total: ₹ ${total}</h3>
    <button class="btn" id="checkout">Checkout</button>
  `;

  document.getElementById('checkout').addEventListener('click', ()=>{
    alert('Checkout placeholder — integrate payment gateway here');
  });
}

document.addEventListener('DOMContentLoaded', renderCart);
