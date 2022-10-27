import { Module } from '@nestjs/common'
import { DatabaseModule } from '@core/nest/database/DatabaseModule'
import { PrismaService } from '../../lib/prisma.service'
import { VideoTagResolver } from './tag.resolver'

@Module({
  imports: [DatabaseModule],
  providers: [VideoTagResolver, PrismaService],
  exports: []
})
export class VideoTagModule {}
