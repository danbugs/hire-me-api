import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";
import { Organization } from "./Organization";

@Entity()
export class Recruiter extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {nullable: true})
    name: string;

    @Column('text', {unique: true})
    githubId: string;
    
    @OneToMany(() => Question, q => q.creator)
    questions: Promise<Question[]>

    @Column()
    organizationId: number;

    @ManyToOne(() => Organization, (o) => o.recruiters)
    @JoinColumn({name: "organizationId"})
    organization: Promise<Organization>;
}