import { useState, useCallback } from "react";

export function useFavorites() {
    const load = () => {
        // Si JSON mal formatté, on a le catch
        try {
            return JSON.parse(localStorage.getItem("fav_movies") || "[]");
        }
        catch { return []; }
    };
    const [favs, setFavs] = useState(load);
    const toggle = useCallback((movie) => {
        setFavs(prev => {
        const exists = prev.some(m => m.id === movie.id);
        const next = exists ?
            // Retire le favori
            prev.filter(m => m.id !== movie.id)
            // Sinon l'ajoute
            : [{ id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date }, ...prev];
        // On met à jour le localStorage
        localStorage.setItem("fav_movies", JSON.stringify(next));
        return next;
    });
    }, []);
    // isFav : utilisé pour l'état du bouton ❤ dans MovieDetailsView
    // useCallback + dépendance [favs] → se recalcule quand favs change
    const isFav = useCallback((id) => favs.some(m => m.id === id), [favs]);
    return { favs, toggle, isFav };
}