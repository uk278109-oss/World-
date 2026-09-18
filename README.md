# WORLD — Be There.

WORLD is a global real-time social discovery platform: **See What’s Happening. Be Part of It.**

Core loop: DISCOVER → BE THERE → PARTICIPATE → CREATE → SHARE.

## Current build
- NOW / FLOW / SCENES / TALK / SPACE / MONETIZE
- Real Appwrite authentication and live Moment data
- Moment expiry, Join, Reaction, Comments and media upload
- Search for live Moments and people
- Public SPACE profiles
- **FOLLOW and SUBSCRIBE are separate relationships and counts**
- Professional settings grouped by category
- Monetization foundation with no fake/demo earnings
- Separate ad component (`src/ads/Ads.jsx`) for easy ad-code replacement
- Copy/context-menu protection for app content (inputs remain usable)
- Green/dark WORLD visual system and mobile navigation
- No seeded fake users, Moments, views or earnings

## Important one-time Appwrite step for Subscribe
The existing database is preserved. Create the `Subscriptions` collection in the same database using `docs/DATABASE.md`, then set `VITE_WORLD_SUBSCRIPTIONS_COLLECTION_ID` in Vercel and redeploy. This is required because the existing Free-plan database does not contain a known subscription collection ID.

## Not included yet
WORLD Studio is intentionally deferred until the core product is stable. YouTube/OAuth auto-publishing is also deferred.
