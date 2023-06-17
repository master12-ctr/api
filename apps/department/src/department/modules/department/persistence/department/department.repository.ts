import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConflictException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { Department } from "../../domain/department/Department";
//import { Department } from "../../domain/department/department";
import { IDepartmentRepository } from "../../domain/department/Department.repository.interface";
import { departmentEntity } from "./department.entity";

@Injectable()  
export class DepartmentRepository implements IDepartmentRepository {
    constructor(
      @InjectRepository(departmentEntity)
      private Repository:Repository<departmentEntity>
      ) {}    
   async insertDepartment(createdep:Department):Promise<Department>{
    const departmentEntity = this.toDepartmentEntity(createdep);
    const result= await this.Repository.insert(departmentEntity); 
    return result ? this.toDepartment(departmentEntity) : null;
  }
  async updateDepartment(deptid:string,departmentupd:Department):Promise<Department> {
         departmentupd.deptid=deptid;
         //  const result= await this.Repository.save(departmentupd);
         departmentupd.deptid=deptid;
         console.log(deptid);
         console.log(departmentupd);
         const result= await this.Repository.update(departmentupd.deptid,departmentupd);
           //  return result ? this.toDepartment(result) : null;
           return result? departmentupd:null ;

} 

async deleteDepartment(deptid:string) {  //Promise<Department>
  
  this.Repository.delete(deptid);
  const result= await this.Repository.delete(deptid);

  return result;
} 

//dont have read methods in repositories in DDD CQRS patterns of nest js

async findById(id: string|null) {
   if(id!==null){
  return await this.Repository.findOne({where:{deptid:id}});
   }else{
    return await this.Repository.findOne({where:{deptid:IsNull()}});
   }
}

async findByName(deptname: string) {
 return await this.Repository.findOne({where:{deptname:deptname}});

}

async findById2(id1:string|null){
  return  await this.Repository.findOne({where:{parentid:IsNull(), deptid:id1},});
}

async findParent(fordelete:string){
  return  await this.Repository.findOne({where:{ deptid:fordelete},});
}

async topnode(){
  return await this.Repository.findOne({where:{deptid:Not(IsNull())}});
}


async findByQuery(deptid: string) {
  return await this.Repository.query(`  
        with RECURSIVE cte as 
            (
              select * from department_entity where deptid='${deptid}'
              union all
              select e.* from department_entity e inner join cte on e.parentid=cte.deptid
           )
          select * from cte;
          `); 
}


private toDepartment(departmentEntity: departmentEntity): Department {
  const department: Department = new Department();
  department.deptid = departmentEntity.deptid;
  department.deptname = departmentEntity.deptname;
  department.description = departmentEntity.description;
  department.parentid = departmentEntity.parentid;
  return department;
}

private toDepartmentEntity(department: Department): departmentEntity {
  const depEntity: departmentEntity = new departmentEntity();
  depEntity.deptid = department.deptid;
  depEntity.deptname = department.deptname;
  depEntity.description = department.description;
  depEntity.parentid = department.parentid;
  return depEntity;
}

}




