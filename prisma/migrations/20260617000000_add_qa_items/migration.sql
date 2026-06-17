-- CreateTable
ALTER TABLE "users" ADD COLUMN "supabaseId" UUID;

CREATE TABLE "qa_items" (
    "id" UUID NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT,
    "projectId" TEXT,
    "sprintId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "externalKey" TEXT,
    "externalUrl" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Unknown',
    "category" TEXT NOT NULL DEFAULT 'Other',
    "status" TEXT NOT NULL DEFAULT 'Other',
    "workflowState" TEXT NOT NULL DEFAULT 'inbox',
    "dailyStatus" TEXT,
    "dailyDate" TIMESTAMP(3),
    "dailyOrder" INTEGER,
    "sentToDaily" BOOLEAN NOT NULL DEFAULT false,
    "resolution" TEXT,
    "resolutionDetails" JSONB,
    "evidence" JSONB,
    "riskLevel" TEXT,
    "severity" TEXT,
    "assigneeId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdByAuthId" UUID,
    "notes" TEXT,
    "itemType" TEXT,
    "metadata" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qa_items_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "bugs" ADD COLUMN "qaItemId" UUID;

-- CreateIndex
CREATE INDEX "qa_items_workspaceId_idx" ON "qa_items"("workspaceId");
CREATE INDEX "qa_items_projectId_idx" ON "qa_items"("projectId");
CREATE INDEX "qa_items_sprintId_idx" ON "qa_items"("sprintId");
CREATE INDEX "qa_items_workflowState_idx" ON "qa_items"("workflowState");
CREATE INDEX "qa_items_dailyDate_idx" ON "qa_items"("dailyDate");
CREATE INDEX "qa_items_sentToDaily_idx" ON "qa_items"("sentToDaily");
CREATE INDEX "qa_items_priority_idx" ON "qa_items"("priority");
CREATE INDEX "qa_items_status_idx" ON "qa_items"("status");
CREATE INDEX "qa_items_externalKey_idx" ON "qa_items"("externalKey");
CREATE INDEX "qa_items_createdById_idx" ON "qa_items"("createdById");
CREATE INDEX "qa_items_createdByAuthId_idx" ON "qa_items"("createdByAuthId");
CREATE INDEX "qa_items_deletedAt_idx" ON "qa_items"("deletedAt");
CREATE INDEX "bugs_qaItemId_idx" ON "bugs"("qaItemId");
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- AddForeignKey
ALTER TABLE "qa_items" ADD CONSTRAINT "qa_items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "qa_items" ADD CONSTRAINT "qa_items_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "qa_items" ADD CONSTRAINT "qa_items_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "qa_items" ADD CONSTRAINT "qa_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_qaItemId_fkey" FOREIGN KEY ("qaItemId") REFERENCES "qa_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Supabase hardening when this table is exposed through the Data API.
ALTER TABLE "qa_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qa_items_select_own_workspace"
ON "qa_items"
FOR SELECT
TO authenticated
USING ("createdByAuthId" = (select auth.uid()));

CREATE POLICY "qa_items_insert_own_workspace"
ON "qa_items"
FOR INSERT
TO authenticated
WITH CHECK ("createdByAuthId" = (select auth.uid()));

CREATE POLICY "qa_items_update_own_workspace"
ON "qa_items"
FOR UPDATE
TO authenticated
USING ("createdByAuthId" = (select auth.uid()))
WITH CHECK ("createdByAuthId" = (select auth.uid()));

CREATE POLICY "qa_items_delete_own_workspace"
ON "qa_items"
FOR DELETE
TO authenticated
USING ("createdByAuthId" = (select auth.uid()));
