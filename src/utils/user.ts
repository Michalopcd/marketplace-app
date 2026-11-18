import type { PublicUser, User } from '../types/user'

/**
 * Strips private fields (e.g. email) before user data is shown to other users.
 * Needed at runtime: TypeScript lets a `User` be passed where a `PublicUser` is
 * expected, so the email would otherwise still be present on the object.
 */
export function toPublicUser({
  id,
  name,
  avatarUrl,
  bio,
  location,
  createdAt,
}: User): PublicUser {
  return { id, name, avatarUrl, bio, location, createdAt }
}
