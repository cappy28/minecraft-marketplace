/* ===========================
   CRAFTMARKET — script.js
   =========================== */

'use strict';

// ───────────────────────────────────────────
// MINECRAFT ITEMS (embedded directly for reliability)
// ───────────────────────────────────────────
// Items loaded dynamically from items.json
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

// Rare items that get special shimmer effect
const RARE_ITEMS = new Set(['nether_star', 'dragon_egg', 'enchanted_golden_apple', 'elytra', 'netherite_ingot', 'totem_of_undying']);

// Category labels
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
// STATE
// ───────────────────────────────────────────
let listings = [];
let activeCategory = 'all';
let searchQuery = '';
let selectedItem = null;
let toastTimer = null;

// ───────────────────────────────────────────
// DOM REFS
// ───────────────────────────────────────────
const grid          = document.getElementById('catalogue-grid');
const emptyState    = document.getElementById('empty-state');
const listingCount  = document.getElementById('listing-count');
const openModalBtn  = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn     = document.getElementById('cancel-btn');
const modalOverlay  = document.getElementById('modal-overlay');
const listingForm   = document.getElementById('listing-form');
const searchInput   = document.getElementById('search-input');
const filterTabs    = document.getElementById('filter-tabs');
const itemSearchEl  = document.getElementById('item-search');
const itemDropdown  = document.getElementById('item-dropdown');
const selectedPreview = document.getElementById('selected-item-preview');
const previewImg    = document.getElementById('preview-img');
const previewName   = document.getElementById('preview-name');
const clearItemBtn  = document.getElementById('clear-item-btn');
const selectedItemId = document.getElementById('selected-item-id');
const priceInput    = document.getElementById('price-input');
const sellerInput   = document.getElementById('seller-input');
const descInput     = document.getElementById('desc-input');
const webhookInput  = document.getElementById('webhook-input');
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
      itemId: 'diamond_sword',
      itemName: 'Diamond Sword',
      itemImage: 'https://minecraft.wiki/images/Diamond_Sword_JE2_BE2.png',
      itemCategory: 'weapons',
      price: 1500,
      seller: 'Notch',
      description: 'Sharpness V, Unbreaking III, Fire Aspect II — quasiment neuf !',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: genId(),
      itemId: 'netherite_ingot',
      itemName: 'Netherite Ingot',
      itemImage: 'https://minecraft.wiki/images/Netherite_Ingot_JE3_BE3.png',
      itemCategory: 'resources',
      price: 3200,
      seller: 'Herobrine',
      description: 'Stack de 4 disponibles. Prix négociable.',
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: genId(),
      itemId: 'elytra',
      itemName: 'Elytra',
      itemImage: 'https://minecraft.wiki/images/Elytra_JE3.png',
      itemCategory: 'armor',
      price: 8000,
      seller: 'Steve64',
      description: 'Mending + Unbreaking III. Une seule utilisation.',
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

