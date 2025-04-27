/*
  Warnings:

  - You are about to drop the `contribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "contribution";

-- CreateTable
CREATE TABLE "Contribution" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ipfsUri" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);
