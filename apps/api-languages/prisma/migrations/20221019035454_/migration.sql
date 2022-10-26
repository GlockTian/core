/*
  Warnings:

  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryContinentTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryNameTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountrySlugTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LanguagesInCountries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CountryContinentTranslation" DROP CONSTRAINT "CountryContinentTranslation_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CountryNameTranslation" DROP CONSTRAINT "CountryNameTranslation_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CountrySlugTranslation" DROP CONSTRAINT "CountrySlugTranslation_countryId_fkey";

-- DropForeignKey
ALTER TABLE "LanguagesInCountries" DROP CONSTRAINT "LanguagesInCountries_countryId_fkey";

-- DropForeignKey
ALTER TABLE "LanguagesInCountries" DROP CONSTRAINT "LanguagesInCountries_languageId_fkey";

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "CountryContinentTranslation";

-- DropTable
DROP TABLE "CountryNameTranslation";

-- DropTable
DROP TABLE "CountrySlugTranslation";

-- DropTable
DROP TABLE "LanguagesInCountries";
