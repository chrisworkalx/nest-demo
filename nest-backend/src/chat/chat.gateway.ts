import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: 'chat', cors: true }) // 绑定到 /chat
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { sessionId: string; userId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, userId, message } = data;
    console.log('message', message);
    client.emit('message', JSON.stringify({ reply: '', isStreaming: true }));
    const responseStream = this.chatService.getAIResponseStream(
      sessionId,
      userId,
      message,
    );

    for await (const chunk of responseStream) {
      client.emit('message', JSON.stringify({ reply: chunk }));
    }
  }
}
