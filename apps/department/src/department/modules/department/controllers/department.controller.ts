import { Body, Controller, Delete, Get, NotAcceptableException, Param, Patch, Post } from "@nestjs/common";
import { addDepartmentCommand } from "../usecases/department/department.command";
import { DepartmentCommands } from "../usecases/department/department.usecase.command";
import { DepartmentQueries } from "../usecases/department/department.usecase.queries";
import { updateDepartmentCommand } from "../usecases/department/updatedepartment.command";

@Controller("departments")
export class departmentController {
  constructor(
    private commands: DepartmentCommands,
    private queries: DepartmentQueries
  ) {}

  @Get()
  getAll(){
    return this.queries.getAll();
  }

  @Get('/:id/:name?')
  getuser(@Param('id') id:string,@Param('name') name:string){
     if(name==="par"){
      return this.queries.getaparent1(id);
     }
     else if(name==="chi"){
      return this.queries.getachildren1(id);
    }else if(name==="allp"){
      return this.queries.getdepartmentAll();
    }else if(name==="posp"){
      return this.queries.possibleParent(id);
    }
    else if(name==null&&id){
      return this.queries.getdepartmentOne(id);
    }
  } 


  @Post()
  create(@Body() createdepartmentdto:addDepartmentCommand)
  {
    return this.commands.create(createdepartmentdto);
  }

  @Patch('/:deptid')
  update(@Param('deptid') deptid:string,@Body() updatedepartment:updateDepartmentCommand){
    return this.commands.updateDepartment(deptid,updatedepartment);
  }
  @Delete('/:deptid')
  delete(@Param('deptid') deptid:string){
    return this.commands.deleteDepartment(deptid);
  }
}
