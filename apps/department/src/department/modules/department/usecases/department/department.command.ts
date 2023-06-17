import { Department } from "../../domain/department/Department";

export class addDepartmentCommand{
      //public readonly createdepartment:createdepartmentdto,
      public readonly deptid:string;
      public readonly deptname:string;
      public readonly description:string;
      public readonly parentid:string|null;

      static fromCommands(DepartmentCommand: addDepartmentCommand): Department {
        const department: Department = new Department();
        department.deptid = DepartmentCommand.deptid;
        department.deptname = DepartmentCommand.deptname;
        department.description = DepartmentCommand.description;
        department.parentid = DepartmentCommand.parentid;
        return department;
      }
 
  }
  