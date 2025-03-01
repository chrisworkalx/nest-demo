/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LogService } from '../log/logs.service';
import { RedisService } from '../redis/redis.service';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private logService: LogService,
    private redisClient: RedisService,
  ) {}

  async register(username: string, password: string) {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ username, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // console.log('user', user);
    // 记录登录日志
    await this.logService.createLog('LOGIN', user.id, 'User logged in');
    return {
      token: this.jwtService.sign({ userId: user.id, role: user.role }),
      role: user.role,
    };
  }

  async updateUserRole(userId: number, role: Role) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.role = role;
    return this.userRepo.save(user);
  }

  async logout(token: string) {
    // 记录登出日志

    // 将 token 加入黑名单，设置过期时间为 token 的有效期
    const payload = this.jwtService.verify(token);
    await this.logService.createLog(
      'LOGOUT',
      payload.userId as number,
      'User logged out',
    );
    const tokenExpiration = payload.exp - Math.floor(Date.now() / 1000);
    await this.redisClient.set(token, 'blacklisted', tokenExpiration); // 设置过期时间与 token 相同

    return { message: 'Logout successful' };
  }
}
