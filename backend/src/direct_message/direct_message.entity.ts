import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { DirectMessageRoom } from './direct_message_room.entity';


@Entity('direct_messages') // Name of the table in the database
export class DirectMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamp' })
	date: Date;

	@Column({ type: 'varchar', length: 500 })
	message: string;

	@Column({ type: 'int' })
	sendBy: number;

	@Column({ type: 'int' })
	sendTo: number;

	@Column({ type: 'int', nullable: true })
	roomId: number;

	@ManyToOne(() => DirectMessageRoom, (room) => room.messages)
	@JoinColumn({ name: 'room_id' })
	room: DirectMessageRoom;
}