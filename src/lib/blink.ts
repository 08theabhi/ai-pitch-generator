import { createClient } from '@blinkdotnew/sdk'

function getProjectId(): string {
  // First check for environment variable
  const envId = import.meta.env.VITE_BLINK_PROJECT_ID
  if (envId) return envId
  
  // Check for Blink deployment URL pattern
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const match = hostname.match(/^([^.]+)\.sites\.blink\.new$/)
  if (match) return match[1]
  
  // For Vercel and other deployments, use the hardcoded project ID
  return 'ai-pitch-generator-6zwa5mhs'
}

export const blink = createClient({
  projectId: getProjectId(),
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY,
  auth: { mode: 'managed' },
})
