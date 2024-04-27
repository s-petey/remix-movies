import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';

export const loader: LoaderFunction = async () => {
  // if (typeof movieId !== 'string') {
  //   return json({}, 404);
  // }

  // const id = parseInt(movieId);

  // if (isNaN(id)) {
  //   return json({}, 404);
  // }

  const movies = await db.movies.findMany({
    // where: { id },
    // include: {
    //   MovieCast: true,
    //   MovieGenres: true,
    // },
    take: 10,
  });
  return json({ movies });
};

export default function Movies() {
  const { movies } = useLoaderData<typeof loader>();

  return (
    <>
      <pre>{JSON.stringify(movies, undefined, 2)}</pre>
    </>
  );
}
