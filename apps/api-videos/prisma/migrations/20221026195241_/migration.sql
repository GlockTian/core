-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('episode', 'standalone', 'playlist');

-- CreateEnum
CREATE TYPE "VideoVariantDownloadQuality" AS ENUM ('low', 'high');

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "type" "VideoType" NOT NULL,
    "primaryLanguageId" TEXT NOT NULL,
    "image" TEXT,
    "variantLanguageIds" TEXT[],
    "noIndex" BOOLEAN NOT NULL,
    "episodeIds" TEXT[],
    "playlistId" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoTitleTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoTitleTranslation_pkey" PRIMARY KEY ("languageId","videoId")
);

-- CreateTable
CREATE TABLE "VideoSeoTitleTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoSeoTitleTranslation_pkey" PRIMARY KEY ("languageId","videoId")
);

-- CreateTable
CREATE TABLE "VideoSnippetTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoSnippetTranslation_pkey" PRIMARY KEY ("languageId","videoId")
);

-- CreateTable
CREATE TABLE "VideoDescriptionTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoDescriptionTranslation_pkey" PRIMARY KEY ("languageId","videoId")
);

-- CreateTable
CREATE TABLE "VideoStudyQuestionTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "VideoStudyQuestionTranslation_pkey" PRIMARY KEY ("languageId","videoId","position")
);

-- CreateTable
CREATE TABLE "VideoImageAltTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoImageAltTranslation_pkey" PRIMARY KEY ("languageId","videoId")
);

-- CreateTable
CREATE TABLE "VideoSlugTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoSlugTranslation_pkey" PRIMARY KEY ("languageId","videoId","value")
);

-- CreateTable
CREATE TABLE "VideoTag" (
    "videoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "VideoTag_pkey" PRIMARY KEY ("videoId","tagId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagTitleTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TagTitleTranslation_pkey" PRIMARY KEY ("tagId","languageId")
);

-- CreateTable
CREATE TABLE "VideoVariant" (
    "id" TEXT NOT NULL,
    "hls" TEXT,
    "duration" INTEGER NOT NULL,
    "languageId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "VideoVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoVariantSubtitleTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "videoVariantId" TEXT NOT NULL,

    CONSTRAINT "VideoVariantSubtitleTranslation_pkey" PRIMARY KEY ("languageId","videoVariantId")
);

-- CreateTable
CREATE TABLE "VideoVariantDownload" (
    "quality" "VideoVariantDownloadQuality" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "videoVariantId" TEXT NOT NULL,

    CONSTRAINT "VideoVariantDownload_pkey" PRIMARY KEY ("videoVariantId","quality")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoSlugTranslation_value_key" ON "VideoSlugTranslation"("value");

-- AddForeignKey
ALTER TABLE "VideoTitleTranslation" ADD CONSTRAINT "VideoTitleTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSeoTitleTranslation" ADD CONSTRAINT "VideoSeoTitleTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSnippetTranslation" ADD CONSTRAINT "VideoSnippetTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoDescriptionTranslation" ADD CONSTRAINT "VideoDescriptionTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoStudyQuestionTranslation" ADD CONSTRAINT "VideoStudyQuestionTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoImageAltTranslation" ADD CONSTRAINT "VideoImageAltTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSlugTranslation" ADD CONSTRAINT "VideoSlugTranslation_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTag" ADD CONSTRAINT "VideoTag_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTag" ADD CONSTRAINT "VideoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTitleTranslation" ADD CONSTRAINT "TagTitleTranslation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoVariant" ADD CONSTRAINT "VideoVariant_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoVariantSubtitleTranslation" ADD CONSTRAINT "VideoVariantSubtitleTranslation_videoVariantId_fkey" FOREIGN KEY ("videoVariantId") REFERENCES "VideoVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoVariantDownload" ADD CONSTRAINT "VideoVariantDownload_videoVariantId_fkey" FOREIGN KEY ("videoVariantId") REFERENCES "VideoVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
