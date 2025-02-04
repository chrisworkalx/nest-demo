import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function createSwaggerDocServer<T extends INestApplication<any>>(
  app: T,
) {
  // 配置 Swagger
  //   setTitle('后台管理系统 API')：设置 API 文档标题。
  // setDescription('NestJS 后台服务接口文档')：描述 API 文档用途。
  // setVersion('1.0')：API 版本号。
  // addBearerAuth()：启用 Token 认证。
  // SwaggerModule.setup('api-docs', app, document)：访问 http://localhost:3000/api-docs 查看接口文档。
  const config = new DocumentBuilder()
    .setTitle('后台管理系统 API')
    .setDescription('NestJS 后台服务接口文档')
    .setVersion('1.0')
    .addBearerAuth() // 支持 Token 认证
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  return document;
}
