const getKey = () => localStorage.getItem("tmdb_key") || "";

export const TMDB = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";
export const PROVIDERS = [
    { label: "VidSrc", url: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
    { label: "SuperEmbed", url: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { label: "Embed.su",   url: (id: number) => `https://embed.su/embed/movie/${id}` },
];

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