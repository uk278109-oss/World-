import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite'
import {
  APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, WORLD_DATABASE_ID,
  USERS_COLLECTION_ID, MOMENTS_COLLECTION_ID, PARTICIPANTS_COLLECTION_ID,
  REACTIONS_COLLECTION_ID, FOLLOWS_COLLECTION_ID, REPORTS_COLLECTION_ID,
  COMMENTS_COLLECTION_ID, WORLD_MEDIA_BUCKET_ID
} from '../config/appwrite'

export const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const COLLECTIONS = {
  users: USERS_COLLECTION_ID, moments: MOMENTS_COLLECTION_ID, participants: PARTICIPANTS_COLLECTION_ID,
  reactions: REACTIONS_COLLECTION_ID, follows: FOLLOWS_COLLECTION_ID, reports: REPORTS_COLLECTION_ID,
  comments: COMMENTS_COLLECTION_ID
}
export const DATABASE_ID = WORLD_DATABASE_ID

const publicRead = [Permission.read(Role.any())]
const ownWrite = userId => [Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))]

export async function getCurrentUser() { try { return await account.get() } catch { return null } }
export async function login(email, password) { return account.createEmailPasswordSession(email, password) }
export async function register(email, password, name) {
  const u = await account.create(ID.unique(), email, password, name)
  await account.createEmailPasswordSession(email, password)
  await ensureUserDocument(u)
  return u
}
export async function logout() { try { await account.deleteSession('current') } catch {} }

export async function ensureUserDocument(user) {
  try { return await databases.getDocument(DATABASE_ID, COLLECTIONS.users, user.$id) } catch (e) {
    return databases.createDocument(DATABASE_ID, COLLECTIONS.users, user.$id, {
      userId: user.$id,
      username: (user.name || user.email?.split('@')[0] || 'world').replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 30) || 'worlduser',
      displayName: (user.name || 'WORLD User').slice(0, 100), avatarId: '', bio: '', visibility: 'public',
      followersCount: 0, followingCount: 0, momentsCount: 0
    }, [...publicRead, ...ownWrite(user.$id)])
  }
}
export async function getUserProfile(userId) { return databases.getDocument(DATABASE_ID, COLLECTIONS.users, userId) }
export async function updateUserProfile(userId, data) {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.users, userId, {
    username: data.username, displayName: data.displayName, bio: data.bio, visibility: data.visibility
  })
}
export async function listUsers(search = '') {
  const r = await databases.listDocuments(DATABASE_ID, COLLECTIONS.users, [Query.orderDesc('$createdAt'), Query.limit(100)])
  const q = search.trim().toLowerCase()
  return q ? r.documents.filter(u => `${u.username} ${u.displayName || ''}`.toLowerCase().includes(q)).slice(0, 30) : r.documents.slice(0, 30)
}

