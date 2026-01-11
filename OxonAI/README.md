# OxonAI

> Build once. Output everywhere. 🚀

OxonAI is an all-in-one AI assistant platform that allows users to generate content, automate tasks, and use multiple AI tools from a single dashboard.

## Features

- 🔐 **Authentication** - Email/password + Google OAuth
- 💬 **AI Chat** - General purpose assistant
- ✍️ **Content Generator** - Blogs, ads, emails, social posts
- 💻 **Code Assistant** - Write, debug, explain, optimize code
- 💡 **Idea Generator** - Brainstorm creative ideas
- 📝 **Summarizer** - Condense long text
- 🔄 **Rewriter** - Transform text with different tones
- 💳 **Subscriptions** - Stripe-powered billing
- 📊 **Admin Panel** - User management & analytics
- 🖥️ **Desktop App** - Electron IDE for Windows/macOS/Linux

## Quick Start

### 1. Install Dependencies
```bash
cd OxonAI
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Set Up Database
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Desktop IDE

To build the installable desktop app:

```bash
cd IDE
npm install
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

Installers will be created in `IDE/dist/`.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas with Prisma ORM
- **Auth**: NextAuth.js (Google OAuth & Credentials)
- **IDE Sync**: Custom deep-link authentication (`oxonai://`)
- **AI**: Hugging Face & Google Gemini
- **Payments**: Stripe
- **Desktop**: Electron

## Project Structure

```
OxonAI/
├── app/
│   ├── api/           # API routes
│   │   ├── ai/        # AI tool endpoints
│   │   ├── auth/      # Authentication
│   │   └── ...        # Stripe endpoints
│   ├── dashboard/     # Tool pages
│   ├── admin/         # Admin panel
│   └── ...            # Other pages
├── components/        # React components
├── lib/               # Utilities
│   └── ai/            # OpenAI service
├── prisma/            # Database schema
└── ...

IDE/                   # Electron desktop app
├── main.js            # Main process
├── preload.js         # Context bridge
└── renderer/          # Offline UI
```

## License

MIT License
