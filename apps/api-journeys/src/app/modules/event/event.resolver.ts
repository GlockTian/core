import { ResolveField, Resolver } from '@nestjs/graphql'
import { Event } from '../../__generated__/graphql' // change
import { EventService } from './event.service'

export interface DbEvent extends Event {
  __typename: string
}
@Resolver('Event')
export class EventResolver {
  constructor(private readonly eventService: EventService) {}
  @ResolveField()
  __resolveType(obj: DbEvent): string {
    return obj.__typename
  }
}
