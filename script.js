/* ===========================
   CRAFTMARKET — script.js (Shop / Multi-Trade System)
   =========================== */

'use strict';

// ───────────────────────────────────────────
// ITEMS
// ───────────────────────────────────────────
let MINECRAFT_ITEMS = [];

async function loadItems() {
  try {
    const res = await fetch('items.json');
    MINECRAFT_ITEMS = await res.json();
  } catch(e) {
    console.error('Failed to load items.json:', e);
    MINECRAFT_ITEMS = [];
  }
}

const RARE_ITEMS = new Set(['nether_star', 'dragon_egg', 'enchanted_golden_apple', 'elytra', 'netherite_ingot', 'totem_of_undying']);

const CAT_LABELS = {
  weapons:   '⚔ Armes',
  tools:     '⛏ Outils',
  armor:     '🛡 Armure',
  resources: '💎 Ressources',
  blocks:    '🧱 Blocs',
  food:      '🍎 Nourriture',
  misc:      '✨ Divers'
};

// ───────────────────────────────────────────
// DISCORD WEBHOOK
// ───────────────────────────────────────────
const DEFAULT_WEBHOOK = 'https://discord.com/api/webhooks/1510191804132229181/4NCQrv7DtCgBCb7zKTpVZ44Ff8_WBSz7JQ_SipowM-bhFsbSgGIZdbgF7UOJIZ2UZWHw';

// ───────────────────────────────────────────
// STATE
// ───────────────────────────────────────────
let listings = [];          // toutes les annonces (shops)
let activeCategory = 'all';
let searchQuery = '';
let toastTimer = null;
let editingId = null;       // id du shop en cours d'édition (null = nouvelle boutique)

// trades en cours dans le modal
// chaque entry: { offerItem, offerQty, exchangeItem, exchangeQty, note }
let pendingTrades = [];

// ───────────────────────────────────────────
// DOM REFS
// ───────────────────────────────────────────
const grid           = document.getElementById('catalogue-grid');
const emptyState     = document.getElementById('empty-state');
const listingCount   = document.getElementById('listing-count');
const openModalBtn   = document.getElementById('open-modal-btn');
const closeModalBtn  = document.getElementById('close-modal-btn');
const cancelBtn      = document.getElementById('cancel-btn');
const modalOverlay   = document.getElementById('modal-overlay');
const modalTitle     = document.getElementById('modal-title');
const sellerInput    = document.getElementById('seller-input');
const shopDescInput  = document.getElementById('shop-desc-input');
const formError      = document.getElementById('form-error');
const toastEl        = document.getElementById('toast');
const submitBtn      = document.getElementById('submit-btn');
const addTradeBtn    = document.getElementById('add-trade-btn');
const tradesList     = document.getElementById('trades-list');
const tradeTemplate  = document.getElementById('trade-row-template');
const tradesCountBadge = document.getElementById('trades-count-badge');
const searchInput    = document.getElementById('search-input');
const filterTabs     = document.getElementById('filter-tabs');

// ───────────────────────────────────────────
// LOCALSTORAGE
// ───────────────────────────────────────────
function loadListings() {
  try {
    const raw = localStorage.getItem('craftmarket_listings_v2');
    listings = raw ? JSON.parse(raw) : getDefaultListings();
  } catch {
    listings = getDefaultListings();
  }
}

function saveListings() {
  localStorage.setItem('craftmarket_listings_v2', JSON.stringify(listings));
}

