/*
  Warnings:

  - The primary key for the `VideoVariantSubtitleTranslation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "VideoVariantSubtitleTranslation" DROP CONSTRAINT "VideoVariantSubtitleTranslation_pkey",
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "VideoVariantSubtitleTranslation_pkey" PRIMARY KEY ("languageId", "videoVariantId", "position");
