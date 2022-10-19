import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../lib/prisma.service'
import { LanguageResolver } from './language.resolver'

describe('LangaugeResolver', () => {
  let resolver: LanguageResolver, prisma: PrismaService

  const language = {
    id: '20615',
    bcp47: 'zh',
    name: [
      {
        value: '普通話',
        primary: true,
        languageId: '20615'
      },
      {
        value: 'Chinese, Mandarin',
        primary: false,
        languageId: '529'
      }
    ]
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguageResolver, PrismaService]
    }).compile()
    resolver = module.get<LanguageResolver>(LanguageResolver)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('languages', () => {
    it('returns Languages', async () => {
      prisma.language.findMany = jest
        .fn()
        .mockReturnValueOnce([language, language])
      expect(await resolver.languages(1, 2)).toEqual([language, language])
      expect(prisma.language.findMany).toHaveBeenCalledWith({
        include: { name: true },
        skip: 1,
        take: 2
      })
    })
  })

  describe('language', () => {
    it('should return language', async () => {
      prisma.language.findUnique = jest.fn().mockReturnValueOnce(language)
      expect(await resolver.language(language.id)).toEqual(language)
      expect(prisma.language.findUnique).toHaveBeenCalledWith({
        where: { id: language.id }
      })
    })
  })

  describe('name', () => {
    it('should return translations', () => {
      prisma.language.findUnique = jest.fn().mockReturnValueOnce(language)
      expect(resolver.name(language)).toEqual(language.name)
    })

    it('should return translations filtered by languageId', () => {
      prisma.language.findUnique = jest.fn().mockReturnValueOnce(language)
      expect(resolver.name(language, '529')).toEqual([language.name[1]])
    })

    it('should return translations filtered by primary', () => {
      prisma.language.findUnique = jest.fn().mockReturnValueOnce(language)
      expect(resolver.name(language, undefined, true)).toEqual([
        language.name[0]
      ])
    })
  })

  describe('resolveReference', () => {
    it('should return language', async () => {
      prisma.language.findUnique = jest.fn().mockReturnValueOnce(language)
      expect(
        await resolver.resolveReference({
          __typename: 'Language',
          id: language.id
        })
      ).toEqual(language)
    })
  })
})
