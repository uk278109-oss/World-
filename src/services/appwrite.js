import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite'
import {
  APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, WORLD_DATABASE_ID,
  USERS_COLLECTION_ID, MOMENTS_COLLECTION_ID, PARTICIPANTS_COLLECTION_ID,
  REACTIONS_COLLECTION_ID, FOLLOWS_COLLECTION_ID, REPORTS_COLLECTION_ID,
  COMMENTS_COLLECTION_ID, WORLD_MEDIA_BUCKET_ID
} from '../config/appwrite'

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const config = { databaseId: WORLD_DATABASE_ID, usersCollectionId: USERS_COLLECTION_ID, momentsCollectionId: MOMENTS_COLLECTION_ID, participantsCollectionId: PARTICIPANTS_COLLECTION_ID, reactionsCollectionId: REACTIONS_COLLECTION_ID, followsCollectionId: FOLLOWS_COLLECTION_ID, reportsCollectionId: REPORTS_COLLECTION_ID, commentsCollectionId: COMMENTS_COLLECTION_ID, bucketId: WORLD_MEDIA_BUCKET_ID }

const safe = async (fn, fallback = null) => { try { return await fn() } catch { return fallback } }
export const getCurrentUser = () => safe(() => account.get(), null)
export const logout = () => account.deleteSession('current')
export const login = (email, password) => account.createEmailPasswordSession(email, password)
export const register = async (email, password, name) => { const u = await account.create(ID.unique(), email, password, name); await account.createEmailPasswordSession(email, password); return u }

export async function ensureUserDocument(user) {
  const existing = await safe(() => databases.getDocument(WORLD_DATABASE_ID, USERS_COLLECTION_ID, user.$id), null)
  if (existing) return existing
  return databases.createDocument(WORLD_DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
    userId: user.$id, username: (user.name || user.email?.split('@')[0] || 'world').slice(0,30),
    displayName: (user.name || 'WORLD User').slice(0,100), avatarId: '', bio: '', visibility: 'public',
    followersCount: 0, followingCount: 0, momentsCount: 0
  }, [Permission.read(Role.any()), Permission.update(Role.user(user.$id))])
}

export async function listMoments() {
  const result = await databases.listDocuments(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, [Query.equal('status','active'), Query.orderDesc('$createdAt'), Query.limit(30)])
  return result.documents.filter(m => !m.expiresAt || new Date(m.expiresAt) > new Date())
}
export async function createMoment(data, userId) {
  const expiresAt = data.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  return databases.createDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, ID.unique(), {
    ownerId: userId, visibility: data.visibility || 'nearby', title: data.title, description: data.description || '',
    category: data.category || 'do', imageUrl: data.imageUrl || '', latitude: data.latitude || '', longitude: data.longitude || '',
    expiresAt, participantsCount: 0, reactionsCount: 0, commentsCount: 0, status: 'active'
  }, [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))])
}
export async function joinMoment(momentId, userId) {
  const existing = await safe(() => databases.listDocuments(WORLD_DATABASE_ID, PARTICIPANTS_COLLECTION_ID, [Query.equal('momentId', momentId), Query.equal('userId', userId), Query.limit(1)]), null)
  if (existing?.documents?.length) return existing.documents[0]
  const doc = await databases.createDocument(WORLD_DATABASE_ID, PARTICIPANTS_COLLECTION_ID, ID.unique(), { momentId, userId, joinedAt: new Date().toISOString(), status: 'joined' }, [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))])
  const m = await databases.getDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, momentId)
  await databases.updateDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, momentId, { participantsCount: Number(m.participantsCount || 0) + 1 })
  return doc
}
export async function reactToMoment(momentId, userId, type='like') {
  const existing = await safe(() => databases.listDocuments(WORLD_DATABASE_ID, REACTIONS_COLLECTION_ID, [Query.equal('momentId', momentId), Query.equal('userId', userId), Query.limit(1)]), null)
  if (existing?.documents?.length) return existing.documents[0]
  const doc = await databases.createDocument(WORLD_DATABASE_ID, REACTIONS_COLLECTION_ID, ID.unique(), { momentId, userId, type, createdAt: new Date().toISOString() }, [Permission.read(Role.any()), Permission.delete(Role.user(userId))])
  const m = await databases.getDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, momentId)
  await databases.updateDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, momentId, { reactionsCount: Number(m.reactionsCount || 0) + 1 })
  return doc
}
export async function addComment(momentId, userId, text) {
  const doc = await databases.createDocument(WORLD_DATABASE_ID, COMMENTS_COLLECTION_ID, ID.unique(), { momentId, userId, text, createdAt: new Date().toISOString() }, [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))])
  const m = await databases.getDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, momentId)
  await databases.updateDocument(WORLD_DATABASE_ID, MOMENTS_COLLECTION_ID, momentId, { commentsCount: Number(m.commentsCount || 0) + 1 })
  return doc
}
export async function uploadMedia(file) { return storage.createFile(WORLD_MEDIA_BUCKET_ID, ID.unique(), file) }
export function mediaPreview(fileId) { return storage.getFilePreview(WORLD_MEDIA_BUCKET_ID, fileId).toString() }
export async function followUser(userId, targetUserId) { return databases.createDocument(WORLD_DATABASE_ID, FOLLOWS_COLLECTION_ID, ID.unique(), { userId, targetUserId, createdAt: new Date().toISOString() }, [Permission.read(Role.any()), Permission.delete(Role.user(userId))]) }
export async function reportTarget(reporterId, targetType, targetId, reason) { return databases.createDocument(WORLD_DATABASE_ID, REPORTS_COLLECTION_ID, ID.unique(), { reporterId, targetType, targetId, reason, status: 'open' }) }
export { ID, Query }
