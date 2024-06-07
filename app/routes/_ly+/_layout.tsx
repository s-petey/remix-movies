import { Link, Outlet } from '@remix-run/react';

export default function Layout() {
  return (
    <>
      <header className="flex flex-row justify-evenly">
        <h1 className="text-3xl font-bold underline text-center">
          <Link to="/">Movies app!</Link>
        </h1>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Link
            to="/movies"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Movies
          </Link>
          <Link
            to="/movies/search"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Search
          </Link>
        </div>
      </header>

      <Outlet />
    </>
  );
}