export async function listMoments() {
  const r = await databases.listDocuments(DATABASE_ID, COLLECTIONS.moments, [Query.equal('status', 'active'), Query.orderDesc('$createdAt'), Query.limit(100)])
  const now = Date.now()
  return r.documents.filter(m => !m.expiresAt || new Date(m.expiresAt).getTime() > now)
}
export async function listUserMoments(userId) {
  const r = await databases.listDocuments(DATABASE_ID, COLLECTIONS.moments, [Query.equal('ownerId', userId), Query.orderDesc('$createdAt'), Query.limit(50)])
  return r.documents
}
export async function createMoment(userId, data) {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.moments, ID.unique(), {
    ownerId: userId, visibility: data.visibility || 'nearby', title: data.title.trim(), description: (data.description || '').trim(),
    category: data.category || 'do', imageUrl: data.imageUrl || '', latitude: data.latitude || '', longitude: data.longitude || '',
    expiresAt: data.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), participantsCount: 0,
    reactionsCount: 0, commentsCount: 0, status: 'active'
  }, [...publicRead, ...ownWrite(userId)])
  try {
    const p = await getUserProfile(userId)
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.users, userId, { momentsCount: Number(p.momentsCount || 0) + 1 })
  } catch {}
  return doc
}
export async function joinMoment(momentId, userId) {
  const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.participants, [Query.equal('momentId', momentId), Query.equal('userId', userId), Query.limit(1)])
  if (existing.documents.length) return existing.documents[0]
  const d = await databases.createDocument(DATABASE_ID, COLLECTIONS.participants, ID.unique(), {
    momentId, userId, joinedAt: new Date().toISOString(), status: 'joined'
  }, [...publicRead, ...ownWrite(userId)])
  try {
    const m = await databases.getDocument(DATABASE_ID, COLLECTIONS.moments, momentId)
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.moments, momentId, { participantsCount: Number(m.participantsCount || 0) + 1 })
  } catch {}
  return d
}
export async function reactToMoment(momentId, userId, type = 'like') {
  const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.reactions, [Query.equal('momentId', momentId), Query.equal('userId', userId), Query.limit(1)])
  if (existing.documents.length) return existing.documents[0]
  const d = await databases.createDocument(DATABASE_ID, COLLECTIONS.reactions, ID.unique(), { momentId, userId, type, createdAt: new Date().toISOString() }, [...publicRead, ...ownWrite(userId)])
  try {
    const m = await databases.getDocument(DATABASE_ID, COLLECTIONS.moments, momentId)
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.moments, momentId, { reactionsCount: Number(m.reactionsCount || 0) + 1 })
  } catch {}
  return d
}
export async function addComment(momentId, userId, text) {
  const d = await databases.createDocument(DATABASE_ID, COLLECTIONS.comments, ID.unique(), { momentId, userId, text: text.trim(), createdAt: new Date().toISOString() }, [...publicRead, ...ownWrite(userId)])
  try {
    const m = await databases.getDocument(DATABASE_ID, COLLECTIONS.moments, momentId)
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.moments, momentId, { commentsCount: Number(m.commentsCount || 0) + 1 })
  } catch {}
  return d
}
export async function listComments(momentId) {
  const r = await databases.listDocuments(DATABASE_ID, COLLECTIONS.comments, [Query.equal('momentId', momentId), Query.orderDesc('createdAt'), Query.limit(50)])
  return r.documents
}
export async function followUser(userId, targetUserId) {
  if (userId === targetUserId) throw new Error('You cannot follow yourself.')
  const e = await databases.listDocuments(DATABASE_ID, COLLECTIONS.follows, [Query.equal('userId', userId), Query.equal('targetUserId', targetUserId), Query.limit(1)])
  if (e.documents.length) return e.documents[0]
  const d = await databases.createDocument(DATABASE_ID, COLLECTIONS.follows, ID.unique(), { userId, targetUserId, createdAt: new Date().toISOString() }, [...publicRead, ...ownWrite(userId)])
  try {
    const [me, target] = await Promise.all([getUserProfile(userId), getUserProfile(targetUserId)])
    await Promise.all([
      databases.updateDocument(DATABASE_ID, COLLECTIONS.users, userId, { followingCount: Number(me.followingCount || 0) + 1 }),
      databases.updateDocument(DATABASE_ID, COLLECTIONS.users, targetUserId, { followersCount: Number(target.followersCount || 0) + 1 })
    ])
  } catch {}
  return d
}
export async function unfollowUser(userId, targetUserId) {
  const e = await databases.listDocuments(DATABASE_ID, COLLECTIONS.follows, [Query.equal('userId', userId), Query.equal('targetUserId', targetUserId), Query.limit(1)])
  if (!e.documents.length) return
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.follows, e.documents[0].$id)
  try {
    const [me, target] = await Promise.all([getUserProfile(userId), getUserProfile(targetUserId)])
    await Promise.all([
      databases.updateDocument(DATABASE_ID, COLLECTIONS.users, userId, { followingCount: Math.max(0, Number(me.followingCount || 0) - 1) }),
      databases.updateDocument(DATABASE_ID, COLLECTIONS.users, targetUserId, { followersCount: Math.max(0, Number(target.followersCount || 0) - 1) })
    ])
  } catch {}
}
export async function isFollowing(userId, targetUserId) {
  if (!userId || !targetUserId) return false
  const r = await databases.listDocuments(DATABASE_ID, COLLECTIONS.follows, [Query.equal('userId', userId), Query.equal('targetUserId', targetUserId), Query.limit(1)])
  return !!r.documents.length
}
export async function listActivity(userId) {
  const out = []
  for (const [key, col, field] of [['joins', COLLECTIONS.participants, 'userId'], ['reactions', COLLECTIONS.reactions, 'userId'], ['comments', COLLECTIONS.comments, 'userId']]) {
    try {
      const r = await databases.listDocuments(DATABASE_ID, col, [Query.equal(field, userId), Query.orderDesc('createdAt'), Query.limit(20)])
      r.documents.forEach(x => out.push({ ...x, _type: key }))
    } catch {}
  }
  return out.sort((a, b) => new Date(b.createdAt || b.$createdAt) - new Date(a.createdAt || a.$createdAt)).slice(0, 30)
}
export async function listNotifications(userId) {
  const mine = await listUserMoments(userId)
  if (!mine.length) return []
  const out = []
  for (const m of mine.slice(0, 30)) {
    for (const [col, type] of [[COLLECTIONS.participants, 'joined'], [COLLECTIONS.reactions, 'reacted'], [COLLECTIONS.comments, 'commented']]) {
      try {
        const r = await databases.listDocuments(DATABASE_ID, col, [Query.equal('momentId', m.$id), Query.orderDesc('createdAt'), Query.limit(20)])
        r.documents.filter(x => x.userId !== userId).forEach(x => out.push({ ...x, _type: type, momentTitle: m.title }))
      } catch {}
    }
  }
  return out.sort((a, b) => new Date(b.createdAt || b.$createdAt) - new Date(a.createdAt || a.$createdAt)).slice(0, 50)
}
export async function uploadMedia(file) {
  if (!file) return ''
  const created = await storage.createFile(WORLD_MEDIA_BUCKET_ID, ID.unique(), file)
  return storage.getFileView(WORLD_MEDIA_BUCKET_ID, created.$id).toString()
}
export async function createReport(userId, targetType, targetId, reason) {
  return databases.createDocument(DATABASE_ID, COLLECTIONS.reports, ID.unique(), { reporterId: userId, targetType, targetId, reason: reason.trim(), status: 'open' }, [...publicRead, ...ownWrite(userId)])
}
export { ID, Query }
