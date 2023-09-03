import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/orm/user.entity';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt/jwt.service';

@Module({
  imports: [
    ConfigModule,
    //forwardRef(() => UserModule),
    UserModule,
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
      //signOptions: { expiresIn: '1m' },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, UserService, JwtAuthService,],
  exports: [UserService, HttpModule, UserModule, AuthService, JwtAuthService],
})
export class AuthModule { }