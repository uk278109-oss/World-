# WORLD 1.0

**WORLD — See What's Happening. Be Part of It.**

This package is a clean production foundation for the WORLD global real-world activity platform.

## Included
- Mobile-first professional UI
- SVG icons only; no emoji navigation icons
- Home / Explore / Create / Activity / Profile / Settings
- Real Firebase Authentication (anonymous)
- Real Firestore Moments
- User profile document
- Public/nearby visibility field
- Approximate-location option (exact coordinates are not implemented)
- Moment expiry timestamp
- Firestore security rules
- Vercel/GitHub-ready static deployment

## Firebase setup
1. Create/open your Firebase project.
2. Enable Authentication → Sign-in method → Anonymous.
3. Create a Firestore database.
4. Add a Web App under Project settings.
5. Copy its config into `firebase-config.js`.
6. Deploy to Vercel or Firebase Hosting.

## Important
This foundation does not contain fake/demo users or fake Moments.
For a production launch, add moderation, anti-spam, real map/geospatial indexing, account recovery, media storage, notifications, and server-side expiry/moderation before public scale.

## Vercel
No build command is required. Framework: Other/None. Output directory: leave empty.

## Firestore index
The feed query uses `status == active` and `createdAt desc`. If Firebase asks for a composite index, follow its generated console link once; this is normal for Firestore queries.
