import { TranslationField } from '@core/nest/decorators/TranslationField'
import { Inject } from '@nestjs/common'
import {
  Resolver,
  Query,
  Args,
  Info,
  ResolveReference,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { PrismaService } from '../../lib/prisma.service'
import { Video, VideoType, PrismaClient } from '.prisma/api-videos-client'

export enum IdType {
  databaseId = 'databaseId',
  slug = 'slug'
}

type Nullable<T> = T | null
export class VideosFilter {
  availableVariantLanguageIds?: Nullable<string[]>
  title?: Nullable<string>
  tagId?: Nullable<string>
  types?: Nullable<VideoType[]>
}

@Resolver('Video')
export class VideoResolver {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}

  @Query('episodes')
  async episodesQuery(
    @Info() info,
    @Args('playlistId') playlistId: string,
    @Args('idType') idType: IdType = IdType.databaseId,
    @Args('where') where?: VideosFilter,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number
  ): Promise<Video[]> {
    const variantLanguageId = info.fieldNodes[0].selectionSet.selections
      .find(({ name }) => name.value === 'variant')
      ?.arguments.find(({ name }) => name.value === 'languageId')?.value?.value

    const videoWhere = {
      id: idType === IdType.databaseId ? playlistId : undefined,
      slug:
        idType === IdType.slug ? { some: { value: playlistId } } : undefined,
      tagId: where?.tagId ?? undefined,
      title:
        where?.title == null ? undefined : { some: { value: where.title } },
      variantLanguageId,
      types: where?.types ?? undefined,
      variantLanguageIds: {
        in: where?.availableVariantLanguageIds ?? undefined
      }
    }

    return await this.prismaService.video.findMany({
      where: videoWhere,
      take: limit,
      skip: offset
    })
  }

  @Query()
  async videos(
    @Info() info,
    @Args('where') where?: VideosFilter,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number
  ): Promise<Video[]> {
    const variantLanguageId = info.fieldNodes[0].selectionSet.selections
      .find(({ name }) => name.value === 'variant')
      ?.arguments.find(({ name }) => name.value === 'languageId')?.value?.value

    const videoWhere = {
      tagId: where?.tagId ?? undefined,
      title:
        where?.title == null ? undefined : { some: { value: where.title } },
      variantLanguageId,
      types: where?.types ?? undefined,
      variantLanguageIds: {
        in: where?.availableVariantLanguageIds ?? undefined
      }
    }

    return await this.prismaService.video.findMany({
      where: videoWhere,
      skip: offset,
      take: limit
    })
  }

  @Query()
  async video(
    @Info() info,
    @Args('id') id: string,
    @Args('idType') idType: IdType = IdType.databaseId
  ): Promise<Video | null> {
    const variantLanguageId = info.fieldNodes[0].selectionSet.selections
      .find(({ name }) => name.value === 'variant')
      ?.arguments.find(({ name }) => name.value === 'languageId')?.value?.value
    return idType === IdType.databaseId
      ? await this.prismaService.video.findFirst({
          where: { id, variantLanguageIds: { has: variantLanguageId } }
        })
      : await this.prismaService.video.findFirst({
          where: {
            slug: { some: { value: id } },
            variantLanguageIds: { has: variantLanguageId }
          }
        })
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: 'Video'
    id: string
    primaryLanguageId?: string | null
  }): Promise<Video | null> {
    return await this.prismaService.video.findFirst({
      where: {
        id: reference.id,
        primaryLanguageId: reference.primaryLanguageId ?? undefined
      }
    })
  }

  @ResolveField()
  async episodes(@Parent() video: Video): Promise<Video[] | null> {
    return video.episodeIds != null
      ? await this.prismaService.video.findMany({
          where: { id: { in: video.episodeIds } }
        })
      : null
  }

  @ResolveField()
  @TranslationField('title')
  title(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('seoTitle')
  seoTitle(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('snippet')
  snippet(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('description')
  description(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('studyQuestions')
  studyQuestions(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('imageAlt')
  imageAlt(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}

  @ResolveField()
  @TranslationField('slug')
  slug(
    @Parent() language,
    @Args('languageId') languageId?: string,
    @Args('primary') primary?: boolean
  ): void {}
}
