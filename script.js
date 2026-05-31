/* ===========================
   CRAFTMARKET — script.js v3
   Item custom + Enchantements
   =========================== */
'use strict';

// ───────────────────────────────────────────
// ENCHANTEMENTS (liste complète Minecraft Java)
// ───────────────────────────────────────────
const ENCHANTMENTS = [
  // Épées / Combat
  { id:'sharpness',        name:'Tranchant',           nameEn:'Sharpness',        maxLvl:5,  group:'combat' },
  { id:'smite',            name:'Châtiment',           nameEn:'Smite',            maxLvl:5,  group:'combat' },
  { id:'bane_arthropods',  name:'Fléau des arthropodes',nameEn:'Bane of Arthropods',maxLvl:5,group:'combat' },
  { id:'knockback',        name:'Repoussement',        nameEn:'Knockback',        maxLvl:2,  group:'combat' },
  { id:'fire_aspect',      name:'Brûlure',             nameEn:'Fire Aspect',      maxLvl:2,  group:'combat' },
  { id:'looting',          name:'Butin',               nameEn:'Looting',          maxLvl:3,  group:'combat' },
  { id:'sweeping_edge',    name:'Tranchant balayé',    nameEn:'Sweeping Edge',    maxLvl:3,  group:'combat' },
  // Arcs
  { id:'power',            name:'Puissance',           nameEn:'Power',            maxLvl:5,  group:'ranged' },
  { id:'punch',            name:'Recul',               nameEn:'Punch',            maxLvl:2,  group:'ranged' },
  { id:'flame',            name:'Flamme',              nameEn:'Flame',            maxLvl:1,  group:'ranged' },
  { id:'infinity',         name:'Infini',              nameEn:'Infinity',         maxLvl:1,  group:'ranged' },
  // Arbalète
  { id:'multishot',        name:'Multitir',            nameEn:'Multishot',        maxLvl:1,  group:'ranged' },
  { id:'quick_charge',     name:'Chargement rapide',   nameEn:'Quick Charge',     maxLvl:3,  group:'ranged' },
  { id:'piercing',         name:'Perforation',         nameEn:'Piercing',         maxLvl:4,  group:'ranged' },
  // Outils
  { id:'efficiency',       name:'Efficacité',          nameEn:'Efficiency',       maxLvl:5,  group:'tools' },
  { id:'silk_touch',       name:'Toucher de soie',     nameEn:'Silk Touch',       maxLvl:1,  group:'tools' },
  { id:'fortune',          name:'Fortune',             nameEn:'Fortune',          maxLvl:3,  group:'tools' },
  { id:'luck_of_the_sea',  name:'Chance de la mer',    nameEn:'Luck of the Sea',  maxLvl:3,  group:'tools' },
  { id:'lure',             name:'Appât',               nameEn:'Lure',             maxLvl:3,  group:'tools' },
  // Armure
  { id:'protection',       name:'Protection',          nameEn:'Protection',       maxLvl:4,  group:'armor' },
  { id:'fire_protection',  name:'Protection contre le feu',nameEn:'Fire Protection',maxLvl:4,group:'armor' },
  { id:'blast_protection', name:'Protection contre les explosions',nameEn:'Blast Protection',maxLvl:4,group:'armor' },
  { id:'projectile_protection',name:'Protection contre les projectiles',nameEn:'Projectile Protection',maxLvl:4,group:'armor' },
  { id:'feather_falling',  name:'Chute amortie',       nameEn:'Feather Falling',  maxLvl:4,  group:'armor' },
  { id:'respiration',      name:'Respiration',         nameEn:'Respiration',      maxLvl:3,  group:'armor' },
  { id:'aqua_affinity',    name:'Affinité aquatique',  nameEn:'Aqua Affinity',    maxLvl:1,  group:'armor' },
  { id:'thorns',           name:'Épines',              nameEn:'Thorns',           maxLvl:3,  group:'armor' },
  { id:'depth_strider',    name:'Marcheur des grands fonds',nameEn:'Depth Strider',maxLvl:3, group:'armor' },
  { id:'frost_walker',     name:'Marcheur des glaces', nameEn:'Frost Walker',     maxLvl:2,  group:'armor' },
  { id:'soul_speed',       name:'Vitesse des âmes',    nameEn:'Soul Speed',       maxLvl:3,  group:'armor' },
  { id:'swift_sneak',      name:'Discrétion agile',    nameEn:'Swift Sneak',      maxLvl:3,  group:'armor' },
  // Universel
  { id:'unbreaking',       name:'Solidité',            nameEn:'Unbreaking',       maxLvl:3,  group:'universal' },
  { id:'mending',          name:'Réparation',          nameEn:'Mending',          maxLvl:1,  group:'universal' },
  { id:'curse_of_vanishing',name:'Malédiction de disparition',nameEn:'Curse of Vanishing',maxLvl:1,group:'curse' },
  { id:'curse_of_binding', name:'Malédiction d\'enlacement',nameEn:'Curse of Binding',maxLvl:1,group:'curse' },
  // Trident
  { id:'channeling',       name:'Canalisation',        nameEn:'Channeling',       maxLvl:1,  group:'combat' },
  { id:'impaling',         name:'Empalage',            nameEn:'Impaling',         maxLvl:5,  group:'combat' },
  { id:'loyalty',          name:'Loyauté',             nameEn:'Loyalty',          maxLvl:3,  group:'combat' },
  { id:'riptide',          name:'Marée déchirante',    nameEn:'Riptide',          maxLvl:3,  group:'combat' },
  // Divers
  { id:'wind_burst',       name:'Rafale de vent',      nameEn:'Wind Burst',       maxLvl:3,  group:'combat' },
  { id:'density',          name:'Densité',             nameEn:'Density',          maxLvl:5,  group:'combat' },
  { id:'breach',           name:'Brèche',              nameEn:'Breach',           maxLvl:4,  group:'combat' },
];

