# 🔄 TeamRetro Pages

> **Free retrospective boards and team health checks, deployed as a static site on GitHub Pages.**

Run lightweight retros and health checks directly in the browser with no backend, no database, and no login flow.

Live site: [https://seifedd.github.io/PIT-TeamRetro/](https://seifedd.github.io/PIT-TeamRetro/)

---

## ✨ Features

### Retrospective Boards
- **Multi-stage flow**: Set Stage → Brainstorm → Vote → Actions → Closed
- **Three columns**: Went Well 😄, To Improve 🧐, Action Items 🚀
- **Client-side voting**: Vote and progress the board directly in the browser
- **Session IDs**: Reopen a retro by its generated board ID on the same device

### Team Health Checks
- **Six dimensions**: Mission & Purpose, Delivery & Process, Codebase & Tech Debt, Support & Teamwork, Learning & Growth, Fun & Engagement
- **Traffic-light voting**: Green 😊 / Yellow 😐 / Red 😔
- **Live totals in-browser**: Results update immediately after each vote

### General
- **Static deployment**: Hosted on GitHub Pages
- **Browser persistence**: Boards and display names are stored in `localStorage`
- **Cross-tab sync**: Updates propagate between tabs on the same device
- **No login required**: Open the site and start a session

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) App Router with static export |
| **Frontend** | React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Persistence** | Browser `localStorage` + `BroadcastChannel` |
| **Hosting** | GitHub Pages via GitHub Actions |

---

## 📁 Project Structure

```text
PIT-TeamRetro/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # GitHub Pages deployment workflow
├── src/
│   ├── app/
│   │   ├── health/
│   │   │   └── page.tsx        # Health check route
│   │   ├── retro/
│   │   │   └── page.tsx        # Retro route
│   │   ├── globals.css         # Global styles and design tokens
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ClientHealthBoard.tsx
│   │   └── ClientRetroBoard.tsx
│   └── lib/
│       └── boards.ts           # Client-side board persistence and sync
├── next.config.ts              # Static export + GitHub Pages config
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
git clone https://github.com/seifedd/PIT-TeamRetro.git
cd PIT-TeamRetro
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

The static export is written to `out/`.

---

## 🌐 Deployment

This project deploys to GitHub Pages using the workflow in [.github/workflows/deploy-pages.yml](/Users/seif/Desktop/coding/PIT-TeamRetro/.github/workflows/deploy-pages.yml).

Deployment flow:
1. Push to `main`
2. GitHub Actions runs `npm ci` and `npm run build`
3. The generated `out/` directory is uploaded and deployed to GitHub Pages

GitHub Pages URL:
- [https://seifedd.github.io/PIT-TeamRetro/](https://seifedd.github.io/PIT-TeamRetro/)

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the static export |
| `npm start` | Start a local production server for the built app |
| `npm run lint` | Run ESLint |

---

## ⚠️ Data Model

This version is intentionally static.

- Boards are stored only in the current browser
- Opening the same board ID on a different device will not load the data
- Cross-tab updates work on the same browser profile
- Clearing browser storage removes saved boards

If you want true multi-user shared boards across devices, you need a real backend again.

---

## 🗺️ Roadmap

- [ ] Shareable backend-hosted sessions
- [ ] Grouping stage for related retro items
- [ ] Timer for each stage
- [ ] Export retro results as PDF/Markdown
- [ ] User avatars and presence indicators
- [ ] Board history and archived sessions

---

## 📄 License

This project is private and intended for internal team use.
