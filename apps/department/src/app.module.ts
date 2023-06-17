import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from './config/typeorm.config';
import { departmentModule } from './department/department.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: DbConfig.host,
      username: DbConfig.username,
      password: DbConfig.password,
      database: DbConfig.database,
    //  schema: DbConfig.schema,
      port: DbConfig.port,
      entities: DbConfig.entities, 
      synchronize: DbConfig.synchronize, 
      autoLoadEntities: true,
 
    }),
    departmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
