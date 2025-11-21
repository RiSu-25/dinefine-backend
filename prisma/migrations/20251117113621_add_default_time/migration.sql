-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "message" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "time" TEXT NOT NULL DEFAULT '00:00',
ALTER COLUMN "email" DROP NOT NULL;
