# Astrology Chart Reader

A professional web-based astrology chart reader with precise astronomical calculations, featuring a classical document-style design and real-time planetary positioning. Built with Svelte 5 and powered by the Astronomia.js library for accurate celestial calculations.

## ✨ Features

### 🔭 Astronomical Precision
- **Real-time planetary positions** using established astronomical libraries
- **Accurate ascendant calculations** using the Placidus method with proper sidereal time
- **Venus position calculations** using simplified VSOP87 theory
- **Automatic timezone detection** with DST handling and UTC conversion
- **Geographic coordinate precision** to 4 decimal places

### 📊 Chart Analysis
- **Sun, Moon, and Rising sign** interpretations with precise degrees
- **Venus placement analysis** for love and relationship insights
- **Saturn positioning** for life lessons and challenges
- **Chinese zodiac integration** with elemental analysis
- **Compatibility matrix** showing relationship dynamics

### 🎨 Classical Design
- **Document-style layout** resembling professional astrological reports
- **Elegant typography** using EB Garamond (serif) and Courier Prime (monospace)
- **Light/dark theme toggle** with subtle background imagery
- **Glass-morphism effects** with backdrop blur for modern appeal
- **Structured data presentation** in clean tabular format

### 📱 User Experience
- **Location search** with intelligent city suggestions
- **Real-time coordinate display** showing precise birth location
- **Responsive design** optimized for all devices
- **Smooth animations** and professional interactions
- **Accessibility features** with proper contrast and keyboard navigation

## 🛠 Tech Stack

- **Svelte 5** - Modern reactive framework with latest syntax
- **Vite** - Fast build tool and development server
- **Astronomia.js** - Professional astronomical calculation library
- **JavaScript ES2022+** - Modern language features
- **CSS Custom Properties** - Advanced theming system

## 🔬 Astronomical Calculations

### Planetary Positions
- **Sun**: Solar apparent longitude with atmospheric corrections
- **Moon**: Lunar coordinates using high-precision algorithms
- **Venus**: VSOP87 simplified theory for accurate positioning
- **Saturn**: Approximate positioning based on orbital periods

### Ascendant Calculation
Uses the standard Placidus formula:
```
tan(A) = -cos(LST) / (sin(ε) × tan(φ) + cos(ε) × sin(LST))
```
Where:
- A = Ascendant longitude
- LST = Local Sidereal Time
- ε = Obliquity of the ecliptic
- φ = Geographic latitude

### Time Handling
- Automatic timezone detection using browser APIs
- DST (Daylight Saving Time) calculations
- Proper UTC conversion for astronomical accuracy
- Julian Day calculations for celestial mechanics

## 🚀 Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/jaidenschembri/chartreader.git
cd chartreader
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Key Dependencies
```json
{
  "astronomia": "^4.1.1",
  "svelte": "^5.28.1", 
  "vite": "^6.3.5"
}
```

## 📁 Project Structure

```
src/
├── App.svelte              # Main application component
├── main.js                 # Application entry point
├── style.css              # Global styles with theming
└── lib/
    ├── astro.js           # Astronomical calculations
    ├── utils.js           # Utility functions & location handling
    ├── data.js            # Data loading and management
    └── types.js           # Type definitions

public/
├── images/
│   ├── bckg.png          # Light theme background
│   └── bckg-1.png        # Dark theme background
├── planetaryPositions.json
├── westernZodiac.json
├── chineseNewYear.json
└── zodiacVibes.json

dist/                      # Built files (generated)
```

## 🎯 Usage Example

```javascript
// Calculate precise astronomical positions
const astroResults = await calculateAstronomicalPositions(
  new Date('2001-06-01'),  // Birth date
  '02:38',                 // Birth time
  48.4283182,             // Latitude (Victoria, BC)
  -123.364953             // Longitude
);

// Results include:
// - Sun position with precise longitude
// - Moon sign and position
// - Ascendant (rising sign) calculation
// - Venus placement for relationships
// - Timezone and coordinate information
```

## 🌙 Astronomical Modules Used

- `astronomia/julian` - Julian day calculations
- `astronomia/solar` - Solar position and apparent longitude
- `astronomia/moonposition` - Lunar coordinates and phases
- `astronomia/sidereal` - Sidereal time calculations
- `astronomia/base` - Base astronomical functions and utilities

## 🎨 Design Philosophy

The interface follows a classical astrological document aesthetic:

- **Typography**: Professional serif fonts for readability
- **Layout**: Structured sections with clear hierarchy
- **Data Presentation**: Clean tables with astronomical symbols
- **Color Scheme**: Minimal palette with subtle backgrounds
- **Theming**: Light/dark modes with appropriate imagery

## 🚀 Deployment

### Automatic GitHub Pages Deployment
The project includes GitHub Actions for automatic deployment:

1. Push changes to the `main` branch
2. GitHub Actions builds and deploys automatically
3. Site available at: `https://jaidenschembri.github.io/chartreader/`

### Manual Deployment
```bash
npm run build    # Build for production
npm run deploy   # Deploy to GitHub Pages
```

## 🔧 Configuration

### Vite Configuration
- Base path: `/chartreader/` for GitHub Pages
- Output directory: `dist/`
- Optimized builds with code splitting

### Environment Variables
- Automatic timezone detection
- Geographic coordinate APIs
- Astronomical calculation precision settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper astronomical documentation
4. Test calculations with known birth data
5. Ensure responsive design works across devices
6. Submit a pull request with detailed description

### Code Standards
- Follow Svelte 5 best practices
- Document all astronomical formulas
- Maintain classical design aesthetic
- Ensure calculation accuracy
- Add proper TypeScript annotations

## 📚 Astronomical References

- **Meeus, Jean**: "Astronomical Algorithms" - Standard reference for calculations
- **USNO**: United States Naval Observatory astronomical formulas
- **VSOP87**: Planetary theory for accurate positioning
- **IAU**: International Astronomical Union standards

## 📄 License

This project is private and proprietary.

---

*"As above, so below" - The stars and planets influence our earthly existence, and this application brings their cosmic wisdom to your fingertips with scientific precision.* 