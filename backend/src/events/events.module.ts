import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { DirectMessageModule } from 'src/direct_message/direct_message.module';
import { UserService } from 'src/users/user.service';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/orm/user.entity';
import { DirectMessageRoom } from 'src/direct_message/direct_message_room.entity';
import { DirectMessage } from 'src/direct_message/direct_message.entity';
import { GameEntity } from 'src/users/orm/game.entity';

@Module({
  providers: [EventsGateway, UserService],
  exports: [EventsGateway],
  imports: [DirectMessageModule, UserModule,
    TypeOrmModule.forFeature([DirectMessage, DirectMessageRoom, UserEntity, GameEntity]),
  ]
})
export class EventsModule { }
