-- DropIndex
DROP INDEX `user_sessions_token_key` ON `user_sessions`;

-- AlterTable
ALTER TABLE `user_sessions` MODIFY `token` TEXT NOT NULL;
