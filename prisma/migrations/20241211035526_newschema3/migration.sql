-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "ratingid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientid" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "practitionerid" INTEGER NOT NULL
);
INSERT INTO "new_Rating" ("patientid", "practitionerid", "rating", "ratingid") SELECT "patientid", "practitionerid", "rating", "ratingid" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
