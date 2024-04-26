-- CreateTable
CREATE TABLE "CastMembers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MovieCast" (
    "movieId" INTEGER NOT NULL,
    "castId" INTEGER NOT NULL,
    CONSTRAINT "MovieCast_castId_fkey" FOREIGN KEY ("castId") REFERENCES "CastMembers" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "MovieCast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "MovieGenres" (
    "movieId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    CONSTRAINT "MovieGenres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "MovieGenres_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "href" TEXT,
    "extract" TEXT,
    "thumbnail" TEXT,
    "thumbnailWidth" INTEGER,
    "thumbnailHeight" INTEGER
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_CastMembers_1" ON "CastMembers"("name");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Genres_1" ON "Genres"("name");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "MovieCast_movieId_castId_key" ON "MovieCast"("movieId", "castId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieGenres_movieId_genreId_key" ON "MovieGenres"("movieId", "genreId");
