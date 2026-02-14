/*
  Warnings:

  - The values [RETURNED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [STAFF] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `postalCode` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtPurchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the column `altText` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('UNPAID', 'PAID', 'FAILED');
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CUSTOMER', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_couponId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_productId_fkey";

-- DropIndex
DROP INDEX "products_categoryId_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "postalCode",
DROP COLUMN "state";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "variantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "priceAtPurchase",
DROP COLUMN "variantId",
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "billingAddress",
DROP COLUMN "couponId",
DROP COLUMN "notes",
DROP COLUMN "shipping",
DROP COLUMN "subtotal",
DROP COLUMN "tax",
DROP COLUMN "trackingNumber";

-- AlterTable
ALTER TABLE "otp" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "altText",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "dimensions",
DROP COLUMN "isActive",
DROP COLUMN "isFeatured",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "summary",
DROP COLUMN "weight",
ADD COLUMN     "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "bio",
DROP COLUMN "dateOfBirth",
DROP COLUMN "gender";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "title",
ALTER COLUMN "rating" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isPhoneVerified",
DROP COLUMN "lastLogin",
DROP COLUMN "twoFactorEnabled";

-- DropTable
DROP TABLE "coupons";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "product_variants";

-- DropEnum
DROP TYPE "DiscountType";

-- CreateTable
CREATE TABLE "specifications" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isFilterable" BOOLEAN NOT NULL DEFAULT true,
    "productId" TEXT NOT NULL,

    CONSTRAINT "specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bannerImage" TEXT,
    "authorName" TEXT DEFAULT 'Admin',
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "blogPostId" TEXT NOT NULL,

    CONSTRAINT "blog_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_productId_key" ON "blog_posts"("productId");

-- AddForeignKey
ALTER TABLE "specifications" ADD CONSTRAINT "specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
