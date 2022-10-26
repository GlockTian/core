import { Module } from '@nestjs/common'
import { DatabaseModule } from '@core/nest/database/DatabaseModule'
import { PrismaService } from '../../lib/prisma.service'
import { VideoResolver } from './video.resolver'

@Module({
  imports: [DatabaseModule],
  providers: [VideoResolver, PrismaService],
  exports: []
})
export class VideoModule {}
