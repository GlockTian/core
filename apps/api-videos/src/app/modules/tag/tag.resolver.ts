import { Resolver, Query, Args } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'

import { PrismaService } from '../../lib/prisma.service'
import { Tag } from '.prisma/api-videos-client'

@Resolver('VideoTag')
export class VideoTagResolver {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @Query()
  async videoTags(): Promise<Tag[]> {
    return await this.prismaService.tag.findMany({
      include: { title: true }
    })
  }

  @Query()
  async videoTag(@Args('id') id: string): Promise<Tag | null> {
    return await this.prismaService.tag.findUnique({
      where: { id },
      include: { title: true }
    })
  }
}
