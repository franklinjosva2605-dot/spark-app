# ✦ Spark — Dating Meets Social Media

A mobile-first React app combining Tinder-style swiping with Instagram-style video posts, comments, and messaging.

## Features
- 🔥 **Match Tab** — Swipe left/right on profiles (drag or buttons), get match animations
- 📸 **Feed Tab** — Video posts, likes, comments, stories row
- 💬 **Messages Tab** — Chat with your matches, auto-reply simulation
- 👤 **Profile Tab** — Your stats, matches, settings

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/spark-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then run:
```bash
npm run deploy
```

## Project Structure

```
src/
├── App.js                  # Root component, state management
├── index.js                # Entry point
├── index.css               # Global styles + fonts
├── components/
│   ├── Header.js           # Nav bar
│   ├── Feed.js             # Instagram-style feed
│   ├── Discover.js         # Tinder swipe cards
│   ├── Messages.js         # Chat screen
│   ├── Profile.js          # User profile
│   ├── CommentsOverlay.js  # Comments modal
│   └── MatchOverlay.js     # Match celebration modal
└── data/
    └── mockData.js         # Mock users, posts, comments
```

## Tech Stack
- React 18
- CSS-in-JS (inline styles)
- Google Fonts (DM Sans + Syne)
- Font Awesome icons
- Pravatar / Picsum for mock images
