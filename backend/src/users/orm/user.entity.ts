import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendshipEntity } from "./friendship.entity";

@Entity()
export class UserEntity {

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.id)
  friendship_relation: FriendshipEntity[];

  @PrimaryGeneratedColumn()
  id: number;

  // 3 Common infos to provide!
  @Column({ unique: true })
  login: string;
  @Column({ unique: true })
  userName: string;
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  refreshToken: string;

  // 2fa Google Authentificator
  @Column({ default: false })
  fa2: boolean;
  @Column({ nullable: true, default: null })
  fa2Secret: string;
  @Column({ nullable: true, default: null })
  fa2QRCode: string;

  // For Non-42 Users
  @Column({ default: false })
  hasPassword: boolean;
  @Column({ nullable: true, default: null })
  hash: string;
  @Column({ default: "images/defaultAvatar.jpg" })
  avatar: string;

  // 42 Users
  @Column({ default: false })
  is42: boolean;
  @Column({ nullable: true, default: null })
  id42: number;
  @Column({ nullable: true, default: null })
  lastName: string;
  @Column({ nullable: true, default: null, })
  firstName: string;

  // 'online' 'offline' 'inGame'
  @Column({ default: "online" })
  liveStatus: string

  @BeforeInsert()
  emailToLowerCases() {
    this.email = this.email.toLowerCase();
  }

}