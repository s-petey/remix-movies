import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';

export const loader: LoaderFunction = async ({ params: { id } }) => {
  if (typeof id !== 'string') {
    return new Response(null, { status: 404 });
  }

  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    return new Response(null, { status: 404 });
  }

  const movie = await db.movies.findFirst({
    where: { id: movieId },
    include: {
      MovieCast: true,
      MovieGenres: true,
    },
  });

  if (movie === null) {
    return new Response(null, { status: 404 });
  }

  return json({ movie });
};

export default function Movie() {
  const { movie } = useLoaderData<typeof loader>();

  return (
    <>
      <pre>{JSON.stringify(movie, undefined, 2)}</pre>
    </>
  );
}