const ENCHANT_GROUPS = {
  combat:    { label: '⚔ Combat', color: '#c04040' },
  ranged:    { label: '🏹 À distance', color: '#8060c0' },
  tools:     { label: '⛏ Outils', color: '#60a0c0' },
  armor:     { label: '🛡 Armure', color: '#4080c0' },
  universal: { label: '🌟 Universel', color: '#d4a017' },
  curse:     { label: '💀 Malédictions', color: '#803060' },
};

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];

// ───────────────────────────────────────────
// ITEMS
// ───────────────────────────────────────────
let MINECRAFT_ITEMS = [];

async function loadItems() {
  try {
    const res = await fetch('items.json');
    MINECRAFT_ITEMS = await res.json();
  } catch(e) { MINECRAFT_ITEMS = []; }
}

function idToEnglish(id) {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const RARE_ITEMS = new Set(['nether_star','dragon_egg','enchanted_golden_apple','elytra','netherite_ingot','totem_of_undying']);

const CAT_LABELS = {
  weapons:'⚔ Armes', tools:'⛏ Outils', armor:'🛡 Armure',
  resources:'💎 Ressources', blocks:'🧱 Blocs', food:'🍎 Nourriture', misc:'✨ Divers'
};

// ───────────────────────────────────────────
// DISCORD WEBHOOK
// ───────────────────────────────────────────
const DEFAULT_WEBHOOK = 'https://discord.com/api/webhooks/1510191804132229181/4NCQrv7DtCgBCb7zKTpVZ44Ff8_WBSz7JQ_SipowM-bhFsbSgGIZdbgF7UOJIZ2UZWHw';

// ───────────────────────────────────────────
// STATE
// ───────────────────────────────────────────
let listings = [];
let activeCategory = 'all';
let searchQuery = '';
let toastTimer = null;
let editingId = null;
let pendingTrades = [];

// État modal enchantements
let enchantContext = null; // { tradeIdx, side, resolve }
let enchantSelection = {}; // { enchant_id: level }

// État modal item custom
let customItemContext = null; // { tradeIdx, side, resolve }

// ───────────────────────────────────────────
// DOM
// ───────────────────────────────────────────
const grid             = document.getElementById('catalogue-grid');
const emptyState       = document.getElementById('empty-state');
const listingCount     = document.getElementById('listing-count');
const openModalBtn     = document.getElementById('open-modal-btn');
const closeModalBtn    = document.getElementById('close-modal-btn');
const cancelBtn        = document.getElementById('cancel-btn');
const modalOverlay     = document.getElementById('modal-overlay');
const modalTitle       = document.getElementById('modal-title');
const sellerInput      = document.getElementById('seller-input');
const shopDescInput    = document.getElementById('shop-desc-input');
const formError        = document.getElementById('form-error');
const toastEl          = document.getElementById('toast');
const submitBtn        = document.getElementById('submit-btn');
const addTradeBtn      = document.getElementById('add-trade-btn');
const tradesList       = document.getElementById('trades-list');
const tradeTemplate    = document.getElementById('trade-row-template');
const tradesCountBadge = document.getElementById('trades-count-badge');
const searchInput      = document.getElementById('search-input');
const filterTabs       = document.getElementById('filter-tabs');

// Custom item modal
const customItemOverlay  = document.getElementById('custom-item-overlay');
const customItemNameInp  = document.getElementById('custom-item-name');
const customItemCatInp   = document.getElementById('custom-item-cat');
const customItemImgInp   = document.getElementById('custom-item-img');
const customItemPreviewRow = document.getElementById('custom-item-preview-row');
const customItemPreviewImg = document.getElementById('custom-item-preview-img');
const customItemPreviewName= document.getElementById('custom-item-preview-name');
const customItemError    = document.getElementById('custom-item-error');
const confirmCustomItemBtn = document.getElementById('confirm-custom-item-btn');
const cancelCustomItemBtn  = document.getElementById('cancel-custom-item-btn');
const closeCustomItemBtn   = document.getElementById('close-custom-item-btn');

// Enchant modal
const enchantOverlay    = document.getElementById('enchant-overlay');
const enchantList       = document.getElementById('enchant-list');
const enchantSearch     = document.getElementById('enchant-search');
const confirmEnchantBtn = document.getElementById('confirm-enchant-btn');
const cancelEnchantBtn  = document.getElementById('cancel-enchant-btn');
const closeEnchantBtn   = document.getElementById('close-enchant-btn');

// ───────────────────────────────────────────
// LOCALSTORAGE
// ───────────────────────────────────────────
function loadListings() {
  try {
    const raw = localStorage.getItem('craftmarket_listings_v3');
    listings = raw ? JSON.parse(raw) : getDefaultListings();
  } catch { listings = getDefaultListings(); }
}
function saveListings() {
  localStorage.setItem('craftmarket_listings_v3', JSON.stringify(listings));
}
function getDefaultListings() {
  return [
    {
      id: genId(), seller: 'Notch', shopDesc: 'Spécialiste ressources et minerais rares',
      trades: [{
        itemId:'diamond', itemName:'Diamant', itemImage:'https://www.mcworldtools.com/textures/rendered/diamond.png',
        itemCategory:'resources', qtyOffer:1, itemEnchants:[],
        exchangeId:'dirt', exchangeName:'Terre', exchangeImage:'https://www.mcworldtools.com/textures/rendered/dirt.png',
        exchangeCategory:'blocks', qtyExchange:32, exchangeEnchants:[], note:'Diamants naturels, trouvés en Y=-59.', custom:false
      }],
      date: new Date(Date.now()-86400000*2).toISOString()
    }
  ];
}

// ───────────────────────────────────────────
// UTILS
// ───────────────────────────────────────────
function genId() { return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function timeAgo(iso) {
  const d=Date.now()-new Date(iso).getTime(), m=Math.floor(d/60000),h=Math.floor(d/3600000),dy=Math.floor(d/86400000);
  if(m<1) return "À l'instant"; if(m<60) return `il y a ${m}min`; if(h<24) return `il y a ${h}h`; return `il y a ${dy}j`;
}
function showToast(msg, isError=false) {
  toastEl.textContent=msg; toastEl.classList.remove('hidden','error');
  if(isError) toastEl.classList.add('error');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastEl.classList.add('hidden'),3500);
}
function showError(msg) { formError.textContent=msg; formError.classList.remove('hidden'); formError.scrollIntoView({behavior:'smooth',block:'nearest'}); }
function clearError()   { formError.classList.add('hidden'); }
function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function formatEnchants(enchants) {
  if (!enchants || enchants.length === 0) return '';
  return enchants.map(e => {
    const def = ENCHANTMENTS.find(x => x.id === e.id);
    const name = def ? def.name : e.id;
    return e.level > 1 ? `${name} ${ROMAN[e.level] || e.level}` : name;
  }).join(', ');
}

// ───────────────────────────────────────────
// RENDER CATALOGUE
// ───────────────────────────────────────────
function getFilteredListings() {
  return listings.filter(shop => {
    const matchCat = activeCategory==='all' || shop.trades.some(t=>t.itemCategory===activeCategory||t.exchangeCategory===activeCategory);
    const q=searchQuery.toLowerCase();
    const matchSearch = !q || shop.seller.toLowerCase().includes(q) || (shop.shopDesc&&shop.shopDesc.toLowerCase().includes(q)) ||
      shop.trades.some(t=>t.itemName.toLowerCase().includes(q)||t.exchangeName.toLowerCase().includes(q)||(t.note&&t.note.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });
}

function renderCatalogue() {
  const filtered = getFilteredListings();
  grid.innerHTML='';
  emptyState.style.display = filtered.length===0 ? 'block' : 'none';
  filtered.forEach((shop,i) => grid.appendChild(createShopCard(shop,i)));
  const total = listings.reduce((a,s)=>a+s.trades.length,0);
  listingCount.textContent=`${listings.length} boutique${listings.length!==1?'s':''} · ${total} trade${total!==1?'s':''}`;
}

function enchantTagsHtml(enchants) {
  if (!enchants || enchants.length === 0) return '';
  return `<div class="enchant-tags-card">${enchants.map(e => {
    const def = ENCHANTMENTS.find(x=>x.id===e.id);
    const name = def ? def.name : e.id;
    const isCurse = def && def.group === 'curse';
    return `<span class="enchant-tag-card${isCurse?' enchant-tag-curse':''}">${name}${e.level>1?' '+ROMAN[e.level]:''}</span>`;
  }).join('')}</div>`;
}

function createShopCard(shop, index) {
  const hasRare = shop.trades.some(t=>RARE_ITEMS.has(t.itemId)||RARE_ITEMS.has(t.exchangeId));
  const card = document.createElement('div');
  card.className=`shop-card${hasRare?' card-rare':''}`;
  card.style.animationDelay=`${index*0.04}s`;

  const tradesHtml = shop.trades.map(t => {
    const fb1=`https://ui-avatars.com/api/?name=${encodeURIComponent(t.itemName)}&background=1a2212&color=7ec84a&size=48`;
    const fb2=`https://ui-avatars.com/api/?name=${encodeURIComponent(t.exchangeName)}&background=1a2212&color=e8a020&size=48`;
    const customBadge = t.custom ? '<span class="custom-badge">custom</span>' : '';
    return `
      <div class="shop-trade-row">
        <div class="trade-side trade-offer">
          <img class="card-item-img-sm" src="${t.itemImage||fb1}" alt="${escapeHtml(t.itemName)}" onerror="this.src='${fb1}'" />
          <div class="trade-side-info">
            <span class="trade-qty">×${t.qtyOffer}</span>
            <span class="trade-name">${escapeHtml(t.itemName)} ${customBadge}</span>
            ${enchantTagsHtml(t.itemEnchants)}
          </div>
        </div>
        <div class="trade-arrow">⇄</div>
        <div class="trade-side trade-exchange">
          <img class="card-item-img-sm" src="${t.exchangeImage||fb2}" alt="${escapeHtml(t.exchangeName)}" onerror="this.src='${fb2}'" />
          <div class="trade-side-info">
            <span class="trade-qty">×${t.qtyExchange}</span>
            <span class="trade-name">${escapeHtml(t.exchangeName)}</span>
            ${enchantTagsHtml(t.exchangeEnchants)}
          </div>
        </div>
        ${t.note?`<span class="trade-card-note" title="${escapeHtml(t.note)}">💬 ${escapeHtml(t.note)}</span>`:''}
      </div>
    `;
  }).join('');

  card.innerHTML=`
    <div class="shop-card-header">
      <div class="shop-seller-info">
        <span class="shop-seller-name">👤 ${escapeHtml(shop.seller)}</span>
        ${shop.shopDesc?`<span class="shop-seller-desc">${escapeHtml(shop.shopDesc)}</span>`:''}
      </div>
      <span class="shop-trade-count">${shop.trades.length} trade${shop.trades.length!==1?'s':''}</span>
    </div>
    <div class="shop-trades-body">${tradesHtml}</div>
    <div class="card-footer">
      <span class="card-date">${timeAgo(shop.date)}</span>
      <div class="card-actions">
        <button class="card-edit-btn" data-id="${shop.id}">✏ Modifier</button>
        <button class="card-del-btn" data-id="${shop.id}">🗑 Supprimer</button>
      </div>
    </div>
  `;
  card.querySelector('.card-del-btn').addEventListener('click',()=>deleteShop(shop.id));
  card.querySelector('.card-edit-btn').addEventListener('click',()=>openEditModal(shop.id));
  return card;
}

function deleteShop(id) { listings=listings.filter(s=>s.id!==id); saveListings(); renderCatalogue(); showToast('Boutique supprimée.'); }

// ───────────────────────────────────────────
// MODAL BOUTIQUE
// ───────────────────────────────────────────
function openModal(shopToEdit=null) {
  editingId = shopToEdit ? shopToEdit.id : null;
  modalTitle.textContent = shopToEdit ? '✏ Modifier la boutique' : '🏪 Nouvelle Boutique';
  submitBtn.textContent  = shopToEdit ? '💾 Enregistrer' : '📢 Publier la boutique';
  sellerInput.value = shopToEdit ? shopToEdit.seller : '';
  shopDescInput.value = shopToEdit ? (shopToEdit.shopDesc||'') : '';
  tradesList.innerHTML=''; pendingTrades=[]; clearError();
  if (shopToEdit && shopToEdit.trades.length>0) {
    shopToEdit.trades.forEach(t=>addTradeRow({
      offerItem: { id:t.itemId, name:t.itemName, image:t.itemImage, category:t.itemCategory, custom:!!t.custom },
      offerQty: t.qtyOffer, offerEnchants: t.itemEnchants||[],
      exchangeItem: { id:t.exchangeId, name:t.exchangeName, image:t.exchangeImage, category:t.exchangeCategory },
      exchangeQty: t.qtyExchange, exchangeEnchants: t.exchangeEnchants||[],
      note: t.note||''
    }));
  } else { addTradeRow(); }
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow='hidden';
  sellerInput.focus();
}
function openEditModal(id) { const s=listings.find(x=>x.id===id); if(s) openModal(s); }
function closeModal() { modalOverlay.classList.add('hidden'); document.body.style.overflow=''; pendingTrades=[]; tradesList.innerHTML=''; editingId=null; }

openModalBtn.addEventListener('click',()=>openModal());
closeModalBtn.addEventListener('click',closeModal);
cancelBtn.addEventListener('click',closeModal);
modalOverlay.addEventListener('click',e=>{ if(e.target===modalOverlay) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') { closeModal(); closeCustomItemModal(); closeEnchantModal(); } });

// ───────────────────────────────────────────
// TRADES DYNAMIQUES
// ───────────────────────────────────────────
function updateTradesBadge() {
  const n=pendingTrades.length;
  tradesCountBadge.textContent=`${n} trade${n!==1?'s':''}`;
}

function addTradeRow(prefill=null) {
  const tradeData = {
    offerItem:null, offerQty:1, offerEnchants:[],
    exchangeItem:null, exchangeQty:1, exchangeEnchants:[],
    note:'', ...(prefill||{})
  };
  const idx=pendingTrades.length;
  pendingTrades.push(tradeData);

  const clone=tradeTemplate.content.cloneNode(true);
  const row=clone.querySelector('.trade-row');
  row.dataset.tradeIndex=idx;
  row.querySelector('.trade-num').textContent=idx+1;

  if(prefill) {
    if(prefill.offerItem)    setOfferPreview(row,prefill.offerItem);
    if(prefill.exchangeItem) setExchangePreview(row,prefill.exchangeItem);
    row.querySelector('.qty-offer').value    = prefill.offerQty||1;
    row.querySelector('.qty-exchange').value = prefill.exchangeQty||1;
    row.querySelector('.trade-note').value   = prefill.note||'';
    if(prefill.offerEnchants?.length)    renderEnchantTagsInline(row.querySelector('.offer-enchant-tags'),    row.querySelector('.offer-enchant-count'),    prefill.offerEnchants);
    if(prefill.exchangeEnchants?.length) renderEnchantTagsInline(row.querySelector('.exchange-enchant-tags'), row.querySelector('.exchange-enchant-count'), prefill.exchangeEnchants);
  }

  row.querySelector('.trade-row-remove').addEventListener('click',()=>removeTradeRow(row,idx));

  // Offer search
  const offerSearch=row.querySelector('.item-search-offer');
  const offerDrop  =row.querySelector('.item-dropdown-offer');
  offerSearch.addEventListener('input',()=>handleSearchInput(offerSearch,offerDrop,item=>{ selectOfferItem(row,idx,item); }));
  offerSearch.addEventListener('focus',()=>{ if(offerSearch.value.trim()) offerDrop.classList.remove('hidden'); });
  row.querySelector('.clear-offer').addEventListener('click',()=>{ pendingTrades[idx].offerItem=null; row.querySelector('.offer-preview').classList.add('hidden'); offerSearch.value=''; offerSearch.focus(); });

  // Exchange search
  const exchSearch=row.querySelector('.item-search-exchange');
  const exchDrop  =row.querySelector('.item-dropdown-exchange');
  exchSearch.addEventListener('input',()=>handleSearchInput(exchSearch,exchDrop,item=>{ selectExchangeItem(row,idx,item); }));
  exchSearch.addEventListener('focus',()=>{ if(exchSearch.value.trim()) exchDrop.classList.remove('hidden'); });
  row.querySelector('.clear-exchange').addEventListener('click',()=>{ pendingTrades[idx].exchangeItem=null; row.querySelector('.exchange-preview').classList.add('hidden'); exchSearch.value=''; exchSearch.focus(); });

  // Quantities & note
  row.querySelector('.qty-offer').addEventListener('input',e=>{ pendingTrades[idx].offerQty=parseInt(e.target.value,10)||1; });
  row.querySelector('.qty-exchange').addEventListener('input',e=>{ pendingTrades[idx].exchangeQty=parseInt(e.target.value,10)||1; });
  row.querySelector('.trade-note').addEventListener('input',e=>{ pendingTrades[idx].note=e.target.value.trim(); });

  // Enchant buttons
  row.querySelector('.offer-enchant-btn').addEventListener('click',()=>openEnchantModal(idx,'offer',row));
  row.querySelector('.exchange-enchant-btn').addEventListener('click',()=>openEnchantModal(idx,'exchange',row));

  tradesList.appendChild(row);
  updateTradesBadge();
  row.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function removeTradeRow(row,idx) {
  pendingTrades.splice(idx,1);
  row.remove();
  tradesList.querySelectorAll('.trade-row').forEach((r,i)=>{ r.dataset.tradeIndex=i; const n=r.querySelector('.trade-num'); if(n) n.textContent=i+1; });
  updateTradesBadge();
}

addTradeBtn.addEventListener('click',()=>addTradeRow());

// ───────────────────────────────────────────
// ITEM SEARCH + DROPDOWN
// ───────────────────────────────────────────
function handleSearchInput(inputEl, dropdownEl, onSelect) {
  const q=inputEl.value.trim().toLowerCase();
  if(!q) { dropdownEl.classList.add('hidden'); return; }
  const matches=MINECRAFT_ITEMS.filter(item=>
    item.name.toLowerCase().includes(q) || idToEnglish(item.id).toLowerCase().includes(q)
  ).slice(0,12);
  renderDropdown(matches, dropdownEl, onSelect, q, inputEl);
}

function renderDropdown(items, dropdownEl, onSelect, query, inputEl) {
  dropdownEl.innerHTML='';
  if(items.length===0) {
    // Aucun résultat → proposer item custom
    const emptyDiv=document.createElement('div');
    emptyDiv.className='dropdown-empty';
    emptyDiv.innerHTML=`Aucun item trouvé. <button class="dropdown-custom-btn">＋ Créer un item custom</button>`;
    emptyDiv.querySelector('.dropdown-custom-btn').addEventListener('click',e=>{
      e.stopPropagation();
      dropdownEl.classList.add('hidden');
      // Trouver le tradeIdx depuis le dropdown
      const tradeRow=dropdownEl.closest('.trade-row');
      const tradeIdx=parseInt(tradeRow.dataset.tradeIndex,10);
      const side=dropdownEl.classList.contains('item-dropdown-offer')?'offer':'exchange';
      openCustomItemModal(tradeIdx, side, tradeRow, inputEl.value.trim());
    });
    dropdownEl.appendChild(emptyDiv);
  } else {
    items.forEach(item=>{
      const enName=idToEnglish(item.id);
      const row=document.createElement('div');
      row.className='dropdown-item';
      row.innerHTML=`
        <img src="${item.image}" alt="${item.name}" onerror="this.src=''" />
        <div class="dropdown-item-names">
          <span class="dropdown-item-name">${item.name}</span>
          <span class="dropdown-item-en">${enName}</span>
        </div>
        <span class="dropdown-item-cat">${CAT_LABELS[item.category]||item.category}</span>
      `;
      row.addEventListener('click',()=>{ onSelect(item); dropdownEl.classList.add('hidden'); });
      dropdownEl.appendChild(row);
    });
    // Toujours ajouter option custom en bas
    const customRow=document.createElement('div');
    customRow.className='dropdown-custom-row';
    customRow.innerHTML='<button class="dropdown-custom-btn">＋ Ajouter un item custom (datapack/plugin)</button>';
    customRow.querySelector('.dropdown-custom-btn').addEventListener('click',e=>{
      e.stopPropagation();
      dropdownEl.classList.add('hidden');
      const tradeRow=dropdownEl.closest('.trade-row');
      const tradeIdx=parseInt(tradeRow.dataset.tradeIndex,10);
      const side=dropdownEl.classList.contains('item-dropdown-offer')?'offer':'exchange';
      openCustomItemModal(tradeIdx, side, tradeRow, inputEl ? inputEl.value.trim() : '');
    });
    dropdownEl.appendChild(customRow);
  }
  dropdownEl.classList.remove('hidden');
}

document.addEventListener('click',e=>{ if(!e.target.closest('.item-selector')) document.querySelectorAll('.item-dropdown').forEach(d=>d.classList.add('hidden')); });

function setOfferPreview(row, item) {
  const p=row.querySelector('.offer-preview');
  row.querySelector('.offer-preview-img').src=item.image||'';
  row.querySelector('.offer-preview-img').alt=item.name;
  row.querySelector('.offer-preview-name').textContent=item.name+(item.custom?' [custom]':'');
  p.classList.remove('hidden');
  row.querySelector('.item-search-offer').value='';
}
function setExchangePreview(row, item) {
  const p=row.querySelector('.exchange-preview');
  row.querySelector('.exchange-preview-img').src=item.image||'';
  row.querySelector('.exchange-preview-img').alt=item.name;
  row.querySelector('.exchange-preview-name').textContent=item.name+(item.custom?' [custom]':'');
  p.classList.remove('hidden');
  row.querySelector('.item-search-exchange').value='';
}
function selectOfferItem(row,idx,item)    { pendingTrades[idx].offerItem=item;    setOfferPreview(row,item);    clearError(); }
function selectExchangeItem(row,idx,item) { pendingTrades[idx].exchangeItem=item; setExchangePreview(row,item); clearError(); }

// ───────────────────────────────────────────
// MODAL ITEM CUSTOM
// ───────────────────────────────────────────
let customItemCallback = null;

function openCustomItemModal(tradeIdx, side, tradeRow, prefillName='') {
  customItemNameInp.value = prefillName;
  customItemImgInp.value  = '';
  customItemCatInp.value  = 'misc';
  customItemPreviewRow.classList.add('hidden');
  customItemError.classList.add('hidden');
  customItemCallback = (item) => {
    if(side==='offer')    selectOfferItem(tradeRow, tradeIdx, item);
    else                  selectExchangeItem(tradeRow, tradeIdx, item);
  };
  customItemOverlay.classList.remove('hidden');
  customItemNameInp.focus();
}
function closeCustomItemModal() { customItemOverlay.classList.add('hidden'); customItemCallback=null; }

// Preview image url en temps réel
customItemImgInp.addEventListener('input',()=>{
  const url=customItemImgInp.value.trim();
  if(url) { customItemPreviewImg.src=url; customItemPreviewRow.classList.remove('hidden'); }
  else    { customItemPreviewRow.classList.add('hidden'); }
});
customItemNameInp.addEventListener('input',()=>{
  customItemPreviewName.textContent=customItemNameInp.value.trim();
});

confirmCustomItemBtn.addEventListener('click',()=>{
  const name=customItemNameInp.value.trim();
  if(!name||name.length<1) { customItemError.textContent='⚠ Donne un nom à ton item.'; customItemError.classList.remove('hidden'); return; }
  const item={ id:'custom_'+genId(), name, image:customItemImgInp.value.trim(), category:customItemCatInp.value, custom:true };
  if(customItemCallback) customItemCallback(item);
  closeCustomItemModal();
});
[cancelCustomItemBtn, closeCustomItemBtn].forEach(b=>b.addEventListener('click',closeCustomItemModal));
customItemOverlay.addEventListener('click',e=>{ if(e.target===customItemOverlay) closeCustomItemModal(); });

// ───────────────────────────────────────────
// MODAL ENCHANTEMENTS
// ───────────────────────────────────────────
let enchantCallback = null;
let currentEnchantSel = {}; // { enchant_id: level }

function openEnchantModal(tradeIdx, side, tradeRow) {
  const existing = side==='offer' ? pendingTrades[tradeIdx].offerEnchants : pendingTrades[tradeIdx].exchangeEnchants;
  currentEnchantSel = {};
  (existing||[]).forEach(e=>{ currentEnchantSel[e.id]=e.level; });
  enchantSearch.value='';
  renderEnchantList('');
  enchantCallback=(enchants)=>{
    if(side==='offer') {
      pendingTrades[tradeIdx].offerEnchants=enchants;
      renderEnchantTagsInline(tradeRow.querySelector('.offer-enchant-tags'), tradeRow.querySelector('.offer-enchant-count'), enchants);
    } else {
      pendingTrades[tradeIdx].exchangeEnchants=enchants;
      renderEnchantTagsInline(tradeRow.querySelector('.exchange-enchant-tags'), tradeRow.querySelector('.exchange-enchant-count'), enchants);
    }
  };
  enchantOverlay.classList.remove('hidden');
  enchantSearch.focus();
}
function closeEnchantModal() { enchantOverlay.classList.add('hidden'); enchantCallback=null; }

enchantSearch.addEventListener('input',()=>renderEnchantList(enchantSearch.value.trim().toLowerCase()));

function renderEnchantList(filter) {
  enchantList.innerHTML='';
  const groups={};
  ENCHANTMENTS.forEach(e=>{
    const matchFr=e.name.toLowerCase().includes(filter);
    const matchEn=e.nameEn.toLowerCase().includes(filter);
    if(!filter||matchFr||matchEn) {
      if(!groups[e.group]) groups[e.group]=[];
      groups[e.group].push(e);
    }
  });
  Object.entries(groups).forEach(([group,enchants])=>{
    const gInfo=ENCHANT_GROUPS[group]||{label:group,color:'#aaa'};
    const header=document.createElement('div');
    header.className='enchant-group-header';
    header.innerHTML=`<span style="color:${gInfo.color}">${gInfo.label}</span>`;
    enchantList.appendChild(header);
    enchants.forEach(e=>{
      const sel=currentEnchantSel[e.id]||0;
      const row=document.createElement('div');
      row.className='enchant-item-row'+(sel?' enchant-selected':'');
      row.dataset.id=e.id;

      // Niveau selector
      let levelHtml='';
      if(e.maxLvl===1) {
        levelHtml=`<label class="enchant-toggle"><input type="checkbox" class="enchant-check" data-id="${e.id}" ${sel?'checked':''}> <span></span></label>`;
      } else {
        levelHtml=`<div class="enchant-levels">${Array.from({length:e.maxLvl},(_,i)=>{
          const lvl=i+1;
          return `<button class="enchant-lvl-btn${sel===lvl?' active':''}" data-id="${e.id}" data-lvl="${lvl}">${ROMAN[lvl]}</button>`;
        }).join('')}<button class="enchant-lvl-btn${sel===0?' active':''}" data-id="${e.id}" data-lvl="0" title="Retirer">✕</button></div>`;
      }

      row.innerHTML=`
        <div class="enchant-info">
          <span class="enchant-name">${e.name}</span>
          <span class="enchant-name-en">${e.nameEn}</span>
        </div>
        ${levelHtml}
      `;

      // Checkbox (maxLvl=1)
      const check=row.querySelector('.enchant-check');
      if(check) check.addEventListener('change',()=>{
        currentEnchantSel[e.id]=check.checked?1:0;
        row.classList.toggle('enchant-selected',check.checked);
      });

      // Level buttons
      row.querySelectorAll('.enchant-lvl-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const lvl=parseInt(btn.dataset.lvl,10);
          currentEnchantSel[e.id]=lvl;
          row.querySelectorAll('.enchant-lvl-btn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          row.classList.toggle('enchant-selected',lvl>0);
        });
      });

      enchantList.appendChild(row);
    });
  });
  if(enchantList.children.length===0) {
    enchantList.innerHTML='<div class="dropdown-empty">Aucun enchantement trouvé.</div>';
  }
}

confirmEnchantBtn.addEventListener('click',()=>{
  const result=Object.entries(currentEnchantSel).filter(([,lvl])=>lvl>0).map(([id,level])=>({id,level}));
  if(enchantCallback) enchantCallback(result);
  closeEnchantModal();
});
[cancelEnchantBtn,closeEnchantBtn].forEach(b=>b.addEventListener('click',closeEnchantModal));
enchantOverlay.addEventListener('click',e=>{ if(e.target===enchantOverlay) closeEnchantModal(); });

// ───────────────────────────────────────────
// ENCHANT TAGS INLINE (dans le modal)
// ───────────────────────────────────────────
function renderEnchantTagsInline(container, badge, enchants) {
  container.innerHTML='';
  if(!enchants||enchants.length===0) { badge.classList.add('hidden'); return; }
  badge.textContent=enchants.length;
  badge.classList.remove('hidden');
  enchants.forEach(e=>{
    const def=ENCHANTMENTS.find(x=>x.id===e.id);
    const name=def?def.name:e.id;
    const span=document.createElement('span');
    span.className='enchant-tag-inline'+(def&&def.group==='curse'?' enchant-tag-curse':'');
    span.textContent=name+(e.level>1?' '+ROMAN[e.level]:'');
    container.appendChild(span);
  });
}

// ───────────────────────────────────────────
// SUBMIT
// ───────────────────────────────────────────
submitBtn.addEventListener('click', async()=>{
  clearError();
  const seller=sellerInput.value.trim();
  if(!seller||seller.length<2) { showError('⚠ Le pseudo vendeur doit faire au moins 2 caractères.'); return; }
  if(pendingTrades.length===0) { showError('⚠ Ajoutez au moins un trade.'); return; }
  for(let i=0;i<pendingTrades.length;i++) {
    const t=pendingTrades[i];
    if(!t.offerItem)    { showError(`⚠ Trade #${i+1} : sélectionnez l'item offert.`); return; }
    if(!t.exchangeItem) { showError(`⚠ Trade #${i+1} : sélectionnez l'item demandé.`); return; }
    const qo=parseInt(tradesList.querySelectorAll('.qty-offer')[i].value,10);
    const qe=parseInt(tradesList.querySelectorAll('.qty-exchange')[i].value,10);
    if(!qo||qo<1||qo>2304) { showError(`⚠ Trade #${i+1} : quantité offerte invalide (1–2304).`); return; }
    if(!qe||qe<1||qe>2304) { showError(`⚠ Trade #${i+1} : quantité demandée invalide (1–2304).`); return; }
    t.offerQty=qo; t.exchangeQty=qe;
  }

  const trades=pendingTrades.map(t=>({
    itemId:t.offerItem.id, itemName:t.offerItem.name, itemImage:t.offerItem.image||'',
    itemCategory:t.offerItem.category, qtyOffer:t.offerQty, itemEnchants:t.offerEnchants||[],
    custom:!!t.offerItem.custom,
    exchangeId:t.exchangeItem.id, exchangeName:t.exchangeItem.name, exchangeImage:t.exchangeItem.image||'',
    exchangeCategory:t.exchangeItem.category, qtyExchange:t.exchangeQty, exchangeEnchants:t.exchangeEnchants||[],
    note:t.note||''
  }));
  const shopDesc=shopDescInput.value.trim();

  if(editingId) {
    const idx=listings.findIndex(s=>s.id===editingId);
    if(idx!==-1) listings[idx]={...listings[idx],seller,shopDesc,trades,date:new Date().toISOString()};
    saveListings(); renderCatalogue(); closeModal();
    showToast(`✅ Boutique de ${seller} mise à jour !`);
  } else {
    const shop={id:genId(),seller,shopDesc,trades,date:new Date().toISOString()};
    listings.unshift(shop); saveListings(); renderCatalogue();
    submitBtn.disabled=true; submitBtn.textContent='📡 Envoi Discord...';
    await sendDiscordWebhook(DEFAULT_WEBHOOK,shop);
    submitBtn.disabled=false; submitBtn.textContent='📢 Publier la boutique';
    closeModal();
    showToast(`✅ Boutique de ${seller} publiée ! (${trades.length} trade${trades.length!==1?'s':''})`);
  }
});

// ───────────────────────────────────────────
// DISCORD
// ───────────────────────────────────────────
async function sendDiscordWebhook(webhookUrl,shop) {
  const fields=[];
  shop.trades.forEach((t,i)=>{
    const offerEnch=formatEnchants(t.itemEnchants);
    const exchEnch=formatEnchants(t.exchangeEnchants);
    let val=`**${t.qtyOffer}× ${t.itemName}**${offerEnch?` _(${offerEnch})_`:''} ⇄ **${t.qtyExchange}× ${t.exchangeName}**${exchEnch?` _(${exchEnch})_`:''}`;
    if(t.note) val+=`\n*${t.note}*`;
    fields.push({name:`Trade #${i+1}`,value:val,inline:false});
  });
  fields.unshift({name:'👤 Vendeur',value:`\`${shop.seller}\``,inline:true});
  if(shop.shopDesc) fields.push({name:'📝 Description',value:shop.shopDesc,inline:false});
  const payload={username:'CraftMarket',avatar_url:'https://minecraft.wiki/images/Grass_Block_JE7_BE6.png',embeds:[{title:`🏪 Boutique de ${shop.seller}`,color:0x5a9e2f,thumbnail:{url:shop.trades[0]?.itemImage||''},fields,footer:{text:'CraftMarket • Minecraft Marketplace'},timestamp:shop.date}]};
  try {
    const res=await fetch(webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!res.ok) showToast('⚠ Discord webhook : erreur '+res.status,true);
    else showToast('📣 Boutique envoyée sur Discord !');
  } catch(err) { showToast("⚠ Impossible d'envoyer sur Discord.",true); }
}

// ───────────────────────────────────────────
// SEARCH & FILTERS
// ───────────────────────────────────────────
let searchDebounce;
searchInput.addEventListener('input',()=>{
  clearTimeout(searchDebounce);
  searchDebounce=setTimeout(()=>{ searchQuery=searchInput.value.trim(); renderCatalogue(); },200);
});
filterTabs.addEventListener('click',e=>{
  const btn=e.target.closest('.tab-btn'); if(!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); activeCategory=btn.dataset.cat; renderCatalogue();
});

// ───────────────────────────────────────────
// INIT
// ───────────────────────────────────────────
loadItems().then(()=>{ loadListings(); renderCatalogue(); });
