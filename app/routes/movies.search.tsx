import { CastMembers, Genres, Movies } from '@prisma/client';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, MetaFunction, json, useLoaderData, useSearchParams } from '@remix-run/react';
import { useDeferredValue, useEffect, useState } from 'react';
import { db } from '~/db.server';
import { Chip } from '~/utils/components/Chip';
import { placeholderImageUrl } from '~/utils/components/placeholderImage';

export const meta: MetaFunction<typeof loader> = ({ location }) => {
  const search = new URLSearchParams(location.search);
  const q = search.get('q');
  return [{ title: 'Movies - ' + q }];
};

type MovieItem = Movies & {
  cast: CastMembers[];
  genres: Genres[];
};

type LoaderHelpersData = {
  movies: MovieItem[];
  pages: number;
};

const movieCount = 10;

async function getNewestMovies(page: number): Promise<LoaderHelpersData> {
  const skipPage = page === 0 ? 0 : page - 1;

  const movies = await db.movies.findMany({
    select: {
      id: true,
      href: true,
      extract: true,
      MovieCast: {
        select: {
          CastMembers: true,
        },
      },
      MovieGenres: {
        select: { Genres: true },
      },
      thumbnail: true,
      thumbnailHeight: true,
      thumbnailWidth: true,
      title: true,
      year: true,
    },
    take: movieCount,
    orderBy: {
      year: 'desc',
    },
    skip: skipPage * movieCount,
  });

  const allCount = await db.movies.count();

  return {
    movies: movies.map((movie) => {
      return {
        ...movie,
        cast: movie.MovieCast.map((mc) => mc.CastMembers),
        genres: movie.MovieGenres.map((mg) => mg.Genres),
      };
    }),
    pages: Math.ceil(allCount / movieCount),
  };
}

let prevSearch = '';

async function getMoviesSearched(q: string, page: number): Promise<LoaderHelpersData> {
  const skipPage = page === 0 ? 0 : page - 1;

  const movies = await db.movies.findMany({
    where: {
      title: {
        contains: q,
      },
    },
    take: movieCount,
    orderBy: {
      year: 'desc',
    },
    skip: skipPage * movieCount,
    select: {
      id: true,
      href: true,
      extract: true,
      MovieCast: {
        select: {
          CastMembers: true,
        },
      },
      MovieGenres: {
        select: { Genres: true },
      },
      thumbnail: true,
      thumbnailHeight: true,
      thumbnailWidth: true,
      title: true,
      year: true,
    },
  });

  const allCount = await db.movies.count({
    where: {
      title: {
        contains: q,
      },
    },
  });

  return {
    movies: movies.map((movie) => {
      return {
        ...movie,
        cast: movie.MovieCast.map((mc) => mc.CastMembers),
        genres: movie.MovieGenres.map((mg) => mg.Genres),
      };
    }),
    pages: Math.ceil(allCount / movieCount),
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const q = searchParams.get('q');
  const maybePage = parseInt(searchParams.get('page') ?? 'NaN');
  const page = !isNaN(maybePage) ? maybePage : 0;

  if (q === null) {
    const { movies, pages } = await getNewestMovies(page);

    return json({ movies, pages });
  }

  if (q !== prevSearch) {
    prevSearch = q;
    searchParams.set('page', '1');

    throw redirect(url.toString());
  }

  if (q.length === 0) {
    const data: LoaderHelpersData = { movies: [], pages: 0 };
    return json(data);
  }

  const { movies, pages } = await getMoviesSearched(q, page);
  // TODO:
  // 1. Add pagination ✅
  // 2. Add filtering (genre, actor, "q" - search) ✅
  // 3. add loading ?
  // 4. add better image loading
  // 5. add better default no records message -- Not applicable
  //   - If we are searching we need to remove the `thumbnail not` below

  return json({ movies, pages });
};

export default function SearchMovies() {
  const { movies, pages } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    return searchParams.get('q') ?? '';
  });
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    if (deferredValue !== '') {
      const currentParams = Array.from(searchParams.entries()).reduce((prev, [k, v]) => {
        return { ...prev, [k]: v };
      }, {});
      setSearchParams({ ...currentParams, q: deferredValue });
    }
  }, [deferredValue, searchParams, setSearchParams]);

  const { currentParams, currentPage } = getMovieParams(searchParams);

  const disableBack = currentPage === 1;

  return (
    <div className="flex flex-col m-4">
      <div className="flex justify-evenly">
        <h1 className="text-3xl font-bold underline text-center">
          <Link to="/">Movies app!</Link>
        </h1>

        <input
          className="rounded"
          placeholder="search"
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />

        <div className="flex gap-1">
          <button
            disabled={disableBack}
            onClick={() => {
              return setSearchParams({
                ...currentParams,
                page: '1',
              });
            }}
            className={
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' +
              (disableBack
                ? ' disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed'
                : '')
            }
          >
            {'<<-'}
          </button>

          <button
            disabled={disableBack}
            onClick={() => {
              setSearchParams({ ...currentParams, page: (currentPage > 0 ? currentPage - 1 : 0).toString() });
            }}
            className={
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' +
              (disableBack
                ? ' disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed'
                : '')
            }
          >
            {'<-'}
          </button>

          <button
            disabled={movies.length < 10}
            onClick={() => {
              setSearchParams({ ...currentParams, page: (currentPage + 1).toString() });
            }}
            className={
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' +
              (movies.length < 10
                ? ' disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed'
                : '')
            }
          >
            {'->'}
          </button>

          <button
            disabled={movies.length < 10}
            onClick={() => {
              setSearchParams({ ...currentParams, page: pages.toString() });
            }}
            className={
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' +
              (movies.length < 10
                ? ' disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed'
                : '')
            }
          >
            {'->>'}
          </button>
        </div>
      </div>

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

                {movie.genres.length > 0 && (
                  <div className="flex flex-row gap-2">
                    {movie.genres.map((genre) => (
                      // TODO: Make into links later?
                      <Chip className="text-sm italic" key={movie.id + genre.id}>
                        {genre.name}
                      </Chip>
                    ))}
                  </div>
                )}

                <p className="flex-grow">{movie.extract}</p>

                {movie.cast.length > 0 && (
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">Starring:</h3>

                    <div className="flex flex-row gap-2 flex-wrap">
                      {movie.cast.map((cast) => (
                        // TODO: Make into links later?
                        <Chip key={movie.id + cast.id}>{cast.name}</Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function getMovieParams(searchParams: URLSearchParams) {
  const currentParams = Array.from(searchParams.entries()).reduce((prev, [k, v]) => {
    return { ...prev, [k]: v };
  }, {});
  const maybePage = 'page' in currentParams && typeof currentParams.page === 'string' ? currentParams.page : '1';
  const maybePageNumber = parseInt(maybePage);
  const currentPage = !isNaN(maybePageNumber) && maybePageNumber > 0 ? maybePageNumber : 0;
  return { currentParams, currentPage };
}
