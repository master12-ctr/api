
import { Department } from "../../domain/department/Department";
import { departmentEntity } from "../../persistence/department/department.entity";

export class DepartmentResponse {
  deptid: string;
  deptname: string;
  description: string;
  parentid: string|null;
  /**
   *A Method which copy  Question Entity object Property value to  QuestionResponse properties
   */
  static fromEntity(dep: departmentEntity): DepartmentResponse {
    const departmentResponse = new DepartmentResponse();
    departmentResponse.deptid = dep.deptid;
    departmentResponse.deptname = dep.deptname;
    departmentResponse.description = dep.description;
    departmentResponse.parentid = dep.parentid;
 
    return departmentResponse;
  }
  /**
   *A Method which copy  Question domain object Property value to  QuestionResponse properties
   */
  static fromDomain(department: Department): DepartmentResponse {
    const departmentResponse = new DepartmentResponse();
    departmentResponse.deptid = department.deptid;
    departmentResponse.deptname = department.deptname;
    departmentResponse.description = department.description;
    departmentResponse.parentid = department.parentid;
    return departmentResponse;
  }
}
