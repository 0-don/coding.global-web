# coding.global-web

A full-stack web platform for the **Coding Global** Discord community. Features real-time chat, programming guides for 20+ languages, job marketplace, and Discord integration.



## Features

- **Community Hub** - Landing page with live Discord server statistics
- **Real-time Chat** - Web-based chat with Discord authentication
- **Project Showcase** - Display community member projects
- **Marketplace** - Job board and developer board
- **Educational Resources** - Programming guides for 20+ languages (JavaScript, Python, Rust, Go, Java, C++, and more)
- **Multi-language Support** - English and German localization
- **Full-text Search** - Search across all resources with Orama

## Tech Stack

| Category  | Technology                           |
| --------- | ------------------------------------ |
| Framework | Next.js 16 (App Router)              |
| Frontend  | React 19, TypeScript, Tailwind CSS 4 |
| Backend   | Elysia with Eden Treaty              |
| Database  | PostgreSQL + Drizzle ORM             |
| Auth      | Better Auth (Discord OAuth)          |
| State     | TanStack Query + Jotai               |
| Search    | Orama                                |
| i18n      | next-intl                            |

## Prerequisites

- [Bun](https://bun.sh/) runtime
- PostgreSQL database (or Docker)
- Discord OAuth credentials ([Discord Developer Portal](https://discord.com/developers/applications))

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/coding-global/coding.global-web.git
   cd coding.global-web
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file with the required environment variables (see below)

4. Run database migrations:

   ```bash
   bun run drizzle
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

The app will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/coding_global

# Discord OAuth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Auth
BETTER_AUTH_SECRET=your_secret_key

# URLs
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_BOT_URL=http://localhost:4000
NEXT_PUBLIC_GUILD_ID=your_discord_server_id
```

## Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `bun run dev`     | Start development server              |
| `bun run build`   | Build for production                  |
| `bun run start`   | Start production server               |
| `bun run drizzle` | Generate database migrations          |
| `bun run reset`   | Reset database (dev only)             |
| `bun run lint`    | Run ESLint                            |
| `bun run format`  | Format code with Prettier             |
| `bun run openapi` | Generate API client from OpenAPI spec |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Internationalized routes
│   │   ├── (navbar)/       # Routes with navbar layout
│   │   └── (sidebar)/      # Routes with sidebar layout
│   └── api/                # API routes (Elysia)
├── components/             # React components
│   ├── elements/           # Basic UI components
│   ├── layout/             # Layout components
│   ├── pages/              # Page-specific components
│   └── ui/                 # shadcn/ui components
├── hook/                   # Custom React hooks
├── lib/                    # Utilities and configuration
│   ├── db-schema/          # Drizzle database schemas
│   └── config/             # App configuration
├── server/                 # Server-side route handlers
├── store/                  # Jotai state stores
└── i18n/                   # Internationalization config

public/
├── i18n/                   # Translation files (en.json, de.json)
└── images/                 # Static assets
```

## Docker Deployment

Start the application with Docker Compose:

```bash
docker-compose up -d
```

This will start both the web application and a PostgreSQL database.

For production builds, the included multi-stage `Dockerfile` creates an optimized container image.

## License

MIT
