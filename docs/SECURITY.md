# WORLD Security

- Treat the client as untrusted.
- Never ship Appwrite server/API secrets in the PWA.
- Keep database/table permissions restrictive.
- Use row/document-level permissions for user-owned data.
- Validate important operations server-side.
- Add rate limits to public actions.
- Provide block, mute and report controls.
- Do not store large media blobs in database rows.
