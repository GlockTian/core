import { Module } from '@nestjs/common'
import { DatabaseModule } from '@core/nest/database/DatabaseModule'
import { PrismaService } from '../../lib/prisma.service'
import { LanguageResolver } from './language.resolver'

@Module({
  imports: [DatabaseModule],
  providers: [LanguageResolver, PrismaService],
  exports: []
})
export class LanguageModule {}
