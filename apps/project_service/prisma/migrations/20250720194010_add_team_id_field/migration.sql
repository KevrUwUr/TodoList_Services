/*
  Warnings:

  - Added the required column `team_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `team_id` INTEGER NOT NULL;
