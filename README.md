# 🎬 SuperStream

> Application de streaming React + TypeScript + Tailwind CSS propulsée par l'API TMDB.
> Recherche de films, exploration les fiches détaillées, découvertes d'acteurs et lecture directement depuis l'interface.

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration TMDB](#-configuration-tmdb)
- [Lancer le projet](#-lancer-le-projet)
- [Architecture](#-architecture)
- [Composants](#-composants)
- [Navigation](#-navigation)
- [Favoris](#-favoris)
- [Providers de streaming](#-providers-de-streaming)
- [Bugs connus](#-bugs-connus)

---

## 👀 Aperçu

SuperStream est une SPA (Single Page Application) qui permet de :

- **Rechercher** des films et des acteurs via l'API TMDB
- **Explorer** les fiches détaillées de chaque film (synopsis, casting, films similaires)
- **Découvrir** la biographie et la filmographie des acteurs
- **Regarder** les films via un player iframe multi-providers
- **Sauvegarder** ses films favoris en localStorage

---

## ✨ Fonctionnalités

| Fonctionnalité  | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| 🔍 Recherche    | Barre de recherche avec switch Films / Acteurs                           |
| 📈 Tendances    | Films tendances de la semaine TMDB affichés sur l'accueil                |
| 🎬 Fiche film   | Poster, genres, durée, synopsis, tagline, casting, films similaires      |
| 👤 Fiche acteur | Photo, biographie expandable, date/lieu de naissance, filmographie triée |
| ▶ Player        | iFrame embarqué avec providers switchables, mode cinéma, plein écran     |
| ❤ Favoris       | Ajout/retrait depuis la fiche film, section dédiée sur l'accueil         |
| 🔑 Clé TMDB     | Saisie inline depuis la Navbar, stockée en localStorage                  |

---

## 🛠 Stack technique

| Outil                                        | Version | Rôle                            |
| -------------------------------------------- | ------- | ------------------------------- |
| [React](https://react.dev)                   | 18+     | UI et gestion du state          |
| [TypeScript](https://www.typescriptlang.org) | 5+      | Typage statique                 |
| [Tailwind CSS](https://tailwindcss.com)      | 3+      | Styling utilitaire              |
| [Vite](https://vitejs.dev)                   | 5+      | Bundler et serveur de dev       |
| [TMDB API](https://developer.themoviedb.org) | v3      | Source de données films/acteurs |

> Aucune librairie de routing (React Router), aucun state manager externe (Redux, Zustand).
> La navigation est gérée manuellement via une stack `useState` dans `App.tsx`.

---

## 📁 Structure du projet

```
superstream/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ActorCard.tsx        # Carte acteur (photo, nom, rôle)
│   │   ├── ActorDetails.tsx     # Page détail acteur
│   │   ├── Favorites.tsx        # Hook useFavorites (localStorage)
│   │   ├── MovieCard.tsx        # Carte film (affiche, titre, année)
│   │   ├── MovieDetails.tsx     # Page détail film
│   │   ├── Navbar.tsx           # Barre de navigation + saisie clé TMDB
│   │   ├── Search.tsx           # Accueil, recherche, tendances, favoris
│   │   └── Streaming.tsx        # Player iframe multi-providers
│   ├── config.tsx               # Clé TMDB, fetch helper, providers
│   ├── App.tsx                  # Racine : navigation stack + distribution des props
│   ├── main.tsx                 # Point d'entrée React
│   └── index.css                # Styles globaux (Tailwind + classes custom)
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📦 Installation

### Prérequis

- **Node.js** 18 ou supérieur → [télécharger](https://nodejs.org)
- **npm** 9+ (inclus avec Node) ou **pnpm** / **yarn**

Vérifier les versions installées :

```bash
node -v         # v25.6.1 ou supérieur
npm -v          # 11.11.0 ou supérieur
```

### 1. Cloner le projet

```bash
git clone https://github.com/Idlemast/superstream.git
cd superstream
```

### 2. Installer les dépendances

```bash
npm install
```

---

## 🔑 Configuration TMDB

L'application nécessite une clé API TMDB gratuite pour fonctionner.

### Obtenir une clé TMDB

1. Créer un compte sur [themoviedb.org](https://www.themoviedb.org/signup)
2. Aller dans **Paramètres du compte → API**
3. Cliquer sur **Créer → Application développeur**
4. Remplir le formulaire (usage personnel suffit)
5. Copier la **clé API (v3 auth)**

### Renseigner la clé dans l'application

La clé **ne se configure pas dans un fichier `.env`** — elle se saisit directement dans l'interface :

1. Lancer l'application (voir section suivante)
2. Cliquer sur le bouton **"🔑 Entrer la clé TMDB"** dans la Navbar
3. Coller la clé et valider avec **OK** ou **Entrée**
4. La clé est sauvegardée en `localStorage` — elle persiste entre les sessions

> Pour changer la clé, cliquer sur **"🔑 Changer la clé"** dans la Navbar.

---

## 🚀 Lancer le projet

### Mode développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173)

Vite active le **Hot Module Replacement** — les modifications sont reflétées instantanément sans recharger la page.

## 🏗 Architecture

### Navigation par stack

L'application n'utilise pas React Router. La navigation est gérée par une **stack de vues** dans `App.tsx` :

```
stack = [
  { view: "search" },                           ← accueil (toujours en bas)
  { view: "movie", payload: { movieId: 550 } },
  { view: "actor", payload: { personId: 287 } } ← current = dernier élément
]
```

- **`push(view, payload)`** — ajoute une vue (navigation avant)
- **`pop()`** — retire la vue courante (bouton Retour)
- Le rendu conditionnel `current.view === "xxx"` détermine ce qui s'affiche

### Flux de données

```
App.tsx
  ├── useFavorites()          → favs, toggle, isFav
  ├── push() / pop()          → navigation
  │
  ├── SearchView              ← favs, onSelectMovie, onSelectActor
  ├── MovieDetailView         ← movieId, onStream, onToggleFav, isFav, onSelectMovie
  ├── ActorDetailView         ← personId, onSelectMovie
  └── StreamingView           ← movie, onDetail
```

Tous les callbacks de navigation sont définis **une seule fois dans App.tsx** et passés en props, les composants enfants ne savent pas qu'une stack existe.

### Fetch TMDB

Tous les appels API passent par la fonction `tmdb()` dans `config.tsx` :

```
SearchView     → /trending/movie/week
               → /search/movie | /search/person

MovieDetailView → /movie/{id}
                → /movie/{id}/credits
                → /movie/{id}/similar    (Promise.all = parallèle)

ActorDetailView → /person/{id}
                → /person/{id}/movie_credits  (Promise.all = parallèle)
```

---

## 🧩 Composants

### `App.tsx`

Point d'entrée. Gère la navigation stack et distribue les props aux vues. Instancie `useFavorites` une seule fois.

### `Navbar.tsx`

Barre sticky. Contient le logo (retour accueil) et le formulaire inline de saisie de clé TMDB. Appelle `onKeyChange` lors de la sauvegarde pour forcer le rechargement des données.

### `SearchView.tsx`

Vue principale / accueil. Trois états :

- **Barre vide** → section Favoris (si existants) + Tendances TMDB
- **Barre remplie, onglet Films** → résultats `MovieCard`
- **Barre remplie, onglet Acteurs** → résultats `ActorCard`

### `MovieCard.tsx`

Carte réutilisable pour un film. Gère le fallback d'image (`onError`). Utilisée dans SearchView, MovieDetailsView, ActorDetailsView.

### `ActorCard.tsx`

Carte pour un acteur. Photo de profil circulaire, nom, rôle. Utilisée dans MovieDetailView (distribution) et SearchView.

### `MovieDetails.tsx`

Fiche film complète. Fetche en parallèle les infos, le casting et les films similaires. Contient les boutons **▶ Regarder** et **❤ Favori**.

### `ActorDetails.tsx`

Fiche acteur. Biographie avec expand/collapse à 420 caractères. Filmographie triée par popularité.

### `Streaming.tsx`

Player iframe. Gère le switch de provider, le mode cinéma (layout plein écran) et le plein écran natif via `requestFullscreen()`.

### `favorites.tsx`

Hook `useFavorites`. Lit/écrit dans `localStorage["fav_movies"]`. Expose `favs`, `toggle(movie)`, `isFav(id)`.

### `config.tsx`

Configuration globale. Exporte `tmdb()`, `IMG`, `TMDB`, `PROVIDERS`. La clé API est lue dynamiquement depuis `localStorage` à chaque appel.

---

## 🗺 Navigation

| Action                          | Résultat                                         |
| ------------------------------- | ------------------------------------------------ |
| Clic sur un film (SearchView)   | `push("movie", { movieId })`                     |
| Clic sur un acteur (SearchView) | `push("actor", { actorId })`                     |
| Clic ▶ Regarder (Stream)        | `push("stream", { movie })`                      |
| Clic sur un acteur du casting   | `push("actor", { actorId })`                     |
| Clic sur un film similaire      | `push("movie", { movieId })`                     |
| Clic ℹ Détails (StreamingView)  | `push("movie", { movieId })`                     |
| Clic ← Retour                   | `pop()`                                          |
| Clic logo Navbar                | `setStack([{ view: "search" }])` — reset complet |

---

## ❤ Favoris

Les favoris sont stockés dans `localStorage` sous la clé `fav_movies`.

Seuls les champs nécessaires à l'affichage d'une `MovieCard` sont persistés :

```json
[
  {
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "release_date": "1999-10-15"
  }
]
```

- **Ajouter** : bouton ❤ sur la fiche film = le film apparaît en tête de liste
- **Retirer** : re-cliquer sur ❤ sur la fiche film
- **Voir** : section "❤ Mes favoris" sur l'accueil (visible uniquement si la barre de recherche est vide)

---

## 📺 Providers de streaming

Le player supporte queqlues providers tiers. Si un film ne charge pas sur l'un, essayer les suivants :

| Provider   | URL pattern                                    |
| ---------- | ---------------------------------------------- |
| VidSrc     | `https://vidsrc.to/embed/movie/{id}`           |
| SuperEmbed | `https://multiembed.mov/?video_id={id}&tmdb=1` |
| Embed.su   | `https://embed.su/embed/movie/{id}`            |

> ⚠️ SuperStream n'héberge aucune vidéo juste des iframes
