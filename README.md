# 🧠 Git Earn

A decentralized bounty platform for open-source contributions. Powered by GitHub + Solana.

## 🚀 Overview

Git Earn transforms the way developers contribute to open source by enabling **bounty-driven development**. Maintainers can incentivize their issues with bounties, and contributors get rewarded for solving real-world problems — all without the need for traditional freelancing.

Whether you're a project maintainer or an open-source enthusiast, Git Earn makes it easy to assign, complete, and reward issues transparently.

## 🎯 Features

- 🔗 **GitHub App Integration** – Seamlessly attach bounties to real issues.
- 💰 **Bounty System** – Fund issues using Solana. Contributors get paid on completion.
- 👥 **Real-Time Collaboration** – Multiple users can interact on issues with live updates.
- 🧩 **Immutable Assignments** – Ensure clarity and fairness with a tamper-proof ledger.
- 🧵 **Issue Activity Feed** – Keep track of discussions, assignments, and completions.
- 💼 **Dashboard** – Track open bounties, contributions, and payments.
- 🏆 **Leaderboard** – Recognize top contributors.
- 💳 **Wallet Integration** – Securely connect and manage your crypto wallet.
- 🧑‍💻 **GitHub Extension** – View and assign bounties directly within GitHub UI.

## 📸 Screenshots

> *(Add some screenshots or gifs of the dashboard, extension UI, bounty modal, etc.)*

## ✨ Tech Stack

- **Frontend**: Next.js, shadcn/ui, Tailwind CSS (main site), Vanilla CSS (extension)
- **Backend**: WebSockets, Redis, custom OAuth, Solana integration
- **Database**: Supabase / PostgreSQL (or your preferred DB)
- **Auth**: GitHub App + Privy

## 🛠 Installation

```bash
# Clone the repo
git clone https://github.com/your-org/gitearn.git
cd gitearn

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your GitHub App credentials, Solana keys, etc.

# Run locally
pnpm dev
