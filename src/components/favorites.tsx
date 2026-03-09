import { useState, useCallback } from "react";

export function useFavorites() {
    const load = () => {
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
            prev.filter(m => m.id !== movie.id)
            : [{ id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date }, ...prev];
        localStorage.setItem("fav_movies", JSON.stringify(next));
        return next;
    });
    }, []);
    const isFav = useCallback((id) => favs.some(m => m.id === id), [favs]);
    return { favs, toggle, isFav };
}