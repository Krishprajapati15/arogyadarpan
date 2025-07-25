-- CreateTable
CREATE TABLE "medicine_reminders" (
    "id" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reminderType" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "specificDate" TEXT,
    "specificDay" TEXT,
    "dosage" TEXT,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSent" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicine_reminders_pkey" PRIMARY KEY ("id")
);
