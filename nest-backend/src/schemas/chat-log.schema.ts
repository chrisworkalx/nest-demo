/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ChatLog {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  response: string;
}

export const ChatLogSchema = SchemaFactory.createForClass(ChatLog);
