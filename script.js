/* ===========================
   CRAFTMARKET — script.js (Trade System)
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
let listings = [];
let activeCategory = 'all';
let searchQuery = '';
let selectedItem = null;
let selectedExchange = null;
let toastTimer = null;

// ───────────────────────────────────────────
// DOM REFS
// ───────────────────────────────────────────
const grid            = document.getElementById('catalogue-grid');
const emptyState      = document.getElementById('empty-state');
const listingCount    = document.getElementById('listing-count');
const openModalBtn    = document.getElementById('open-modal-btn');
const closeModalBtn   = document.getElementById('close-modal-btn');
const cancelBtn       = document.getElementById('cancel-btn');
const modalOverlay    = document.getElementById('modal-overlay');
const listingForm     = document.getElementById('listing-form');
const searchInput     = document.getElementById('search-input');
const filterTabs      = document.getElementById('filter-tabs');

// Item offert
const itemSearchEl    = document.getElementById('item-search');
const itemDropdown    = document.getElementById('item-dropdown');
const selectedPreview = document.getElementById('selected-item-preview');
const previewImg      = document.getElementById('preview-img');
const previewName     = document.getElementById('preview-name');
const clearItemBtn    = document.getElementById('clear-item-btn');
const selectedItemId  = document.getElementById('selected-item-id');
const qtyOfferInput   = document.getElementById('qty-offer-input');

// Item échange
const exchangeSearchEl    = document.getElementById('exchange-search');
const exchangeDropdown    = document.getElementById('exchange-dropdown');
const selectedExchangePreview = document.getElementById('selected-exchange-preview');
const exchangePreviewImg  = document.getElementById('exchange-preview-img');
const exchangePreviewName = document.getElementById('exchange-preview-name');
const clearExchangeBtn    = document.getElementById('clear-exchange-btn');
const selectedExchangeId  = document.getElementById('selected-exchange-id');
const qtyExchangeInput    = document.getElementById('qty-exchange-input');

const sellerInput   = document.getElementById('seller-input');
const descInput     = document.getElementById('desc-input');
const formError     = document.getElementById('form-error');
const toastEl       = document.getElementById('toast');
const submitBtn     = document.getElementById('submit-btn');

// ───────────────────────────────────────────
// LOCALSTORAGE
// ───────────────────────────────────────────
function loadListings() {
  try {
    const raw = localStorage.getItem('craftmarket_listings');
    listings = raw ? JSON.parse(raw) : getDefaultListings();
  } catch {
    listings = getDefaultListings();
  }
}

function saveListings() {
  localStorage.setItem('craftmarket_listings', JSON.stringify(listings));
}

function getDefaultListings() {
  return [
    {
      id: genId(),
      itemId: 'diamond',
      itemName: 'Diamond',
      itemImage: 'https://www.mcworldtools.com/textures/rendered/diamond.png',
      itemCategory: 'resources',
      qtyOffer: 1,
      exchangeId: 'dirt',
      exchangeName: 'Dirt',
      exchangeImage: 'https://www.mcworldtools.com/textures/rendered/dirt.png',
      exchangeCategory: 'blocks',
      qtyExchange: 32,
      seller: 'Notch',
      description: 'Diamants naturels, trouvés en Y=-59.',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: genId(),
      itemId: 'netherite_ingot',
      itemName: 'Netherite Ingot',
      itemImage: 'https://www.mcworldtools.com/textures/rendered/netherite_ingot.png',
      itemCategory: 'resources',
      qtyOffer: 1,
      exchangeId: 'diamond',
      exchangeName: 'Diamond',
      exchangeImage: 'https://www.mcworldtools.com/textures/rendered/diamond.png',
      exchangeCategory: 'resources',
      qtyExchange: 4,
      seller: 'Herobrine',
      description: 'Prix négociable pour gros volumes.',
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: genId(),
      itemId: 'elytra',
      itemName: 'Elytra',
      itemImage: 'https://www.mcworldtools.com/textures/rendered/elytra.png',
      itemCategory: 'armor',
      qtyOffer: 1,
      exchangeId: 'emerald_block',
      exchangeName: 'Emerald Block',
      exchangeImage: 'https://www.mcworldtools.com/textures/rendered/emerald_block.png',
      exchangeCategory: 'blocks',
      qtyExchange: 8,
      seller: 'Steve64',
      description: 'Mending + Unbreaking III. Une seule dispo.',
      date: new Date().toISOString()
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
  return listings.filter(l => {
    const matchCat = activeCategory === 'all' || l.itemCategory === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      l.itemName.toLowerCase().includes(q) ||
      l.exchangeName.toLowerCase().includes(q) ||
      l.seller.toLowerCase().includes(q) ||
      (l.description && l.description.toLowerCase().includes(q));
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
    filtered.forEach((listing, i) => {
      const card = createCard(listing, i);
      grid.appendChild(card);
    });
  }

  listingCount.textContent = `${listings.length} annonce${listings.length !== 1 ? 's' : ''}`;
}

function createCard(listing, index) {
  const isRare = RARE_ITEMS.has(listing.itemId) || RARE_ITEMS.has(listing.exchangeId);
  const card = document.createElement('div');
  card.className = `item-card${isRare ? ' card-rare' : ''}`;
  card.style.animationDelay = `${index * 0.04}s`;

  const fallbackOffer    = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.itemName)}&background=1a2212&color=7ec84a&size=72`;
  const fallbackExchange = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.exchangeName)}&background=1a2212&color=e8a020&size=72`;

  card.innerHTML = `
    <div class="card-img-wrap">
      <span class="card-category-badge">${CAT_LABELS[listing.itemCategory] || listing.itemCategory}</span>
      <div class="card-trade-display">
        <div class="trade-side trade-offer">
          <img class="card-item-img" src="${listing.itemImage}" alt="${listing.itemName}" onerror="this.src='${fallbackOffer}'" />
          <span class="trade-qty">×${listing.qtyOffer}</span>
          <span class="trade-name">${escapeHtml(listing.itemName)}</span>
        </div>
        <div class="trade-arrow">⇄</div>
        <div class="trade-side trade-exchange">
          <img class="card-item-img" src="${listing.exchangeImage}" alt="${listing.exchangeName}" onerror="this.src='${fallbackExchange}'" />
          <span class="trade-qty">×${listing.qtyExchange}</span>
          <span class="trade-name">${escapeHtml(listing.exchangeName)}</span>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-seller">👤 ${escapeHtml(listing.seller)}</div>
      ${listing.description ? `<div class="card-desc">${escapeHtml(listing.description)}</div>` : ''}
    </div>
    <div class="card-footer">
      <span class="card-date">${timeAgo(listing.date)}</span>
      <button class="card-del-btn" data-id="${listing.id}" title="Supprimer">🗑 Supprimer</button>
    </div>
  `;

  card.querySelector('.card-del-btn').addEventListener('click', () => deleteListing(listing.id));
  return card;
}

// ───────────────────────────────────────────
// DELETE
// ───────────────────────────────────────────
function deleteListing(id) {
  listings = listings.filter(l => l.id !== id);
  saveListings();
  renderCatalogue();
  showToast('Annonce supprimée.');
}

// ───────────────────────────────────────────
// MODAL
// ───────────────────────────────────────────
function openModal() {
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  itemSearchEl.focus();
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  resetForm();
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
});

// ───────────────────────────────────────────
// ITEM SELECTOR — OFFERT
// ───────────────────────────────────────────
itemSearchEl.addEventListener('input', () => {
  const q = itemSearchEl.value.trim().toLowerCase();
  if (!q) { itemDropdown.classList.add('hidden'); return; }
  const matches = MINECRAFT_ITEMS.filter(item =>
    item.name.toLowerCase().includes(q) || item.id.includes(q)
  ).slice(0, 12);
  renderDropdown(matches, itemDropdown, selectItem);
});

itemSearchEl.addEventListener('focus', () => {
  if (itemSearchEl.value.trim()) itemDropdown.classList.remove('hidden');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.item-selector')) {
    itemDropdown.classList.add('hidden');
    exchangeDropdown.classList.add('hidden');
  }
});

function selectItem(item) {
  selectedItem = item;
  selectedItemId.value = item.id;
  previewImg.src = item.image;
  previewImg.alt = item.name;
  previewName.textContent = item.name;
  selectedPreview.classList.remove('hidden');
  itemSearchEl.value = '';
  itemDropdown.classList.add('hidden');
  clearError();
}

clearItemBtn.addEventListener('click', () => {
  selectedItem = null;
  selectedItemId.value = '';
  selectedPreview.classList.add('hidden');
  itemSearchEl.value = '';
  itemSearchEl.focus();
});

// ───────────────────────────────────────────
// ITEM SELECTOR — ÉCHANGE
// ───────────────────────────────────────────
exchangeSearchEl.addEventListener('input', () => {
  const q = exchangeSearchEl.value.trim().toLowerCase();
  if (!q) { exchangeDropdown.classList.add('hidden'); return; }
  const matches = MINECRAFT_ITEMS.filter(item =>
    item.name.toLowerCase().includes(q) || item.id.includes(q)
  ).slice(0, 12);
  renderDropdown(matches, exchangeDropdown, selectExchange);
});

exchangeSearchEl.addEventListener('focus', () => {
  if (exchangeSearchEl.value.trim()) exchangeDropdown.classList.remove('hidden');
});

function selectExchange(item) {
  selectedExchange = item;
  selectedExchangeId.value = item.id;
  exchangePreviewImg.src = item.image;
  exchangePreviewImg.alt = item.name;
  exchangePreviewName.textContent = item.name;
  selectedExchangePreview.classList.remove('hidden');
  exchangeSearchEl.value = '';
  exchangeDropdown.classList.add('hidden');
  clearError();
}

clearExchangeBtn.addEventListener('click', () => {
  selectedExchange = null;
  selectedExchangeId.value = '';
  selectedExchangePreview.classList.add('hidden');
  exchangeSearchEl.value = '';
  exchangeSearchEl.focus();
});

// ───────────────────────────────────────────
// SHARED DROPDOWN RENDERER
// ───────────────────────────────────────────
function renderDropdown(items, dropdownEl, onSelect) {
  dropdownEl.innerHTML = '';
  if (items.length === 0) {
    dropdownEl.innerHTML = '<div class="dropdown-empty">Aucun item trouvé.</div>';
  } else {
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'dropdown-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src=''" />
        <span class="dropdown-item-name">${item.name}</span>
        <span class="dropdown-item-cat">${CAT_LABELS[item.category] || item.category}</span>
      `;
      row.addEventListener('click', () => onSelect(item));
      dropdownEl.appendChild(row);
    });
  }
  dropdownEl.classList.remove('hidden');
}

// ───────────────────────────────────────────
// FORM SUBMISSION
// ───────────────────────────────────────────
listingForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearError();

  if (!selectedItem) {
    showError('⚠ Veuillez sélectionner l\'item que vous offrez.');
    return;
  }
  if (!selectedExchange) {
    showError('⚠ Veuillez sélectionner l\'item demandé en échange.');
    return;
  }

  const qtyOffer    = parseInt(qtyOfferInput.value, 10);
  const qtyExchange = parseInt(qtyExchangeInput.value, 10);
  const seller      = sellerInput.value.trim();
  const desc        = descInput.value.trim();

  if (!qtyOffer || qtyOffer < 1 || qtyOffer > 2304) {
    showError('⚠ La quantité offerte doit être entre 1 et 2304.');
    return;
  }
  if (!qtyExchange || qtyExchange < 1 || qtyExchange > 2304) {
    showError('⚠ La quantité demandée doit être entre 1 et 2304.');
    return;
  }
  if (!seller || seller.length < 2) {
    showError('⚠ Le pseudo vendeur doit faire au moins 2 caractères.');
    return;
  }

  const listing = {
    id: genId(),
    itemId: selectedItem.id,
    itemName: selectedItem.name,
    itemImage: selectedItem.image,
    itemCategory: selectedItem.category,
    qtyOffer,
    exchangeId: selectedExchange.id,
    exchangeName: selectedExchange.name,
    exchangeImage: selectedExchange.image,
    exchangeCategory: selectedExchange.category,
    qtyExchange,
    seller,
    description: desc,
    date: new Date().toISOString()
  };

  listings.unshift(listing);
  saveListings();
  renderCatalogue();

  submitBtn.disabled = true;
  submitBtn.textContent = '📡 Envoi Discord...';
  await sendDiscordWebhook(DEFAULT_WEBHOOK, listing);
  submitBtn.disabled = false;
  submitBtn.textContent = "📢 Publier l'annonce";

  closeModal();
  showToast(`✅ Annonce publiée !\n${listing.qtyOffer}× ${listing.itemName} ⇄ ${listing.qtyExchange}× ${listing.exchangeName}`);
});

// ───────────────────────────────────────────
// DISCORD WEBHOOK
// ───────────────────────────────────────────
async function sendDiscordWebhook(webhookUrl, listing) {
  const payload = {
    username: 'CraftMarket',
    avatar_url: 'https://minecraft.wiki/images/Grass_Block_JE7_BE6.png',
    embeds: [{
      title: `🔄 Échange : ${listing.qtyOffer}× ${listing.itemName} ⇄ ${listing.qtyExchange}× ${listing.exchangeName}`,
      color: 0x5a9e2f,
      thumbnail: { url: listing.itemImage },
      fields: [
        { name: '📦 Offre',    value: `**${listing.qtyOffer}× ${listing.itemName}**`,     inline: true },
        { name: '🔄 Contre',   value: `**${listing.qtyExchange}× ${listing.exchangeName}**`, inline: true },
        { name: '👤 Vendeur',  value: `\`${listing.seller}\``,                             inline: true },
        ...(listing.description ? [{ name: '📝 Description', value: listing.description, inline: false }] : [])
      ],
      footer: { text: 'CraftMarket • Minecraft Marketplace' },
      timestamp: listing.date
    }]
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn('Discord webhook failed:', res.status);
      showToast('⚠ Discord webhook : erreur ' + res.status, true);
    } else {
      showToast('📣 Message envoyé sur Discord !');
    }
  } catch (err) {
    console.error('Discord webhook error:', err);
    showToast("⚠ Impossible d'envoyer sur Discord.", true);
  }
}

// ───────────────────────────────────────────
// RESET FORM
// ───────────────────────────────────────────
function resetForm() {
  selectedItem = null;
  selectedExchange = null;
  selectedItemId.value = '';
  selectedExchangeId.value = '';
  itemSearchEl.value = '';
  exchangeSearchEl.value = '';
  qtyOfferInput.value = '1';
  qtyExchangeInput.value = '1';
  sellerInput.value = '';
  descInput.value = '';
  selectedPreview.classList.add('hidden');
  selectedExchangePreview.classList.add('hidden');
  itemDropdown.classList.add('hidden');
  exchangeDropdown.classList.add('hidden');
  clearError();
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
