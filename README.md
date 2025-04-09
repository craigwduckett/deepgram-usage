# Deepgram Usage Dashboard

A simple React TypeScript application to track and visualize your Deepgram API usage. This application allows you to monitor metrics such as API requests, audio hours processed, and characters transcribed over specific time periods.

## Features

- Secure API key management
- Date range selection for usage metrics
- Visual dashboard for key usage statistics
- Responsive design for desktop and mobile

## Technologies Used

- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- shadcn/ui for UI components
- Biome.js for code formatting and linting
- Deepgram SDK for API integration

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deepgram-usage.git
cd deepgram-usage
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
pnpm build
```

The build output will be in the `dist` directory.

## Usage

1. Enter your Deepgram API key in the input field and click "Set API Key"
2. Select a date range for which you want to view usage data
3. Click "Get Usage Data" to fetch and display your Deepgram usage metrics

## Configuration

You can customize the application theme by editing the `tailwind.config.js` file.

## License

MIT

## Acknowledgements

- [Deepgram](https://deepgram.com) for their excellent API and SDK
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Biome.js](https://biomejs.dev/) for code formatting and linting
