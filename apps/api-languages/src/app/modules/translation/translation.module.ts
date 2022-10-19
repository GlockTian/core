import { Module } from '@nestjs/common'
import { DatabaseModule } from '@core/nest/database/DatabaseModule'
import { PrismaService } from '../../lib/prisma.service'
import { TranslationResolver } from './translation.resolver'

@Module({
  imports: [DatabaseModule],
  providers: [PrismaService, TranslationResolver],
  exports: [TranslationResolver]
})
export class TranslationModule {}
