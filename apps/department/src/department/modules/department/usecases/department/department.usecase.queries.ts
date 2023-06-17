import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { departmentEntity } from "../../persistence/department/department.entity";
import { DepartmentResponse } from "./department.response";


@Injectable()
export class DepartmentQueries {
  constructor(
    @InjectRepository(departmentEntity)
    private departmentRepository: Repository<departmentEntity>
  ) {}
  
  async getAll():Promise<DepartmentResponse[]>{
    const getdep= await this.departmentRepository.query(`
    WITH RECURSIVE elt AS
    (
    SELECT s.deptid AS father
         , CASE WHEN array_agg(e.deptid) = array[NULL :: uuid[]] THEN NULL ELSE array_agg(e.deptid) END  AS children_list
         , jsonb_build_object
           ( 'id', s.deptid
           , 'name', s.deptname
           , 'descr', s.description
           , 'subRows', array_agg(e.deptid)
           ) AS json_tree
      FROM department_entity AS s
      LEFT JOIN department_entity AS e
        ON s.deptid = e.parentid
     GROUP BY s.deptid, s.deptname,s.description
    ), list (father, json_tree, children_list, rank, path) AS
    (
    SELECT c.father, c.json_tree, c.children_list, 1, '{}' :: text[]
      FROM elt AS c
      LEFT JOIN elt AS f
        ON array[c.father] <@ f.children_list
     WHERE f.father IS NULL
    UNION ALL
    SELECT c.father
         , c.json_tree
         , c.children_list
         , f.rank + 1
         , f.path || array['subRows',(array_position(f.children_list, c.father)-1) :: text]
      FROM list AS f
     INNER JOIN elt AS c
        ON array[c.father] <@ f.children_list
    )
    SELECT jsonb_set_agg(NULL :: jsonb, path, json_tree, true ORDER BY rank ASC) as department
      FROM list
      `);
     // return getdep.map((entity) => DepartmentResponse.fromEntity(entity));

     
       const obj= getdep[0].department;
       const a:any=[];
       a.push(obj);
     const b=JSON.stringify(a,(k,v)=>Array.isArray(v) && !(v=v.filter(e=>e)).length?void 0:v,2);
      const c=JSON.parse(b);
     return c;

  }

   async getdepartmentOne(deptid:string):Promise<DepartmentResponse>{
    const existence= await this.departmentRepository.findOne({
      where: {
          deptid:deptid
     },
     // relations: ['parent'],
  });
        if(existence){
       const getid=this.departmentRepository.findOne({select:{deptid:true,deptname:true,description:true},where:{deptid:deptid}}); 
       console.log(getid); 
     //  return getid;
      return DepartmentResponse.fromEntity(await getid);
      }else{
         throw new ForbiddenException("not found the id");
        }

  }
    async getaparent1(deptid:string){
     
      const existence=await  this.departmentRepository.findOne({where:{deptid:deptid}});
      if(!existence){
        throw new NotAcceptableException("not existence this department id");
      }else{
      const identi = await this.departmentRepository.findOne({where:{deptid:deptid,parentid:IsNull()},});
      if(!identi){
      const parentida = await this.departmentRepository.findOne({where:{deptid:deptid},select:{parentid:true}});
      if(parentida.parentid==null)
      {
        console.log("");
      }
       const pardep= await this.departmentRepository.findOne({where:{deptid:parentida.parentid},select:{deptname:true}});
      // const returnpar=Object.keys(pardep).map(function(k){return pardep[k]}).join(":");
      // return returnpar;
      const returnpar= DepartmentResponse.fromEntity(pardep);
      return Object.keys(returnpar).map(function(k){return returnpar[k]}).join("");
      // return returnpar ? this.toDepartment(departmentEntity[0]) : null;
    }else{
      //console.log("can not have parent");
      //throw new BadRequestException("can not have parent");
      return "None";
    }  }

  }  
   async getachildren1(deptid:string){ 

    const idexist=await this.departmentRepository.findOne({where:{deptid:deptid}});
    if(idexist){
const chiret= await this.departmentRepository.find({select:{deptname:true},where:{parentid:deptid} }); 
 //const chiretdep = chiret.map((department) => department.deptname).join(': ');
const chiretdep= chiret.map((chiret) => DepartmentResponse.fromEntity(chiret));
const childret= chiretdep.map((department) => department.deptname).join(': ');
if(childret){
   return childret;
}
else{
  return "None";
}   }else{
  throw new NotFoundException("this id does not exist");
}   

 }

 async getdepartmentAll(){ 
    const selall=await this.departmentRepository.find({select:{deptid:true,deptname:true},});
     return selall; 

}
async possibleParent(deptid:string){ 
  const selall=await this.departmentRepository.find({select:{deptid:true,deptname:true},});
  const allchi=await this.departmentRepository.query(`
  with RECURSIVE cte as 
            (
              select * from department_entity where deptid='${deptid}'
              union all
              select e.* from department_entity e inner join cte on e.parentid=cte.deptid
           )
          select * from cte;`);
   
          const allchie = allchi.map(el => (el.deptid)); // extract id from arrayTwo
          const result = selall.filter(el => !allchie.includes(el.deptid));
      return result; 

}

}