function getDefaultListings() {
  return [
    {
      id: genId(),
      seller: 'Notch',
      shopDesc: 'Spécialiste ressources et minerais rares',
      trades: [
        {
          itemId: 'diamond', itemName: 'Diamond',
          itemImage: 'https://www.mcworldtools.com/textures/rendered/diamond.png',
          itemCategory: 'resources', qtyOffer: 1,
          exchangeId: 'dirt', exchangeName: 'Dirt',
          exchangeImage: 'https://www.mcworldtools.com/textures/rendered/dirt.png',
          exchangeCategory: 'blocks', qtyExchange: 32,
          note: 'Diamants naturels, trouvés en Y=-59.'
        },
        {
          itemId: 'emerald', itemName: 'Emerald',
          itemImage: 'https://www.mcworldtools.com/textures/rendered/emerald.png',
          itemCategory: 'resources', qtyOffer: 5,
          exchangeId: 'gold_ingot', exchangeName: 'Gold Ingot',
          exchangeImage: 'https://www.mcworldtools.com/textures/rendered/gold_ingot.png',
          exchangeCategory: 'resources', qtyExchange: 16,
          note: ''
        }
      ],
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: genId(),
      seller: 'Herobrine',
      shopDesc: 'Équipement haut de gamme – prix négociables',
      trades: [
        {
          itemId: 'netherite_ingot', itemName: 'Netherite Ingot',
          itemImage: 'https://www.mcworldtools.com/textures/rendered/netherite_ingot.png',
          itemCategory: 'resources', qtyOffer: 1,
          exchangeId: 'diamond', exchangeName: 'Diamond',
          exchangeImage: 'https://www.mcworldtools.com/textures/rendered/diamond.png',
          exchangeCategory: 'resources', qtyExchange: 4,
          note: 'Prix négociable pour gros volumes.'
        },
        {
          itemId: 'elytra', itemName: 'Elytra',
          itemImage: 'https://www.mcworldtools.com/textures/rendered/elytra.png',
          itemCategory: 'armor', qtyOffer: 1,
          exchangeId: 'emerald_block', exchangeName: 'Emerald Block',
          exchangeImage: 'https://www.mcworldtools.com/textures/rendered/emerald_block.png',
          exchangeCategory: 'blocks', qtyExchange: 8,
          note: 'Mending + Unbreaking III.'
        }
      ],
      date: new Date(Date.now() - 86400000).toISOString()
    }
  ];
}

// ───────────────────────────────────────────
// UTILS
// ───────────────────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return "À l'instant";
  if (mins < 60)   return `il y a ${mins}min`;
  if (hours < 24)  return `il y a ${hours}h`;
  return `il y a ${days}j`;
}

function showToast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden', 'error');
  if (isError) toastEl.classList.add('error');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 3500);
}

function showError(msg) {
  formError.textContent = msg;
  formError.classList.remove('hidden');
  formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearError() {
  formError.classList.add('hidden');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ───────────────────────────────────────────
// RENDER CATALOGUE
// ───────────────────────────────────────────
function getFilteredListings() {
  return listings.filter(shop => {
    const matchCat = activeCategory === 'all' ||
      shop.trades.some(t => t.itemCategory === activeCategory || t.exchangeCategory === activeCategory);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      shop.seller.toLowerCase().includes(q) ||
      (shop.shopDesc && shop.shopDesc.toLowerCase().includes(q)) ||
      shop.trades.some(t =>
        t.itemName.toLowerCase().includes(q) ||
        t.exchangeName.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q))
      );
    return matchCat && matchSearch;
  });
}

function renderCatalogue() {
  const filtered = getFilteredListings();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    filtered.forEach((shop, i) => {
      const card = createShopCard(shop, i);
      grid.appendChild(card);
    });
  }

  const total = listings.reduce((acc, s) => acc + s.trades.length, 0);
  listingCount.textContent = `${listings.length} boutique${listings.length !== 1 ? 's' : ''} · ${total} trade${total !== 1 ? 's' : ''}`;
}

