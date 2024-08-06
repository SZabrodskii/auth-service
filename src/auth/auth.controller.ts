import {Body, Controller, Inject, Post} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../../../todo-list/src/users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {ClientProxy, MessagePattern} from "@nestjs/microservices";

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject('AUTH_SERVICE') private readonly client: ClientProxy ) {}

    @MessagePattern('/auth/login')
    @Post('/login')
    login(@Body() userDto: CreateUserDto){
        return this.authService.login(userDto)
    }
    @MessagePattern('/auth/registration')
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto){
        return this.authService.registration(userDto)
    }

    @MessagePattern('login_pattern')
    async handleLogin( userDto: CreateUserDto) {
        // Обработка сообщения для логина
    }

    @MessagePattern('validate_user')
    async validateUser(data: any) {
        return this.authService.validateUser(data);
    }


}