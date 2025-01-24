import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { Category } from "../../domain/type/category.type";

@Entity({ name: "cards" })
export class CardDAO {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    category!: Category;

    @Column()
    question!: string;

    @Column()
    answer!: string;

    @Column({ nullable: true })
    tag!: string;
}