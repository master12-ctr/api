import * as dotenv from "dotenv";
import { departmentEntity } from "../department/modules/department/persistence/department/department.entity";
//import { departmentEntity } from "src/department/modules/department/persistence/department/department.entity";
dotenv.config({ path: '.env' });
export const DbConfig= {
  "type": "postgres",
  "host": process.env.DATABASE_HOST,
  "port": parseInt(process.env.DATABASE_PORT),
  "username": process.env.DATABASE_USER,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE_NAME,
  "logging": true,
  "synchronize": true,
  "migrationsRun": false,
  "autoLoadEntities":true,
  "entities": [departmentEntity]
  //"entities": ["dist/**/*.entity{.ts,.js}"]
}
