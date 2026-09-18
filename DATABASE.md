# WORLD Database — production map

Use the existing single Appwrite database `6aa5175700159ea99cb8`. Do not create a second database on the Free plan.

## Existing collections
- Users: `6aaa2a34003681b87ac5`
- Moments: `6aa517d80020820efcb0`
- Participants: `6aaa2ced00214fa332b5`
- Reactions: `6aaa2ffd00040fbf4bee`
- Follows: `6aaa30da000a4707eba3`
- Reports: `6aaa32a1000082d07a73`
- Comments: `6aaa2edb002d5a668746` (verify in Appwrite if your console shows a different Comments ID)
- Media bucket: `6aaaa1b70013c346455e`

## Required Users attributes
`userId` string 128 required; `username` string 30 required; `displayName` string 100 required; `avatarId` string 100 required; `bio` string 500 required; `visibility` string 20 required; integer counts `followersCount`, `followingCount`, `subscribersCount`, `subscriptionsCount`, `momentsCount` required with default 0.

## Required Subscriptions collection
Follow and Subscribe are intentionally different relationships. Create a collection named `Subscriptions` in the existing database with:
- `userId` string 128 required
- `targetUserId` string 128 required
- `createdAt` datetime required

Set collection permissions: Read = Any; Create/Update/Delete = Users. Set document permissions to Read Any + Create/Update/Delete for the creating user. Then add the collection ID to Vercel environment variable `VITE_WORLD_SUBSCRIPTIONS_COLLECTION_ID` and redeploy. The UI will keep Subscribe visibly separate from Follow.

## Moment attributes
`ownerId` string 128 required; `visibility` string 20 required; `title` string 200 required; `description` string 2000 optional; `category` string 30 required; `imageUrl` string 1000 optional; `latitude` string 30 optional; `longitude` string 30 optional; `expiresAt` datetime required; `participantsCount` integer required default 0; `reactionsCount` integer required default 0; `commentsCount` integer required default 0; `status` string 20 required default `active`.

## Security
Authenticated users should have collection Create/Update/Delete. Do not grant public/Any Create in production. Moment reads can be public. Document permissions should give the owner create/update/delete where appropriate.
