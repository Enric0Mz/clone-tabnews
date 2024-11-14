import database from "infra/database.js";

async function status(request, response) {
  const version = await database.query("SELECT version();");
  const max = await database.query("SHOW max_connections;");
  const opened = await database.query("SELECT COUNT(*) FROM pg_stat_activity;");
  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    database: {
      version: version.rows[0].version,
      max_connections: max.rows[0].max_connections,
      opened_connections: opened.rows[0].count,
    },
  });
}

export default status;
