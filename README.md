# Heatmap

A web application that visualizes user activity across different platforms as calendar-style heatmaps.

## Applications

### Web App (`packages/web`)

React application built with Vite, featuring:

- React 19 with TypeScript
- Tailwind CSS
- Clerk Authentication
- Supabase Integration
- TanStack Query

### API Server (`packages/api`)

Hono API server built with Bun:

- TypeScript
- CORS enabled
- Endpoints:
  - `GET /health` - Health check
  - `GET /api` - Welcome message
  - `GET /api/hello/:name` - Personalized greeting

## Features

- **GitHub Integration**: Real commit data using GitHub's GraphQL API (requires token)
- **Modular Architecture**: Easy to add new platforms by implementing the `HeatmapProvider` interface
- **Interactive Heatmap**: Click on cells to see detailed information

## Architecture

### Core Components

- **`HeatmapProvider`**: Interface that all platform providers must implement
- **`ProviderRegistry`**: Manages and provides access to all registered providers
- **`Grid`**: Renders the calendar-style heatmap grid

### Data Flow

1. User enters username and selects platform
2. Application fetches data from the selected provider
3. Data is normalized to `ActivityDataPoint[]` format
4. Heatmap visualization renders the data as a calendar grid

### Adding New Platforms

To add support for a new platform (e.g., LeetCode), simply:

1. Create a new provider class implementing `HeatmapProvider`:

```typescript
import type { HeatmapProvider, ActivityDataPoint } from "@/providers/heatmap";

export class LeetCodeHeatmapProvider implements HeatmapProvider {
  name = "leetcode";

  async fetchData(username: string): Promise<ActivityDataPoint[]> {
    // Implement data fetching logic
    // Return data in standardized format
  }
}
```

2. Register it in `ProviderRegistry`:

```typescript
import { LeetCodeHeatmapProvider } from './LeetCodeHeatmapProvider';

constructor() {
  // ... existing providers
  this.registerProvider(new LeetCodeHeatmapProvider());
}
```

That's it! The new platform will automatically appear in the UI dropdown and work with the existing heatmap visualization.

## Data Format

All providers must return data in this standardized format:

```typescript
interface ActivityDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number; // Activity count for that date
}
```

## Available Platforms

### GitHub

- **Data Source**: GitHub GraphQL API (with fallback to mock data)
- **Authentication**: Optional GitHub token for better rate limits
- **Data**: Daily commit counts

### LeetCode

- **Data Source**: Community LeetCode API
- **Data**: Daily submissions counts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request
