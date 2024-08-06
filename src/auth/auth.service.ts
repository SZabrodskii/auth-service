import {CreateUserDto} from '../../../todo-list/src/users/dto/create-user.dto';
import {HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from '../../../todo-list/src/users/users.service';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {User} from '../../../todo-list/src/users/entity/user.entity';
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";

@Injectable()
export class AuthService {

    @Client({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://localhost:5672'],
            queue: 'auth_queue',
            queueOptions: {
                durable: false,
            },
        },
    })
    private readonly client: ClientProxy;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}


    async login( userDto: CreateUserDto){
        const user = await this.validateUser(userDto);
        return this.generateToken(user)
    }

    async registration(userDto: CreateUserDto){
        const candidate = await this.usersService.getUserByEmail(userDto.email);
        if(candidate) {
            throw new HttpException("User with this email already exists", HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.usersService.createUser({...userDto, password: hashPassword});
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if(user && passwordEquals) {
            return user
        }
        throw new UnauthorizedException({message: "Wrong email or password", status: 401})
    }

    async sendMessage(pattern: string, data: any) {
        return lastValueFrom(this.client.send(pattern, data));
    }

}
