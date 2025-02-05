import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, userName: string, actionUrl: string) {
    console.log('actionUrl', actionUrl);
    await this.mailerService.sendMail({
      to: email,
      subject: '欢迎邮件测试',
      template: 'welcome', // 指定模板名称（不需要加 .pug）
      context: {
        name: userName, // 传递变量到 Pug 模板
        action_url: actionUrl,
      },
    });
  }
}
