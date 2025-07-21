/*
  Warnings:

  - You are about to drop the column `permissions` on the `role_cache` table. All the data in the column will be lost.
  - You are about to drop the column `synced_at` on the `role_cache` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `role_cache` DROP COLUMN `permissions`,
    DROP COLUMN `synced_at`;

-- AlterTable
ALTER TABLE `user_profiles` DROP COLUMN `avatar_url`;
