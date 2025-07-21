/*
  Warnings:

  - You are about to drop the column `new_value` on the `task_history` table. All the data in the column will be lost.
  - You are about to drop the column `old_value` on the `task_history` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_to` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `task_history` DROP COLUMN `new_value`,
    DROP COLUMN `old_value`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `assigned_to`,
    DROP COLUMN `created_by`;
