import { json, MetaFunction, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import { placeholderImageUrl } from '../_placeholderImage';
import { Chip } from '../Chip';

export const meta: MetaFunction = () => {
  return [{ title: 'Movies List' }];
};

export const loader = async () => {
  // TODO:
  // 1. Add pagination
  // 2. Add filtering (genre, actor, "q" - search)
  //   - If we are searching we need to remove the `thumbnail not` below

  const movieCount = 10;

  const movies = await db.movies.findMany({
    include: {
      MovieCast: {
        include: {
          CastMembers: true,
        },
      },
      MovieGenres: {
        include: {
          Genres: true,
        },
      },
    },
    take: movieCount,
    orderBy: {
      year: 'desc',
    },
  });
  return json({ movies });
};

export default function Movies() {
  const { movies } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-1">
      {movies.map((movie) => (
        <div key={movie.id} className="flex flex-col p-2">
          <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr] items-center gap-2">
            <div className="bg-slate-50 m-auto rounded-lg overflow-hidden">
              <img
                key={movie.id}
                src={movie.thumbnail || placeholderImageUrl}
                alt="movie poster"
                className={
                  'transition-opacity h-full w-full' + movie.thumbnail !== null ? 'object-cover' : 'object-fill'
                }
              />
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl font-bold">{movie.title}</h2>

              {movie.MovieGenres.length > 0 && (
                <div className="flex flex-row gap-2">
                  {movie.MovieGenres.map((genre) => (
                    // TODO: Make into links later?
                    <Chip className="text-sm italic" key={genre.movieId + genre.genreId}>
                      {genre.Genres.name}
                    </Chip>
                  ))}
                </div>
              )}

              <p className="flex-grow">{movie.extract}</p>

              {movie.MovieCast.length > 0 && (
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">Starring:</h3>

                  <div className="flex flex-row gap-2">
                    {movie.MovieCast.map((cast) => (
                      // TODO: Make into links later?
                      <Chip key={cast.movieId + cast.castId}>{cast.CastMembers.name}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
