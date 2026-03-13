import { useState, useEffect } from "react"
import { tmdb, IMG } from "./Config"
import MovieCard from "./MovieCard";
import ActorCard from "./ActorCard";

// Vue détail d'un film. Va chercher 3 addresses :
// infos film + casting + films similaires

export default function MovieDetailView({ movieId, onBack, onSelectActor, onSelectMovie, onStream, onToggleFav, isFav }) {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset au changement de movieId, évite d'afficher les données
    // du film précédent pendant le chargement du nouveau
    setLoading(true);
    setMovie(null);
    Promise.all([
      tmdb(`/movie/${movieId}`, { language: "fr-FR" }),
      tmdb(`/movie/${movieId}/credits`, { language: "fr-FR" }),
      tmdb(`/movie/${movieId}/similar`, { language: "fr-FR" }),
    ]).then(([m, c, s]) => {
      setMovie(m);
      // on limite à 12 acteurs
      setCast(c.cast?.slice(0, 12) || []);
      // et 6 films similaires
      setSimilar(s.results?.slice(0, 6) || []);
    }).finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return (
    <div className="max-w-7xl mt-0 mx-auto py-10 px-6">
      <div className="h-96 rounded-lg" />
    </div>
  );
  if (!movie) return null;

  const backdrop = movie.backdrop_path ? `${IMG}/original${movie.backdrop_path}` : null;
  const poster = movie.poster_path   ? `${IMG}/w342${movie.poster_path}` : null;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min` : null;
  const genres = movie.genres?.map(g => g.name).join(", ");

  return (
    <>
      {/* Backdrop */}
      <div className="relative overflow-hidden" style={{height: "clamp(280px,45vw,500px)"}}>
        {backdrop && (
          <img className="w-full h-full object-cover" src={backdrop} />
        )}
        <div className="absolute inset-0 bg-linear-30" />
        <button className="btn absolute top-6 left-6 px-5 py-2 rounded-full text-sm backdrop-blur-sm bg-black border-2 bg-solid border-gray-800 text-white" onClick={onBack}>
          ← Retour
        </button>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 -mt-25">
        <div className="flex gap-8 items-start flex-wrap">

          {/* Poster */}
          {poster && (
            <div
              className="shrink-0 w-44 rounded-xl overflow-hidden border-2 border-solid border-gray-800 shadow-2xl shadow-black mr-4">
              <img src={poster} alt={movie.title} className="w-full block" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-60 bg-white p-4 rounded-lg">
            {genres && (
              <p className="text-xs tracking-widest uppercase mb-2.5 text-zinc-500">
                {genres}{runtime && ` · ${runtime}`}
              </p>
            )}
            <h1 className="serif leading-tight mb-2" style={{ fontSize: "clamp(22px, 4vw, 42px)" }}>
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="serif italic text-sm mb-3.5 text-zinc-500">
                "{movie.tagline}"
              </p>
            )}
            <p className="text-sm leading-relaxed mb-6 max-w-xl text-zinc-500">
              {movie.overview || "Aucune description disponible."}
            </p>

            <div className="flex gap-3 items-center flex-wrap">
              <button
                className="btn inline-flex items-center gap-2.5 px-8 py-3 rounded-lg text-sm font-semibold bg-orange-300 text-black" onClick={() => onStream(movie)}>
                ▶ Regarder le film
              </button>
              <button
                className={`btn inline-flex items-center gap-2 px-5 py-3 rounded-lg text-lg transition-all duration-200 border-2 border-solid ${isFav(movie.id) ? "bg-orange-300 border-orange-300 text-white" : "bg-transparent border-gray-800 text-zinc-500"}`} title={isFav(movie.id) ? "Retirer des favoris" : "Ajouter aux favoris"} onClick={() => onToggleFav(movie)}>
                {isFav(movie.id) ? "❤" : "♡"}
                <span className="text-sm font-medium">
                  {isFav(movie.id) ? "Favori" : "Ajouter"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="serif text-xl mb-5 text-orange-300">Distribution</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))" }}>
              {cast.map(a => <ActorCard key={a.id} actor={a} onClick={onSelectActor} />)}
            </div>
          </div>
        )}

        {/* Films similaires */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="serif text-xl mb-5 text-orange-300">Films similaires</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}>
              {similar.map(m => <MovieCard key={m.id} movie={m} onClick={onSelectMovie} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}