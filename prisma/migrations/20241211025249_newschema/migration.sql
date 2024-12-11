-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "patientid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseaddress" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "practitionerid" INTEGER,
    CONSTRAINT "Patient_practitionerid_fkey" FOREIGN KEY ("practitionerid") REFERENCES "Practitioner" ("practitionerid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("baseaddress", "birthdate", "height", "name", "patientid", "practitionerid", "weight") SELECT "baseaddress", "birthdate", "height", "name", "patientid", "practitionerid", "weight" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
