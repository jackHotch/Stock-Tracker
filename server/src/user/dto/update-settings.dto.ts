import { PartialType } from '@nestjs/mapped-types';
import { SettingsDto } from './settings.dto';

export class UpdateSettingsDto extends PartialType(SettingsDto) {}
