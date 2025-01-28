import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const database = new DataSource({
  type: isProduction ? 'mysql' : 'postgres',
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
  port: isProduction ? 3306 : 5432,
  username: isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
  password: isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
  database: isProduction ? process.env.DB_DATABASE_PROD : process.env.DB_DATABASE_DEV,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/src/domain/type/*.entity.{ts,js}'],
});

export default database;