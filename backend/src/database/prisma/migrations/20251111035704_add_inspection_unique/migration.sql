/*
  Warnings:

  - A unique constraint covering the columns `[turbineId,date]` on the table `Inspection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inspection_turbineId_date_key" ON "Inspection"("turbineId", "date");
