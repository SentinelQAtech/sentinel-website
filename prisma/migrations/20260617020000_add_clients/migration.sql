CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "country" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "jiraUrl" TEXT,
    "notes" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "clients_ownerId_name_key" ON "clients"("ownerId", "name");
CREATE INDEX "clients_ownerId_idx" ON "clients"("ownerId");
CREATE INDEX "clients_status_idx" ON "clients"("status");

ALTER TABLE "clients" ADD CONSTRAINT "clients_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
