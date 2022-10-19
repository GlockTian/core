import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../lib/prisma.service'
import { TranslationResolver } from './translation.resolver'

describe('Translation Resolver', () => {
  let resolver: TranslationResolver, prisma: PrismaService

  const translation = [
    {
      value: 'Teke, Central',
      languageId: '529',
      primary: true
    }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationResolver, PrismaService]
    }).compile()
    resolver = module.get<TranslationResolver>(TranslationResolver)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should return the translation', async () => {
    prisma.language.findUnique = jest.fn().mockReturnValueOnce(translation)
    expect(await resolver.language(translation)).toEqual(translation)
  })
})
