-- CreateTable
CREATE TABLE "reels" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "autorNombre" TEXT NOT NULL DEFAULT 'Alfa Digital',
    "autorAvatar" TEXT,
    "duracion" INTEGER,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reels_pkey" PRIMARY KEY ("id")
);
