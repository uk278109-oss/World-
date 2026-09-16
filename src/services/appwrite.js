import { Client, Account, Databases, ID, Query, Permission, Role } from 'appwrite'

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'
const PROJECT_ID = '6aa5127e001ea31b0f77'
const DATABASE_ID = '6aaa2edb002d5a668746'

const COLLECTIONS = {
  users: '6aaa2a34003681b87ac5',
  moments: '6aa517d80020820efcb0',
  participants: '6aaa2ced00214fa332b5',
  reactions: '6aaa2ffd00040fbf4bee',
  follows: '6aaa30da000a4707eba3',
  reports: '6aaa32a1000082d07a73',
  comments: '6aaa2edb002d5a668746'
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)
export const account = new Account(client)
export const databases = new Databases(client)

export async function getCurrentUser() {
  try { return await account.get() } catch { return null }
}

export async function login(email, password) {
  return account.createEmailPasswordSession(email, password)
}

export async function register(email, password, name) {
  const user = await account.create(ID.unique(), email, password, name)
  await account.createEmailPasswordSession(email, password)
  return user
}

export async function logout() {
  try { await account.deleteSession('current') } catch {}
}

export async function ensureUserDocument(user) {
  try { return await databases.getDocument(DATABASE_ID, COLLECTIONS.users, user.$id) } catch {}
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.users,
    user.$id,
    {
      userId: user.$id,
      username: (user.name || user.email?.split('@')[0] || 'world').slice(0, 30),
      displayName: (user.name || 'WORLD User').slice(0, 100),
      avatarId: '',
      bio: '',
      visibility: 'public',
      followersCount: 0,
      followingCount: 0,
      momentsCount: 0
    },
    [Permission.read(Role.any()), Permission.update(Role.user(user.$id))]
  )
}

export async function listMoments() {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.moments, [
    Query.equal('status', 'active'),
    Query.orderDesc('$createdAt'),
    Query.limit(30)
  ])
  const now = Date.now()
  return result.documents.filter(m => !m.expiresAt || new Date(m.expiresAt).getTime() > now)
}

export async function createMoment(userId, data) {
  const expiresAt = data.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.moments,
    ID.unique(),
    {
      ownerId: userId,
      visibility: data.visibility || 'nearby',
      title: data.title,
      description: data.description || '',
      category: data.category || 'do',
      imageUrl: '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      expiresAt,
      participantsCount: 0,
      reactionsCount: 0,
      commentsCount: 0,
      status: 'active'
    },
    [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))]
  )
}

export async function joinMoment(momentId, userId) {
  const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.participants, [
    Query.equal('momentId', momentId), Query.equal('userId', userId), Query.limit(1)
  ])
  if (existing.documents.length) return existing.documents[0]
  const doc = await databases.createDocument(
    DATABASE_ID, COLLECTIONS.participants, ID.unique(),
    { momentId, userId, joinedAt: new Date().toISOString(), status: 'joined' },
    [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))]
  )
  const moment = await databases.getDocument(DATABASE_ID, COLLECTIONS.moments, momentId)
  await databases.updateDocument(DATABASE_ID, COLLECTIONS.moments, momentId, {
    participantsCount: Number(moment.participantsCount || 0) + 1
  })
  return doc
}

export async function reactToMoment(momentId, userId, type = 'like') {
  const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.reactions, [
    Query.equal('momentId', momentId), Query.equal('userId', userId), Query.limit(1)
  ])
  if (existing.documents.length) return existing.documents[0]
  const doc = await databases.createDocument(
    DATABASE_ID, COLLECTIONS.reactions, ID.unique(),
    { momentId, userId, type, createdAt: new Date().toISOString() },
    [Permission.read(Role.any()), Permission.delete(Role.user(userId))]
  )
  const moment = await databases.getDocument(DATABASE_ID, COLLECTIONS.moments, momentId)
  await databases.updateDocument(DATABASE_ID, COLLECTIONS.moments, momentId, {
    reactionsCount: Number(moment.reactionsCount || 0) + 1
  })
  return doc
}

export async function addComment(momentId, userId, text) {
  const doc = await databases.createDocument(
    DATABASE_ID, COLLECTIONS.comments, ID.unique(),
    { momentId, userId, text, createdAt: new Date().toISOString() },
    [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))]
  )
  const moment = await databases.getDocument(DATABASE_ID, COLLECTIONS.moments, momentId)
  await databases.updateDocument(DATABASE_ID, COLLECTIONS.moments, momentId, {
    commentsCount: Number(moment.commentsCount || 0) + 1
  })
  return doc
}

export { ID, Query, COLLECTIONS, DATABASE_ID }
