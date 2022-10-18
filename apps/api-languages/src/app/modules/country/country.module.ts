import { Module } from '@nestjs/common'
import { DatabaseModule } from '@core/nest/database/DatabaseModule'
import { PrismaService } from '../../lib/prisma.service'
import { CountryResolver } from './country.resolver'

@Module({
  imports: [DatabaseModule],
  providers: [CountryResolver, PrismaService],
  exports: []
})
export class CountryModule {}
