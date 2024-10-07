-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('in_progress', 'completed', 'canceled') NOT NULL;
