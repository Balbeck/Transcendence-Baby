import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('friendships')
export class FriendshipEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity)
	requester: UserEntity;

	@ManyToOne(() => UserEntity)
	recipient: UserEntity;

	// status : 'pending', 'accepted', 'blocked'
	@Column({ default: 'pending' })
	status: string;
}