export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  APP_NAME: 'Weekly Planner',
} as const
