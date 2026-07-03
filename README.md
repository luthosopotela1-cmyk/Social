# Omnichannel Social CX Platform

Phase 1 scaffold for a modular monolith architecture using NestJS and Prisma.

## What’s included

- NestJS application bootstrap
- Prisma schema for multi-tenant workspace, channels, conversations, messages, users, and AI invocations
- Channel adapter registry pattern
- Placeholder services for conversation/inbox, routing, automation, AI orchestration, search, notifications, and analytics
- Environment configuration and basic project scripts

## Getting started

1. Copy `.env.example` to `.env`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Start in development mode:
   ```bash
   npm run start:dev
   ```

## Next steps

- Add concrete channel adapter implementations
- Build the webhook receiver and queue workers
- Implement event dispatching for routing, automation, search indexing, and notifications
- Add real-time Socket.IO support and API endpoints
