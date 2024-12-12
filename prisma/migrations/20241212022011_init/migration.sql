-- CreateTable
CREATE TABLE "Image" (
    "imageid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beforeImageCid" TEXT NOT NULL,
    "afterImageCid" TEXT,
    "afterImageUploaded" BOOLEAN NOT NULL DEFAULT false,
    "patientid" INTEGER NOT NULL,
    CONSTRAINT "Image_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "Patient" ("patientid") ON DELETE RESTRICT ON UPDATE CASCADE
);
