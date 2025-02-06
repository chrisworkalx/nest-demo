/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatSessionDocument = ChatSession & Document;

@Schema({ timestamps: true })
export class ChatSession {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ role: String, content: String }] }) // 存储对话历史
  messages: { role: string; content: string }[];
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
