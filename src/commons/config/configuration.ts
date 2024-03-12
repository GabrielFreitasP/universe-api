import * as process from 'process';

export type LoggerConfig = {
  level: string;
  label: string;
};

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  logging: boolean;
  migrationsRun: boolean;
};

type AuthConfig = {
  jwt: {
    secret: string;
    expiresIn: number;
  };
};

export type Config = {
  port: number;
  logger: LoggerConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
};

export default (): Config => ({
  port: parseInt(process.env.PORT) || 3000,
  logger: {
    level: process.env.LOGGER_LEVEL || 'debug',
    label: process.env.LOGGER_LABEL || 'development',
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'sub-universe',
    password: process.env.DATABASE_PASSWORD || 'sub-universe',
    name: process.env.DATABASE_NAME || 'sub-universe',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
  },
  auth: {
    jwt: {
      secret: process.env.AUTH_JWT_SECRET || 'sub-universe',
      expiresIn: parseInt(process.env.AUTH_JWT_EXPIRES_IN) || 3000,
    },
  },
});
