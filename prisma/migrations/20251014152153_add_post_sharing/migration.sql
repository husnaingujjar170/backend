-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "post_shares" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_shares_postId_userId_key" ON "post_shares"("postId", "userId");

-- AddForeignKey
ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
