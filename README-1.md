# ⛏ CraftMarket — Minecraft Marketplace

Site web de marketplace pour items Minecraft avec webhook Discord.

---

## 📁 Structure du projet

```
minecraft-marketplace/
├── index.html      ← Page principale
├── style.css       ← Design pixel Minecraft
├── script.js       ← Logique (catalogue, formulaire, Discord)
├── items.json      ← 497 items Minecraft officiels (mcworldtools)
└── README.md       ← Ce fichier
```

---

## 🚀 Déploiement sur GitHub Pages (gratuit)

### Étape 1 — Créer un compte GitHub
1. Va sur **https://github.com**
2. Clique **Sign up** et crée ton compte (gratuit)

---

### Étape 2 — Créer un nouveau dépôt
1. Connecte-toi, clique le **+** en haut à droite → **New repository**
2. Remplis :
   - **Repository name** : `craftmarket` (ou ce que tu veux)
   - **Visibility** : ✅ **Public** (obligatoire pour GitHub Pages gratuit)
   - Ne coche rien d'autre
3. Clique **Create repository**

---

### Étape 3 — Uploader les fichiers

**Option A — Via l'interface web (plus simple) :**
1. Sur la page de ton dépôt vide, clique **uploading an existing file**
2. Glisse-dépose les 4 fichiers : `index.html`, `style.css`, `script.js`, `items.json`
3. En bas, écris un message comme `Initial commit` et clique **Commit changes**

**Option B — Via Git (terminal) :**
```bash
# Dans le dossier du projet
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/craftmarket.git
git push -u origin main
```

---

### Étape 4 — Activer GitHub Pages
1. Dans ton dépôt, clique **Settings** (onglet en haut)
2. Dans le menu gauche, clique **Pages**
3. Sous **Source**, sélectionne :
   - Branch : **main**
   - Folder : **/ (root)**
4. Clique **Save**
5. Attends 1-2 minutes ☕

---

### Étape 5 — Accéder au site
Ton site sera accessible à :
```
https://TON_USERNAME.github.io/craftmarket/
```

GitHub t'affiche l'URL exacte dans Settings → Pages dès qu'il est prêt.

---

## 🔔 Configurer le Webhook Discord

### Créer le webhook dans Discord :
1. Ouvre Discord, va dans le serveur de ton choix
2. Clique droit sur un salon texte → **Modifier le salon**
3. Onglet **Intégrations** → **Webhooks** → **Nouveau webhook**
4. Donne-lui un nom (ex: `CraftMarket`) et choisis le salon
5. Clique **Copier l'URL du webhook**

### L'utiliser dans CraftMarket :
- Quand tu crées une annonce sur le site, colle l'URL dans le champ **"Discord Webhook URL"**
- À chaque annonce publiée, un message embed apparaît automatiquement dans ton salon Discord avec :
  - 🖼 L'image de l'item
  - 💰 Le prix
  - 👤 Le vendeur
  - 📝 La description

> **⚠️ Note :** Le webhook est optionnel. L'annonce est publiée sur le site même sans webhook.

---

## 💾 Stockage des données

Les annonces sont sauvegardées dans le **LocalStorage** du navigateur. Cela signifie :
- ✅ Les annonces persistent après fermeture du navigateur
- ✅ Aucun serveur/base de données nécessaire
- ⚠️ Les annonces sont locales à chaque visiteur (chaque personne voit ses propres annonces)

> Pour un vrai marketplace partagé entre plusieurs joueurs, il faudrait ajouter un backend (Firebase, Supabase...).

---

## 🎮 Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| 📦 Catalogue | Grille responsive de cartes items |
| 🔍 Recherche | Filtrage en temps réel par nom/vendeur/description |
| 🏷 Filtres | Par catégorie (armes, outils, armure, ressources, blocs, nourriture, divers) |
| ➕ Ajout annonce | Formulaire avec dropdown de 497 items officiels |
| 🛡 Anti-fake | Impossible de créer un item non officiel |
| 🖼 Images | Chargées depuis mcworldtools.com (CDN officiel) |
| 🔔 Discord | Webhook automatique à chaque nouvelle annonce |
| 💾 Persistance | LocalStorage (pas de backend requis) |
| ✨ Effets rares | Shimmer animé sur les items rares (Nether Star, Dragon Egg...) |
| 📱 Responsive | Compatible mobile et PC |

---

## 🛠 Modifier les items

Le fichier `items.json` contient 497 items. Chaque entrée a la structure :
```json
{
  "id": "diamond_sword",
  "name": "Diamond Sword",
  "category": "weapons",
  "image": "https://www.mcworldtools.com/textures/rendered/diamond_sword.png"
}
```

**Catégories disponibles :** `weapons`, `tools`, `armor`, `resources`, `blocks`, `food`, `misc`

Pour ajouter un item, copie une entrée existante, change l'`id`, le `name`, la `category` et l'`image`.

---

## 📦 Technologies utilisées

- **HTML5 / CSS3 / JavaScript Vanilla** — aucune dépendance
- **Google Fonts** — Press Start 2P + VT323 (style Minecraft)
- **mcworldtools.com** — CDN des images d'items Minecraft
- **Discord Webhooks API** — notifications Discord
- **LocalStorage** — persistance des annonces

---

*CraftMarket — Fait avec ❤ pour la communauté Minecraft*
