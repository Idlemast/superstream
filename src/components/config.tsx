// Lit la clé depuis localStorage à chaque appel
const getKey = () => localStorage.getItem("tmdb_key") || "";

// URL pour l'API
export const TMDB = "https://api.themoviedb.org/3";
// URL pour les images
export const IMG = "https://image.tmdb.org/t/p";
// Chaque provider génère une URL embed à partir de l'id TMDB du film. Si un provider ne charge pas,
// l'utilisateur peut en essayer un autre depuis le player
export const PROVIDERS = [
    { label: "VidSrc", url: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
    { label: "SuperEmbed", url: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { label: "Embed.su",   url: (id: number) => `https://embed.su/embed/movie/${id}` },
];

// Fonction générique pour tous les appels TMDB
// - vérifie la clé avant d'envoyer la requête
// - construit l'URL avec les params
// - lève une erreur si la réponse n'est pas ok (401, 404, etc)
export const tmdb = async (endpoint: string, params: Record<string, string> = {}) => {
    const key = getKey();
    if (!key) throw new Error("Clé TMDB manquante");
    const url = new URL(`${TMDB}${endpoint}`);
    url.searchParams.set("api_key", key);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
};