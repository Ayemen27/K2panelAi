# SaaS Boilerplate - Next.js, Firebase, GraphQL & Stripe

A powerful, production-ready SaaS boilerplate built with modern technologies to help you launch your product faster.

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router and SSR
- **TypeScript** - Type-safe development
- **Apollo GraphQL** - API layer with client & server
- **Firebase Auth** - Authentication & user management
- **Sanity CMS** - Headless CMS for content management
- **Stripe** - Payment processing & subscriptions
- **Tailwind CSS** - Modern, utility-first styling
- **Jest** - Testing framework

## 📋 Features

- ✅ Server-side rendering with Next.js App Router
- ✅ Full authentication flow (login/signup/protected routes)
- ✅ GraphQL API with Apollo Server & Client
- ✅ Headless CMS integration with Sanity
- ✅ Payment processing with Stripe
- ✅ Responsive, mobile-first design
- ✅ Analytics integration (Amplitude, Segment, Google Analytics, Datadog)
- ✅ Type-safe development with TypeScript
- ✅ Testing setup with Jest

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account with project configured
- Stripe account with API keys
- Sanity CMS account (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- Firebase configuration
- Stripe API keys
- Sanity project details
- Analytics keys (optional)

See `.env.example` for required variables.

### Running the App

Development mode:
```bash
npm run dev
```

The app will run on `http://localhost:5000`

Production build:
```bash
npm run build
npm start
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📁 Project Structure

```
.
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (app)/        # Authenticated app pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (marketing)/  # Public marketing pages
│   │   ├── api/          # API routes
│   │   └── dashboard/    # Dashboard pages
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities and helpers
│   ├── providers/        # React context providers
│   ├── server/           # Server-side code
│   │   ├── auth/         # Auth logic
│   │   └── graphql/      # GraphQL resolvers & schema
│   └── types/            # TypeScript type definitions
├── sanity/               # Sanity CMS configuration
├── public/               # Static assets
├── docs/                 # Documentation
└── __mocks__/            # Test mocks
```

## 📚 Documentation

- [Deployment Guide](./docs/deployment.md) - How to deploy to production
- [Sanity CMS Guide](./docs/sanity-guide.md) - Content management setup
- [Project Overview](./docs/project-overview.md) - Detailed project information

## 🔐 Environment Variables

Required environment variables (see `.env.example` for full list):

**Firebase:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

**Stripe:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Sanity (optional):**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`

## 🚢 Deployment

This project is optimized for deployment on:
- Vercel (recommended)
- Netlify
- Any platform supporting Next.js

See [Deployment Guide](./docs/deployment.md) for detailed instructions.

## 🧪 Testing

The project includes:
- Unit tests with Jest
- Component testing with React Testing Library
- Mock setup for Firebase and external services

Run tests before deploying to production.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
