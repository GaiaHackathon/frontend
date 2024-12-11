-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "ratingid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientid" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "practitionerid" INTEGER NOT NULL,
    CONSTRAINT "Rating_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "Patient" ("patientid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_practitionerid_fkey" FOREIGN KEY ("practitionerid") REFERENCES "Practitioner" ("practitionerid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("patientid", "practitionerid", "rating", "ratingid") SELECT "patientid", "practitionerid", "rating", "ratingid" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
