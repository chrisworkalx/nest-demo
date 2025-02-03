import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers.authorization;

    // console.log('authHeader', authHeader);

    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader?.split(' ')[1];

    const isBlacklisted = await this.redisService.get(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been blacklisted');
    }
    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
