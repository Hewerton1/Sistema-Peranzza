/* Catálogo Peranzza (Render Static Site).
 * Tamanhos P/M/G: 1 ou 2 sabores; GG: 1, 2 ou 3 sabores.
 * Todos os sabores de pizza estão liberados em cada tamanho, inclusive
 * combinações entre categorias doces, tradicionais, especiais e premium.
 * Preço de pizza com mais de um sabor: maior preço no tamanho escolhido.
 */
let ITEMS = [];
let EDGES = [];
const money = v => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(v);
const $ = selector => document.querySelector(selector);
const escapeHtml = text => String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let active = 'Todos';
let selected = null;
let sz = '';
let qty = 1;
let cart = [];
const pizza = product => product.kind === 'pizza';
const cats = ['Todos','Tradicionais','Especiais','Premium salgadas','Doces tradicionais','Doces Premium','Pratos','Panquecas','Porções','Sobremesas','Sucos','Bebidas','Drinks e destilados'];
const pizzaCats = cats.filter(cat => ['Tradicionais','Especiais','Premium salgadas','Doces tradicionais','Doces Premium'].includes(cat));

function show(id) { document.getElementById(id).hidden = false; }
function hide(id) { document.getElementById(id).hidden = true; }

function renderTabs() {
  $('#tabs').innerHTML = cats.map(cat => `<button class="tab ${active === cat ? 'active' : ''}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('');
  document.querySelectorAll('[data-cat]').forEach(button => button.onclick = () => {
    active = button.dataset.cat;
    renderTabs();
    renderItems();
  });
}
function renderItems() {
  const q = $('#search').value.trim().toLocaleLowerCase('pt-BR');
  const matches = ITEMS.filter(product => (active === 'Todos' || product.cat === active)
    && (!q || `${product.name} ${product.desc} ${product.cat}`.toLocaleLowerCase('pt-BR').includes(q)));
  $('#grid').innerHTML = matches.length ? matches.map(product => `<article class="item">
      <span class="tag">${escapeHtml(product.cat)}</span>
      <h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.desc)}</p>
      <div class="foot"><span class="price">A partir de ${money(Math.min(...Object.values(product.prices)))}</span>
      <button class="add" data-id="${product.id}">Escolher +</button></div>
    </article>`).join('') : '<div class="empty">Nenhum produto encontrado. Tente outro nome ou ingrediente.</div>';
  document.querySelectorAll('[data-id]').forEach(button => button.onclick = () => openProduct(Number(button.dataset.id)));
}

function currentFlavorCount() {
  if (!selected || !pizza(selected)) return 1;
  return sz === 'GG' ? Number($('#ggFlavorCount').value) : ($('#half').checked ? 2 : 1);
}
function getFlavor(id) {
  return ITEMS.find(item => item.id === Number(id) && pizza(item));
}
// As bordas de R$ 4 passam a R$ 8 na GG; as de R$ 10, a R$ 16.
// Para P, M e G, continuam valendo os preços originais do cardápio.
function edgePrice(index, size = sz) {
  const original = Number(EDGES[Number(index)]?.[1] ?? 0);
  if (size === 'GG' && original === 4) return 8;
  if (size === 'GG' && original === 10) return 16;
  return original;
}
function renderEdgeOptions() {
  const field = $('#edge');
  const keepIndex = Number(field.value || 0);
  field.innerHTML = EDGES.map((edge, index) => {
    const price = edgePrice(index);
    return `<option value="${index}">${escapeHtml(edge[0])}${price ? ' + ' + money(price) : ''}</option>`;
  }).join('');
  field.value = String(EDGES[keepIndex] ? keepIndex : 0);
}
function pickedFlavors() {
  const list = selected && pizza(selected) ? [selected] : [];
  const count = currentFlavorCount();
  if (count >= 2) {
    const second = getFlavor($('#secondFlavor').value);
    if (second && $('#secondCategory').value === second.cat && second.id !== selected.id) list.push(second);
  }
  if (count >= 3) {
    const third = getFlavor($('#thirdFlavor').value);
    if (third && $('#thirdCategory').value === third.cat && !list.some(item => item.id === third.id)) list.push(third);
  }
  return list;
}
function flavorSelectionsComplete() {
  if (!selected || !pizza(selected)) return true;
  const count = currentFlavorCount();
  const list = pickedFlavors();
  return list.length === count && new Set(list.map(item => item.id)).size === count
    && list.every(item => Number.isFinite(Number(item.prices[sz])));
}
function fillCategorySelect(selectId, preferred = '') {
  const el = $(selectId);
  el.innerHTML = `<option value="">Selecione a categoria</option>`
    + pizzaCats.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
  el.value = pizzaCats.includes(preferred) ? preferred : '';
}
function fillFlavorSelect(categorySelector, flavorSelector, excludedIds) {
  const category = $(categorySelector).value;
  const select = $(flavorSelector);
  const previous = select.value;
  const available = ITEMS.filter(item => pizza(item) && item.cat === category && !excludedIds.includes(item.id)
    && Number.isFinite(Number(item.prices[sz])));
  select.innerHTML = '<option value="">Selecione o sabor</option>' + available.map(item =>
    `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
  select.disabled = !category || !available.length;
  select.value = available.some(item => String(item.id) === previous) ? previous : '';
}
function refreshFlavorSelectors() {
  if (!selected || !pizza(selected)) return;
  const count = currentFlavorCount();
  const gg = sz === 'GG';
  $('#normalFlavorControls').hidden = gg;
  $('#ggFlavorControls').hidden = !gg;
  $('#halfOptions').hidden = count < 2;
  $('#thirdOptions').hidden = count < 3;

  // Cada categoria disponibiliza todas as pizzas, sem restrição a doce/salgada.
  fillFlavorSelect('#secondCategory', '#secondFlavor', [selected.id]);
  const second = getFlavor($('#secondFlavor').value);
  fillFlavorSelect('#thirdCategory', '#thirdFlavor', [selected.id, ...(second ? [second.id] : [])]);
  refreshPrice();
}
function openProduct(id) {
  selected = ITEMS.find(item => item.id === id);
  if (!selected) return;
  sz = Object.keys(selected.prices)[0];
  qty = 1;
  $('#productCat').textContent = selected.cat;
  $('#productTitle').textContent = selected.name;
  $('#productDesc').textContent = selected.desc;
  $('#half').checked = false;
  $('#ggFlavorCount').value = '1';
  $('#extraCat').checked = false;
  $('#pizzaOptions').hidden = !pizza(selected);
  $('#panOptions').hidden = selected.kind !== 'panqueca';
  $('#edge').value = '0';
  fillCategorySelect('#secondCategory');
  fillCategorySelect('#thirdCategory');
  $('#secondFlavor').innerHTML = '<option value="">Selecione o sabor</option>';
  $('#thirdFlavor').innerHTML = '<option value="">Selecione o sabor</option>';
  renderSizes();
  show('productOverlay');
}
function renderSizes() {
  $('#sizeChoices').innerHTML = Object.entries(selected.prices).map(([size, value]) =>
    `<button class="choice ${size === sz ? 'active' : ''}" data-size="${escapeHtml(size)}" type="button">${escapeHtml(size)} · ${money(value)}</button>`).join('');
  document.querySelectorAll('[data-size]').forEach(button => button.onclick = () => {
    if (sz === button.dataset.size) return;
    sz = button.dataset.size;
    // A troca de tamanho redefine a escolha para evitar misturar opções antigas.
    $('#half').checked = false;
    $('#ggFlavorCount').value = '1';
    fillCategorySelect('#secondCategory');
    fillCategorySelect('#thirdCategory');
    renderSizes();
  });
  $('#qty').textContent = qty;
  if (pizza(selected)) renderEdgeOptions();
  if (pizza(selected)) refreshFlavorSelectors();
  else refreshPrice();
}
function unitPrice() {
  if (!selected) return 0;
  let value = Number(selected.prices[sz]);
  if (pizza(selected)) {
    const flavors = pickedFlavors();
    value = Math.max(...flavors.map(item => Number(item.prices[sz])));
    value += edgePrice($('#edge').value);
  }
  if (selected.kind === 'panqueca' && $('#extraCat').checked) value += 3;
  return value;
}
function refreshPrice() {
  if (!selected) return;
  const valid = flavorSelectionsComplete();
  $('#flavorError').hidden = valid;
  $('#addToCart').disabled = !valid;
  $('#lineTotal').textContent = valid ? money(unitPrice() * qty) : 'Selecione os sabores';
}

