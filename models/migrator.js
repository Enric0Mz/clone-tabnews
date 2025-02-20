import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const migrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner({
      ...migrationOptions,
      dbClient: dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient = await database.getNewClient();
  try {
    const migratedMigrations = await migrationRunner({
      ...migrationOptions,
      dryRun: false,
      dbClient: dbClient,
    });
    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
