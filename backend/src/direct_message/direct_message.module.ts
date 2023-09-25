import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessage } from './direct_message.entity';
import { DirectMessageService } from './direct_message.service';
import { DirectMessageRoom } from './direct_message_room.entity';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { UserEntity } from 'src/users/orm/user.entity';
import { GameEntity } from 'src/users/orm/game.entity';

@Module({
	imports: [TypeOrmModule.forFeature([DirectMessage, DirectMessageRoom, UserEntity, GameEntity]), UserModule],
	providers: [DirectMessageService, UserService],
	exports: [DirectMessageService]
})
export class DirectMessageModule {
	//constructor(private readonly dmService: DirectMessageService) { }
}
