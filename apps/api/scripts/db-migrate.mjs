import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const migrationsDir =
  process.env.MIGRATIONS_DIR ?? resolve(appRoot, "migrations");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for db:migrate");
}

const loadMigrations = () =>
  readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const main = async () => {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  await client.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       version TEXT PRIMARY KEY,
       applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
  );

  const { rows } = await client.query<{ version: string }>(
    "SELECT version FROM schema_migrations",
  );
  const applied = new Set(rows.map((row) => row.version));
  const migrations = loadMigrations();

  for (const file of migrations) {
    if (applied.has(file)) continue;
    const sql = readFileSync(resolve(migrationsDir, file), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (version) VALUES ($1)",
        [file],
      );
      await client.query("COMMIT");
      // eslint-disable-next-line no-console
      console.log(`Applied migration ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  await client.end();
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
