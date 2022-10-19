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
import { PrismaService } from '../../lib/prisma.service'
import { Country } from '.prisma/api-countries-client'

export enum IdType {
  databaseId = 'databaseId',
  slug = 'slug'
}

@Resolver('Country')
export class CountryResolver {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @Query()
  async countries(): Promise<Country[]> {
    return (await this.prismaService.country.findMany({
      include: { name: true, slug: true, continent: true }
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
      include: { name: true, slug: true, continent: true }
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
