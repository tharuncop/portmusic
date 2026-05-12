/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,platform]` on the table `UserPlatform` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "hashedPassword" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPlatform_userId_platform_key" ON "UserPlatform"("userId", "platform");
