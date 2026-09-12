# WORLD — production foundation

Files:
- index.html — frontend shell
- style.css — brand/UI
- app.js — Firebase Auth + Firestore frontend
- firebase-config.js — your Firebase Web App config (replace placeholders)
- firestore.rules — Firestore security rules
- firebase.json — Firebase Hosting/Firestore config

Brand:
- Signature WORLD green: #00A86B
- Supporting green: #20C997
- Deep background: #07100C

Important:
This build contains NO seeded/demo Moments. The feed starts empty and is populated only by real Firestore data.

Before deployment:
1. Create a Firebase project for WORLD.
2. Enable Authentication → Anonymous.
3. Create Firestore Database.
4. Put your Web App config into firebase-config.js.
5. Deploy the folder with Firebase Hosting or serve it from a static host.
6. Firestore may request a composite index for the active-Moments query; create the exact index Firebase provides.

This version intentionally does not fake users, points, followers, locations, or Moments.
