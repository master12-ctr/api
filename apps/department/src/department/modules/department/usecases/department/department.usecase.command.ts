import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LoggerService } from 'apps/department/src/department/infrastructure/logger/logger.service';
//import { LoggerService } from 'src/department/infrastructure/logger/logger.service';
import { DepartmentRepository } from '../../persistence/department/department.repository';
import { addDepartmentCommand } from './department.command';
import { DepartmentResponse } from './department.response';
import { updateDepartmentCommand } from './updatedepartment.command';
@Injectable()  
export class DepartmentCommands {
    private readonly logger = new LoggerService('DepartmentService');
  constructor(
    private departmentRepository: DepartmentRepository 
  ){}
   async create(command: addDepartmentCommand):Promise<DepartmentResponse>{
    const departmentinsert = addDepartmentCommand.fromCommands(command);
      const{parentid,deptname}=departmentinsert;
      const duplicatename=await this.departmentRepository.findByName(deptname);
      const insertparent=await this.departmentRepository.findById(parentid);
      const topnode=await this.departmentRepository.topnode();
      if(topnode){
       if(parentid==null)
       { throw new  NotAcceptableException("presence parent");
       } else{
     //  return await this.Repository.save(createdep);
         if(insertparent){
  
     if(!duplicatename){
      const result = await this.departmentRepository.insertDepartment(departmentinsert);
          this.logger.log(
      'CreateDepartment command execute',
      'New department have been inserted'
    );
      return DepartmentResponse.fromDomain(result);
    }else{
      throw new ConflictException("Department names already exists");
  }
  }else{
    throw new BadRequestException("department parent does not exist");
  }
  
     }
      }else{
       if(parentid!=null){
       throw new ForbiddenException ("absence of parent please insert parent");
        }
       else{
        if(!duplicatename){
          const result = await this.departmentRepository.insertDepartment(departmentinsert);
              this.logger.log(
      'CreateDepartment command execute',
     'New department have been inserted'
    );
          return DepartmentResponse.fromDomain(result);
    }else{
      throw new ConflictException("Department names already exists");
  }
      }
     }
  }
  async updateDepartment(deptid:string,command:updateDepartmentCommand):Promise<DepartmentResponse> {
 const departmentupdate=updateDepartmentCommand.fromCommands(command);
    const{parentid}=departmentupdate; 
    const parentidexist=await this.departmentRepository.findById(parentid);
    const deptidexist=await this.departmentRepository.findById(deptid);
   // const duplicatename=await this.Repository.findOne({where:{deptname:deptname}});
    if(deptidexist){
    if(parentidexist){
    const parentidb = await this.departmentRepository.findById2(deptid);
    if(!parentidb){
      // for await this.departmentRepository.findOne({where:{deptid:deptid},select:{parentid:true}});
     const parentida = await this.departmentRepository.findById(deptid);
       // for   await this.departmentRepository.findOne({where:{deptid:parentida.parentid},select:{deptname:true,deptid:true}});
     const a= await this.departmentRepository.findById(parentida.parentid);
     if(parentid!=null){
        //implimentation
        const allchi= await this.departmentRepository.findByQuery(deptid);  
          const found = allchi.some(el => el.deptid ===parentid);
          if(found){
           // return "can not update because of circular dependency";
            throw new ForbiddenException("can not update because of circular dependency")
          }else{
            const result=await this.departmentRepository.updateDepartment(deptid,departmentupdate);
              this.logger.log(
             'updateDepartment command execute',
                 'New department have been updated'
            );   
            return DepartmentResponse.fromDomain(result);
          }
          
    }else{
     throw new BadRequestException("exist the parent can not u parent");
    }
   }else{
     if(parentid!=null){
       throw new UnauthorizedException("you are top node dont change parent");
     }else{
      const result=await this.departmentRepository.updateDepartment(deptid,departmentupdate);
      this.logger.log(
     'updateDepartment command execute',
         'New department have been updated'
    );   
    return DepartmentResponse.fromDomain(result);
   }
   }
   
   // const result=await this.Repository.update(updatedepartment.deptid,updatedepartment);
   // return result ;
  }else{
    throw new BadRequestException("inserted parent does not exist");
  }}else{
    throw new BadRequestException("such department does not exist");
  }
}


async deleteDepartment(deptid:string) {  //:Promise<DepartmentResponse>
 
  //can not delete if the department is root department
  const parentidd = await this.departmentRepository.findParent(deptid); 
  if(!parentidd.parentid){
    console.log("can not delete because it is root node");
  }else{
 //  const childDelete=await this.departmentRepository.findByQuery(deptid);
 // console.log("can delete because it is not root node");
 // const allchildarr = childDelete.map((dep) => dep.deptid);

  const result=await this.departmentRepository.deleteDepartment(deptid);
              this.logger.log(
             'deleteDepartment command execute',
                 'existing department have been deleted'
            );   
           // return DepartmentResponse.fromDomain(result);
           return result;
          }

 // console.log(childDelete);

  }




}
