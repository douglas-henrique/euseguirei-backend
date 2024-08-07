-- CreateTable
CREATE TABLE "Liturgy" (
    "id" SERIAL NOT NULL,
    "firstReading" TEXT,
    "psalm" TEXT,
    "gospel" TEXT,

    CONSTRAINT "Liturgy_pkey" PRIMARY KEY ("id")
);
