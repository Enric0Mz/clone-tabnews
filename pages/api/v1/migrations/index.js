import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import { onNoMatchHandler } from "helpers/handlers";
import { InternalServerError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

async function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  response.status(500).json(publicErrorObject);
}

const migrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner({
      ...migrationOptions,
      dbClient: dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient = await database.getNewClient();
  try {
    const migratedMigrations = await migrationRunner({
      ...migrationOptions,
      dryRun: false,
      dbClient: dbClient,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
