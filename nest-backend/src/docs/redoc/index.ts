/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as RedocModule from 'redoc-express';
import { INestApplication } from '@nestjs/common';

export const createReDocServer = <
  T extends INestApplication<any>,
  U extends Record<string, any>,
>(
  app: T,
  document: U,
) => {
  app.use(
    '/redoc',
    RedocModule.default({
      title: '后台管理 API 文档',
      specUrl: '/api-docs-json',
    }),
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  app.use('/api-docs-json', (req, res) => res.json(document as any));
};
