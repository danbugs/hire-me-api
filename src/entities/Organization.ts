import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Recruiter } from "./Recruiter";

@Entity()
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {nullable: true})
    name: string;
    
    @OneToMany(() => Recruiter, r => r.organizationId)
    recruiters: Promise<Recruiter[]>
}