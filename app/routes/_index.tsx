import { SerializeFrom, json, redirect, type MetaFunction } from '@remix-run/node';
import { ClientLoaderFunctionArgs, Form, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import { placeholderImageUrl } from './_placeholderImage';

export const meta: MetaFunction = () => {
  return [{ title: 'Movie App' }, { name: 'description', content: 'Showing off the power of remix with a movie app!' }];
};

let moviesCache: null | Awaited<ReturnType<typeof getRandomMovies>> = null;

async function getRandomMovies() {
  const allIds = await db.movies.findMany({
    select: {
      id: true,
    },
    where: {
      thumbnail: {
        not: '',
      },
    },
  });

  const movieCount = 10;

  allIds.sort(() => Math.random() - 0.5);
  const randomIds = allIds.slice(0, movieCount).map((movie) => movie.id);

  const movies = await db.movies.findMany({
    where: {
      id: {
        in: randomIds,
      },
    },
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
  });

  return movies;
}

export const loader = async () => {
  const movies = await getRandomMovies();

  return json({ movies });
};

export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  if (moviesCache !== null) {
    return json({ movies: moviesCache });
  }

  const { movies } = await serverLoader<typeof loader>();

  moviesCache = movies;

  return json({ movies });
};

clientLoader.hydrate = true;

export const action = async () => {
  return redirect('/');
};

export default function Index() {
  const { movies } = useLoaderData<typeof loader>();

  return (
    <div>
      <Form method="post" className="flex justify-center my-4">
        <button className="p-2 bg-teal-200 text-slate-600 rounded" type="submit">
          Randomize!
        </button>
      </Form>

      <div className="flex flex-wrap gap-2 p-4 justify-evenly">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function MovieCard({ movie }: { movie: SerializeFrom<typeof loader>['movies'][number] }) {
  return (
    <a
      className="w-[150px] md:w-[200px] lg:w-[275px] rounded-lg gap-2 border flex flex-col bg-neutral-200"
      href={`/movies/${movie.id}`}
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
    </a>
  );
}
