/*
This SQL script migrates from the old schema (using member_id and primary_email in StudentMember/FederatedAccount)
to the new schema (User table with an INT auto-increment primary key and user_id references).
Key improvements:
- Added temporary indexes for better performance during migration
- Proper handling of dependencies when deleting records
- Optimized JOIN operations for data updates
*/

BEGIN;

-- Step 1: Create temporary indexes for better performance
CREATE INDEX IF NOT EXISTS "temp_member_email_idx"
ON "StudentMember" ("primary_email")
WHERE "primary_email" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "temp_federated_member_idx"
ON "FederatedAccount" ("member_id");

-- Step 2: Create the new User table (INT auto-increment)
CREATE TABLE IF NOT EXISTS "User" (
    "id"            SERIAL PRIMARY KEY,
    "primary_email" TEXT    NOT NULL UNIQUE,
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL,
    "member_id"     TEXT
);

-- Step 3: Add user_id columns to old tables (nullable initially)
ALTER TABLE "FederatedAccount"
    ADD COLUMN IF NOT EXISTS "user_id" INT;

ALTER TABLE "StudentMember"
    ADD COLUMN IF NOT EXISTS "user_id" INT;

ALTER TABLE "UserDevice"
    ADD COLUMN IF NOT EXISTS "user_id" INT;

-- Step 4: Remove all related data for StudentMember with null primary_email
DELETE FROM "FederatedAccount"
WHERE "member_id" IN (
    SELECT "id" FROM "StudentMember"
    WHERE "primary_email" IS NULL
);

DELETE FROM "PersonalMembershipOrder"
WHERE "member_id" IN (
    SELECT "id" FROM "StudentMember"
    WHERE "primary_email" IS NULL
);

DELETE FROM "StudentMember"
WHERE "primary_email" IS NULL;

-- Step 5: Remove FederatedAccount rows with null email
DELETE FROM "FederatedAccount"
WHERE "email" IS NULL;

-- Step 6: Insert new User records from StudentMember with non-null primary_email
WITH inserted_users AS (
    INSERT INTO "User" ("primary_email", "created_at", "updated_at", "member_id")
    SELECT DISTINCT ON (s."primary_email")
        s."primary_email",
        s."created_at",
        s."created_at",
        s."id"
    FROM "StudentMember" s
    WHERE s."primary_email" IS NOT NULL
    RETURNING "id", "primary_email"
)
UPDATE "StudentMember" sm
SET "user_id" = iu."id"
FROM inserted_users iu
WHERE sm."primary_email" = iu."primary_email";

-- Step 7: Update FederatedAccount user_id using optimized JOIN
UPDATE "FederatedAccount" fa
SET "user_id" = sm."user_id"
FROM "StudentMember" sm
WHERE fa."member_id" = sm."id"
AND sm."user_id" IS NOT NULL;

-- Step 8: Drop old constraints and columns
ALTER TABLE "FederatedAccount"
    DROP CONSTRAINT IF EXISTS "FederatedAccount_member_id_fkey";

ALTER TABLE "_StudentMemberToUserDevice"
    DROP CONSTRAINT IF EXISTS "_StudentMemberToUserDevice_A_fkey";
ALTER TABLE "_StudentMemberToUserDevice"
    DROP CONSTRAINT IF EXISTS "_StudentMemberToUserDevice_B_fkey";

DROP INDEX IF EXISTS "StudentMember_primary_email_key";
DROP INDEX IF EXISTS "temp_member_email_idx";
DROP INDEX IF EXISTS "temp_federated_member_idx";

ALTER TABLE "FederatedAccount"
    DROP COLUMN IF EXISTS "member_id",
    ALTER COLUMN "email" SET NOT NULL;

ALTER TABLE "StudentMember"
    DROP COLUMN IF EXISTS "primary_email";

DROP TABLE IF EXISTS "_StudentMemberToUserDevice";

-- Step 9: Set user_id columns to NOT NULL
ALTER TABLE "FederatedAccount"
    ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "StudentMember"
    ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "UserDevice"
    ALTER COLUMN "user_id" SET NOT NULL;

-- Step 10: Create new indexes and foreign keys
CREATE INDEX IF NOT EXISTS "FederatedAccount_provider_provider_identifier_idx"
    ON "FederatedAccount" ("provider", "provider_identifier");

CREATE INDEX IF NOT EXISTS "FederatedAccount_email_idx"
    ON "FederatedAccount" ("email");

CREATE UNIQUE INDEX "StudentMember_user_id_key" ON "StudentMember"("user_id");

ALTER TABLE "FederatedAccount"
    ADD CONSTRAINT "FederatedAccount_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "StudentMember"
    ADD CONSTRAINT "StudentMember_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserDevice"
    ADD CONSTRAINT "UserDevice_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
