import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/settings')
  getSettings(@UserId() userId: number) {
    return this.userService.getSettings(userId);
  }

  @Patch('/settings')
  updateSettings(@UserId() userId: number, @Body() body: UpdateSettingsDto) {
    return this.userService.updateSettings(userId, body);
  }
}
