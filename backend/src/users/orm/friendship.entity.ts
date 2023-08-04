import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity()
export class FriendshipEntity {

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
	user: UserEntity;

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
	friend: UserEntity;

	@PrimaryGeneratedColumn()
	id: number

	// status : 'pending', 'accepted', 'blocked'
	@Column()
	status: string

}