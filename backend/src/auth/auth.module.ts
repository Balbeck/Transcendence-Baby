import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FriendshipEntity } from 'src/users/orm/friendship.entity';
import { UserEntity } from 'src/users/orm/user.entity';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/users/strategies/jwt.strategy';
import { jwtSecret } from './jwtSecret';

import { ConfigModule, ConfigService } from '@nestjs/config';
import 'dotenv/config';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret.secret,
      signOptions: { expiresIn: '8h' },
    }),
    TypeOrmModule.forFeature([UserEntity, FriendshipEntity]),
    HttpModule,
    UserModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [UserService, HttpModule, UserModule, AuthService],
})
export class AuthModule { }





// imports: [
//   JwtModule.registerAsync({
//     imports: [ConfigModule],
//     inject: [ConfigService],
//     useFactory: async (configService: ConfigService) => ({
//       global: true,
//       secret: jwtConstants.secret,
//       //secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '8h' },
//     }),
//   }),