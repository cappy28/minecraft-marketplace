/* =========================================
   CRAFTMARKET v4 — script.js
   Multi-items • Apple Design • Bug fixes
   ========================================= */
'use strict';

// ─────────────────────────────────────────────
// ENCHANTEMENTS
// ─────────────────────────────────────────────
const ENCHANTMENTS = [
  { id:'sharpness',        name:'Tranchant',              nameEn:'Sharpness',              maxLvl:5, group:'combat' },
  { id:'smite',            name:'Châtiment',              nameEn:'Smite',                  maxLvl:5, group:'combat' },
  { id:'bane_arthropods',  name:'Fléau des arthropodes',  nameEn:'Bane of Arthropods',     maxLvl:5, group:'combat' },
  { id:'knockback',        name:'Repoussement',           nameEn:'Knockback',              maxLvl:2, group:'combat' },
  { id:'fire_aspect',      name:'Brûlure',                nameEn:'Fire Aspect',            maxLvl:2, group:'combat' },
  { id:'looting',          name:'Butin',                  nameEn:'Looting',                maxLvl:3, group:'combat' },
  { id:'sweeping_edge',    name:'Tranchant balayé',       nameEn:'Sweeping Edge',          maxLvl:3, group:'combat' },
  { id:'channeling',       name:'Canalisation',           nameEn:'Channeling',             maxLvl:1, group:'combat' },
  { id:'impaling',         name:'Empalage',               nameEn:'Impaling',               maxLvl:5, group:'combat' },
  { id:'loyalty',          name:'Loyauté',                nameEn:'Loyalty',                maxLvl:3, group:'combat' },
  { id:'riptide',          name:'Marée déchirante',       nameEn:'Riptide',                maxLvl:3, group:'combat' },
  { id:'wind_burst',       name:'Rafale de vent',         nameEn:'Wind Burst',             maxLvl:3, group:'combat' },
  { id:'density',          name:'Densité',                nameEn:'Density',                maxLvl:5, group:'combat' },
  { id:'breach',           name:'Brèche',                 nameEn:'Breach',                 maxLvl:4, group:'combat' },
  { id:'power',            name:'Puissance',              nameEn:'Power',                  maxLvl:5, group:'ranged' },
  { id:'punch',            name:'Recul',                  nameEn:'Punch',                  maxLvl:2, group:'ranged' },
  { id:'flame',            name:'Flamme',                 nameEn:'Flame',                  maxLvl:1, group:'ranged' },
  { id:'infinity',         name:'Infini',                 nameEn:'Infinity',               maxLvl:1, group:'ranged' },
  { id:'multishot',        name:'Multitir',               nameEn:'Multishot',              maxLvl:1, group:'ranged' },
  { id:'quick_charge',     name:'Chargement rapide',      nameEn:'Quick Charge',           maxLvl:3, group:'ranged' },
  { id:'piercing',         name:'Perforation',            nameEn:'Piercing',               maxLvl:4, group:'ranged' },
  { id:'efficiency',       name:'Efficacité',             nameEn:'Efficiency',             maxLvl:5, group:'tools' },
  { id:'silk_touch',       name:'Toucher de soie',        nameEn:'Silk Touch',             maxLvl:1, group:'tools' },
  { id:'fortune',          name:'Fortune',                nameEn:'Fortune',                maxLvl:3, group:'tools' },
  { id:'luck_of_the_sea',  name:'Chance de la mer',       nameEn:'Luck of the Sea',        maxLvl:3, group:'tools' },
  { id:'lure',             name:'Appât',                  nameEn:'Lure',                   maxLvl:3, group:'tools' },
  { id:'protection',       name:'Protection',             nameEn:'Protection',             maxLvl:4, group:'armor' },
  { id:'fire_protection',  name:'Protection feu',         nameEn:'Fire Protection',        maxLvl:4, group:'armor' },
  { id:'blast_protection', name:'Protection explosions',  nameEn:'Blast Protection',       maxLvl:4, group:'armor' },
  { id:'projectile_protection', name:'Protection proj.',  nameEn:'Projectile Protection',  maxLvl:4, group:'armor' },
  { id:'feather_falling',  name:'Chute amortie',          nameEn:'Feather Falling',        maxLvl:4, group:'armor' },
  { id:'respiration',      name:'Respiration',            nameEn:'Respiration',            maxLvl:3, group:'armor' },
  { id:'aqua_affinity',    name:'Affinité aquatique',     nameEn:'Aqua Affinity',          maxLvl:1, group:'armor' },
  { id:'thorns',           name:'Épines',                 nameEn:'Thorns',                 maxLvl:3, group:'armor' },
  { id:'depth_strider',    name:'Marcheur des fonds',     nameEn:'Depth Strider',          maxLvl:3, group:'armor' },
  { id:'frost_walker',     name:'Marcheur des glaces',    nameEn:'Frost Walker',           maxLvl:2, group:'armor' },
  { id:'soul_speed',       name:'Vitesse des âmes',       nameEn:'Soul Speed',             maxLvl:3, group:'armor' },
  { id:'swift_sneak',      name:'Discrétion agile',       nameEn:'Swift Sneak',            maxLvl:3, group:'armor' },
  { id:'unbreaking',       name:'Solidité',               nameEn:'Unbreaking',             maxLvl:3, group:'universal' },
  { id:'mending',          name:'Réparation',             nameEn:'Mending',                maxLvl:1, group:'universal' },
  { id:'curse_of_vanishing', name:'Malédiction disparition', nameEn:'Curse of Vanishing',  maxLvl:1, group:'curse' },
  { id:'curse_of_binding', name:'Malédiction enlacement', nameEn:'Curse of Binding',       maxLvl:1, group:'curse' },
];

