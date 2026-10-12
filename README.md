# SwipeJoy

A daily pocket ritual for instant joy and micro-mindfulness. Swipe through affirmations, heart three, and keep your streak.

It is a static site: `index.html`, `manifest.webmanifest`, `sw.js` and `icons/`. No build step.

## Put it online (GitHub Pages)
1. In the repository, open **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose `main` and `/ (root)`, then **Save**.
3. After a minute your site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Install on iPhone
Open the link in **Safari**, tap **Share**, then **Add to Home Screen**.

## Notes
- Streaks and hearts are stored in each person's own browser, per web address.
- To ship an update, edit `index.html`, then change `CACHE = 'swipejoy-v1'` in `sw.js` to `swipejoy-v2` and commit.
- Replace the BrainFlow link (`https://example.com/brainflow`) in `index.html`.
