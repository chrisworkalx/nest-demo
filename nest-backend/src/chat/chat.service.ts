/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatSession,
  ChatSessionDocument,
} from '../schemas/chat-session.schema';
import { ChatLog, ChatLogSchema } from '../schemas/chat-log.schema';
import { Readable } from 'stream';

@Injectable()
export class ChatService {
  private readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';
  private readonly API_KEY = 'sk-a501ba0fdb3340a2a1082a6ab531a01a';

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(ChatSession.name)
    private chatSessionModel: Model<ChatSessionDocument>,
    @InjectModel(ChatLog.name)
    private chatLogModel: Model<typeof ChatLogSchema>,
  ) {}

  async *getAIResponseStream(
    sessionId: string,
    userId: string,
    prompt: string,
  ) {
    try {
      // 记录用户输入
      await this.updateChatHistory(sessionId, userId, {
        role: 'user',
        content: prompt,
      });

      console.log('--进入websocket连接');

      // 发送请求到 DeepSeek API（流式返回）
      const response = await this.httpService.axiosRef.post(
        this.API_URL,
        {
          model: 'deepseek-chat',
          messages: await this.getChatHistory(sessionId),
          stream: true,
        },
        {
          headers: { Authorization: `Bearer ${this.API_KEY}` },
          responseType: 'stream', //流式响应
          timeout: 30000,
        },
      );

      const stream = response.data as Readable;
      let aiResponse = '';

      for await (const chunk of stream) {
        const delta = chunk?.data?.choices[0]?.delta?.content;
        const text = chunk.toString();
        aiResponse += text;
        yield delta;
      }

      // 存储 AI 响应到数据库
      await this.updateChatHistory(sessionId, userId, {
        role: 'assistant',
        content: aiResponse,
      });
      await this.logMessage(sessionId, userId, prompt, aiResponse);
    } catch (error) {
      console.error('DeepSeek API 调用失败:', error.message);
      yield 'AI 无法响应，请稍后再试';
    }
  }

  // 获取历史聊天记录
  private async getChatHistory(sessionId: string) {
    const session = await this.chatSessionModel.findOne({ sessionId }).exec();

    return session ? session.messages : [];
  }

  // 更新聊天记录
  private async updateChatHistory(
    sessionId: string,
    userId: string,
    message: { role: string; content: string },
  ) {
    await this.chatSessionModel.findOneAndUpdate(
      { sessionId },
      { $push: { messages: message }, $set: { userId } },
      { upsert: true },
    );
  }

  // 记录日志
  private async logMessage(
    sessionId: string,
    userId: string,
    message: string,
    response: string,
  ) {
    await this.chatLogModel.create({ sessionId, userId, message, response });
  }
}
