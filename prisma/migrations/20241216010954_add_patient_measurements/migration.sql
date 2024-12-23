/*
  Warnings:

  - Added the required column `height` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN "analysis" TEXT;
ALTER TABLE "Image" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "patientid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseaddress" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" REAL NOT NULL,
    "fatPercentage" REAL,
    "age" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "practitionerid" INTEGER,
    CONSTRAINT "Patient_practitionerid_fkey" FOREIGN KEY ("practitionerid") REFERENCES "Practitioner" ("practitionerid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("age", "baseaddress", "name", "patientid", "practitionerid", "sex", "weight", "height", "fatPercentage") 
SELECT "age", "baseaddress", "name", "patientid", "practitionerid", "sex", "weight", 170.0, NULL FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
