import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import { isValidUrl } from '~/utils/isValidUrl';
import { placeholderImageUrl } from './_placeholderImage';

export const loader = async ({ params: { id } }: LoaderFunctionArgs) => {
  if (typeof id !== 'string') {
    throw new Response(null, { status: 404 });
  }

  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    throw new Response(null, { status: 404 });
  }

  const movie = await db.movies.findFirst({
    where: { id: movieId },
    include: {
      MovieCast: {
        select: {
          CastMembers: true,
        },
      },
      MovieGenres: {
        select: {
          Genres: true,
        },
      },
    },
  });

  if (movie === null) {
    throw new Response(null, { status: 404 });
  }

  return json({ movie });
};

export default function Movie() {
  const { movie } = useLoaderData<typeof loader>();

  const validUrl = isValidUrl(movie.href);

  return (
    <>
      <title>{movie.title}</title>
      <meta name="description" content={movie.extract ?? ''} />

      <div className="flex">
        <div className="mr-5 w-[270px] h-[400px] bg-slate-50">
          <img
            key={movie.id}
            src={movie.thumbnail || placeholderImageUrl}
            alt="movie poster"
            className={'transition-opacity h-full w-full' + movie.thumbnail !== null ? 'object-cover' : 'object-fill'}
            // style={{
            //   objectFit: movie.thumbnail ? 'cover' : 'fill',
            //   transition: 'opacity 300ms ease-in-out',
            //   width: '100%',
            //   height: '100%',
            // }}
          />
        </div>
        <div className="flex  flex-col flex-1 gap-2">
          <h1 className="text-3xl">
            {movie.title} ({movie.year})
          </h1>

          {/* TODO: Make into carousel with buttons to cycle through if it gets long enough */}
          <div className="flex flex-row">
            {/* TODO: make into links */}
            {movie.MovieGenres.map((genre) => (
              <p key={genre.Genres.id}>{genre.Genres.name}</p>
            ))}
          </div>

          <p>{movie.extract}</p>

          {movie.MovieCast.length > 0 && (
            <section>
              <h2 className="text-2xl">Featuring:</h2>
              <div className="grid grid-flow-col gap-4 justify-start">
                {movie.MovieCast.map((cast) => (
                  <p key={cast.CastMembers.id}>{cast.CastMembers.name} </p>
                ))}
              </div>
            </section>
          )}

          {validUrl.success && (
            <a target="_blank" rel="noreferrer" href={validUrl.url.href}>
              {validUrl.url.href}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
