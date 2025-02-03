/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头的 Bearer token 获取 JWT
      secretOrKey: 'your-secret-key', // 用于验证 JWT 签名
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.userId, username: payload.username }; // 返回用户信息
  }
}
