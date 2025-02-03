import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

// createLog：记录用户操作。
// getLogs：获取日志列表，按时间倒序排列
@Injectable()
export class LogService {
  constructor(@InjectRepository(Log) private logRepo: Repository<Log>) {}

  async createLog(action: string, userId: number, details?: string) {
    // console.log('here----');
    const log = this.logRepo.create({ action, userId, details });
    return this.logRepo.save(log);
  }

  async getLogs() {
    return this.logRepo.find({ order: { timestamp: 'DESC' } });
  }
}
