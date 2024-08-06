import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import {lastValueFrom} from "rxjs";

@Injectable()
export class AppService {
  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy) {}

  async sendMessage(pattern: string, data: any) {
    return lastValueFrom(this.client.send(pattern, data));
  }
}