const ENCHANT_GROUPS = {
  combat:    { label: '⚔ Combat',       color: '#ff6b6b' },
  ranged:    { label: '🏹 À distance',   color: '#c590e8' },
  tools:     { label: '⛏ Outils',       color: '#60bfdf' },
  armor:     { label: '🛡 Armure',       color: '#60a0ff' },
  universal: { label: '🌟 Universel',    color: '#ffd700' },
  curse:     { label: '💀 Malédictions', color: '#ff6080' },
};

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];

// ─────────────────────────────────────────────
// ITEMS
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// DISCORD WEBHOOK
// ─────────────────────────────────────────────
const DEFAULT_WEBHOOK = 'https://discord.com/api/webhooks/1510191804132229181/4NCQrv7DtCgBCb7zKTpVZ44Ff8_WBSz7JQ_SipowM-bhFsbSgGIZdbgF7UOJIZ2UZWHw';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let listings = [];
let activeCategory = 'all';
let searchQuery = '';
let toastTimer = null;
let editingId = null;

// pendingTrades[i] = {
//   offerSlots:    [{ item, qty }],   // ≥1
//   offerEnchants: [],
//   exchangeSlots: [{ item, qty }],   // ≥1
//   exchangeEnchants: [],
//   note: ''
// }
let pendingTrades = [];

// ─────────────────────────────────────────────
// ENCHANT MODAL STATE
// ─────────────────────────────────────────────
let enchantCallback = null;
let currentEnchantSel = {};

// ─────────────────────────────────────────────
// CUSTOM ITEM MODAL STATE
// ─────────────────────────────────────────────
let customItemCallback = null;

// ─────────────────────────────────────────────
// DOM REFS
// ─────────────────────────────────────────────
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
const itemSlotTemplate = document.getElementById('item-slot-template');
const tradesCountBadge = document.getElementById('trades-count-badge');
const searchInput      = document.getElementById('search-input');
const filterTabs       = document.getElementById('filter-tabs');

const customItemOverlay    = document.getElementById('custom-item-overlay');
const customItemNameInp    = document.getElementById('custom-item-name');
const customItemCatInp     = document.getElementById('custom-item-cat');
const customItemImgInp     = document.getElementById('custom-item-img');
const customItemPreviewRow = document.getElementById('custom-item-preview-row');
const customItemPreviewImg = document.getElementById('custom-item-preview-img');
const customItemPreviewName= document.getElementById('custom-item-preview-name');
const customItemError      = document.getElementById('custom-item-error');
const confirmCustomItemBtn = document.getElementById('confirm-custom-item-btn');
const cancelCustomItemBtn  = document.getElementById('cancel-custom-item-btn');
const closeCustomItemBtn   = document.getElementById('close-custom-item-btn');

const enchantOverlay    = document.getElementById('enchant-overlay');
const enchantListEl     = document.getElementById('enchant-list');
const enchantSearch     = document.getElementById('enchant-search');
const confirmEnchantBtn = document.getElementById('confirm-enchant-btn');
const cancelEnchantBtn  = document.getElementById('cancel-enchant-btn');
const closeEnchantBtn   = document.getElementById('close-enchant-btn');

// ─────────────────────────────────────────────
// LOCALSTORAGE
// ─────────────────────────────────────────────
function loadListings() {
  try {
    const raw = localStorage.getItem('craftmarket_listings_v4');
    // Try v4 first, then migrate from v3
    if (raw) { listings = JSON.parse(raw); return; }
    const rawV3 = localStorage.getItem('craftmarket_listings_v3');
    if (rawV3) { listings = migrateV3(JSON.parse(rawV3)); saveListings(); return; }
  } catch { /* ignore */ }
  listings = getDefaultListings();
}

function migrateV3(oldListings) {
  return oldListings.map(shop => ({
    ...shop,
    trades: shop.trades.map(t => ({
      offerSlots:       [{ item: { id:t.itemId, name:t.itemName, image:t.itemImage||'', category:t.itemCategory, custom:!!t.custom }, qty: t.qtyOffer }],
      offerEnchants:    t.itemEnchants || [],
      exchangeSlots:    [{ item: { id:t.exchangeId, name:t.exchangeName, image:t.exchangeImage||'', category:t.exchangeCategory }, qty: t.qtyExchange }],
      exchangeEnchants: t.exchangeEnchants || [],
      note:             t.note || ''
    }))
  }));
}

function saveListings() {
  localStorage.setItem('craftmarket_listings_v4', JSON.stringify(listings));
}

function getDefaultListings() {
  return [
    {
      id: genId(),
      seller: 'Notch',
      shopDesc: 'Spécialiste ressources et minerais rares',
      trades: [{
        offerSlots:    [{ item:{ id:'diamond', name:'Diamant', image:'https://www.mcworldtools.com/textures/rendered/diamond.png', category:'resources', custom:false }, qty:1 }],
        offerEnchants: [],
        exchangeSlots: [{ item:{ id:'dirt', name:'Terre', image:'https://www.mcworldtools.com/textures/rendered/dirt.png', category:'blocks', custom:false }, qty:32 }],
        exchangeEnchants: [],
        note: 'Diamants naturels, trouvés en Y=-59.'
      }, {
        offerSlots:    [
          { item:{ id:'iron_ingot', name:'Lingot de fer', image:'https://www.mcworldtools.com/textures/rendered/iron_ingot.png', category:'resources', custom:false }, qty:32 },
          { item:{ id:'gold_ingot', name:'Lingot d\'or', image:'https://www.mcworldtools.com/textures/rendered/gold_ingot.png', category:'resources', custom:false }, qty:16 }
        ],
        offerEnchants: [],
        exchangeSlots: [{ item:{ id:'netherite_ingot', name:'Lingot de Netherite', image:'https://www.mcworldtools.com/textures/rendered/netherite_ingot.png', category:'resources', custom:false }, qty:1 }],
        exchangeEnchants: [],
        note: 'Échange multi-items !'
      }],
      date: new Date(Date.now()-86400000*2).toISOString()
    }
  ];
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function genId() { return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }

function timeAgo(iso) {
  const d = Date.now()-new Date(iso).getTime(), m=Math.floor(d/60000), h=Math.floor(d/3600000), dy=Math.floor(d/86400000);
  if(m<1) return "À l'instant"; if(m<60) return `il y a ${m}min`; if(h<24) return `il y a ${h}h`; return `il y a ${dy}j`;
}

function showToast(msg, isError=false) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden','error');
  if(isError) toastEl.classList.add('error');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.add('hidden'), 3500);
}

