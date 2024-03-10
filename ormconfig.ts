import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const PostgresDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'sub-universe',
  password: process.env.DB_PASS || 'sub-universe',
  database: process.env.DB_NAME || 'sub-universe',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  migrationsRun: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDataSource = new DataSource(PostgresDataSourceOptions);
