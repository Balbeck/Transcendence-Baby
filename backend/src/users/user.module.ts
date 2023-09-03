import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './orm/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
//import { AuthService } from 'src/auth/auth.service';
//import { AuthModule } from 'src/auth/auth.module';
// import { FriendshipEntity } from './orm/friendship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),

  ],
  providers: [UserService,
    JwtAuthService,
    AuthGuard,
  ],
  controllers: [UserController]
})
export class UserModule { }
