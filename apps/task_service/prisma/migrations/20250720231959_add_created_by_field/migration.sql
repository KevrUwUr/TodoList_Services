/*
  Warnings:

  - Added the required column `created_by` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `created_by` INTEGER NOT NULL;
