# TODO — Apply Landing Page Green Theme + Logo Across All Pages

Goal: Make all internal role pages adopt the green color theme from `landingpage.html`
(emerald green-500/600/700 `#10b981`→`#047857` gradients, emerald tints, Inter font)
and use the actual `assets/images/logo.png` everywhere branding appears.

## Steps — Track Progress
- [x] Fix logo reference in `crm-engine.js` (`logo.jpeg` → `logo.png`)
- [x] Convert shared `crm-sidebar.css` from indigo → green
- [x] Update native indigo accents in `crm-engine.js` generic views → green
- [x] Update `login.html` to green theme + real logo image
- [x] Update `crm-auth.js` role picker / access-denied colors → green
- [x] Update shared pages (`index.html`, `digital marketing.html`, `franchise.html`, `technical support.html`, `telecalling.html`) accent vars → green
- [x] Update standalone pages (`superadmin.html`, `admin.html`, `hr.html`, `gallerymanager.html`, `galleryowner.html`, `developerhub.html`, `socialmediamanager.html`) indigo accents → green
- [x] Update `landingpage.html` staff-login modal indigo accents → green
- [x] Verify no `logo.jpeg` references remain (0 remaining)
- [x] Verify no indigo (`#4f46e5`/`#4338ca`/`#818cf8`/`#6366f1`) remain in deliverable files (only in diagnostic `extracted.js`)
- [x] Verify shared assets (`crm-sidebar.css`, `crm-engine.js`, `crm-auth.js`) are green with 0 indigo refs

## Done
All role pages now use the green emerald theme and the real logo image.
