# Astrology Chart Reader

A modern web-based application for reading and interpreting astrological charts built with Svelte 5 and Vite.

## Features

- Astrological chart visualization
- Chart interpretation
- Planetary positions
- Aspect calculations
- Responsive design for mobile and desktop

## Tech Stack

- **Svelte 5** - Modern reactive framework
- **Vite** - Fast build tool and dev server
- **JavaScript** - Modern ES modules
- **CSS** - Custom styling with responsive design

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/jaidenschembri/chartreader.git
cd chartreader
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment

### GitHub Pages (Automatic)

The project is configured with GitHub Actions for automatic deployment to GitHub Pages:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at: `https://jaidenschembri.github.io/chartreader/`

### Manual Deployment

You can also deploy manually using:

```bash
npm run build    # Build the project
npm run deploy   # Deploy to GitHub Pages
```

## Project Structure

```
src/
├── App.svelte          # Main application component
├── main.js            # Application entry point
├── style.css          # Global styles
└── components/        # Reusable components

public/               # Static assets
dist/                # Built files (generated)
```

## Build Configuration

The project uses Vite with custom configuration for GitHub Pages deployment:

- Base path: `/chartreader/`
- Output directory: `dist/`
- Optimized for production builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Build and test with `npm run build`
6. Submit a pull request

## License

This project is private and proprietary. 