function createShopCard(shop, index) {
  const hasRare = shop.trades.some(t => RARE_ITEMS.has(t.itemId) || RARE_ITEMS.has(t.exchangeId));
  const card = document.createElement('div');
  card.className = `shop-card${hasRare ? ' card-rare' : ''}`;
  card.style.animationDelay = `${index * 0.04}s`;

  const tradesHtml = shop.trades.map(t => {
    const fallbackOffer    = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.itemName)}&background=1a2212&color=7ec84a&size=48`;
    const fallbackExchange = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.exchangeName)}&background=1a2212&color=e8a020&size=48`;
    return `
      <div class="shop-trade-row">
        <div class="trade-side trade-offer">
          <img class="card-item-img-sm" src="${t.itemImage}" alt="${t.itemName}" onerror="this.src='${fallbackOffer}'" />
          <span class="trade-qty">×${t.qtyOffer}</span>
          <span class="trade-name">${escapeHtml(t.itemName)}</span>
        </div>
        <div class="trade-arrow">⇄</div>
        <div class="trade-side trade-exchange">
          <img class="card-item-img-sm" src="${t.exchangeImage}" alt="${t.exchangeName}" onerror="this.src='${fallbackExchange}'" />
          <span class="trade-qty">×${t.qtyExchange}</span>
          <span class="trade-name">${escapeHtml(t.exchangeName)}</span>
        </div>
        ${t.note ? `<span class="trade-card-note" title="${escapeHtml(t.note)}">💬 ${escapeHtml(t.note)}</span>` : ''}
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <div class="shop-card-header">
      <div class="shop-seller-info">
        <span class="shop-seller-name">👤 ${escapeHtml(shop.seller)}</span>
        ${shop.shopDesc ? `<span class="shop-seller-desc">${escapeHtml(shop.shopDesc)}</span>` : ''}
      </div>
      <span class="shop-trade-count">${shop.trades.length} trade${shop.trades.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="shop-trades-body">
      ${tradesHtml}
    </div>
    <div class="card-footer">
      <span class="card-date">${timeAgo(shop.date)}</span>
      <div class="card-actions">
        <button class="card-edit-btn" data-id="${shop.id}" title="Modifier">✏ Modifier</button>
        <button class="card-del-btn" data-id="${shop.id}" title="Supprimer">🗑 Supprimer</button>
      </div>
    </div>
  `;

  card.querySelector('.card-del-btn').addEventListener('click', () => deleteShop(shop.id));
  card.querySelector('.card-edit-btn').addEventListener('click', () => openEditModal(shop.id));
  return card;
}

// ───────────────────────────────────────────
// DELETE
// ───────────────────────────────────────────
function deleteShop(id) {
  listings = listings.filter(s => s.id !== id);
  saveListings();
  renderCatalogue();
  showToast('Boutique supprimée.');
}

// ───────────────────────────────────────────
// MODAL
// ───────────────────────────────────────────
function openModal(shopToEdit = null) {
  editingId = shopToEdit ? shopToEdit.id : null;
  modalTitle.textContent = shopToEdit ? '✏ Modifier la boutique' : '🏪 Nouvelle Boutique';
  submitBtn.textContent = shopToEdit ? '💾 Enregistrer les modifications' : '📢 Publier la boutique';

  sellerInput.value = shopToEdit ? shopToEdit.seller : '';
  shopDescInput.value = shopToEdit ? (shopToEdit.shopDesc || '') : '';
  tradesList.innerHTML = '';
  pendingTrades = [];
  clearError();

  if (shopToEdit && shopToEdit.trades.length > 0) {
    shopToEdit.trades.forEach(t => addTradeRow({
      offerItem:    { id: t.itemId, name: t.itemName, image: t.itemImage, category: t.itemCategory },
      offerQty:     t.qtyOffer,
      exchangeItem: { id: t.exchangeId, name: t.exchangeName, image: t.exchangeImage, category: t.exchangeCategory },
      exchangeQty:  t.qtyExchange,
      note:         t.note || ''
    }));
  } else {
    addTradeRow(); // un trade vide par défaut
  }

  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  sellerInput.focus();
}

function openEditModal(id) {
  const shop = listings.find(s => s.id === id);
  if (shop) openModal(shop);
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  pendingTrades = [];
  tradesList.innerHTML = '';
  editingId = null;
}

openModalBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
});

