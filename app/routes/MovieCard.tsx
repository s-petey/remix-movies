import { Link } from '@remix-run/react';
import { placeholderImageUrl } from './_placeholderImage';
import { MoviesData } from './loader.server';

export function MovieCard({ movie }: { movie: MoviesData[number] }) {
  return (
    <Link
      className="w-[150px] md:w-[200px] lg:w-[275px] rounded-lg gap-2 border flex flex-col bg-neutral-200"
      to={`/movies/${movie.id}`}
      prefetch="intent"
    >
      <div className="border-b border-cyan-600 h-20 py-2 text-center content-center overflow-auto bg-slate-100">
        <h3 className="text-xl font-bold">{movie.title}</h3>
      </div>

      <div className="flex flex-col flex-grow bg-neutral-200">
        <div className="h-full m-auto rounded-lg overflow-hidden content-center">
          <img
            key={movie.id}
            src={movie.thumbnail || placeholderImageUrl}
            alt="movie poster"
            className={'transition-opacity h-full w-full' + movie.thumbnail !== null ? 'object-cover' : 'object-fill'}
          />
        </div>
        <div className="text-center border-t border-cyan-600 bg-slate-100">{movie.year}</div>
      </div>
    </Link>
  );
}
