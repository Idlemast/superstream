import { useState, useCallback } from "react";
import SearchView from "./components/Search"
import MovieDetailView from "./components/MovieDetails"
import ActorDetailView from "./components/ActorDetails"
import StreamingView from "./components/Streaming"
import { useFavorites } from "./components/Favorites";
import Navbar from "./components/Navbar";

export default function App() {
  // Navigation par pile, au lieu de React Router, on empile les vues comme un historique manuel current = dernière vue affichée
  const [stack, setStack] = useState([{ view: "search" }]);
  // Change quand la clé TMDB change = force SearchView à recharger via la prop key={keyVersion}, ce qui relance le fetch des tendances
  const [keyVersion, setKeyVersion] = useState(0);
  // Hook centralisé pour les favoris : favs, toggle, isFav
  // Défini une seule fois ici et passé en props aux vues qui en ont besoin
  const { favs, toggle, isFav } = useFavorites();
  // Toujours lire le dernier élément de la stack = vue active
  const current = stack[stack.length - 1];

  // Ajoute une vue à la stack + scroll en haut
  // useCallback pour éviter de recréer la fonction à chaque render
  const push = useCallback((view, payload = {}) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStack(s => [...s, { view, payload }]);
  }, []);

  // Retire la vue courante → retourne à la précédente
  // Si on est déjà à la racine, on ne fait rien (length > 1)
  const pop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  }, []);
  // Appelé par Navbar quand on change la clé TMDB
  // Remet la stack à zéro + incrémente keyVersion pour forcer les fetch
  const handleKeyChange = useCallback(() => {
    setStack([{ view: "search" }]);
    setKeyVersion(v => v + 1); // remont SearchView → relance le fetch trending
  }, []);

  return (
    <>
      <Navbar
        // clic logo = retour accueil
        onHome={() => setStack([{ view: "search" }])}
        onKeyChange={handleKeyChange}
      />

      {/* Rendu conditionnel selon current.view */}
      {current.view === "search" && (
        <SearchView
          key={keyVersion}
          onSelectMovie={m => push("movie", { movieId: m.id })}
          onSelectActor={a => push("actor", { actorId: a.id })}
          // liste des favoris
          favs={favs}
          onSelectFav={m => push("movie", { movieId: m.id })}
        />
      )}
      {current.view === "movie" && (
        <MovieDetailView
          movieId={current.payload.movieId}
          onBack={pop}
          onSelectActor={a => push("actor", { actorId: a.id })}
          onSelectMovie={m => push("movie", { movieId: m.id })}
          // bouton "Regarder"
          onStream={m => push("stream", { movie: m })}
          // ajoute ou retire des favoris
          onToggleFav={toggle}
          // fonction qui retourne un boolean pour un id
          isFav={isFav}
        />
      )}
      {current.view === "actor" && (
        <ActorDetailView
          actorId={current.payload.actorId}
          onBack={pop}
          // vers ActorDetails
          onSelectMovie={m => push("movie", { movieId: m.id })}
        />
      )}
      {current.view === "stream" && (
        <StreamingView
          movie={current.payload.movie}
          onBack={pop}
          // vers MovieDetails
          onDetail={m => push("movie", { movieId: m.id })}
        />
      )}
    </>
  );
}
