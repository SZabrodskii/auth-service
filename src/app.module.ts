import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {User} from '../../todo-list/src/users/entity/user.entity';
import {RolesModule} from '../../todo-list/src/roles/roles.module';
import {Role} from '../../todo-list/src/roles/entity/role.entity';
import {AuthModule} from "./auth/auth.module";
import {getEnv} from "./utils/getenv";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UsersModule} from "../../todo-list/src/users/users.module";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'auth_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
        ConfigModule.forRoot(
            {envFilePath: '.env', isGlobal: true}
        ),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: getEnv('DB_HOST', 'localhost'),
            port: getEnv('DB_PORT', 5432),
            username: getEnv('DB_USER', 'admin'),
            password: getEnv('DB_PASSWORD', 'postgres'),
            database: getEnv('DB_NAME', 'todo_list'),
            entities: [User, Role],
            synchronize: true,
        }),
        UsersModule,
        RolesModule,
        AuthModule,
    ],
})
export class AppModule {
}

