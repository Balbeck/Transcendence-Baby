import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { FriendshipEntity } from 'src/users/orm/friendship.entity';
import { UserEntity } from 'src/users/orm/user.entity';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/users/strategies/jwt.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
// import { jwtSecret } from './jwtSecret';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]),

    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get(process.env.JWT_SECRET),
    //     signOptions: { expiresIn: '8h' }
    //   })
    // }),
    JwtModule.register({
      global: true,
      //  secret: jwtSecret.secret,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [UserService, HttpModule, UserModule, AuthService],
})
export class AuthModule { }