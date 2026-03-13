import { useState, useRef, useCallback, useEffect } from "react"
import { tmdb } from "./Config"
import MovieCard from "./MovieCard";
import ActorCard from "./ActorCard";

// 3 états possibles :
// Barre vide = affiche favoris (si existants) + tendances TMDB
// Barre remplie, tab Films = résultats MovieCard
// Barre remplie, tab Acteurs = résultats ActorCard

export default function SearchView({ onSelectMovie, onSelectActor, favs, onSelectFav }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("movie");
    const [trending, setTrending] = useState([]);
    // Pour éviter de spam l'API
    const timer = useRef(null);

    // Fetch des tendances
    // Le catch évite un crash si la clé est absente au démarrage
    useEffect(() => {
        tmdb("/trending/movie/week", { language: "fr-FR" })
        .then(d => setTrending(d.results || []))
        .catch(() => {});
    }, []);

    // Délai de 350ms : attend que l'utilisateur arrête de taper avant d'envoyer la requête = évite de spam l'API
    const search = useCallback((q, type) => {
        clearTimeout(timer.current);
        if (!q.trim()) { setResults([]); return; }
        timer.current = setTimeout(async () => {
        setLoading(true);
        try {
            const data = await tmdb(type === "actor"
                ? "/search/person"
                : "/search/movie", { query: q, language: "fr-FR" });
            setResults(data.results || []);
        } catch { setResults([]); }
        finally { setLoading(false); }
        }, 350);
    }, []);

    // Se déclenche à chaque changement de query ou de tab
    useEffect(() => { search(query, tab); }, [query, tab, search]);

    // Détermine si la barre est vide = contrôle l'affichage tendances vs résultats
    const empty = !query.trim();

    return (
        <div className="max-w-7xl my-0 mx-auto py-10 px-6">
            {/* Barre de recherche avec toggle Films/Acteurs */}
            <div className="max-w-lg my-0 mx-auto mb-4 flex border-2 border-solid border-gray-800 rounded-xl overflow-hidden bg-neutral-900">
            {["movie", "actor"].map(t => (
                <button key={t} onClick={() => setTab(t)} className={`btn py-3 px-5 text-sm font-medium whitespace-nowrap ${tab == t ? "bg-orange-300 text-black" : "bg-transparent text-zinc-500"}`}>
                    {t === "movie" ? "🎬 Films" : "👤 Acteurs"}
                </button>
                ))}
                <input className="flex-px bg-transparent border-none outline-none text-stone-200 py-3 px-5 text-base"
                    value={query} placeholder={tab === "movie" ? "Rechercher un film..." : "Rechercher un acteur..."}
                    onChange={e => setQuery(e.target.value)} />
                    {loading && <span className="py-3 px-4 text-zinc-500 text-sm">⟳</span>}
            </div>

            {/* Section favoris, visible uniquement si barre vide ET favoris existants */}
            {favs.length > 0 && empty && (
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-sm tracking-wide uppercase">❤ Mes favoris</span>
                    <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="gap-4 grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}>
                    {favs.map(m => <MovieCard key={m.id} movie={m} onClick={onSelectFav} />)}
                </div>
            </div>
            )}

            {empty ? (
                // Barre vide = tendances TMDB de la semaine
                <>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-xs tracking-widest uppercase">
                            Tendances
                        </span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>
                    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}>
                        {trending.slice(0, 12).map(m => (
                            <MovieCard key={m.id} movie={m} onClick={onSelectMovie} />
                        ))}
                    </div>
                </>
            ) : (
                // Barre remplie = résultats de recherche
                <>
                    <p className="text-sm mb-5 text-zinc-500">
                        {results.length} résultat{results.length !== 1 ? "s" : ""} pour « {query} »
                    </p>
                    {
                        tab === "movie"
                        ? <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}>
                            {results.map(m => (
                                <MovieCard key={m.id} movie={m} onClick={onSelectMovie} />
                            ))}
                        </div>
                        : <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}>
                            {results.map(p => (
                                <ActorCard key={p.id} actor={p} onClick={onSelectActor} />
                            ))}
                        </div>
                    }

                    {!loading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
                        <span className="text-5xl">🔍</span>
                        <p className="text-sm">Aucun résultat trouvé</p>
                        </div>
                    )}
                    </>
                )}
        </div>
    );
}