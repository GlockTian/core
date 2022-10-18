import { TranslationField } from '@core/nest/decorators/TranslationField'
import {
  Resolver,
  Query,
  Args,
  ResolveReference,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { IdType } from '../../__generated__/graphql'
import { PrismaService } from '../../lib/prisma.service'
import { Country, Language } from '.prisma/api-languages-client'

@Resolver('Country')
export class CountryResolver {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @Query()
  async countries(): Promise<Country[]> {
    return (await this.prismaService.country.findMany({
      include: { name: true, slug: true, continent: true, languages: true }
    })) as unknown as Country[]
  }

  @Query()
  async country(
    @Args('id') id: string,
    @Args('idType') idType: IdType = IdType.databaseId
  ): Promise<Country | null> {
    let countryId = id
    if (idType !== IdType.databaseId) {
      const result = await this.prismaService.countrySlugTranslation.findFirst({
        where: { value: id },
        select: { countryId: true }
      })
      if (result == null) return null
      countryId = result?.countryId
    }
    return await this.prismaService.country.findUnique({
      where: { id: countryId },
      include: { name: true, slug: true, continent: true, languages: true }
    })
  }

  @ResolveField()
  @TranslationField('name')
  name(
    @Parent() country,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('slug')
  slug(
    @Parent() country,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('continent')
  continent(
    @Parent() country,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  async languages(
    @Parent() country: Country & { languageIds: string[] }
  ): Promise<Language[]> {
    return await this.prismaService.language.findMany({
      where: { id: { in: country.languageIds } }
    })
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: 'Country'
    id: string
  }): Promise<Country | null> {
    return await this.prismaService.country.findUnique({
      where: { id: reference.id }
    })
  }
}
