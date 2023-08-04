// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { User } from './orm/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';

// @Module({
//     imports: [TypeOrmModule.forFeature([ User])],
//     controllers: [UserController],
//     providers: [UserService],
//     exports: [UserService]
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './orm/user.entity';
import { FriendshipEntity } from './orm/friendship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FriendshipEntity])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
