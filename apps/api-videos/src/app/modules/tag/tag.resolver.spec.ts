import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../lib/prisma.service'
import { VideoTagResolver } from './tag.resolver'
import { tag } from './testData'

describe('VideoTagResolver', () => {
  let resolver: VideoTagResolver, prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, VideoTagResolver]
    }).compile()
    resolver = module.get<VideoTagResolver>(VideoTagResolver)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('returns a tag', async () => {
    prisma.videoTag.findMany = jest.fn().mockReturnValueOnce(tag)
    expect(await resolver.videoTag('JFM1')).toEqual(tag)
    expect(prisma.videoTag.findMany).toHaveBeenCalledWith('JFM1')
  })

  it('returns all tags', async () => {
    prisma.videoTag.findUnique = jest.fn().mockReturnValueOnce([tag, tag])
    expect(await resolver.videoTags()).toEqual([tag, tag])
    expect(prisma.videoTag.findUnique).toHaveBeenCalledWith()
  })
})
