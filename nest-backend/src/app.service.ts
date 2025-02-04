import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth/user.entity';
@Injectable()
export class AppService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getUserInfo(userId: number): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const info = Object.keys(user).reduce(
      (acc, key) => {
        if (key !== 'password') {
          acc[key] = user[key];
        }
        return acc;
      },
      {} as Omit<typeof user, 'password'>,
    );
    return info;
  }
}
{
}