function showError(msg) {
  formError.textContent = msg;
  formError.classList.remove('hidden');
  formError.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function clearError() { formError.classList.add('hidden'); }

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatEnchants(enchants) {
  if(!enchants||enchants.length===0) return '';
  return enchants.map(e=>{
    const def = ENCHANTMENTS.find(x=>x.id===e.id);
    const name = def ? def.name : e.id;
    return e.level > 1 ? `${name} ${ROMAN[e.level]||e.level}` : name;
  }).join(', ');
}

// ─────────────────────────────────────────────
// RENDER CATALOGUE
// ─────────────────────────────────────────────
function getFilteredListings() {
  return listings.filter(shop => {
    const matchCat = activeCategory === 'all' || shop.trades.some(t =>
      t.offerSlots.some(s=>s.item&&s.item.category===activeCategory) ||
      t.exchangeSlots.some(s=>s.item&&s.item.category===activeCategory)
    );
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      shop.seller.toLowerCase().includes(q) ||
      (shop.shopDesc && shop.shopDesc.toLowerCase().includes(q)) ||
      shop.trades.some(t =>
        t.offerSlots.some(s=>s.item&&s.item.name.toLowerCase().includes(q)) ||
        t.exchangeSlots.some(s=>s.item&&s.item.name.toLowerCase().includes(q)) ||
        (t.note && t.note.toLowerCase().includes(q))
      );
    return matchCat && matchSearch;
  });
}

function renderCatalogue() {
  const filtered = getFilteredListings();
  grid.innerHTML = '';
  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
  filtered.forEach((shop, i) => {
    const card = createShopCard(shop, i);
    grid.appendChild(card);
  });
  const total = listings.reduce((a,s)=>a+s.trades.length,0);
  listingCount.textContent = `${listings.length} boutique${listings.length!==1?'s':''} · ${total} trade${total!==1?'s':''}`;
}

function enchantTagsHtml(enchants) {
  if(!enchants||enchants.length===0) return '';
  return `<div class="enchant-tags-card">${enchants.map(e=>{
    const def = ENCHANTMENTS.find(x=>x.id===e.id);
    const name = def ? def.name : e.id;
    const isCurse = def && def.group === 'curse';
    return `<span class="enchant-tag-card${isCurse?' enchant-tag-curse':''}">${escHtml(name)}${e.level>1?' '+ROMAN[e.level]:''}</span>`;
  }).join('')}</div>`;
}

function createShopCard(shop, index) {
  const hasRare = shop.trades.some(t =>
    t.offerSlots.some(s=>s.item&&RARE_ITEMS.has(s.item.id)) ||
    t.exchangeSlots.some(s=>s.item&&RARE_ITEMS.has(s.item.id))
  );

  const card = document.createElement('div');
  card.className = `shop-card${hasRare?' card-rare':''}`;
  card.style.animationDelay = `${index*0.04}s`;

  const tradesHtml = shop.trades.map(t => {
    // Build multi-item side HTML
    const offerItemsHtml = t.offerSlots.map(s => {
      if(!s.item) return '';
      const fb = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.item.name)}&background=1a2212&color=7ec84a&size=48`;
      const custom = s.item.custom ? `<span class="custom-badge">custom</span>` : '';
      return `
        <div class="trade-side-item">
          <img class="card-item-img-sm" src="${escHtml(s.item.image||fb)}" alt="${escHtml(s.item.name)}" onerror="this.src='${fb}'" />
          <div class="trade-side-info">
            <span class="trade-qty">×${s.qty}</span>
            <span class="trade-name" title="${escHtml(s.item.name)}">${escHtml(s.item.name)} ${custom}</span>
          </div>
        </div>`;
    }).join('');

    const exchItemsHtml = t.exchangeSlots.map(s => {
      if(!s.item) return '';
      const fb = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.item.name)}&background=1a1012&color=e8a020&size=48`;
      return `
        <div class="trade-side-item">
          <img class="card-item-img-sm" src="${escHtml(s.item.image||fb)}" alt="${escHtml(s.item.name)}" onerror="this.src='${fb}'" />
          <div class="trade-side-info">
            <span class="trade-qty">×${s.qty}</span>
            <span class="trade-name" title="${escHtml(s.item.name)}">${escHtml(s.item.name)}</span>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="shop-trade-row">
        <div class="trade-side">
          <div class="trade-side-items">${offerItemsHtml}</div>
          ${enchantTagsHtml(t.offerEnchants)}
        </div>
        <div class="trade-arrow">⇄</div>
        <div class="trade-side">
          <div class="trade-side-items">${exchItemsHtml}</div>
          ${enchantTagsHtml(t.exchangeEnchants)}
        </div>
        ${t.note ? `<span class="trade-card-note" title="${escHtml(t.note)}">💬 ${escHtml(t.note)}</span>` : ''}
      </div>`;
  }).join('');

  card.innerHTML = `
    <div class="shop-card-header">
      <div class="shop-seller-info">
        <span class="shop-seller-name">👤 ${escHtml(shop.seller)}</span>
        ${shop.shopDesc ? `<span class="shop-seller-desc">${escHtml(shop.shopDesc)}</span>` : ''}
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
    </div>`;

  card.querySelector('.card-del-btn').addEventListener('click', ()=>deleteShop(shop.id));
  card.querySelector('.card-edit-btn').addEventListener('click', ()=>openEditModal(shop.id));
  return card;
}

function deleteShop(id) {
  listings = listings.filter(s=>s.id!==id);
  saveListings();
  renderCatalogue();
  showToast('Boutique supprimée.');
}

// ─────────────────────────────────────────────
// MODAL BOUTIQUE
// ─────────────────────────────────────────────
function openModal(shopToEdit=null) {
  editingId = shopToEdit ? shopToEdit.id : null;
  modalTitle.textContent = shopToEdit ? 'Modifier la boutique' : 'Nouvelle Boutique';
  submitBtn.textContent  = shopToEdit ? 'Enregistrer' : 'Publier la boutique';
  sellerInput.value   = shopToEdit ? shopToEdit.seller : '';
  shopDescInput.value = shopToEdit ? (shopToEdit.shopDesc||'') : '';
  tradesList.innerHTML = '';
  pendingTrades = [];
  clearError();

  if(shopToEdit && shopToEdit.trades.length > 0) {
    shopToEdit.trades.forEach(t => addTradeRow(t));
  } else {
    addTradeRow();
  }

  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  sellerInput.focus();
}

function openEditModal(id) {
  const s = listings.find(x=>x.id===id);
  if(s) openModal(s);
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  pendingTrades = [];
  tradesList.innerHTML = '';
  editingId = null;
}

openModalBtn.addEventListener('click', ()=>openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e=>{ if(e.target===modalOverlay) closeModal(); });
document.addEventListener('keydown', e=>{
  if(e.key==='Escape') { closeModal(); closeCustomItemModal(); closeEnchantModal(); }
});

// ─────────────────────────────────────────────
// TRADES DYNAMIQUES
// ─────────────────────────────────────────────
function updateTradesBadge() {
  const n = pendingTrades.length;
  tradesCountBadge.textContent = `${n} trade${n!==1?'s':''}`;
}

/**
 * Creates a new trade row in the modal.
 * @param {Object|null} prefill — existing trade data (v4 format)
 */
function addTradeRow(prefill=null) {
  const tradeData = {
    offerSlots:       prefill ? JSON.parse(JSON.stringify(prefill.offerSlots||[])) : [],
    offerEnchants:    prefill ? (prefill.offerEnchants||[]) : [],
    exchangeSlots:    prefill ? JSON.parse(JSON.stringify(prefill.exchangeSlots||[])) : [],
    exchangeEnchants: prefill ? (prefill.exchangeEnchants||[]) : [],
    note:             prefill ? (prefill.note||'') : ''
  };

  const idx = pendingTrades.length;
  pendingTrades.push(tradeData);

  const clone = tradeTemplate.content.cloneNode(true);
  const row   = clone.querySelector('.trade-row');
  row.dataset.tradeIndex = idx;
  row.querySelector('.trade-num').textContent = idx+1;

  // Note
  const noteInput = row.querySelector('.trade-note');
  noteInput.value = tradeData.note;
  noteInput.addEventListener('input', e=>{ pendingTrades[idx].note = e.target.value.trim(); });

  // Remove trade
  row.querySelector('.trade-row-remove').addEventListener('click', ()=>removeTradeRow(row, idx));

  // Offer slots setup
  const offerSlotsEl = row.querySelector('.offer-slots');
  tradeData.offerSlots.forEach((slot, si) => addItemSlot(offerSlotsEl, idx, 'offer', si, slot));
  if(tradeData.offerSlots.length === 0) addItemSlot(offerSlotsEl, idx, 'offer');

  // Exchange slots setup
  const exchSlotsEl = row.querySelector('.exchange-slots');
  tradeData.exchangeSlots.forEach((slot, si) => addItemSlot(exchSlotsEl, idx, 'exchange', si, slot));
  if(tradeData.exchangeSlots.length === 0) addItemSlot(exchSlotsEl, idx, 'exchange');

  // Add slot buttons
  row.querySelector('.offer-add-slot-btn').addEventListener('click', ()=>{
    const nextIdx = pendingTrades[idx].offerSlots.length;
    pendingTrades[idx].offerSlots.push({ item:null, qty:1 });
    addItemSlot(offerSlotsEl, idx, 'offer', nextIdx, null);
  });

  row.querySelector('.exchange-add-slot-btn').addEventListener('click', ()=>{
    const nextIdx = pendingTrades[idx].exchangeSlots.length;
    pendingTrades[idx].exchangeSlots.push({ item:null, qty:1 });
    addItemSlot(exchSlotsEl, idx, 'exchange', nextIdx, null);
  });

  // Enchant buttons
  row.querySelector('.offer-enchant-btn').addEventListener('click', ()=>openEnchantModal(idx, 'offer', row));
  row.querySelector('.exchange-enchant-btn').addEventListener('click', ()=>openEnchantModal(idx, 'exchange', row));

  // Pre-fill enchant tags
  if(tradeData.offerEnchants.length)    renderEnchantTagsInline(row.querySelector('.offer-enchant-tags'),    row.querySelector('.offer-enchant-count'),    tradeData.offerEnchants);
  if(tradeData.exchangeEnchants.length) renderEnchantTagsInline(row.querySelector('.exchange-enchant-tags'), row.querySelector('.exchange-enchant-count'), tradeData.exchangeEnchants);

  tradesList.appendChild(row);
  updateTradesBadge();
  row.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function removeTradeRow(row, idx) {
  pendingTrades.splice(idx, 1);
  row.remove();
  // Re-index remaining rows
  tradesList.querySelectorAll('.trade-row').forEach((r, i) => {
    r.dataset.tradeIndex = i;
    const n = r.querySelector('.trade-num');
    if(n) n.textContent = i+1;
  });
  updateTradesBadge();
}

addTradeBtn.addEventListener('click', ()=>addTradeRow());

// ─────────────────────────────────────────────
// ITEM SLOTS (multi-item per side)
// ─────────────────────────────────────────────
function addItemSlot(slotsContainer, tradeIdx, side, slotIdx, prefillSlot=null) {
  // Ensure state array is large enough
  const slotsArr = side==='offer' ? pendingTrades[tradeIdx].offerSlots : pendingTrades[tradeIdx].exchangeSlots;
  while(slotsArr.length <= slotIdx) slotsArr.push({ item:null, qty:1 });
  if(prefillSlot) slotsArr[slotIdx] = { ...slotsArr[slotIdx], ...prefillSlot };

  const clone = itemSlotTemplate.content.cloneNode(true);
  const slotEl = clone.querySelector('.item-slot');
  slotEl.dataset.slotIndex = slotIdx;

  // Slot header num
  slotEl.querySelector('.item-slot-num').textContent = `Item ${slotIdx+1}`;

  // Remove slot button (don't allow removing last slot)
  const removeSlotBtn = slotEl.querySelector('.item-slot-remove');
  removeSlotBtn.addEventListener('click', ()=>{
    const arr = side==='offer' ? pendingTrades[tradeIdx].offerSlots : pendingTrades[tradeIdx].exchangeSlots;
    if(arr.length <= 1) { showToast('Au minimum 1 item requis par côté.', true); return; }
    arr.splice(slotIdx, 1);
    slotsContainer.removeChild(slotEl);
    // Re-number slots
    slotsContainer.querySelectorAll('.item-slot').forEach((s,i)=>{
      s.dataset.slotIndex = i;
      const n = s.querySelector('.item-slot-num');
      if(n) n.textContent = `Item ${i+1}`;
    });
  });

  // Item search
  const searchEl   = slotEl.querySelector('.item-search');
  const dropdownEl = slotEl.querySelector('.item-dropdown');
  const previewEl  = slotEl.querySelector('.selected-preview');
  const previewImg = slotEl.querySelector('.preview-img');
  const previewNm  = slotEl.querySelector('.preview-name');
  const qtyInput   = slotEl.querySelector('.qty-input');
  const clearBtn   = slotEl.querySelector('.clear-btn');

  // Prefill
  if(prefillSlot && prefillSlot.item) {
    setSlotPreview(previewEl, previewImg, previewNm, prefillSlot.item);
    qtyInput.value = prefillSlot.qty || 1;
  } else {
    qtyInput.value = 1;
  }

  // Search input
  searchEl.addEventListener('input', ()=>{
    handleItemSearch(searchEl, dropdownEl, item=>{
      selectSlotItem(tradeIdx, side, slotIdx, item);
      setSlotPreview(previewEl, previewImg, previewNm, item);
    });
  });

  searchEl.addEventListener('focus', ()=>{
    if(searchEl.value.trim()) dropdownEl.classList.remove('hidden');
  });

  // Qty
  qtyInput.addEventListener('input', e=>{
    const arr = side==='offer' ? pendingTrades[tradeIdx].offerSlots : pendingTrades[tradeIdx].exchangeSlots;
    if(arr[slotIdx]) arr[slotIdx].qty = parseInt(e.target.value,10) || 1;
  });

  // Clear
  clearBtn.addEventListener('click', ()=>{
    const arr = side==='offer' ? pendingTrades[tradeIdx].offerSlots : pendingTrades[tradeIdx].exchangeSlots;
    if(arr[slotIdx]) arr[slotIdx].item = null;
    previewEl.classList.add('hidden');
    searchEl.value = '';
    searchEl.focus();
  });

  slotsContainer.appendChild(slotEl);
}

function selectSlotItem(tradeIdx, side, slotIdx, item) {
  const arr = side==='offer' ? pendingTrades[tradeIdx].offerSlots : pendingTrades[tradeIdx].exchangeSlots;
  if(arr[slotIdx]) arr[slotIdx].item = item;
  clearError();
}

function setSlotPreview(previewEl, imgEl, nameEl, item) {
  imgEl.src = item.image || '';
  imgEl.alt = item.name;
  nameEl.textContent = item.name + (item.custom ? ' [custom]' : '');
  previewEl.classList.remove('hidden');
  // Hide search input
  const searchInput = previewEl.closest('.item-selector').querySelector('.item-search');
  if(searchInput) searchInput.value = '';
}

// ─────────────────────────────────────────────
// ITEM SEARCH + DROPDOWN
// ─────────────────────────────────────────────
function handleItemSearch(inputEl, dropdownEl, onSelect) {
  const q = inputEl.value.trim().toLowerCase();
  if(!q) { dropdownEl.classList.add('hidden'); return; }
  const matches = MINECRAFT_ITEMS.filter(item=>
    item.name.toLowerCase().includes(q) || idToEnglish(item.id).toLowerCase().includes(q)
  ).slice(0, 12);
  renderDropdown(matches, dropdownEl, onSelect, inputEl);
}

function renderDropdown(items, dropdownEl, onSelect, inputEl) {
  dropdownEl.innerHTML = '';

  if(items.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'dropdown-empty';
    emptyDiv.innerHTML = `Aucun item trouvé. <button class="dropdown-custom-btn">＋ Item custom</button>`;
    emptyDiv.querySelector('.dropdown-custom-btn').addEventListener('click', e=>{
      e.stopPropagation();
      dropdownEl.classList.add('hidden');
      const slotEl   = dropdownEl.closest('.item-slot');
      const tradeRow = dropdownEl.closest('.trade-row');
      const tradeIdx = parseInt(tradeRow.dataset.tradeIndex, 10);
      const side     = slotEl.closest('.trade-col').dataset.side;
      const slotIdx  = parseInt(slotEl.dataset.slotIndex, 10);
      const previewEl  = slotEl.querySelector('.selected-preview');
      const previewImg = slotEl.querySelector('.preview-img');
      const previewNm  = slotEl.querySelector('.preview-name');
      openCustomItemModal(tradeIdx, side, slotIdx, previewEl, previewImg, previewNm, inputEl.value.trim());
    });
    dropdownEl.appendChild(emptyDiv);
  } else {
    items.forEach(item=>{
      const enName = idToEnglish(item.id);
      const row = document.createElement('div');
      row.className = 'dropdown-item';
      row.innerHTML = `
        <img src="${escHtml(item.image||'')}" alt="${escHtml(item.name)}" onerror="this.src=''" />
        <div class="dropdown-item-names">
          <span class="dropdown-item-name">${escHtml(item.name)}</span>
          <span class="dropdown-item-en">${escHtml(enName)}</span>
        </div>
        <span class="dropdown-item-cat">${escHtml(CAT_LABELS[item.category]||item.category)}</span>`;
      row.addEventListener('click', ()=>{
        onSelect(item);
        dropdownEl.classList.add('hidden');
      });
      dropdownEl.appendChild(row);
    });
    // Custom row at bottom
    const customRow = document.createElement('div');
    customRow.className = 'dropdown-custom-row';
    customRow.innerHTML = '<button class="dropdown-custom-btn">＋ Item custom (datapack/plugin)</button>';
    customRow.querySelector('.dropdown-custom-btn').addEventListener('click', e=>{
      e.stopPropagation();
      dropdownEl.classList.add('hidden');
      const slotEl   = dropdownEl.closest('.item-slot');
      const tradeRow = dropdownEl.closest('.trade-row');
      const tradeIdx = parseInt(tradeRow.dataset.tradeIndex, 10);
      const side     = slotEl.closest('.trade-col').dataset.side;
      const slotIdx  = parseInt(slotEl.dataset.slotIndex, 10);
      const previewEl  = slotEl.querySelector('.selected-preview');
      const previewImg = slotEl.querySelector('.preview-img');
      const previewNm  = slotEl.querySelector('.preview-name');
      openCustomItemModal(tradeIdx, side, slotIdx, previewEl, previewImg, previewNm, inputEl ? inputEl.value.trim() : '');
    });
    dropdownEl.appendChild(customRow);
  }
  dropdownEl.classList.remove('hidden');
}

// Close dropdowns on outside click
document.addEventListener('click', e=>{
  if(!e.target.closest('.item-selector')) {
    document.querySelectorAll('.item-dropdown').forEach(d=>d.classList.add('hidden'));
  }
});

// ─────────────────────────────────────────────
// CUSTOM ITEM MODAL
// ─────────────────────────────────────────────
function openCustomItemModal(tradeIdx, side, slotIdx, previewEl, previewImg, previewNm, prefillName='') {
  customItemNameInp.value = prefillName;
  customItemImgInp.value  = '';
  customItemCatInp.value  = 'misc';
  customItemPreviewRow.classList.add('hidden');
  customItemError.classList.add('hidden');
  customItemCallback = item=>{
    selectSlotItem(tradeIdx, side, slotIdx, item);
    setSlotPreview(previewEl, previewImg, previewNm, item);
  };
  customItemOverlay.classList.remove('hidden');
  customItemNameInp.focus();
}

function closeCustomItemModal() {
  customItemOverlay.classList.add('hidden');
  customItemCallback = null;
}

customItemImgInp.addEventListener('input', ()=>{
  const url = customItemImgInp.value.trim();
  if(url) {
    customItemPreviewImg.src = url;
    customItemPreviewRow.classList.remove('hidden');
  } else {
    customItemPreviewRow.classList.add('hidden');
  }
});

customItemNameInp.addEventListener('input', ()=>{
  customItemPreviewName.textContent = customItemNameInp.value.trim();
});

confirmCustomItemBtn.addEventListener('click', ()=>{
  const name = customItemNameInp.value.trim();
  if(!name || name.length < 1) {
    customItemError.textContent = '⚠ Donne un nom à ton item.';
    customItemError.classList.remove('hidden');
    return;
  }
  const item = { id:'custom_'+genId(), name, image:customItemImgInp.value.trim(), category:customItemCatInp.value, custom:true };
  if(customItemCallback) customItemCallback(item);
  closeCustomItemModal();
});

[cancelCustomItemBtn, closeCustomItemBtn].forEach(b=>b.addEventListener('click', closeCustomItemModal));
customItemOverlay.addEventListener('click', e=>{ if(e.target===customItemOverlay) closeCustomItemModal(); });

// ─────────────────────────────────────────────
// ENCHANT MODAL
// ─────────────────────────────────────────────
function openEnchantModal(tradeIdx, side, tradeRow) {
  const existing = side==='offer' ? pendingTrades[tradeIdx].offerEnchants : pendingTrades[tradeIdx].exchangeEnchants;
  currentEnchantSel = {};
  (existing||[]).forEach(e=>{ currentEnchantSel[e.id] = e.level; });
  enchantSearch.value = '';
  renderEnchantList('');
  enchantCallback = enchants=>{
    if(side==='offer') {
      pendingTrades[tradeIdx].offerEnchants = enchants;
      renderEnchantTagsInline(tradeRow.querySelector('.offer-enchant-tags'), tradeRow.querySelector('.offer-enchant-count'), enchants);
    } else {
      pendingTrades[tradeIdx].exchangeEnchants = enchants;
      renderEnchantTagsInline(tradeRow.querySelector('.exchange-enchant-tags'), tradeRow.querySelector('.exchange-enchant-count'), enchants);
    }
  };
  enchantOverlay.classList.remove('hidden');
  enchantSearch.focus();
}

function closeEnchantModal() {
  enchantOverlay.classList.add('hidden');
  enchantCallback = null;
}

enchantSearch.addEventListener('input', ()=>renderEnchantList(enchantSearch.value.trim().toLowerCase()));

function renderEnchantList(filter) {
  enchantListEl.innerHTML = '';
  const groups = {};
  ENCHANTMENTS.forEach(e=>{
    if(!filter || e.name.toLowerCase().includes(filter) || e.nameEn.toLowerCase().includes(filter)) {
      if(!groups[e.group]) groups[e.group] = [];
      groups[e.group].push(e);
    }
  });

  Object.entries(groups).forEach(([group, enchants])=>{
    const gInfo = ENCHANT_GROUPS[group] || { label:group, color:'#aaa' };
    const header = document.createElement('div');
    header.className = 'enchant-group-header';
    header.innerHTML = `<span style="color:${gInfo.color}">${gInfo.label}</span>`;
    enchantListEl.appendChild(header);

    enchants.forEach(e=>{
      const sel = currentEnchantSel[e.id] || 0;
      const row = document.createElement('div');
      row.className = 'enchant-item-row' + (sel ? ' enchant-selected' : '');
      row.dataset.id = e.id;

      let levelHtml = '';
      if(e.maxLvl === 1) {
        levelHtml = `<label class="enchant-toggle"><input type="checkbox" class="enchant-check" data-id="${e.id}" ${sel?'checked':''}> <span></span></label>`;
      } else {
        levelHtml = `<div class="enchant-levels">${Array.from({length:e.maxLvl},(_,i)=>{
          const lvl = i+1;
          return `<button class="enchant-lvl-btn${sel===lvl?' active':''}" data-id="${e.id}" data-lvl="${lvl}">${ROMAN[lvl]}</button>`;
        }).join('')}<button class="enchant-lvl-btn${sel===0?' active':''}" data-id="${e.id}" data-lvl="0" title="Retirer">✕</button></div>`;
      }

      row.innerHTML = `
        <div class="enchant-info">
          <span class="enchant-name">${escHtml(e.name)}</span>
          <span class="enchant-name-en">${escHtml(e.nameEn)}</span>
        </div>
        ${levelHtml}`;

      const check = row.querySelector('.enchant-check');
      if(check) check.addEventListener('change', ()=>{
        currentEnchantSel[e.id] = check.checked ? 1 : 0;
        row.classList.toggle('enchant-selected', check.checked);
      });

      row.querySelectorAll('.enchant-lvl-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const lvl = parseInt(btn.dataset.lvl, 10);
          currentEnchantSel[e.id] = lvl;
          row.querySelectorAll('.enchant-lvl-btn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          row.classList.toggle('enchant-selected', lvl > 0);
        });
      });

      enchantListEl.appendChild(row);
    });
  });

  if(enchantListEl.children.length === 0) {
    enchantListEl.innerHTML = '<div class="dropdown-empty">Aucun enchantement trouvé.</div>';
  }
}

