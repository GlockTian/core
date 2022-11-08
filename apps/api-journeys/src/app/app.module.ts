import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig
} from '@nestjs/apollo'
import { ActionModule } from './modules/action/action.module'
import { BlockModule } from './modules/block/block.module'
import { JourneyModule } from './modules/journey/journey.module'
import { EventModule } from './modules/event/event.module'
import { UserJourneyModule } from './modules/userJourney/userJourney.module'
import { UserRoleModule } from './modules/userRole/userRole.module'
import { VisitorModule } from './modules/visitor/visitor.module'
import { MemberModule } from './modules/member/member.module'
import { TeamModule } from './modules/team/team.module'

@Module({
  imports: [
    ActionModule,
    BlockModule,
    JourneyModule,
    EventModule,
    MemberModule,
    TeamModule,
    UserJourneyModule,
    UserRoleModule,
    VisitorModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: [
        join(process.cwd(), 'apps/api-journeys/src/app/**/*.graphql'),
        join(process.cwd(), 'assets/**/*.graphql')
      ],
      cors: true,
      context: ({ req }) => ({ headers: req.headers })
    })
  ]
})
export class AppModule {}
