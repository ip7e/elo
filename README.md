# Shmelo

A modern scoreboard application for tracking competitive game results, rankings, and winning streaks among friends.

![Chart](public/chart.png)

## Features

- **Interactive Rankings**: Track player rankings with beautiful charts
- **Winning Streaks**: Keep track of winning streaks and player performance
- **Circle Management**: Create circles for different groups of players
- **Visual Statistics**: View performance trends with an intuitive bump chart
- **Game History**: Record and review game results
- **Dark Mode**: Supports both light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices (however, desktop version has a better user experience)

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- D3
- Supabase

## Local Development Setup

> **Quick Setup (Claude Code):** Copy and paste this prompt:
> ```
> Setup local dev environment: install dependencies, start local Supabase (npx supabase start), and create .env.local with the outputted credentials. Refer to README for details.
> ```

### Prerequisites

- Node.js
- Docker (required for local Supabase)

### Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start local Supabase**

   ```bash
   npx supabase start
   ```

   This will pull Docker images (first time only) and start the local Supabase stack. Once complete, it will display the API URL and keys.

3. **Create `.env.local`**

   Create a `.env.local` file in the project root with the credentials from the previous step:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start>
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

### Useful URLs (Local)

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| Supabase Studio | http://127.0.0.1:54323 |
| Inbucket (emails) | http://127.0.0.1:54324 |

### Other Commands

```bash
# Stop local Supabase
npx supabase stop

# Regenerate TypeScript types after schema changes
npm run types:generate
```

### Author

Made by [Ika](https://ika.im) • [Twitter/X](https://x.com/itsikap) • [Bluesky](https://bsky.app/profile/ika.im)