confirmEnchantBtn.addEventListener('click', ()=>{
  const result = Object.entries(currentEnchantSel).filter(([,lvl])=>lvl>0).map(([id,level])=>({id,level}));
  if(enchantCallback) enchantCallback(result);
  closeEnchantModal();
});

[cancelEnchantBtn, closeEnchantBtn].forEach(b=>b.addEventListener('click', closeEnchantModal));
enchantOverlay.addEventListener('click', e=>{ if(e.target===enchantOverlay) closeEnchantModal(); });

// ─────────────────────────────────────────────
// ENCHANT TAGS INLINE
// ─────────────────────────────────────────────
function renderEnchantTagsInline(container, badge, enchants) {
  container.innerHTML = '';
  if(!enchants || enchants.length === 0) { badge.classList.add('hidden'); return; }
  badge.textContent = enchants.length;
  badge.classList.remove('hidden');
  enchants.forEach(e=>{
    const def  = ENCHANTMENTS.find(x=>x.id===e.id);
    const name = def ? def.name : e.id;
    const span = document.createElement('span');
    span.className = 'enchant-tag-inline' + (def && def.group==='curse' ? ' enchant-tag-curse' : '');
    span.textContent = name + (e.level > 1 ? ' '+ROMAN[e.level] : '');
    container.appendChild(span);
  });
}

