import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { departmentController } from './modules/department/controllers/department.controller';
import { departmentEntity } from './modules/department/persistence/department/department.entity';
import { DepartmentRepository } from './modules/department/persistence/department/department.repository';
import { DepartmentCommands } from './modules/department/usecases/department/department.usecase.command';
import { DepartmentQueries } from './modules/department/usecases/department/department.usecase.queries';


@Module({
  imports: [TypeOrmModule.forFeature([departmentEntity]),],
  controllers: [departmentController],
  providers: [
    DepartmentRepository,
    DepartmentQueries,
    DepartmentCommands,
     ],

})
export class departmentModule {}