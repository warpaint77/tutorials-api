import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tutorial {
    
    @PrimaryGeneratedColumn('increment')
    id: Number;

    @Column()
    author: string;

    @Column({unique: true})
    title: string;

    @Column()
    body: string;

    @Column()
    creationDate: Date

    @Column()
    updateDate: Date
}
