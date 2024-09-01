import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: Number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;
  }