/*
  Warnings:

  - You are about to drop the column `slug` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subTotal` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE 'STAFF';

-- DropIndex
DROP INDEX "blog_posts_slug_key";

-- DropIndex
DROP INDEX "categories_slug_key";

-- DropIndex
DROP INDEX "products_slug_idx";

-- DropIndex
DROP INDEX "products_slug_key";

-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "deliveryCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "estimatedDays" INTEGER,
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "subTotal" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "orders_transactionId_key" ON "orders"("transactionId");
