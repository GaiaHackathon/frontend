/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `starrating` on the `Practitioner` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Image";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Patient";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Rating";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Practitioner" (
    "practitionerid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseaddress" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Practitioner" ("baseaddress", "name", "practitionerid") SELECT "baseaddress", "name", "practitionerid" FROM "Practitioner";
DROP TABLE "Practitioner";
ALTER TABLE "new_Practitioner" RENAME TO "Practitioner";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
