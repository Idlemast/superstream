import { useState, useCallback } from "react";
import SearchView from "./components/SearchView"
import MovieDetailView from "./components/MovieDetails"
import ActorDetailView from "./components/ActorDetails"
import StreamingView from "./components/Streaming"
import { useFavorites } from "./components/favorites";
import Navbar from "./components/Navbar";

export default function App() {
  const [stack, setStack] = useState([{ view: "search" }]);
  const [keyVersion, setKeyVersion] = useState(0);
  const { favs, toggle, isFav } = useFavorites();
  const current = stack[stack.length - 1];

  const push = useCallback((view, payload = {}) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStack(s => [...s, { view, payload }]);
  }, []);

  const pop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  }, []);

  const handleKeyChange = useCallback(() => {
    setStack([{ view: "search" }]);
    setKeyVersion(v => v + 1); // remont SearchView → relance le fetch trending
  }, []);

  return (
    <>
      <Navbar onHome={() => setStack([{ view: "search" }])} onKeyChange={handleKeyChange} />

      {current.view === "search" && (
        <SearchView
          key={keyVersion}
          onSelectMovie={m => push("movie", { movieId: m.id })}
          onSelectActor={p => push("actor", { personId: p.id })}
          favs={favs}
          onSelectFav={m => push("movie", { movieId: m.id })}
        />
      )}
      {current.view === "movie" && (
        <MovieDetailView
          movieId={current.payload.movieId}
          onBack={pop}
          onSelectActor={p => push("actor", { personId: p.id })}
          onSelectMovie={m => push("movie", { movieId: m.id })}
          onStream={m => push("stream", { movie: m })}
          onToggleFav={toggle}
          isFav={isFav}
        />
      )}
      {current.view === "actor" && (
        <ActorDetailView
          personId={current.payload.personId}
          onBack={pop}
          onSelectMovie={m => push("movie", { movieId: m.id })}
        />
      )}
      {current.view === "stream" && (
        <StreamingView
          movie={current.payload.movie}
          onBack={pop}
          onDetail={m => push("movie", { movieId: m.id })}
        />
      )}
    </>
  );
}
