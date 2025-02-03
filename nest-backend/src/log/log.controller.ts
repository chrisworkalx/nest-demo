import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './logs.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('logs')
@UseGuards(AuthGuard, RolesGuard)
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getLogs() {
    return this.logService.getLogs();
  }
}
