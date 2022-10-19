import {
  Resolver,
  Query,
  Args,
  ResolveField,
  ResolveReference,
  Parent
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { TranslationField } from '@core/nest/decorators/TranslationField'
import { PrismaService } from '../../lib/prisma.service'
import { Language } from '.prisma/api-languages-client'

export enum LanguageIdType {
  databaseId = 'databaseId',
  bcp47 = 'bcp47'
}

@Resolver('Language')
export class LanguageResolver {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @Query()
  async languages(
    @Args('offset') offset: number,
    @Args('limit') limit: number
  ): Promise<Language[]> {
    return await this.prismaService.language.findMany({
      include: { name: { include: { language: true } } },
      skip: offset,
      take: limit
    })
  }

  @Query()
  async language(
    @Args('id') id: string,
    @Args('idType') idType = LanguageIdType.databaseId
  ): Promise<Language | null> {
    return idType === LanguageIdType.databaseId
      ? await this.prismaService.language.findUnique({
          where: { id },
          include: { name: true }
        })
      : await this.prismaService.language.findFirst({
          where: { bcp47: id },
          include: { name: true }
        })
  }

  @ResolveField()
  @TranslationField('name')
  name(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveReference()
  async resolveReference(reference: {
    __typename: 'Language'
    id: string
  }): Promise<Language | null> {
    return await this.prismaService.language.findUnique({
      where: { id: reference.id },
      include: { name: true }
    })
  }
}