// ─────────────────────────────────────────────
// SUBMIT
// ─────────────────────────────────────────────
submitBtn.addEventListener('click', async()=>{
  clearError();
  const seller = sellerInput.value.trim();
  if(!seller || seller.length < 2) { showError('⚠ Le pseudo vendeur doit faire au moins 2 caractères.'); return; }
  if(pendingTrades.length === 0) { showError('⚠ Ajoutez au moins un trade.'); return; }

  for(let i = 0; i < pendingTrades.length; i++) {
    const t = pendingTrades[i];

    // Sync qtys from DOM (in case listeners missed something)
    const rowEl = tradesList.querySelectorAll('.trade-row')[i];
    if(!rowEl) continue;

    const offerSlotEls    = rowEl.querySelectorAll('.offer-slots .item-slot');
    const exchangeSlotEls = rowEl.querySelectorAll('.exchange-slots .item-slot');

    offerSlotEls.forEach((slotEl, si)=>{
      const qty = parseInt(slotEl.querySelector('.qty-input').value, 10) || 1;
      if(t.offerSlots[si]) t.offerSlots[si].qty = qty;
    });

    exchangeSlotEls.forEach((slotEl, si)=>{
      const qty = parseInt(slotEl.querySelector('.qty-input').value, 10) || 1;
      if(t.exchangeSlots[si]) t.exchangeSlots[si].qty = qty;
    });

    // Validate at least 1 item each side
    const offerFilled    = t.offerSlots.filter(s=>s.item);
    const exchangeFilled = t.exchangeSlots.filter(s=>s.item);

    if(offerFilled.length === 0)    { showError(`⚠ Trade #${i+1} : sélectionnez au moins un item offert.`); return; }
    if(exchangeFilled.length === 0) { showError(`⚠ Trade #${i+1} : sélectionnez au moins un item demandé.`); return; }

    // Validate quantities
    for(const slot of [...t.offerSlots, ...t.exchangeSlots]) {
      if(slot.item && (slot.qty < 1 || slot.qty > 2304)) {
        showError(`⚠ Trade #${i+1} : quantité invalide (1–2304).`); return;
      }
    }

    // Remove empty slots (user added but didn't fill)
    t.offerSlots    = t.offerSlots.filter(s=>s.item);
    t.exchangeSlots = t.exchangeSlots.filter(s=>s.item);
  }

  const trades = pendingTrades.map(t=>({
    offerSlots:       t.offerSlots,
    offerEnchants:    t.offerEnchants || [],
    exchangeSlots:    t.exchangeSlots,
    exchangeEnchants: t.exchangeEnchants || [],
    note:             t.note || ''
  }));

  const shopDesc = shopDescInput.value.trim();

  if(editingId) {
    const idx = listings.findIndex(s=>s.id===editingId);
    if(idx !== -1) listings[idx] = { ...listings[idx], seller, shopDesc, trades, date:new Date().toISOString() };
    saveListings(); renderCatalogue(); closeModal();
    showToast(`✅ Boutique de ${seller} mise à jour !`);
  } else {
    const shop = { id:genId(), seller, shopDesc, trades, date:new Date().toISOString() };
    listings.unshift(shop);
    saveListings();
    renderCatalogue();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi Discord…';
    await sendDiscordWebhook(DEFAULT_WEBHOOK, shop);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Publier la boutique';
    closeModal();
    const totalItems = trades.reduce((a,t)=>a+t.offerSlots.length+t.exchangeSlots.length, 0);
    showToast(`✅ Boutique de ${seller} publiée ! (${trades.length} trade${trades.length!==1?'s':''}, ${totalItems} items)`);
  }
});

