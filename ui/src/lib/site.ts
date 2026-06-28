// Central place for presentation-level constants so they stay consistent
// across the header, sidebar, and About page. Edit these to rebrand.

export const SITE = {
  name: 'AI Template',
  tagline: 'A compact, production-shaped full-stack AI starter',
  // Personal branding — this template doubles as a portfolio piece.
  author: 'Guy Frishman',
  authorRole: 'Full-Stack & AI Engineer',
  authorInitials: 'GF',
  repoUrl: 'https://github.com/guyfrishman/ai-fullstack-template',
  githubUrl: 'https://github.com/guyfrishman',
  email: 'guyfrishman@gmail.com',
} as const

// Prompts offered on an empty chat to give first-time visitors a quick start.
export const SUGGESTED_PROMPTS = [
  'Explain what a REST API is in two sentences.',
  'Give me three tips for writing clean Python.',
  'What is the repository pattern and why use it?',
] as const
