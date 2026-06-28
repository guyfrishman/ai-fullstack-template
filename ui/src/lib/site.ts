// Central place for presentation-level constants so they stay consistent
// across the header, sidebar, and About page.

export const SITE = {
  name: 'AI Template',
  tagline: 'A compact, production-shaped full-stack AI starter',
  author: 'Guy Frishman',
  repoUrl: 'https://github.com/guyfrishman/ai-fullstack-template',
} as const

// Prompts offered on an empty chat to give first-time visitors a quick start.
export const SUGGESTED_PROMPTS = [
  'Explain what a REST API is in two sentences.',
  'Give me three tips for writing clean Python.',
  'What is the repository pattern and why use it?',
] as const
