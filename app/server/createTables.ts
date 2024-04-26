// eslint-disable-next-line import/no-unresolved
import { Database } from 'bun:sqlite';
import { VITE_DATABASE_URL } from './url';

const sql = `
-- SQL script to create tables for movie database

-- Table for Movies
CREATE TABLE Movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    href TEXT,
    extract TEXT,
    thumbnail TEXT,
    thumbnailWidth INTEGER,
    thumbnailHeight INTEGER
);

-- Table for cast members
CREATE TABLE CastMembers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Linking table for Movies and cast members
CREATE TABLE MovieCast (
    movieId INTEGER,
    castId INTEGER,
    FOREIGN KEY (movieId) REFERENCES Movies(id),
    FOREIGN KEY (castId) REFERENCES CastMembers(id),
    PRIMARY KEY (movieId, castId)
);

-- Table for Genres
CREATE TABLE Genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Linking table for Movies and Genres
CREATE TABLE MovieGenres (
    movieId INTEGER,
    genreId INTEGER,
    FOREIGN KEY (movieId) REFERENCES Movies(id),
    FOREIGN KEY (genreId) REFERENCES Genres(id),
    PRIMARY KEY (movieId, genreId)
);`;

async function makeTables() {
  // console.log(__dirname);
  const { pathname } = Bun.pathToFileURL(VITE_DATABASE_URL);
  console.log(pathname);
  const db = new Database(pathname);

  try {
    await db.run('SELECT * FROM Movies');
    console.log('Tables exist');
  } catch (error) {
    console.time('Creating Tables');
    await db.run(sql);
    console.timeEnd('Creating Tables');
  }
}

makeTables().catch((e) => {
  console.error(e);
  process.exit(1);
});
