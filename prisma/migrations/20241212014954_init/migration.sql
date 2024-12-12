-- CreateTable
CREATE TABLE "Patient" (
    "patientid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseaddress" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "practitionerid" INTEGER,
    CONSTRAINT "Patient_practitionerid_fkey" FOREIGN KEY ("practitionerid") REFERENCES "Practitioner" ("practitionerid") ON DELETE SET NULL ON UPDATE CASCADE
);
