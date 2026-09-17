# WORLD Database

Use the existing single Appwrite database. Do not create a second database on the Free plan.

Recommended metadata tables:
- profiles
- moments
- scenes
- subscriptions
- connections
- reports
- blocks
- messages

Large media should use storage/CDN, not database rows.

The current frontend keeps database IDs configurable in `src/config/appwrite.js`.
