import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "./Answer";
import { Recruiter } from "./Recruiter";
import { User } from "./User";

@Entity()
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    text: string;

    @Column()
    creatorId: number;

    @ManyToOne(() => Recruiter, (r) => r.questions)
    @JoinColumn({name: "creatorId"})
    creator: Promise<User>;

    @OneToMany(() => Answer, a => a.question)
    answers: Promise<Answer[]>
}