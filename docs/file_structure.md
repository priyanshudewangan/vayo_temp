# Vayo Commune - Project Directory Structure

This document outlines the current streamlined folder and file structure of the Vayo Commune codebase, detailing what each directory and file does.

---

```
vayo_temp/
├── docs/                      # Project documentation and roadmap references
│   ├── file_structure.md      # This file structure guide
│   ├── VAYO_ROADMAP.md        # Feature roadmap and planning
│   ├── VAYO_ROADMAP.pdf        # PDF version of the roadmap
│   └── migration_analysis.md  # Original static-to-React migration details
│
├── public/                    # Static public assets served at root "/"
│   ├── assets/                # Core media files (compressed videos, photos, logos)
│   │   ├── events/            # Static fallback images for categories (e.g., sports.png)
│   │   ├── pin_bg_2.mp4       # Background ambient video
│   │   ├── vayo-logo.png      # VAYO brand logo image
│   │   └── *.mp4              # Compressed, web-optimized 8-bit event showcase videos
│   ├── favicon.ico            # Static favicon file
│   ├── favicon.png            # PNG favicon logo
│   └── vercel.svg             # Vercel logo
│
├── src/                       # Application source code
│   ├── app/                   # Next.js app router pages, layouts, and global styles
│   │   ├── join/              # Waitlist wait list page router path
│   │   │   └── page.js        # React component embedding waitlist registration form (Tally.so)
│   │   ├── favicon.ico        # App favicon
│   │   ├── globals.css        # Global CSS stylesheet (Tailwind v4 imports + custom 3D utilities)
│   │   ├── layout.js          # Root layout defining <html> structure & background ambient video
│   │   └── page.js            # Homepage component (hero section, philosophy, waitlist call-to-actions)
│   │
│   ├── components/            # Reusable UI component layer
│   │   ├── ui/                # Shadcn primitives (standard stylized controls)
│   │   │   ├── button.jsx     # Primitive button component
│   │   │   ├── input.jsx      # Input text box field
│   │   │   ├── label.jsx      # Styled form labels
│   │   │   ├── select.jsx     # Dropdown menu element
│   │   │   └── textarea.jsx   # Multi-line input textbox
│   │   ├── EventShowcase.jsx  # Event highlight list with focused 3D card flips & background blur
│   │   └── WaveBackground.jsx # WebGL fluid background wave generated via Three.js (GLSL canvas)
│   │
│   └── lib/                   # Shared helper utilities and configurations
│       └── utils.js           # ClassName merger (`cn` utility for Tailwind + Shadcn)
│
├── package.json               # Node.js project manifest (scripts, package list & versions)
├── next.config.mjs            # Next.js project configuration rules
├── vercel.json                # Vercel deployment rewrite rules
├── jsconfig.json              # Javascript configuration (custom path mapping e.g., "@/*" to "src/*")
├── eslint.config.mjs          # Lint rule settings for code quality checking
├── postcss.config.mjs         # PostCSS plugins setup (Tailwind configuration)
├── components.json            # Shadcn UI configuration details
├── README.md                  # Project overview and standard readme guide
├── AGENTS.md                  # Next.js workspace rule definitions for agents
└── CLAUDE.md                  # Common build & check commands guidelines
```

---

## File Details

### App Configuration & Tooling (Root)
* **[package.json](file:///Users/chata/Desktop/Vayo_temp/package.json):** Defines the list of active npm package dependencies (React, Next.js, Shadcn, etc.) and deployment scripts (`npm run dev`, `npm run build`, `npm run start`).
* **[next.config.mjs](file:///Users/chata/Desktop/Vayo_temp/next.config.mjs):** Configures Next.js custom rules, optimizations, and experimental features (like Turbopack).
* **[jsconfig.json](file:///Users/chata/Desktop/Vayo_temp/jsconfig.json):** Maps `@/*` path aliases directly to `src/*` so you can write `import Button from "@/components/ui/button"` instead of complex relative paths.
* **[eslint.config.mjs](file:///Users/chata/Desktop/Vayo_temp/eslint.config.mjs):** Houses the syntax validation and formatting check rules to maintain code quality.
* **[components.json](file:///Users/chata/Desktop/Vayo_temp/components.json):** Tracks the tailwind styles and path rules used by the Shadcn CLI to import UI primitives.
* **[vercel.json](file:///Users/chata/Desktop/Vayo_temp/vercel.json):** Tells the Vercel hosting platform how to route URLs and handle single-page application requests.

### Core Assets (`public/`)
* **[public/assets/](file:///Users/chata/Desktop/Vayo_temp/public/assets):** Houses all visual assets. Videos inside are compressed to H.264 MP4 8-bit web formats (making files up to 99% smaller) for instant cross-device playback.

### React Application (`src/`)
* **[src/app/layout.js](file:///Users/chata/Desktop/Vayo_temp/src/app/layout.js):** Wraps all pages. It specifies the default fonts, metadata tags (for SEO/Twitter cards), and displays the full-screen ambient video background playing behind the transparent page layout.
* **[src/app/page.js](file:///Users/chata/Desktop/Vayo_temp/src/app/page.js):** The main landing page. Renders the navigation bar, hero headline, waitlist email forms, and the Vayo Philosophy cards.
* **[src/app/join/page.js](file:///Users/chata/Desktop/Vayo_temp/src/app/join/page.js):** The waitlist registration page. Parses the `interest` URL parameter dynamically and passes it to the embedded Tally.so form to auto-select what vibe they want.
* **[src/app/globals.css](file:///Users/chata/Desktop/Vayo_temp/src/app/globals.css):** Imports Tailwind v4 styles and contains helper rules for ambient floating animations, background dot grids, and 3D card perspective flipping.
* **[src/components/EventShowcase.jsx](file:///Users/chata/Desktop/Vayo_temp/src/components/EventShowcase.jsx):** Renders the horizontal carousel of events. It manages the custom 3D card flips, scaling, and darkening/blurring of inactive cards.
* **[src/components/WaveBackground.jsx](file:///Users/chata/Desktop/Vayo_temp/src/components/WaveBackground.jsx):** Implements a premium Three.js WebGL canvas displaying interactive, smooth light waves.
