/*
  Warnings:

  - The primary key for the `VideoVariantSubtitleTranslation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `position` on the `VideoVariantSubtitleTranslation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VideoVariantSubtitleTranslation" DROP CONSTRAINT "VideoVariantSubtitleTranslation_pkey",
DROP COLUMN "position",
ADD CONSTRAINT "VideoVariantSubtitleTranslation_pkey" PRIMARY KEY ("languageId", "videoVariantId");
