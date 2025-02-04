import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response: Response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码

    let resultMessage = exception.message;

    // 拦截class-validate错误信息
    try {
      const exceptionResponse = exception.getResponse() as any;
      if (Object.hasOwnProperty.call(exceptionResponse, 'message')) {
        resultMessage = exceptionResponse.message;
      }
    } catch (e) {
      throw new Error('拦截class-validate错误信息失败' + e);
    }

    const errorResponse = {
      data: null,
      message: resultMessage,
      // code: '9999',
      code: 'ENOTFOUND',
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
