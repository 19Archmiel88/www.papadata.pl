import crypto from 'crypto';
import { Client } from 'pg';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const getEnv = (key: string, fallback = ''): string => (process.env[key] ?? fallback).trim();

const main = async () => {
  const projectId = getEnv('GOOGLE_CLOUD_PROJECT') || getEnv('GCP_PROJECT_ID');
  const secretName = getEnv('DB_PASSWORD_SECRET_NAME', 'CLOUD_SQL_PASSWORD');
  const dbUser = getEnv('DB_ROTATE_USER');
  const adminUrl = getEnv('DATABASE_ADMIN_URL') || getEnv('DATABASE_URL');
  const sslEnabled = getEnv('DATABASE_SSL_ENABLED', 'true').toLowerCase() !== 'false';
  const sslRejectUnauthorized =
    getEnv('DATABASE_SSL_REJECT_UNAUTHORIZED', 'true').toLowerCase() !== 'false';

  if (!projectId) throw new Error('Missing GOOGLE_CLOUD_PROJECT/GCP_PROJECT_ID');
  if (!dbUser) throw new Error('Missing DB_ROTATE_USER');
  if (!adminUrl) throw new Error('Missing DATABASE_ADMIN_URL or DATABASE_URL');

  if (!/^[a-zA-Z0-9_]+$/.test(dbUser)) {
    throw new Error('DB_ROTATE_USER contains invalid characters');
  }

  const password = crypto.randomBytes(24).toString('base64url');

  const client = new Client({
    connectionString: adminUrl,
    ssl: sslEnabled ? { rejectUnauthorized: sslRejectUnauthorized } : undefined,
  });
  await client.connect();
  await client.query(`ALTER USER "${dbUser}" WITH PASSWORD $1`, [password]);
  await client.end();

  const sm = new SecretManagerServiceClient();
  const parent = `projects/${projectId}/secrets/${secretName}`;
  await sm.addSecretVersion({
    parent,
    payload: { data: Buffer.from(password, 'utf8') },
  });

  // eslint-disable-next-line no-console
  console.log(`Rotated password for ${dbUser} and stored in ${secretName}`);
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
