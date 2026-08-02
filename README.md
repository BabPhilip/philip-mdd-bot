# PhilzBab Agent 🤖

**AI-Powered 3D Responsive Website Builder**

## Features

- **AI Chat Interface**: Describe your vision in natural language
- **3D Website Generation**: Automatic HTML/CSS/JavaScript generation with Three.js
- **Live Preview**: See your site render in real-time
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Built-in transitions and effects
- **Easy Deployment**: Export to Netlify with one click

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Describe Your Website**: Tell the agent what you want to build
2. **Customize**: Provide specific details about design, colors, animations
3. **Generate**: Agent creates the code automatically
4. **Preview**: See your site in real-time
5. **Deploy**: Export and host on Netlify

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Deployment**: Netlify

## Project Structure

```
philzbab-agent/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Utility functions
├── store/            # State management
├── types/            # TypeScript types
└── public/           # Static assets
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and configure if using external LLM.

## Deployment

Deploy to Netlify:

```bash
npm install netlify-cli -g
netlify deploy --prod
```

---

**Made by BabPhilip** - PhilzBab Agent v1.0.0
