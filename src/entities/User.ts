import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "./Answer";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {nullable: true})
    name: string;

    @Column('text', {unique: true})
    githubId: string;
    
    @OneToMany(() => Answer, a => a.creator)
    answers: Promise<Answer[]>
}