import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class GameEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => UserEntity, user => user.gamesAsPlayer1)
	player1: UserEntity;

	@ManyToOne(type => UserEntity, user => user.gamesAsPlayer2)
	player2: UserEntity;

	@Column()
	player1Score: number;

	@Column()
	player2Score: number;

	@CreateDateColumn()
	date: Date;
}