$('#search').oninput = renderItems;
$('#half').onchange = refreshFlavorSelectors;
$('#ggFlavorCount').onchange = refreshFlavorSelectors;
$('#secondCategory').onchange = () => {
  $('#secondFlavor').value = '';
  $('#thirdFlavor').value = '';
  refreshFlavorSelectors();
};
$('#thirdCategory').onchange = () => {
  $('#thirdFlavor').value = '';
  refreshFlavorSelectors();
};
$('#secondFlavor').onchange = () => {
  // Impede que o 3º sabor repita algum dos dois primeiros.
  refreshFlavorSelectors();
};
$('#thirdFlavor').onchange = refreshPrice;
$('#edge').onchange = refreshPrice;
$('#extraCat').onchange = refreshPrice;
$('#minus').onclick = () => { qty = Math.max(1, qty - 1); $('#qty').textContent = qty; refreshPrice(); };
$('#plus').onclick = () => { qty += 1; $('#qty').textContent = qty; refreshPrice(); };
$('#addToCart').onclick = () => {
  if (!selected || !flavorSelectionsComplete()) {refreshPrice(); return;}
  let details = sz;
  let name = selected.name;
  if (pizza(selected)) {
    const flavors = pickedFlavors();
    if (flavors.length > 1) {
      const label = flavors.length === 3 ? '3 sabores' : 'meio a meio';
      details += ` · ${label}: ` + flavors.map(item => `${item.name} (${item.cat})`).join(' + ');
    }
    if (Number($('#edge').value) > 0) {
      const edgeIndex = Number($('#edge').value);
      details += ` · borda ${EDGES[edgeIndex][0]} (+ ${money(edgePrice(edgeIndex))})`;
    }
  }
  if (selected.kind === 'panqueca' && $('#extraCat').checked) details += ' · Catupiry original';
  cart.push({name, details, qty, unit: unitPrice()});
  hide('productOverlay');
  renderCart();
  show('cartOverlay');
};
function renderCart() {
  $('#cartCount').textContent = cart.reduce((total, item) => total + item.qty, 0);
  $('#cartItems').innerHTML = cart.length ? cart.map((item, i) => `<div class="cartline">
    <div class="sumrow"><b>${item.qty}× ${escapeHtml(item.name)}</b><strong class="price">${money(item.unit * item.qty)}</strong></div>
    <small>${escapeHtml(item.details)}</small>
    <button data-dec="${i}">−</button><button data-inc="${i}">+</button><button data-del="${i}">Remover</button>
    </div>`).join('') : '<p class="hint">Seu carrinho está vazio. Escolha os produtos no cardápio.</p>';
  $('#subtotal').textContent = money(cart.reduce((total, item) => total + item.unit * item.qty, 0));
  document.querySelectorAll('[data-dec]').forEach(button => button.onclick = () => {
    const i = Number(button.dataset.dec);
    cart[i].qty -= 1;
    if (!cart[i].qty) cart.splice(i, 1);
    renderCart();
  });
  document.querySelectorAll('[data-inc]').forEach(button => button.onclick = () => {cart[Number(button.dataset.inc)].qty++; renderCart();});
  document.querySelectorAll('[data-del]').forEach(button => button.onclick = () => {cart.splice(Number(button.dataset.del), 1); renderCart();});
  $('#checkoutResult').hidden = true;
  $('#orderThanks').hidden = true;
}
$('#addMoreItems').onclick = () => {
  hide('cartOverlay');
  active = 'Todos';
  $('#search').value = '';
  renderTabs();
  renderItems();
  $('#search').dispatchEvent(new Event('input'));
  document.querySelector('#cardapio').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
};
$('#cartOpen').onclick = () => {renderCart(); show('cartOverlay');};
$('#orderType').onchange = () => {$('#addressWrap').hidden = $('#orderType').value === 'Retirada';};
// Fallback: pedido-whatsapp.js configura a validação detalhada e o link do WhatsApp.
$('#checkout').onclick = () => {
  if (!cart.length) {alert('Adicione pelo menos um produto.'); return;}
  const msg = '*PEDIDO PERANZZA*\n\n' + cart.map(item => `${item.qty}x ${item.name} (${item.details}) — ${money(item.qty*item.unit)}`).join('\n');
  $('#message').value = msg;
  show('checkoutResult');
};
$('#copy').onclick = async () => {
  try {await navigator.clipboard.writeText($('#message').value); $('#copy').textContent='Copiado ✓';}
  catch (error) {$('#message').select(); $('#copy').textContent='Selecione e copie a mensagem';}
};
document.querySelectorAll('.overlay').forEach(overlay => overlay.addEventListener('click', event => {
  if (event.target === overlay) hide(overlay.id);
}));

async function carregarCatalogo() {
  try {
    const response = await fetch('dados/cardapio.json', {cache:'no-store'});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    ITEMS = data.itens;
    EDGES = data.bordas.map(edge => [edge.nome, Number(edge.preco)]);
    renderTabs();
    renderItems();
    document.dispatchEvent(new Event('peranzza:catalogo-carregado'));
  } catch (error) {
    console.error('Falha ao carregar catálogo:', error);
    $('#grid').innerHTML = '<div class="empty">Não foi possível carregar o cardápio. Atualize a página ou tente novamente.</div>';
  }
}
carregarCatalogo();
