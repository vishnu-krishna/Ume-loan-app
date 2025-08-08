# Ume Loans - Lead Acquisition Form

A modern, multi-step loan application form built with React, TypeScript, and HeroUI components.

## Features

- Interactive loan details configuration with slider controls
- Real-time form validation and persistence
- Responsive design with smooth animations
- Mock API integration for testing
- Type-safe development with TypeScript

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Tech Stack

- **React 18** with TypeScript
- **HeroUI** component library
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** + Zod validation
- **Vitest** for testing
- **MSW** for API mocking

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── services/           # API services
├── types/              # TypeScript definitions
├── mocks/              # MSW handlers
└── test/               # Test utilities
```

## Development

The application uses Mock Service Worker (MSW) for API simulation during development. In production, these would be replaced with actual API endpoints.

## Deployment

Configured for Vercel deployment with optimized builds and environment-specific configurations.