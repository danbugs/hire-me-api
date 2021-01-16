import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";
import { User } from "./User";

@Entity()
export class Answer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    text: string;

    @Column()
    creatorId: number;

    @ManyToOne(() => User, (u) => u.answers)
    @JoinColumn({name: "creatorId"})
    creator: Promise<User>;

    @Column()
    questionId: number;

    @ManyToOne(() => Question, (q) => q.answers)
    @JoinColumn({name: "questionId"})
    question: Promise<Question>;
}