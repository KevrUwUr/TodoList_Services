/*
  Warnings:

  - You are about to alter the column `status` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `user_profiles` MODIFY `status` INTEGER NOT NULL DEFAULT 1;
