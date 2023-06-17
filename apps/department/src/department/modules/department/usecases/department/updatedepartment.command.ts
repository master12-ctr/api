import { Department } from "../../domain/department/Department";

export class updateDepartmentCommand{
      //public readonly createdepartment:createdepartmentdto,
      public readonly deptid:string;
      public readonly deptname?:string;
      public readonly description?:string;
      public readonly parentid?:string;

      static fromCommands(DepartmentCommand: updateDepartmentCommand): Department {
        const department: Department = new Department();
        department.deptid = DepartmentCommand.deptid;
        department.deptname = DepartmentCommand.deptname;
        department.description = DepartmentCommand.description;
        department.parentid = DepartmentCommand.parentid;
        return department;
      }
 
  }
  