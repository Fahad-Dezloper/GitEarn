# Git Earn

**Git Earn** is a powerful open-source bounty platform built to incentivize contributions to open-source projects. Maintainers can post bounties on GitHub issues, and contributors can earn rewards for completing them. It’s designed with a modern UI, deep GitHub integration, and a scalable architecture.

---

## 🌍 Monorepo Structure

This project is managed using [Turborepo](https://turbo.build/). It consists of the following packages and apps:

```
apps/
├── gitearn-bot    # GitHub App built with Probot
├── web            # Frontend and backend built with Next.js
packages/
└── db             # Shared Prisma + PostgreSQL schema and client
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/gitearn.git
cd gitearn
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

Create the following `.env` files:

**apps/web/.env**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gitearn
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

**apps/gitearn-bot/.env**

```env
APP_ID=your-github-app-id
PRIVATE_KEY=your-private-key
WEBHOOK_SECRET=your-webhook-secret
```

### 4. Set up the Database

```bash
bunx prisma db push --schema=packages/db/schema.prisma
```

### 5. Run the Dev Servers

In separate terminals:

```bash
# Start the Next.js frontend and backend
bun run dev --filter=web
```

```bash
# Start the GitHub Probot bot
bun run dev --filter=gitearn-bot
```

---

## 🧱 Tech Stack

- **Next.js** – Full-stack frontend and backend
- **Probot** – GitHub App for automating GitHub interactions
- **Prisma + PostgreSQL** – Database ORM and storage
- **Turborepo** – Monorepo management
- **Bun** – Fast JavaScript runtime and package manager
- **shadcn/ui** – UI component library

---

## 🤩 Key Features

- 🔍 Filter and browse GitHub issues with bounties
- 💰 Add bounties to open-source issues
- 👨‍💻 Contributors earn rewards by solving issues
- 🧠 Maintainers incentivize quality contributions
- 🔒 GitHub OAuth + secure permissions
- 🔄 Real-time updates and GitHub syncing

---

## 🤝 Contributing

We welcome all kinds of contributions! Please read our `CONTRIBUTING.md` for guidelines.

- Fork the repo and create your branch from `main`
- Run the project locally and test your changes
- Make sure linting and formatting passes
- Open a Pull Request and describe your changes clearly

---

## 📄 License

MIT © Fahad-Dezloper/GitEarn
