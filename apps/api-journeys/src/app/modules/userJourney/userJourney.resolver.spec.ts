import { Test, TestingModule } from '@nestjs/testing'
import {
  IdType,
  JourneyStatus,
  Role,
  ThemeMode,
  ThemeName,
  UserJourneyRole
} from '../../__generated__/graphql'
import { UserJourneyService } from '../userJourney/userJourney.service'
import { JourneyService } from '../journey/journey.service'
import { UserRoleService } from '../userRole/userRole.service'
import { UserJourneyResolver } from './userJourney.resolver'

describe('UserJourneyResolver', () => {
  let resolver: UserJourneyResolver, service: UserJourneyService

  const userJourney = {
    id: '1',
    userId: '1',
    journeyId: '1',
    role: UserJourneyRole.editor
  }

  const actorUserJourney = {
    id: '2',
    userId: '2',
    journeyId: '2',
    role: UserJourneyRole.owner
  }

  const openedUserJourney = {
    id: '3',
    userId: '3',
    journeyId: '3',
    role: UserJourneyRole.editor,
    openedAt: '2021-02-18T00:00:00.000Z'
  }

  const publishedAt = new Date('2021-11-19T12:34:56.647Z').toISOString()
  const createdAt = new Date('2021-11-19T12:34:56.647Z').toISOString()

  const userRole = {
    id: 'userRole.id',
    userId: 'user.id',
    roles: [Role.publisher]
  }

  const journey = {
    id: '1',
    title: 'published',
    status: JourneyStatus.published,
    languageId: '529',
    themeMode: ThemeMode.light,
    themeName: ThemeName.base,
    description: null,
    primaryImageBlockId: '2',
    slug: 'published-slug',
    publishedAt,
    createdAt,
    teamId: 'jfp-team'
  }

  const journeyService = {
    provide: JourneyService,
    useFactory: () => ({
      get: jest.fn((id) => (id === journey.id ? journey : undefined)),
      getBySlug: jest.fn((slug) =>
        slug === journey.slug ? journey : undefined
      )
    })
  }

  const userJourneyService = {
    provide: UserJourneyService,
    useFactory: () => ({
      get: jest.fn((key) => {
        if (key === actorUserJourney.id) return actorUserJourney
        return userJourney
      }),
      getAll: jest.fn(() => [userJourney, userJourney]),
      remove: jest.fn((input) => input),
      removeAll: jest.fn(() => [userJourney, userJourney]),
      save: jest.fn((input) => input),
      update: jest.fn((input) => input),
      forJourneyUser: jest.fn((key, userId) => {
        switch (userId) {
          case userJourney.userId:
            return userJourney
          case actorUserJourney.userId:
            return actorUserJourney
          case openedUserJourney.userId:
            return openedUserJourney
          default:
            return null
        }
      }),
      forJourney: jest.fn(() => [userJourney, userJourney]),
      requestAccess: jest.fn(),
      approveAccess: jest.fn()
    })
  }

  const userRoleService = {
    provide: UserRoleService,
    useFactory: () => ({
      getUserRoleById: jest.fn(() => userRole)
    })
  }

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2021-02-18'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserJourneyResolver,
        userJourneyService,
        journeyService,
        userRoleService
      ]
    }).compile()
    resolver = module.get<UserJourneyResolver>(UserJourneyResolver)
    service = await module.resolve(UserJourneyService)
  })

  describe('userJourneyRequest', () => {
    it('creates a UserJourney', async () => {
      await resolver.userJourneyRequest(journey.id, IdType.databaseId, '1')

      expect(service.requestAccess).toHaveBeenCalledWith(
        journey.id,
        IdType.databaseId,
        '1'
      )
    })
  })

  describe('userJourneyApprove', () => {
    it('updates a UserJourney to editor status', async () => {
      await resolver.userJourneyApprove(userJourney.id, actorUserJourney.userId)
      expect(service.approveAccess).toHaveBeenCalledWith(
        userJourney.id,
        actorUserJourney.userId
      )
    })
  })

  describe('userJourneyPromote', () => {
    it('updates a UserJourney to owner status', async () => {
      await resolver.userJourneyPromote(userJourney.id, actorUserJourney.userId)
      expect(service.update).toHaveBeenCalledWith('1', {
        role: UserJourneyRole.owner
      })
      expect(service.update).toHaveBeenCalledWith('2', {
        role: UserJourneyRole.editor
      })
    })
    it('should not update a UserJourney', async () => {
      await expect(
        async () =>
          await resolver.userJourneyPromote(userJourney.id, userJourney.userId)
      ).rejects.toThrow(
        'You do not own this journey, so you cannot make changes to it'
      )
      expect(service.update).not.toHaveBeenCalled()
    })
    it('should not update a UserJourney scenario 2', async () => {
      await resolver.userJourneyPromote(
        actorUserJourney.id,
        actorUserJourney.userId
      )
      expect(service.update).not.toHaveBeenCalled()
    })
  })

  describe('userJourneyRemove', () => {
    it('removes a UserJourney', async () => {
      await resolver.userJourneyRemove(
        actorUserJourney.id,
        actorUserJourney.userId
      )
      expect(service.remove).toHaveBeenCalledWith(actorUserJourney.id)
    })
  })

  describe('userJourneyRemoveAll', () => {
    it('removes all userJourneys', async () => {
      await resolver.userJourneyRemoveAll(journey.id)
      expect(service.removeAll).toHaveBeenCalledWith([
        userJourney.id,
        userJourney.id
      ])
    })
  })

  describe('UserJourneyOpen', () => {
    it('should update openedAt for userJourney', async () => {
      await resolver.userJourneyOpen(userJourney.id, userJourney.userId)
      expect(service.update).toHaveBeenCalledWith(userJourney.id, {
        openedAt: new Date().toISOString()
      })
    })

    it('should note update openedAt if current user is not userJourney user', async () => {
      await resolver.userJourneyOpen(userJourney.id, 'another.id')
      expect(service.update).not.toHaveBeenCalled()
    })

    it('should note update openedAt if current user has already opened the userJourney', async () => {
      await resolver.userJourneyOpen(
        openedUserJourney.id,
        openedUserJourney.userId
      )
      expect(service.update).not.toHaveBeenCalled()
    })
  })
})
