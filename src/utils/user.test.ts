import { describe, expect, it } from 'vitest'
import { mockUsers } from '../data/mockUsers'
import { toPublicUser } from './user'

describe('toPublicUser', () => {
  it('removes the email and keeps public fields', () => {
    const user = mockUsers[0]
    const publicUser = toPublicUser(user)

    expect(publicUser).not.toHaveProperty('email')
    expect(publicUser).toEqual({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
    })
  })

  it('does not mutate the source user', () => {
    const user = mockUsers[0]
    toPublicUser(user)

    expect(user.email).toBeTruthy()
  })
})
