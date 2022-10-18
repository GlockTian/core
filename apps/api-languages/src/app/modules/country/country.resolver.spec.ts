import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../lib/prisma.service'
import { IdType } from '../../__generated__/graphql'
import { CountryResolver } from './country.resolver'

describe('LangaugeResolver', () => {
  let resolver: CountryResolver, prisma: PrismaService

  const country = {
    id: 'US',
    name: [{ value: 'United States', languageId: '529', primary: true }],
    population: 500000000,
    continent: [{ value: 'North America', languageId: '529', primary: true }],
    slug: [{ value: 'United-States', languageId: '529', primary: true }],
    languageIds: ['529'],
    latitude: 10,
    longitude: -20.1
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryResolver, PrismaService]
    }).compile()
    resolver = module.get<CountryResolver>(CountryResolver)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('countries', () => {
    it('returns Countries', async () => {
      prisma.country.findMany = jest
        .fn()
        .mockReturnValueOnce([country, country])
      expect(await resolver.countries()).toEqual([country, country])
      expect(prisma.country.findMany).toHaveBeenCalledWith({
        include: { continent: true, languages: true, name: true, slug: true }
      })
    })
  })

  describe('country', () => {
    beforeEach(() => {
      prisma.country.findUnique = jest.fn().mockReturnValueOnce(country)
    })
    it('should return country', async () => {
      expect(await resolver.country(country.id)).toEqual(country)
      expect(prisma.country.findUnique).toHaveBeenCalledWith({
        include: { continent: true, languages: true, name: true, slug: true },
        where: { id: country.id }
      })
    })

    it('should return country by slug', async () => {
      prisma.countrySlugTranslation.findFirst = jest
        .fn()
        .mockReturnValueOnce({ countryId: country.id })
      expect(await resolver.country(country.id, IdType.slug)).toEqual(country)
      expect(prisma.countrySlugTranslation.findFirst).toHaveBeenCalledWith({
        select: { countryId: true },
        where: { value: 'US' }
      })
      expect(prisma.country.findUnique).toHaveBeenCalledWith({
        include: { continent: true, languages: true, name: true, slug: true },
        where: { id: country.id }
      })
    })
  })

  describe('name', () => {
    it('should return translations', () => {
      expect(resolver.name(country)).toEqual(country.name)
    })

    it('should return translations filtered by countryId', () => {
      expect(resolver.name(country, '529')).toEqual([country.name[0]])
    })

    it('should return translations filtered by primary', () => {
      expect(resolver.name(country, undefined, true)).toEqual([country.name[0]])
    })
  })

  describe('slug', () => {
    it('should return translations', () => {
      expect(resolver.slug(country)).toEqual(country.slug)
    })

    it('should return translations filtered by countryId', () => {
      expect(resolver.slug(country, '529')).toEqual([country.slug[0]])
    })

    it('should return translations filtered by primary', () => {
      expect(resolver.slug(country, undefined, true)).toEqual([country.slug[0]])
    })
  })

  describe('continent', () => {
    it('should return translations', () => {
      expect(resolver.continent(country)).toEqual(country.continent)
    })

    it('should return translations filtered by countryId', () => {
      expect(resolver.continent(country, '529')).toEqual([country.continent[0]])
    })

    it('should return translations filtered by primary', () => {
      expect(resolver.continent(country, undefined, true)).toEqual([
        country.continent[0]
      ])
    })
  })

  describe('resolveReference', () => {
    it('should return country', async () => {
      expect(
        await resolver.resolveReference({
          __typename: 'Country',
          id: country.id
        })
      ).toEqual(country)
    })
  })
})
