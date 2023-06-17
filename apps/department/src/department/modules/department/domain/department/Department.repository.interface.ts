import { Department } from "./Department";

//import { Department } from './department';
export interface IDepartmentRepository {
  insertDepartment(department: Department): Promise<Department>;
  updateDepartment(deptid:string,Department: Department): Promise<Department>;
   findById(deptid:string|null):Promise<Department>;
   findByName(deptname:string):Promise<Department>
   findById2(id1:string|null,id2:string|null):Promise<Department>;
   findByQuery(deptid:string):Promise<Department>;
   topnode():Promise<Department>;
}
