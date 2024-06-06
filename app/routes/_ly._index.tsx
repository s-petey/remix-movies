import { redirect, type MetaFunction } from '@remix-run/node';
import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, Form, json, useLoaderData } from '@remix-run/react';
import { MovieCard } from '~/utils/components/MovieCard';
import { MoviesData, getRandomMovies } from '~/utils/randomMovies';

export const loader = async () => {
  const movies = await getRandomMovies();

  return json({ movies });
};

export type IndexLoader = { movies: MoviesData };
export const meta: MetaFunction = () => {
  return [{ title: 'Movie App' }, { name: 'description', content: 'Showing off the power of remix with a movie app!' }];
};

let moviesCache: null | MoviesData = null;

export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  if (moviesCache !== null) {
    return json({ movies: moviesCache });
  }

  const { movies } = await serverLoader<IndexLoader>();
  moviesCache = movies;

  return json({ movies });
};

clientLoader.hydrate = true;

export const action = () => {
  return redirect('/');
};

export const clientAction = async ({ serverAction }: ClientActionFunctionArgs) => {
  moviesCache = null;
  return await serverAction();
};

export default function Index() {
  const { movies } = useLoaderData<IndexLoader>();

  return (
    <div>
      <Form method="post" className="flex justify-center my-4 gap-2">
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
