import { useState, useEffect } from "react"
import { tmdb, IMG } from "./Config"
import MovieCard from "./MovieCard";

export default function ActorDetailsView({ actorId, onBack, onSelectMovie }) {
  const [actor, setActor] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActor(null);
    Promise.all([
      tmdb(`/person/${actorId}`, { language: "fr-FR" }),
      tmdb(`/person/${actorId}/movie_credits`, { language: "fr-FR" }),
    ]).then(([p, c]) => {
      setActor(p);
      setCredits(c.cast?.sort((a, b) => b.popularity - a.popularity).slice(0, 18) || []);
    }).finally(() => setLoading(false));
  }, [actorId]);

  if (loading) return (
    <div className="max-w-7xl my-0 mx-auto py-10 px-6">
      <div className="rounded-lg h-80" />
    </div>
  );
  if (!actor) return null;

  const photo = actor.profile_path ? `${IMG}/w342${actor.profile_path}` : null;
  const bio = actor.biography || "";
  const cutBio = bio.slice(0, 420);

  return (
    <div className="fade-up max-w-6xl mx-auto px-6 py-10 pb-16">
      <button className="btn mb-8 px-5 py-2 rounded-full text-sm bg-neutral-900 border-2 border-solid border-gray-800 text-white" onClick={onBack}>
        ← Retour
      </button>

      {/* Bio */}
      <div className="flex gap-8 items-start flex-wrap mb-12">
        {photo && (
          <div
            className="shrink-0 w-48 rounded-xl overflow-hidden shadow-2xl shadow-black">
            <img src={photo} alt={actor.name} className="w-full block" />
          </div>
        )}
        <div className="flex-1 min-w-60">
          <h1 className="serif leading-tight mb-4 text-2xl">
            {actor.name}
          </h1>
          <div className="flex gap-7 mb-5 flex-wrap">
            {actor.birthday && (
              <div>
                <p className="text-xs tracking-wide uppercase mb-0.5 text-zinc-500">
                  Naissance
                </p>
                <p className="text-sm">
                  {new Date(actor.birthday).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            )}
            {actor.place_of_birth && (
              <div>
                <p className="text-xs tracking-wide uppercase mb-0.5 text-zinc-500">Lieu</p>
                <p className="text-sm">{actor.place_of_birth}</p>
              </div>
            )}
          </div>

          {bio && (
            <>
              <p className="text-sm leading-relaxed text-zinc-500">
                {expanded ? bio : cutBio}{!expanded && bio.length > 420 && "…"}
              </p>
              {bio.length > 420 && (
                <button
                  className="btn text-sm mt-2 bg-none text-orange-300" onClick={() => setExpanded(v => !v)}>
                  {expanded ? "Voir moins" : "Lire la suite"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filmographie */}
      {credits.length > 0 && (
        <>
          <h2 className="serif text-xl mb-5 text-orange-300">
            Filmographie
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}>
            {credits.map(m => (
              <MovieCard key={m.id} movie={m} onClick={onSelectMovie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}