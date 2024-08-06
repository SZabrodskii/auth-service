import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send')
  async sendMessage(@Body() data: any) {
    return this.appService.sendMessage('auth_queue', data);
  }
}
