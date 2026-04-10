# 🔄 TeamRetro Local

> **Free, self-hosted retrospectives & team health checks** — no SaaS subscription required.

Run engaging agile retros, track team sentiment with health checks, and drive actionable outcomes — all from your local machine. Real-time collaboration powered by Socket.io, backed by a local SQLite database.

---

## ✨ Features

### Retrospective Boards
- **Multi-stage flow**: Set Stage → Brainstorm → Vote → Actions → Closed
- **Three columns**: Went Well 😄, To Improve 🧐, Action Items 🚀
- **Real-time sync**: Cards appear instantly for all participants via WebSocket
- **Upvoting**: Prioritize items during the Vote stage (sorted by votes)
- **Optimistic UI**: Instant feedback — no waiting for server roundtrips

### Team Health Checks
- **Six dimensions**: Mission & Purpose, Delivery & Process, Codebase & Tech Debt, Support & Teamwork, Learning & Growth, Fun & Engagement
- **Traffic light voting**: Green 😊 / Yellow 😐 / Red 😔
- **Live results bar**: See aggregate team sentiment update in real-time

### General
- **Session persistence**: Display name saved to localStorage across sessions
- **Join by ID**: Share a board ID with teammates to join the same session
- **No login required**: Jump straight into a retro — zero friction

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Actions) |
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 |
| **Real-time** | [Socket.io](https://socket.io/) (custom `server.js` wrapping Next.js) |
| **Database** | SQLite via [Prisma ORM](https://www.prisma.io/) |
| **Styling** | Tailwind CSS + Outfit font from Google Fonts |

---

## 📁 Project Structure

```
PIT-TeamRetro/
├── prisma/
│   └── schema.prisma          # Database schema (RetroBoard, RetroItem, HealthCheckBoard, etc.)
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── board.ts       # Server actions: create/join boards
│   │   │   ├── retro.ts       # Server actions: add items, vote, change stage
│   │   │   └── health.ts      # Server actions: add health metrics
│   │   ├── retro/[id]/page.tsx    # Retro board page (SSR)
│   │   ├── health/[id]/page.tsx   # Health check page (SSR)
│   │   ├── page.tsx           # Landing page (create/join sessions)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles & design tokens
│   ├── components/
│   │   ├── ClientRetroBoard.tsx   # Interactive retro board (client component)
│   │   └── ClientHealthBoard.tsx  # Interactive health board (client component)
│   └── lib/
│       └── prisma.ts          # Prisma client singleton
├── server.js                  # Custom HTTP server (Next.js + Socket.io)
├── package.json
└── .env                       # DATABASE_URL (SQLite)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/PIT-TeamRetro.git
cd PIT-TeamRetro

# 2. Install dependencies
npm install

# 3. Set up the database
cp .env.example .env          # Uses SQLite by default (file:./dev.db)
npx prisma db push            # Create tables
npx prisma generate           # Generate Prisma client

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database file path |
| `PORT` | `3000` | Server port |

---

## 📊 Database Schema

The app uses 5 models:

- **RetroBoard** — A retrospective session with a status lifecycle
- **RetroItem** — A card on a retro board (category, votes, author)
- **RetroAction** — Action items assigned from a retro
- **HealthCheckBoard** — A team health check session
- **HealthCheckMetric** — Individual health votes per dimension

Run `npx prisma studio` to visually browse the database.

---

## 🤝 Real-time Architecture

```
Browser A ──┐
            ├── Socket.io ──→ server.js ──→ broadcast to room
Browser B ──┘                     │
                                  ↓
                           Next.js handler
                                  ↓
                           Prisma → SQLite
```

1. Each board has a Socket.io **room** (keyed by board ID)
2. When a user adds an item or votes, the client calls a **Server Action** and emits a `board-updated` event
3. All other clients in the room receive the event and re-fetch the board data

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🗺️ Roadmap

- [ ] Grouping stage (cluster related cards)
- [ ] Timer for each stage
- [ ] Export retro results as PDF/Markdown
- [ ] User avatars and presence indicators
- [ ] Board history and past retros list
- [ ] Dark mode support

---

## 📄 License

This project is private and intended for internal team use.
