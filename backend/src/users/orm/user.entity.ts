import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

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

  // Friend System Management
  @Column('text', { array: true, default: [] })
  friends: string[]; // List of friend usernames

  @Column('text', { array: true, default: [] })
  friendRequestsSent: string[]; // List of requests sent to other user and waiting for answer

  @Column('text', { array: true, default: [] })
  pendindFriendRequests: string[]; // List of friend requests received

  // Block User Management
  @Column('text', { array: true, default: [] })
  blockedUser: string[]; // List of users I blocked

  @Column('text', { array: true, default: [] })
  blockedBy: string[]; // List of users who blocked me

  // Game
  @Column({ nullable: false, default: 1 })
  rank: number;
  @Column({ nullable: false, default: "Newbee" })
  title: string;
  @Column({ nullable: false, default: 0 })
  wonGameNbr: number;
  @Column({ nullable: false, default: 0 })
  lostGameNbr: number;


  @BeforeInsert()
  emailToLowerCases() {
    this.email = this.email.toLowerCase();
  }

}