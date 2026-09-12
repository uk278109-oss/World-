# WORLD 1.1 — Appwrite + Cloudinary
Firebase removed from this version. Appwrite handles accounts/database; Cloudinary is reserved for media.

Appwrite: create a project, add your Vercel Web platform, enable anonymous sessions, create database `world`, collections `users` and `moments`.

Moments attributes: ownerId string 128, title string 80, description string 300, category string 32, visibility string 32, durationMinutes integer, status string 20, expiresAt datetime, hasApproxLocation boolean.

Give authenticated users appropriate create/read permissions; restrict update/delete to document owners.

Cloudinary: use it for photos/videos. Never put the API secret in browser code. Use an unsigned preset for initial testing or secure server-side signing later.

No fake users or Moments are seeded. Vercel: Other/None, no build command, output directory empty.