import { Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { PrismaService } from '../../lib/prisma.service'
import { Language } from '.prisma/api-languages-client'

@Resolver('Translation')
export class TranslationResolver {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @ResolveField()
  async language(@Parent() translation): Promise<Language | null> {
    return await this.prismaService.language.findUnique({
      where: { id: translation.languageId }
    })
  }
}
