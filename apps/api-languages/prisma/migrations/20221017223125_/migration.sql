-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "bcp47" TEXT,
    "iso3" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageNameTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "parentLanguageId" TEXT NOT NULL,

    CONSTRAINT "LanguageNameTranslation_pkey" PRIMARY KEY ("languageId","parentLanguageId")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "languageIds" TEXT[],
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryNameTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "CountryNameTranslation_pkey" PRIMARY KEY ("countryId","languageId")
);

-- CreateTable
CREATE TABLE "CountrySlugTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "CountrySlugTranslation_pkey" PRIMARY KEY ("countryId","languageId")
);

-- CreateTable
CREATE TABLE "CountryContinentTranslation" (
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "CountryContinentTranslation_pkey" PRIMARY KEY ("countryId","languageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_bcp47_key" ON "Language"("bcp47");

-- CreateIndex
CREATE UNIQUE INDEX "Language_iso3_key" ON "Language"("iso3");

-- AddForeignKey
ALTER TABLE "LanguageNameTranslation" ADD CONSTRAINT "LanguageNameTranslation_parentLanguageId_fkey" FOREIGN KEY ("parentLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryNameTranslation" ADD CONSTRAINT "CountryNameTranslation_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountrySlugTranslation" ADD CONSTRAINT "CountrySlugTranslation_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryContinentTranslation" ADD CONSTRAINT "CountryContinentTranslation_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
