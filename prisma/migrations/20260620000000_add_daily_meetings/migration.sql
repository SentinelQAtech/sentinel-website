CREATE TABLE "daily_meetings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "region" TEXT NOT NULL DEFAULT '',
    "time" TEXT NOT NULL DEFAULT '09:00',
    "title" TEXT,
    "participants" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdByAuthId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_meetings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "daily_meetings_workspaceId_idx" ON "daily_meetings"("workspaceId");
CREATE INDEX "daily_meetings_date_idx" ON "daily_meetings"("date");
CREATE INDEX "daily_meetings_createdById_idx" ON "daily_meetings"("createdById");

ALTER TABLE "daily_meetings" ADD CONSTRAINT "daily_meetings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
