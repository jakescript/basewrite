-- CreateTable
CREATE TABLE "contribution" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ipfsUri" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contribution_pkey" PRIMARY KEY ("id")
);