// ───────────────────────────────────────────
// TRADES DYNAMIQUES
// ───────────────────────────────────────────
function updateTradesBadge() {
  const n = pendingTrades.length;
  tradesCountBadge.textContent = `${n} trade${n !== 1 ? 's' : ''}`;
}

function addTradeRow(prefill = null) {
  const tradeData = {
    offerItem: null,
    offerQty: 1,
    exchangeItem: null,
    exchangeQty: 1,
    note: '',
    ...(prefill || {})
  };

  const idx = pendingTrades.length;
  pendingTrades.push(tradeData);

  const clone = tradeTemplate.content.cloneNode(true);
  const row = clone.querySelector('.trade-row');
  row.dataset.tradeIndex = idx;
  row.querySelector('.trade-num').textContent = idx + 1;

  // Pré-remplissage si édition
  if (prefill) {
    if (prefill.offerItem) {
      setOfferPreview(row, prefill.offerItem);
    }
    if (prefill.exchangeItem) {
      setExchangePreview(row, prefill.exchangeItem);
    }
    row.querySelector('.qty-offer').value = prefill.offerQty || 1;
    row.querySelector('.qty-exchange').value = prefill.exchangeQty || 1;
    row.querySelector('.trade-note').value = prefill.note || '';
  }

  // Supprimer ce trade
  row.querySelector('.trade-row-remove').addEventListener('click', () => removeTradeRow(row, idx));

  // Dropdowns offre
  const offerSearch = row.querySelector('.item-search-offer');
  const offerDrop   = row.querySelector('.item-dropdown-offer');
  offerSearch.addEventListener('input', () => handleSearchInput(offerSearch, offerDrop, item => {
    selectOfferItem(row, idx, item);
  }));
  offerSearch.addEventListener('focus', () => {
    if (offerSearch.value.trim()) offerDrop.classList.remove('hidden');
  });

  row.querySelector('.clear-offer').addEventListener('click', () => {
    pendingTrades[idx].offerItem = null;
    row.querySelector('.offer-preview').classList.add('hidden');
    offerSearch.value = '';
    offerSearch.focus();
  });

  // Dropdowns échange
  const exchSearch = row.querySelector('.item-search-exchange');
  const exchDrop   = row.querySelector('.item-dropdown-exchange');
  exchSearch.addEventListener('input', () => handleSearchInput(exchSearch, exchDrop, item => {
    selectExchangeItem(row, idx, item);
  }));
  exchSearch.addEventListener('focus', () => {
    if (exchSearch.value.trim()) exchDrop.classList.remove('hidden');
  });

  row.querySelector('.clear-exchange').addEventListener('click', () => {
    pendingTrades[idx].exchangeItem = null;
    row.querySelector('.exchange-preview').classList.add('hidden');
    exchSearch.value = '';
    exchSearch.focus();
  });

  // Sync quantities & notes
  row.querySelector('.qty-offer').addEventListener('input', e => {
    pendingTrades[idx].offerQty = parseInt(e.target.value, 10) || 1;
  });
  row.querySelector('.qty-exchange').addEventListener('input', e => {
    pendingTrades[idx].exchangeQty = parseInt(e.target.value, 10) || 1;
  });
  row.querySelector('.trade-note').addEventListener('input', e => {
    pendingTrades[idx].note = e.target.value.trim();
  });

  tradesList.appendChild(row);
  updateTradesBadge();
  row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function removeTradeRow(row, idx) {
  pendingTrades.splice(idx, 1);
  row.remove();
  // Re-numéroter les rows restants
  tradesList.querySelectorAll('.trade-row').forEach((r, i) => {
    r.dataset.tradeIndex = i;
    const numEl = r.querySelector('.trade-num');
    if (numEl) numEl.textContent = i + 1;
  });
  updateTradesBadge();
}

addTradeBtn.addEventListener('click', () => addTradeRow());

// ───────────────────────────────────────────
// ITEM SEARCH HELPERS
// ───────────────────────────────────────────
// Convertit un id Minecraft en nom anglais lisible : "netherite_ingot" → "Netherite Ingot"
function idToEnglish(id) {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function handleSearchInput(inputEl, dropdownEl, onSelect) {
  const q = inputEl.value.trim().toLowerCase();
  if (!q) { dropdownEl.classList.add('hidden'); return; }
  const matches = MINECRAFT_ITEMS.filter(item =>
    item.name.toLowerCase().includes(q) ||        // recherche en français
    idToEnglish(item.id).toLowerCase().includes(q) // recherche en anglais
  ).slice(0, 12);
  renderDropdown(matches, dropdownEl, onSelect);
}

function renderDropdown(items, dropdownEl, onSelect) {
  dropdownEl.innerHTML = '';
  if (items.length === 0) {
    dropdownEl.innerHTML = '<div class="dropdown-empty">Aucun item trouvé.</div>';
  } else {
    items.forEach(item => {
      const enName = idToEnglish(item.id);
      const row = document.createElement('div');
      row.className = 'dropdown-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src=''" />
        <div class="dropdown-item-names">
          <span class="dropdown-item-name">${item.name}</span>
          <span class="dropdown-item-en">${enName}</span>
        </div>
        <span class="dropdown-item-cat">${CAT_LABELS[item.category] || item.category}</span>
      `;
      row.addEventListener('click', () => {
        onSelect(item);
        dropdownEl.classList.add('hidden');
      });
      dropdownEl.appendChild(row);
    });
  }
  dropdownEl.classList.remove('hidden');
}

// Ferme tous les dropdowns sur click extérieur
document.addEventListener('click', e => {
  if (!e.target.closest('.item-selector')) {
    document.querySelectorAll('.item-dropdown').forEach(d => d.classList.add('hidden'));
  }
});

function setOfferPreview(row, item) {
  const preview = row.querySelector('.offer-preview');
  row.querySelector('.offer-preview-img').src = item.image;
  row.querySelector('.offer-preview-img').alt = item.name;
  row.querySelector('.offer-preview-name').textContent = item.name;
  preview.classList.remove('hidden');
  row.querySelector('.item-search-offer').value = '';
}

function setExchangePreview(row, item) {
  const preview = row.querySelector('.exchange-preview');
  row.querySelector('.exchange-preview-img').src = item.image;
  row.querySelector('.exchange-preview-img').alt = item.name;
  row.querySelector('.exchange-preview-name').textContent = item.name;
  preview.classList.remove('hidden');
  row.querySelector('.item-search-exchange').value = '';
}

function selectOfferItem(row, idx, item) {
  pendingTrades[idx].offerItem = item;
  setOfferPreview(row, item);
  clearError();
}

function selectExchangeItem(row, idx, item) {
  pendingTrades[idx].exchangeItem = item;
  setExchangePreview(row, item);
  clearError();
}

// ───────────────────────────────────────────
// SUBMIT
// ───────────────────────────────────────────
submitBtn.addEventListener('click', async () => {
  clearError();

  const seller = sellerInput.value.trim();
  if (!seller || seller.length < 2) {
    showError('⚠ Le pseudo vendeur doit faire au moins 2 caractères.');
    return;
  }

  if (pendingTrades.length === 0) {
    showError('⚠ Ajoutez au moins un trade.');
    return;
  }

  // Valider chaque trade
  for (let i = 0; i < pendingTrades.length; i++) {
    const t = pendingTrades[i];
    if (!t.offerItem) {
      showError(`⚠ Trade #${i + 1} : sélectionnez l'item offert.`);
      return;
    }
    if (!t.exchangeItem) {
      showError(`⚠ Trade #${i + 1} : sélectionnez l'item demandé.`);
      return;
    }
    const qo = parseInt(tradesList.querySelectorAll('.qty-offer')[i].value, 10);
    const qe = parseInt(tradesList.querySelectorAll('.qty-exchange')[i].value, 10);
    if (!qo || qo < 1 || qo > 2304) {
      showError(`⚠ Trade #${i + 1} : quantité offerte invalide (1–2304).`);
      return;
    }
    if (!qe || qe < 1 || qe > 2304) {
      showError(`⚠ Trade #${i + 1} : quantité demandée invalide (1–2304).`);
      return;
    }
    t.offerQty = qo;
    t.exchangeQty = qe;
  }

  const trades = pendingTrades.map(t => ({
    itemId:          t.offerItem.id,
    itemName:        t.offerItem.name,
    itemImage:       t.offerItem.image,
    itemCategory:    t.offerItem.category,
    qtyOffer:        t.offerQty,
    exchangeId:      t.exchangeItem.id,
    exchangeName:    t.exchangeItem.name,
    exchangeImage:   t.exchangeItem.image,
    exchangeCategory:t.exchangeItem.category,
    qtyExchange:     t.exchangeQty,
    note:            t.note || ''
  }));

  const shopDesc = shopDescInput.value.trim();

  if (editingId) {
    // ÉDITION
    const idx = listings.findIndex(s => s.id === editingId);
    if (idx !== -1) {
      listings[idx] = { ...listings[idx], seller, shopDesc, trades, date: new Date().toISOString() };
    }
    saveListings();
    renderCatalogue();
    closeModal();
    showToast(`✅ Boutique de ${seller} mise à jour ! (${trades.length} trade${trades.length !== 1 ? 's' : ''})`);
  } else {
    // CRÉATION
    const shop = { id: genId(), seller, shopDesc, trades, date: new Date().toISOString() };
    listings.unshift(shop);
    saveListings();
    renderCatalogue();

    submitBtn.disabled = true;
    submitBtn.textContent = '📡 Envoi Discord...';
    await sendDiscordWebhook(DEFAULT_WEBHOOK, shop);
    submitBtn.disabled = false;
    submitBtn.textContent = '📢 Publier la boutique';

    closeModal();
    showToast(`✅ Boutique de ${seller} publiée ! (${trades.length} trade${trades.length !== 1 ? 's' : ''})`);
  }
});

// ───────────────────────────────────────────
// DISCORD WEBHOOK
// ───────────────────────────────────────────
async function sendDiscordWebhook(webhookUrl, shop) {
  const fields = [];
  shop.trades.forEach((t, i) => {
    fields.push({
      name: `Trade #${i + 1}`,
      value: `**${t.qtyOffer}× ${t.itemName}** ⇄ **${t.qtyExchange}× ${t.exchangeName}**${t.note ? `\n*${t.note}*` : ''}`,
      inline: false
    });
  });
  fields.unshift({ name: '👤 Vendeur', value: `\`${shop.seller}\``, inline: true });
  if (shop.shopDesc) fields.push({ name: '📝 Description', value: shop.shopDesc, inline: false });

  const payload = {
    username: 'CraftMarket',
    avatar_url: 'https://minecraft.wiki/images/Grass_Block_JE7_BE6.png',
    embeds: [{
      title: `🏪 Boutique de ${shop.seller} — ${shop.trades.length} trade${shop.trades.length !== 1 ? 's' : ''}`,
      color: 0x5a9e2f,
      thumbnail: { url: shop.trades[0]?.itemImage || '' },
      fields,
      footer: { text: 'CraftMarket • Minecraft Marketplace' },
      timestamp: shop.date
    }]
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      showToast('⚠ Discord webhook : erreur ' + res.status, true);
    } else {
      showToast('📣 Boutique envoyée sur Discord !');
    }
  } catch (err) {
    showToast("⚠ Impossible d'envoyer sur Discord.", true);
  }
}

// ───────────────────────────────────────────
// SEARCH & FILTERS
// ───────────────────────────────────────────
let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = searchInput.value.trim();
    renderCatalogue();
  }, 200);
});

filterTabs.addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = btn.dataset.cat;
  renderCatalogue();
});

// ───────────────────────────────────────────
// INIT
// ───────────────────────────────────────────
loadItems().then(() => {
  loadListings();
  renderCatalogue();
});
