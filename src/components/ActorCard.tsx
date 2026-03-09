import { IMG } from "./config"

export default function ActorCard({ actor, onClick }) {
  const photo = actor.profile_path ? `${IMG}/w185${actor.profile_path}` : null;
  return (
  <div className="hoverable rounded-xl text-center p-4 cursor-pointer bg-neutral-900 border-2 border-solid border-neutral-900" onClick={() => onClick(actor)}>
    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2.5 border-2 border-solid border-orange-300 bg-zinc-900">
      {photo
        ? <img src={photo} alt={actor.name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
      }
    </div>
    <p className="text-sm text-white font-medium mb-0.5">{actor.name}</p>
    <p className="text-xs text-zinc-500">
      { actor.character }
    </p>
  </div>
);
}