-- CreateTable
CREATE TABLE "Patient" (
    "patientid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseaddress" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "practitionerid" INTEGER,
    CONSTRAINT "Patient_practitionerid_fkey" FOREIGN KEY ("practitionerid") REFERENCES "Practitioner" ("practitionerid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "imageid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beforeImageCid" TEXT NOT NULL,
    "afterImageCid" TEXT,
    "afterImageUploaded" BOOLEAN NOT NULL DEFAULT false,
    "patientid" INTEGER NOT NULL,
    CONSTRAINT "Image_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "Patient" ("patientid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Practitioner" (
    "practitionerid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseaddress" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rating" (
    "ratingid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientid" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "practitionerid" INTEGER NOT NULL,
    CONSTRAINT "Rating_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "Patient" ("patientid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_practitionerid_fkey" FOREIGN KEY ("practitionerid") REFERENCES "Practitioner" ("practitionerid") ON DELETE RESTRICT ON UPDATE CASCADE
);
