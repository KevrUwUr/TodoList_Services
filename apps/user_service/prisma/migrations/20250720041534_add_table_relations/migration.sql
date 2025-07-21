-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role_cache`(`role_id`) ON DELETE SET NULL ON UPDATE CASCADE;
