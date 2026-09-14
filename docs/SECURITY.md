# Security baseline
Client is untrusted.
Server-side validation is required for ownership, subscriptions, viewer counts,
moderation, admin actions and future payments.
No service keys/secrets in the APK.
Use document permissions, rate limits, block/report/mute and audit logs.
Production builds must have debug disabled.
