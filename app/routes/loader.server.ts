import { json } from '@remix-run/react';
import { db } from '~/db.server';

export async function getRandomMovies() {
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

export type MoviesData = Awaited<ReturnType<typeof getRandomMovies>>;
export type IndexLoader = { movies: MoviesData };
