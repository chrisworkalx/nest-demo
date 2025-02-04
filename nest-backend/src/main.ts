import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { TransformInterceptor } from './common/transform/transform.interceptor';

import { createSwaggerDocServer } from './docs/swagger';
import { createReDocServer } from './docs/redoc';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    const documnet = createSwaggerDocServer(app);
    createReDocServer(app, documnet);
    app.useGlobalFilters(new HttpExceptionFilter()); // 全局注册错误的过滤器(错误异常)
    app.useGlobalInterceptors(new TransformInterceptor()); // 全局注册成功过滤器
    await app.listen(process.env.PORT ?? 3000);
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    console.log('服务启动完成');
  }
}
void bootstrap();