// ─────────────────────────────────────────────
// DISCORD WEBHOOK
// ─────────────────────────────────────────────
async function sendDiscordWebhook(webhookUrl, shop) {
  const fields = [];
  fields.push({ name:'👤 Vendeur', value:`\`${shop.seller}\``, inline:true });
  if(shop.shopDesc) fields.push({ name:'📝 Description', value:shop.shopDesc, inline:false });

  shop.trades.forEach((t,i)=>{
    const offerParts = t.offerSlots.map(s=>`**${s.qty}× ${s.item.name}**`).join(' + ');
    const exchParts  = t.exchangeSlots.map(s=>`**${s.qty}× ${s.item.name}**`).join(' + ');
    const offerEnch  = formatEnchants(t.offerEnchants);
    const exchEnch   = formatEnchants(t.exchangeEnchants);
    let val = `${offerParts}${offerEnch ? ` _(${offerEnch})_` : ''} ⇄ ${exchParts}${exchEnch ? ` _(${exchEnch})_` : ''}`;
    if(t.note) val += `\n*${t.note}*`;
    fields.push({ name:`Trade #${i+1}`, value:val, inline:false });
  });

  const firstItem = shop.trades[0]?.offerSlots[0]?.item;
  const payload = {
    username: 'CraftMarket',
    avatar_url: 'https://minecraft.wiki/images/Grass_Block_JE7_BE6.png',
    embeds: [{
      title: `🏪 Boutique de ${shop.seller}`,
      color: 0x5db039,
      thumbnail: { url: firstItem?.image || '' },
      fields,
      footer: { text: 'CraftMarket • Minecraft Marketplace' },
      timestamp: shop.date
    }]
  };

  try {
    const res = await fetch(webhookUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    if(!res.ok) showToast('⚠ Discord webhook : erreur '+res.status, true);
    else showToast('📣 Boutique envoyée sur Discord !');
  } catch(err) {
    showToast("⚠ Impossible d'envoyer sur Discord.", true);
  }
}

// ─────────────────────────────────────────────
// SEARCH & FILTERS
// ─────────────────────────────────────────────
let searchDebounce;
searchInput.addEventListener('input', ()=>{
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(()=>{ searchQuery = searchInput.value.trim(); renderCatalogue(); }, 200);
});

filterTabs.addEventListener('click', e=>{
  const btn = e.target.closest('.tab-btn');
  if(!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = btn.dataset.cat;
  renderCatalogue();
});

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
loadItems().then(()=>{
  loadListings();
  renderCatalogue();
});
