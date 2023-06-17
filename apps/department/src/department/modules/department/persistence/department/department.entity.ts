import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class departmentEntity extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    deptid:string
    @Column({unique:true, })
    deptname:string
    @Column({nullable:false})
    description:string
    @Column({nullable:true})
    parentid:string;
    @ManyToOne(()=>departmentEntity,departmentEntity=>departmentEntity.parent,{ 
        onDelete: 'CASCADE' 
      })
    @JoinColumn({name:"parentid"})
     parent:departmentEntity
    @OneToMany(()=>departmentEntity,departmentEntity=>departmentEntity.child)
     child:departmentEntity[]
}






