/*
  Warnings:

  - You are about to drop the column `languageIds` on the `Country` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Country" DROP COLUMN "languageIds";

-- CreateTable
CREATE TABLE "LanguagesInCountries" (
    "languageId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "LanguagesInCountries_pkey" PRIMARY KEY ("languageId","countryId")
);

-- AddForeignKey
ALTER TABLE "LanguagesInCountries" ADD CONSTRAINT "LanguagesInCountries_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguagesInCountries" ADD CONSTRAINT "LanguagesInCountries_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
