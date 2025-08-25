# Activity Heatmap

A modular, extensible web application that visualizes user activity across different platforms as calendar-style heatmaps.

## Features

- **GitHub Integration**: Real commit data using GitHub's GraphQL API (requires token)
- **MongoDB Ready**: Designed with MongoDB persistence in mind for future backend integration
- **Modular Architecture**: Easy to add new platforms by implementing the `HeatmapProvider` interface
- **Responsive Design**: Beautiful UI built with React and Tailwind CSS
- **Interactive Heatmap**: Click on cells to see detailed information

## ⚠️ Important Note: GitHub Data

**Real Data Available**: The GitHub provider fetches real commit data using GitHub's GraphQL API.

**Setup Required**: To get actual commit data, you need to:

1. **Create GitHub Token**: Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. **Set Permissions**: Select `read:user` and `repo` scopes
3. **Create .env File**: Copy `env.example` to `.env` and add your token
4. **Restart Dev Server**: The token will be loaded on restart

**Fallback**: If no token is provided, the app will generate realistic mock data.

## 🗄️ MongoDB Integration Ready

The application is designed with MongoDB in mind:

- **Document Structure**: All data models extend `MongoDocument` interface
- **User Profiles**: Store user information and platform preferences
- **Activity Data**: Efficient storage of daily activity counts
- **Search & Pagination**: Built-in support for future database queries
- **API Responses**: Consistent response format for database operations

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd heatmap
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### GitHub API Token (Optional)

For better GitHub data fetching, you can set a GitHub token:

1. Create a GitHub personal access token at [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Set the environment variable:

```bash
export GITHUB_TOKEN=your_token_here
```

## Architecture

### Core Components

- **`HeatmapProvider`**: Interface that all platform providers must implement
- **`ProviderRegistry`**: Manages and provides access to all registered providers
- **`HeatmapVisualization`**: Renders the calendar-style heatmap grid
- **`HeatmapApp`**: Main application component handling user input and data flow

### Data Flow

1. User enters username and selects platform
2. Application fetches data from the selected provider
3. Data is normalized to `ActivityDataPoint[]` format
4. Heatmap visualization renders the data as a calendar grid

### Adding New Platforms

To add support for a new platform (e.g., LeetCode), simply:

1. Create a new provider class implementing `HeatmapProvider`:

```typescript
import type { HeatmapProvider, ActivityDataPoint } from '../types/heatmap'

export class LeetCodeHeatmapProvider implements HeatmapProvider {
  name = 'leetcode'
  displayName = 'LeetCode'

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
  date: string // ISO date string (YYYY-MM-DD)
  count: number // Activity count for that date
}
```

## Available Platforms

### GitHub

- **Data Source**: GitHub GraphQL API (with fallback to mock data)
- **Authentication**: Optional GitHub token for better rate limits
- **Data**: Daily commit counts

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── HeatmapApp.tsx  # Main application
│   └── HeatmapVisualization.tsx  # Heatmap rendering
├── providers/           # Platform data providers
│   ├── ProviderRegistry.ts
│   └── GitHubHeatmapProvider.ts
├── types/               # TypeScript type definitions
│   └── heatmap.ts
└── App.tsx             # Application entry point
```

### Building for Production

```bash
npm run build
# or
bun run build
```

### Linting

```bash
npm run lint
# or
bun run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- [ ] MongoDB backend integration
- [ ] User authentication and profiles
- [ ] Data persistence and caching
- [ ] More platforms (LeetCode, HackerRank, etc.)
- [ ] Custom date ranges
- [ ] Export functionality (PNG, SVG)
- [ ] Advanced analytics and insights
- [ ] Dark mode support
- [ ] Mobile-optimized heatmap interaction