function formatPrice(n) {
  return Number(n).toLocaleString('fr-FR');
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return 'À l\'instant';
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

// ───────────────────────────────────────────
// RENDER CATALOGUE
// ───────────────────────────────────────────
function getFilteredListings() {
  return listings.filter(l => {
    const matchCat  = activeCategory === 'all' || l.itemCategory === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      l.itemName.toLowerCase().includes(q) ||
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
  const isRare = RARE_ITEMS.has(listing.itemId);
  const card = document.createElement('div');
  card.className = `item-card${isRare ? ' card-rare' : ''}`;
  card.style.animationDelay = `${index * 0.04}s`;

  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.itemName)}&background=1a2212&color=7ec84a&size=72`;

  card.innerHTML = `
    <div class="card-img-wrap">
      <img
        class="card-item-img"
        src="${listing.itemImage}"
        alt="${listing.itemName}"
        onerror="this.src='${fallbackImg}'"
      />
      <span class="card-category-badge">${CAT_LABELS[listing.itemCategory] || listing.itemCategory}</span>
    </div>
    <div class="card-body">
      <div class="card-item-name">${listing.itemName}</div>
      <div class="card-price">💰 ${formatPrice(listing.price)} coins</div>
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
// ITEM SELECTOR DROPDOWN
// ───────────────────────────────────────────
itemSearchEl.addEventListener('input', () => {
  const q = itemSearchEl.value.trim().toLowerCase();
  if (q.length === 0) {
    itemDropdown.classList.add('hidden');
    return;
  }
  const matches = MINECRAFT_ITEMS.filter(item =>
    item.name.toLowerCase().includes(q) || item.id.includes(q)
  ).slice(0, 12);

  renderDropdown(matches);
});

itemSearchEl.addEventListener('focus', () => {
  if (itemSearchEl.value.trim()) {
    itemDropdown.classList.remove('hidden');
  }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.item-selector')) {
    itemDropdown.classList.add('hidden');
  }
});

function renderDropdown(items) {
  itemDropdown.innerHTML = '';
  if (items.length === 0) {
    itemDropdown.innerHTML = '<div class="dropdown-empty">Aucun item trouvé.</div>';
  } else {
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'dropdown-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src=''" />
        <span class="dropdown-item-name">${item.name}</span>
        <span class="dropdown-item-cat">${CAT_LABELS[item.category] || item.category}</span>
      `;
      row.addEventListener('click', () => selectItem(item));
      itemDropdown.appendChild(row);
    });
  }
  itemDropdown.classList.remove('hidden');
}

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
// FORM SUBMISSION
// ───────────────────────────────────────────
listingForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearError();

  // Validate
  if (!selectedItem) {
    showError('⚠ Veuillez sélectionner un item Minecraft valide.');
    return;
  }

  const price  = parseInt(priceInput.value, 10);
  const seller = sellerInput.value.trim();
  const desc   = descInput.value.trim();
  const webhook = webhookInput.value.trim();

  if (!price || price < 1 || price > 999999) {
    showError('⚠ Le prix doit être entre 1 et 999 999 coins.');
    return;
  }

  if (!seller || seller.length < 2) {
    showError('⚠ Le pseudo vendeur doit faire au moins 2 caractères.');
    return;
  }

  // Build listing
  const listing = {
    id: genId(),
    itemId: selectedItem.id,
    itemName: selectedItem.name,
    itemImage: selectedItem.image,
    itemCategory: selectedItem.category,
    price,
    seller,
    description: desc,
    date: new Date().toISOString()
  };

  // Add to list
  listings.unshift(listing);
  saveListings();
  renderCatalogue();

  // Discord webhook
  if (webhook) {
    submitBtn.disabled = true;
    submitBtn.textContent = '📡 Envoi Discord...';
    await sendDiscordWebhook(webhook, listing);
    submitBtn.disabled = false;
    submitBtn.textContent = '📢 Publier l\'annonce';
  }

  closeModal();
  showToast(`✅ Annonce publiée !\n${listing.itemName} — ${formatPrice(price)} coins`);
});

// ───────────────────────────────────────────
// DISCORD WEBHOOK
// ───────────────────────────────────────────
async function sendDiscordWebhook(webhookUrl, listing) {
  const payload = {
    username: 'CraftMarket',
    avatar_url: 'https://minecraft.wiki/images/Grass_Block_JE7_BE6.png',
    embeds: [{
      title: `🛒 Nouvelle annonce : ${listing.itemName}`,
      color: 0x5a9e2f,
      thumbnail: { url: listing.itemImage },
      fields: [
        { name: '💰 Prix',     value: `**${formatPrice(listing.price)} coins**`, inline: true },
        { name: '👤 Vendeur',  value: `\`${listing.seller}\``,                   inline: true },
        { name: '🏷 Catégorie', value: CAT_LABELS[listing.itemCategory] || listing.itemCategory, inline: true },
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
    showToast('⚠ Impossible d\'envoyer sur Discord.', true);
  }
}

// ───────────────────────────────────────────
// RESET FORM
// ───────────────────────────────────────────
function resetForm() {
  selectedItem = null;
  selectedItemId.value = '';
  itemSearchEl.value = '';
  priceInput.value = '';
  sellerInput.value = '';
  descInput.value = '';
  selectedPreview.classList.add('hidden');
  itemDropdown.classList.add('hidden');
  clearError();
}

// ───────────────────────────────────────────
// SEARCH
// ───────────────────────────────────────────
let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = searchInput.value.trim();
    renderCatalogue();
  }, 200);
});

// ───────────────────────────────────────────
// FILTER TABS
// ───────────────────────────────────────────
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
// ───────────────────────────────────────────
// BOOTSTRAP
// ───────────────────────────────────────────
loadItems().then(() => {
  loadListings();
  renderCatalogue();
});
