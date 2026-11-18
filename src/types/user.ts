export type UserId = string

export interface PublicUser {
  id: UserId
  name: string
  avatarUrl: string | null
  bio: string
  location: string
  createdAt: string
}

export interface User extends PublicUser {
  email: string
}