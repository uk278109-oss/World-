# WORLD database
profiles: userId, username, displayName, avatarId, bio, visibility, createdAt
subscriptions: subscriberId, creatorId, createdAt
connections: requesterId, receiverId, status, createdAt
conversations: type, memberIds, createdAt
messages: conversationId, senderId, body, mediaId, createdAt, status
scenes: creatorId, title, description, spot, visibility, startsAt, endsAt
now_sessions: creatorId, sceneId, title, status, startedAt, endedAt, viewerCount
content: creatorId, type, mediaId, caption, visibility, createdAt
reactions: userId, targetType, targetId, type, createdAt
signals: recipientId, actorId, type, targetId, createdAt, readAt
reports: reporterId, targetType, targetId, reason, status, createdAt
blocks: blockerId, blockedId, createdAt
