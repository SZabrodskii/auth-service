import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from '../../../todo-list/src/users/users.module';
import {JwtModule} from "@nestjs/jwt";
import {getEnv} from "../utils/getenv";
import {ClientsModule, Transport} from "@nestjs/microservices";


@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        JwtModule.register({
            secret: getEnv('JWT_SECRET', 'secret'),
            signOptions: {
                expiresIn: '24h'
            }
        }),

        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://rabbit:5672'],
                    queue: 'auth_queue',
                    queueOptions: {
                        durable: false
                    },
                }
            }
        ])

    ],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}