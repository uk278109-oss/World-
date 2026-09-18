# WORLD — Be There.

Production-oriented mobile-first PWA for the WORLD real-time activity network.

## What is included
- Real Appwrite Email/Password authentication.
- Real Moments loaded from Appwrite; expired Moments are filtered out.
- Create, join, react and comment on Moments.
- Real profile names/usernames and profile editing.
- Search across live Moments and users.
- Notifications generated from real joins/reactions/comments on the user's Moments.
- Scenes derived only from real Moments; no seeded/fake activity.
- Talk tied to real live Moments; no fake rooms.
- Image/video/audio upload through the existing WORLD Media bucket.
- Privacy/safety, content, notification, discovery, originality, copyright and moderation settings.
- Creator monetization progress UI; USA-only launch policy is clearly presented as a product policy, not a guarantee of approval or earnings.
- Ads isolated in `src/ads/Ads.jsx`. Replace that one file to change the ad code.
- Copy/context-menu protection for app UI, while allowing typing/selecting in form controls.
- Black phone/PWA status-bar theme and mobile no-zoom viewport.

## Appwrite IDs
Configured in `src/config/appwrite.js`.
The database ID is the supplied current ID `6aa5175700159ea99cb8`.

## Ads
`src/ads/Ads.jsx` contains the supplied 320x50 and 300x250 HighRevenue snippets. No Popunder is included.

## Important
The app does not manufacture demo users, fake Moments, fake comments, fake followers or fake activity. An empty database intentionally shows an empty state until real users create content.
